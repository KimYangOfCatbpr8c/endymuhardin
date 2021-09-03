module wijmo.pdf {
	'use strict';

	export class _PdfSvgPathHelper {
		/*
		* Updates the absolute coordinates using the given offset and returns an updated path.
		* @param path Path.
		* @param offset Offset.
		*/
		public static offset(path: string, offset: wijmo.Point): string {
			var newPath = this._processPath(path, (value, cmd, cmdIdx, argIdx) => {
				value = this._updateOffset(value, offset,  cmd, cmdIdx, argIdx);
				return value;
			});
			return newPath;
		}

		/*
		* Updates coordinates using the given scale factor and returns an updated path.
		* @param path Path.
		* @param scale Scale factor.
		*/
		public static scale(path: string, scale: number): string {
			var newPath = this._processPath(path, (value, cmd, cmdIdx, argIdx) => {
				if (cmd === 'a' || cmd === 'A') {
					var rm = argIdx % 7;
					if (rm >= 2 && rm <= 4) { // skip 'x-axis-rotation', 'large-arc-flag', 'sweep-flag'
						return value; 
					}
				}

				return value * scale;
			});

			return newPath;
		}

		private static _processPath(path: string, argCallback: (value: number, cmd: string, cmdIdx: number, argIdx: number) => number): string {
			var tkn = this._getTokenizer(path),
				cmd = '',
				res = '',
				argIdx = -1,
				cmdIdx = -1;

			for (var token: string; token = tkn();) {
				if (token.length === 1 && /[a-zA-Z]/.test(token)) { // a command
					cmdIdx++;
					cmd = token;
					argIdx = -1
				} else { // an argument
					argIdx++;
					var newValue = argCallback(parseFloat(token), cmd, cmdIdx, argIdx);
					token = wijmo.toFixed(newValue, 7, false) + '';
				}

				res += token + ' ';
			}
			
			return res;
		} 

		private static _getTokenizer(path: string) {
			var len = path.length,
				i = 0;

			return () => {
				if (i >= len) {
					return ''; // done
				}

				// skip whitespaces
				while ((i < len) && (/\s/.test(path[i]) || path[i] == ',')) {
					i++;
				}

				var j = i;

				// skip numbers
				while ((i < len) && (/[0-9\.\-eE\+]/.test(path[i]))) {
					i++;
				}

				if (i != j) {
					return path.substr(j, i - j);
				}

				return path.substr(i++, 1);
			};
		}

		private static _updateOffset(value: number, offset: Point, cmd: string, cmdIdx: number, argIdx: number): number {
			var o = 0;

			switch (cmd) {
				case 'm': // (dx dy)+
					if (cmdIdx === 0) { // SVG specs: if a relative moveto (m) appears as the first element of the path, then it is treated as a pair of absolute coordinates.
						// inspect only the first group
						if (argIdx === 0) {
							o = -1;
						} else {
							if (argIdx === 1) {
								o = 1;
							}
						}
					}
					break;

				case 'L': // (x y)+
				case 'M': // (x y)+
				case 'C': // (c1x c1y c2x c2y x y)+
				case 'S': // (x2 y2 x y)+
				case 'Q': // (x1 y1 x y)+
				case 'T': // (x y)+
					o = (argIdx % 2 === 0) ? -1 : 1;
					break;

				case 'A': // (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
					if (argIdx % 7 === 5) { // x
						o = -1;
					} else {
						if (argIdx % 7 === 6) { // y
							o = 1;
						}
					}
					break;

				case 'H': // x+
					o = -1;
					break;

				case 'V': // y+
					o = 1;
					break;
			}

			return o
				? (o === -1 ? value + offset.x : value + offset.y)
				: value;
		}
	}
}
