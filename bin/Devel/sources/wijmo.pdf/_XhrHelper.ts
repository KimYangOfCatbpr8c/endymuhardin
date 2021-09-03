module wijmo.pdf {
	'use strict';

	/* Represents the XMLHttpRequest settings. */
	interface _IXhrSettings {
		responseType?: string;
		headers?: { [index: string]: string };
		method?: string;
		async?: boolean;
		user?: string;
		password?: string;
		data?: any;
		overrideMimeType?: string;
	}

	var _XhrOverrideMimeTypeSupported = !!new XMLHttpRequest().overrideMimeType;

	/* XMLHttpRequest helper. */
	export class _XhrHelper {
		/*
		* Asynchronously retrieves an ArrayBuffer from the URL using XMLHttpRequest.
		*
		* @param url The URL to send the request to.
		* @param success A function to be called if the request succeeds.
		* @param error A function to be called if the request fails.
		*/
		public static arrayBufferAsync(url: string, success: (xhr: XMLHttpRequest, data: ArrayBuffer) => void, error?: (xhr: XMLHttpRequest) => void): void {
			var settings: _IXhrSettings = {
				method: 'GET',
				responseType: 'arraybuffer',
				async: true
			};

			this._getData(url, settings, success, error);
		}

		/*
		* Synchronously retrieves an ArrayBuffer from a URL using XMLHttpRequest.
		*
		* @param url The URL to send the request to.
		* @param error A function to be called if the request fails.
		*/
		public static arrayBuffer(url: string, error?: (xhr: XMLHttpRequest) => void): ArrayBuffer {
			var buffer: ArrayBuffer,
				settings: _IXhrSettings = {
					method: 'GET',
					async: false
				};

			if (_XhrOverrideMimeTypeSupported) { // IE>10, Chrome, FireFox
				// Note: the responseType parameter must be empty in case of synchronous request (http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute)
				settings.overrideMimeType = 'text/plain; charset=x-user-defined'; // retrieve unprocessed data as a binary string

				this._getData(url, settings, (xhr, response: string) => {
					// convert string to ArrayBuffer
					buffer = new ArrayBuffer(response.length);

					var byteView = new Uint8Array(buffer);

					for (var i = 0, len = response.length; i < len; i++) {
						byteView[i] = response.charCodeAt(i) & 0xFF;
					}
				}, error);
			} else {
				// We can retrieve binary data synchronously using xhr.responseType in case of IE10.
				settings.responseType = 'arraybuffer';

				this._getData(url, settings, (xhr, response: ArrayBuffer) => {
					buffer = response;
				}, error);
			}

			return buffer;
		}

		/*
		* Synchronously retrieves a text from a URL using XMLHttpRequest.
		*
		* @param url The URL to send the request to.
		* @param error A function to be called if the request fails.
		*/
		public static text(url: string, error?: (xhr: XMLHttpRequest) => void): string {
			var settings: _IXhrSettings = {
					method: 'GET',
					async: false
				},
				res = "";

			this._getData(url, settings, (xhr, response) =>	res = response, error);

			return res;
		}

		/*
		* Retrieves data from a URL using XMLHttpRequest.
		*
		* @param url The URL to send the request to.
		* @param settings Request settings.
		* @param success A function to be called if the request succeeds.
		* @param error A function to be called if the request fails.
		*/
		private static _getData(url: string, settings: _IXhrSettings, success: (xhr: XMLHttpRequest, response: any) => void, error?: (xhr: XMLHttpRequest) => void): void {
			var xhr = new XMLHttpRequest();

			settings = settings || {};

			xhr.open(settings.method, url, settings.async, settings.user, settings.password);

			xhr.addEventListener('load', () => {
				if (xhr.readyState === 4) {
					var status = xhr.status;

					if (status >= 200 && status < 300 || status === 304) {
						if (success) {
							success(xhr, xhr.response);
						}
					} else {
						if (error) {
							error(xhr);
						}
					}
				}
			});

			if (settings.headers) {
				for (var key in settings.headers) {
					xhr.setRequestHeader(key, settings.headers[key]);
				}
			}

			if (settings.responseType) {
				xhr.responseType = settings.responseType;
			}

			if (settings.overrideMimeType && xhr.overrideMimeType) {
				xhr.overrideMimeType(settings.overrideMimeType);
			}

			xhr.send(settings.data);
		}
	}
}
