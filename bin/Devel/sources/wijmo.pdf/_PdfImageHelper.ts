module wijmo.pdf {
	'use strict';

	export class _PdfImageHelper {
		private static DATAURI_CACHE = {};

		public static getDataUri(url: string): string {
			wijmo.assert(!!(url = wijmo.asString(url)), _Errors.EmptyUrl);

			if (_PdfImageHelper.DATAURI_CACHE[url]) {
				return _PdfImageHelper.DATAURI_CACHE[url];
			}

			var res = '';

			if (url.indexOf('data:') === 0) {
				wijmo.assert(!!url.match(/^data:(image\/png|image\/jpg);base64,/), _Errors.InvalidImageDataUri);
				res = url;
			} else {
				var xhrError: string,
					buffer = _XhrHelper.arrayBuffer(url, xhr => xhrError = xhr.statusText);

				wijmo.assert(xhrError == null, xhrError);

				try {
					var arr = new Uint16Array(buffer, 0, 2);

					if ((arr[0] === 0xD8FF) || (arr[0] === 0x5089 && arr[1] === 0x474E)) {
						var base64 = _PdfImageHelper._toBase64(buffer);
						res = 'data:' + ((arr[0] === 0xD8FF) ? 'image/jpg' : 'image/png') + ';base64,' + base64;
					} else {
						throw '';
					}
				}
				catch (ex) {
					wijmo.assert(false, _Errors.InvalidImageFormat);
				}
			}

			return _PdfImageHelper.DATAURI_CACHE[url] = res;
		}

		private static _toBase64(buffer: ArrayBuffer): string {
			var binary = '',
				bytes = new Uint8Array(buffer);

			for (var i = 0; i < bytes.byteLength; i++) {
				binary += String.fromCharCode(bytes[i]);
			}

			return window.btoa(binary);
		}
	}
} 