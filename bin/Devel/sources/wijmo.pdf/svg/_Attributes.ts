module wijmo.pdf {
	'use strict';

	//#region Basic attributes

	export enum _SvgNumConversion {
		Default = 1, // convert value according to its unit identifier
		None = 2, // no unit conversion, unit identifier is not allowed
		Px = 3 // always treat value as a 'px', unit identifier is not allowed
	}

	export enum _SvgLengthContext {
		Width = 1,
		Height = 2,
		Other = 3
	}

	export enum _SvgAttrType {
		Number = 1,
		String = 2
	}

	export class _SvgAttr<T> {
		public static parseValue(value: any, attrType: _SvgAttrType, viewPort: Size, lCtx: _SvgLengthContext, numConv: _SvgNumConversion): any {
			if (value == null) {
				return value;
			}

			// some attributes can have both numerical and string values (font-size)
			if (attrType & _SvgAttrType.Number) {
				var numVal: number,
					unitType: string;

				if (typeof (value) === 'number') {
					numVal = value;
				} else {
					var match = value.match(/^([\+-]?[\d\.]+)(em|ex|px|pt|pc|cm|mm|in|%)?$/);
					if (match) {
						numVal = parseFloat(match[1]);
						unitType = match[2];
					}
				}

				if (numVal != null && numVal === numVal) {
					if (numConv !== _SvgNumConversion.Default) {
						wijmo.assert(!unitType, _Errors.InvalidFormat(value));

						if (numConv === _SvgNumConversion.None) {
							return numVal;
						}
					}

					// convert to pt
					switch (unitType) {
						case 'mm':
							return numVal * 72 / 25.4

						case 'cm':
							return numVal * 72 / 2.54

						case 'in':
							return numVal * 72;

						case 'pt':
							return numVal;

						case 'pc':
							return numVal * 12;

						case '%':
							switch (lCtx) {
								case _SvgLengthContext.Height:
									numVal *= viewPort.height / 100;
									break;

								case _SvgLengthContext.Width:
									numVal *= viewPort.width / 100;
									break;

								case _SvgLengthContext.Other:
									numVal *= (Math.sqrt(viewPort.width * viewPort.width + viewPort.height * viewPort.height) / Math.sqrt(2)) / 100;
									break;
							}
							return numVal;

						case 'px':
						default:
							return numVal * 0.75;
					}
				}
			}

			if (attrType & _SvgAttrType.String) {
				return value + '';
			}

			wijmo.assert(false, _Errors.InvalidFormat(value));
		}

		private _owner: _SvgElementBase
		private _value: any;
		private _defValue: any;
		private _propName: string;
		private _propType: _SvgAttrType;
		private _searchValue: boolean;
		private _inheritable: boolean;
		private _pCtx: _SvgLengthContext;
		private _nc: _SvgNumConversion;

		constructor(owner: _SvgElementBase, propName: string, propType: _SvgAttrType, defValue = undefined, nc = _SvgNumConversion.Default, lCtx = _SvgLengthContext.Other, inheritable = false) {
			wijmo.assert(!!owner, _Errors.ValueCannotBeEmpty('owner'));
			wijmo.assert(!!propName, _Errors.ValueCannotBeEmpty('propName'));

			this._owner = owner;
			this._propName = propName;
			this._propType = propType;
			this._defValue = defValue;
			this._inheritable = inheritable;
			this._nc = nc;
			this._pCtx = lCtx;
			this._searchValue = true;
		}

		public get hasVal(): boolean {
			return this._val != null;
		}

		public get val(): T {
			if (this._val != null) {
				return this._val;
			} else {
				return this._parse(this._defValue);
			}
		}

		public set val(value: T) {
			this._searchValue = false;
			this._value = value;
		}

		protected get _val(): any {
			if (this._searchValue) {
				this._searchValue = false;

				var value;

				for (var p = this._owner; p; p = p.parent) {
					value = p.attr(this._propName);

					if (!(this._inheritable && (value == null || value == 'inherit'))) {
						break;
					}
				}

				this._value = (value === 'inherit') ? undefined : this._parse(value);
			}

			return this._value;
		}

		public reset(): void {
			this._value = undefined;
			this._searchValue = true;
		}

		protected _parse(value: any, nc?: _SvgNumConversion): any {
			var value = _SvgAttr.parseValue(value, this._propType, this._owner.viewport, this._pCtx, nc || this._nc);
			return value;
		}
	}

	export class _SvgNumAttr extends _SvgAttr<number> {
		constructor(owner: _SvgElementBase, propName: string, defValue = undefined, nc = _SvgNumConversion.Default, pCtx = _SvgLengthContext.Other, inheritable?: boolean) {
			super(owner, propName, _SvgAttrType.Number, defValue, nc, pCtx, inheritable);
		}
	}

	export class _SvgStrAttr extends _SvgAttr<string> {
		constructor(owner: _SvgElementBase, propName: string, defValue?: any, inheritable?: boolean) {
			super(owner, propName, _SvgAttrType.String, defValue, undefined, undefined, inheritable);
		}
	}

	//#endregion Basic attributes

	export class _SvgColorAttr extends _SvgAttr<string> {
		constructor(owner: _SvgElementBase, propName: string, defValue = undefined, inheritable = true) {
			super(owner, propName, _SvgAttrType.String, defValue, _SvgNumConversion.None, _SvgLengthContext.Other, inheritable);
		}

		protected _parse(value: any): any {
			if (value === '' || value === 'null' || value === 'undefined') { // handle wijmo5 invalid values
				return undefined; // use default value then
			}

			return super._parse(value);
		}
	}

	export class _SvgDashArrayAttr extends _SvgAttr<number[]> {
		constructor(owner: _SvgElementBase) {
			super(owner, 'stroke-dasharray', _SvgAttrType.Number, undefined, _SvgNumConversion.Px, _SvgLengthContext.Other, true);
		}

		protected _parse(value: any): number[] {
			var res: number[],
				vals = (<string>value || '').trim().split(/[\s,]+/);

			if (vals.length) {
				res = [];

				try {
					for (var i = 0; i < vals.length; i++) {
						if (vals[i]) {
							res.push(super._parse(vals[i]));
						}
					}
				} catch (ex) {
					return undefined;
				}

				return res.length ? res : undefined;
			}

			return res;
		}
	}

	export class _SvgFillRuleAttr extends _SvgAttr<PdfFillRule> {
		constructor(owner: _SvgElementBase, propName: string) {
			super(owner, propName, _SvgAttrType.String, PdfFillRule.NonZero, undefined, undefined, true);
		}

		protected _parse(value: string): PdfFillRule {
			if (wijmo.isNumber(value)) { // defValue
				return <any>value;
			} else {
				var match = (value || '').match(/(nonzero|evenodd)/i);
				if (match) {
					return match[1] === 'nonzero' ? PdfFillRule.NonZero : PdfFillRule.EvenOdd;
				}
				return undefined;
			}
		}
	}

	// supports attributes like attr="smth" and attr="url(smth)"
	export class _SvgHRefAttr extends _SvgStrAttr {
		constructor(owner: _SvgElementBase, propName: string) {
			super(owner, propName);
		}

		protected _parse(value: string): string {
			value = (value || '').trim();

			// url(smth) => smth
			var match = value.match(/url\((.+)\)/);
			if (match) {
				value = match[1].trim();
			}

			// "smth" => smth
			value = value.replace(/["']/g, '');

			return value;
		}
	}

	// supports attributes like attr="#id" and attr="url(#id)"
	export class _SvgIdRefAttr extends _SvgHRefAttr {
		protected _parse(value: string): string {
			value = super._parse(value);

			// #smth => smth
			if (value && value[0] === '#') {
				return value.substring(1);
			}

			return undefined;
		}
	}

	export class _SvgPointsArrayAttr extends _SvgAttr<Point[]> {
		constructor(owner: _SvgElementBase, propName: string) {
			super(owner, propName, _SvgAttrType.Number, undefined, _SvgNumConversion.Px);
		}

		protected _parse(value: any): Point[] {
			var res: Point[],
				vals = (<string>value || '').trim().split(/[\s,]+/),
				len = Math.floor(vals.length / 2) * 2;

			if (len) {
				res = [];

				try {
					for (var i = 0; i < len - 1; i = i + 2) {
						res.push(new Point(super._parse(vals[i]), super._parse(vals[i + 1])));
					}
				}
				catch (ex) {
					return undefined;
				}
			}

			return res;
		}
	}

	export class _SvgTransformAttr extends _SvgAttr<((doc: PdfPageArea) => void)[]> {
		constructor(owner: _SvgElementBase) {
			super(owner, 'transform', _SvgAttrType.Number, undefined, _SvgNumConversion.None);
		}

		public apply(element: _SvgElementBase): void {
			var area = element.ctx.area;

			if (this.hasVal) {
				this.val.forEach((item) => {
					item(area);
				});
			}
		}

		protected _parse(value: any): ((doc: PdfPageArea) => void)[] {
			var res: ((doc: PdfPageArea) => void)[] = [],
				match = (<string>value || '').match(/((matrix|translate|scale|rotate|skewX|skewY)\([^\)]+\))+/g);

			if (match) {
				for (var i = 0; i < match.length; i++) {
					var item = match[i],
						sgnr = item.match(/(\w+)\(([^\)]+)\)/),
						args: number[] = [];

					try {
						sgnr[2].trim().split(/[\s,]+/).forEach((numStr: string) => {
							if (numStr) {
								args.push(super._parse(numStr, _SvgNumConversion.None));
							}
						});
					} catch (ex) {
						return undefined;
					}

					if (args.length) {
						// replace closures with bind?
						switch (sgnr[1]) {
							case 'matrix':
								res.push(((a: number, b: number, c: number, d: number, e: number, f: number) => {
									return (area: PdfPageArea) => {
										area.transform(a, b, c, d, e, f);
									}
								})(args[0], args[1], args[2], args[3], super._parse(args[4], _SvgNumConversion.Px), super._parse(args[5], _SvgNumConversion.Px)));
								break;

							case 'translate':
								res.push(((x: number, y: number) => {
									return (area: PdfPageArea) => {
										area.translate(x, y);
									}
								})(super._parse(args[0], _SvgNumConversion.Px), super._parse(args[1] || 0, _SvgNumConversion.Px)));
								break;

							case 'scale':
								res.push(((xFactor: number, yFactor: number) => {
									return (area: PdfPageArea) => {
										area.scale(xFactor, yFactor);
									}
								})(args[0], args[1]));
								break;

							case 'rotate':
								res.push(((angle: number, point: Point) => {
									return (area: PdfPageArea) => {
										area.rotate(angle, point);
									}
								})(args[0], new Point(super._parse(args[1] || 0, _SvgNumConversion.Px), super._parse(args[2] || 0, _SvgNumConversion.Px))));
								break;

							case 'skewX':
								res.push(((angle: number) => {
									return (area: PdfPageArea) => {
										area.transform(1, 0, angle, 1, 0, 0);
									}
								})(Math.tan(args[0] * Math.PI / 180)));
								break;

							case 'skewY':
								res.push(((angle: number) => {
									return (area: PdfPageArea) => {
										area.transform(1, angle, 0, 1, 0, 0);
									}
								})(Math.tan(args[0] * Math.PI / 180)));
								break;
						}
					}
				}
			}

			return res.length ? res : undefined;
		}
	}

	export class _SvgTextDecorationAttr extends _SvgAttr<string[]> {
		constructor(owner: _SvgElementBase) {
			super(owner, 'text-decoration', _SvgAttrType.String, undefined, _SvgNumConversion.None);
		}

		protected _parse(value: any): string[] {
			var res: string[],
				vals = (<string>value || '').trim().toLowerCase().split(/[\s,]+/);

			if (vals.length) {
				res = [];

				for (var i = 0; i < vals.length; i++) {
					if (/line-through|overline|underline/.test(vals[i])) {
						res.push(vals[i]);
					}
				}
			}

			return res && res.length ? res : undefined;
		}
	}

	export interface _ISvgViewBoxAttr {
		minX: number;
		minY: number;
		width: number;
		height: number;
	}

	export class _SvgViewboxAttr extends _SvgAttr<_ISvgViewBoxAttr> {
		constructor(owner: _SvgElementBase) {
			super(owner, 'viewBox', _SvgAttrType.Number, undefined, _SvgNumConversion.Px);
		}

		protected _parse(value: any): _ISvgViewBoxAttr {
			var res: _ISvgViewBoxAttr,
				vals = (<string>value || '').trim().split(/[\s,]+/);

			if (vals.length === 4) {
				res = {
					minX: super._parse(vals[0]),
					minY: super._parse(vals[1]),
					width: super._parse(vals[2]),
					height: super._parse(vals[3])
				};
			}

			return res;
		}
	}

	export interface _ISvgPreserveAspectRatioAttr {
		align: string;
		meet: boolean;
	}

	export class _SvgPreserveAspectRatioAttr extends _SvgAttr<_ISvgPreserveAspectRatioAttr> {
		constructor(owner: _SvgElementBase) {
			super(owner, 'preserveAspectRatio', _SvgAttrType.Number, 'xMidYMid meet');
		}

		protected _parse(value: any): _ISvgPreserveAspectRatioAttr {
			var res: _ISvgPreserveAspectRatioAttr;

			if (typeof (value) === 'string') {
				var vals = (<string>value).replace(/^defer\s+/, '').trim().split(/\s+/);  // skip 'defer', it is used only with images

				res = {
					align: vals[0],
					meet: !vals[1] || (vals[1] === 'meet')
				};
			} else {
				res = value;
			}

			return res;
		}
	}

	// combines both viewBox and preserveAspectRatio attributes
	export class _SvgScaleAttributes {
		private _owner: _SvgElementBase;

		public aspect: _SvgPreserveAspectRatioAttr;
		public viewBox: _SvgViewboxAttr;

		constructor(owner: _SvgElementBase) {
			this._owner = owner;
			this.aspect = new _SvgPreserveAspectRatioAttr(this._owner);
			this.viewBox = new _SvgViewboxAttr(this._owner);
		}

		public apply(element: _SvgElementBase): Size {
			var area = element.ctx.area,
				viewPort = element.viewport,
				viewBox = this.viewBox.val;

			if (viewPort && viewBox) {
				if (viewBox.width && viewBox.height) {
					var ar = this.aspect.val,
						sx = viewPort.width / viewBox.width,
						sy = viewPort.height / viewBox.height,
						sMin = Math.min(sx, sy),
						sMax = Math.max(sx, sy),
						uniScaledWidth = viewBox.width * (ar.meet ? sMin : sMax),
						uniScaledHeight = viewBox.height * (ar.meet ? sMin : sMax);

					if (ar.align === 'none') { // non-uniform scaling
						area.scale(sx, sy);
					} else { // uniform scaling
						var scale = ar.meet ? sMin : sMax,
							tx = 0, ty = 0;

						if (ar.align.match(/^xMid/) && (scale === sy)) {
							tx = viewPort.width / 2 - uniScaledWidth / 2;
						} else {
							if (ar.align.match(/^xMax/) && (scale === sy)) {
								tx = viewPort.width - uniScaledWidth;
							}
						}

						if (ar.align.match(/YMid$/) && (scale === sx)) {
							ty = viewPort.height / 2 - uniScaledHeight / 2;
						} else {
							if (ar.align.match(/YMax$/) && (scale === sx)) {
								ty = viewPort.height - uniScaledHeight;
							}
						}

						if (tx || ty) {
							area.translate(tx, ty);
						}

						if (ar.meet) {
							area.scale(sMin, sMin);
						} else {
							area.scale(sMax, sMax);
						}

						if (viewBox.minX || viewBox.minY) {
							area.translate(-viewBox.minX, -viewBox.minY);
						}
					}
				}

				//return new Size(viewPort.width / sx, viewPort.height / sy);
				return new Size(viewBox.width, viewBox.height); // establish a new viewport.  
			}

			return viewPort;
		}
	}

	// combines all stroking attributes
	export class _SvgStrokeAttributes {
		private _owner: _SvgElementBase;

		public color: _SvgColorAttr;
		public dashArray: _SvgDashArrayAttr;
		public dashOffset: _SvgNumAttr;
		public lineCap: _SvgStrAttr;
		public lineJoin: _SvgStrAttr;
		public miterLimit: _SvgNumAttr;
		public opacity: _SvgNumAttr;
		public width: _SvgNumAttr;

		constructor(owner: _SvgElementBase) {
			this._owner = owner;

			this.color = new _SvgColorAttr(this._owner, 'stroke', 'none');
			this.dashArray = new _SvgDashArrayAttr(this._owner);
			this.dashOffset = new _SvgNumAttr(this._owner, 'stroke-dashoffset', 0, _SvgNumConversion.Default, _SvgLengthContext.Other, true);
			this.lineCap = new _SvgStrAttr(this._owner, 'stroke-linecap', 'butt', true);
			this.lineJoin = new _SvgStrAttr(this._owner, 'stroke-linejoin', 'miter', true);
			this.miterLimit = new _SvgNumAttr(this._owner, 'stroke-miterlimit', 4, _SvgNumConversion.None, _SvgLengthContext.Other, true);
			this.opacity = new _SvgNumAttr(this._owner, 'stroke-opacity', 1, _SvgNumConversion.None, _SvgLengthContext.Other, true);
			this.width = new _SvgNumAttr(this._owner, 'stroke-width', 1, _SvgNumConversion.Default, _SvgLengthContext.Other, true);
		}

		public toPen(): PdfPen {
			var color = new wijmo.Color(this.color.val);

			if (this.opacity.hasVal) {
				color.a = this.opacity.val;
			}

			var pen = new PdfPen(color, this.width.val);

			if (this.dashArray.hasVal) {
				var dashes = this.dashArray.val;

				if (dashes.length) {
					pen.dashPattern = new PdfDashPattern(dashes[0],
						dashes.length > 1 ? dashes[1] : undefined,
						this.dashOffset.val);
				}
			}

			switch (this.lineCap.val) {
				case 'butt':
					pen.cap = PdfLineCapStyle.Butt;
					break;

				case 'round':
					pen.cap = PdfLineCapStyle.Round;
					break;

				case 'square':
					pen.cap = PdfLineCapStyle.Square;
					break;
			}

			switch (this.lineJoin.val) {
				case 'miter':
					pen.join = PdfLineJoinStyle.Miter;
					break;

				case 'round':
					pen.join = PdfLineJoinStyle.Round;
					break;

				case 'bevel':
					pen.join = PdfLineJoinStyle.Bevel;
					break;
			}

			pen.miterLimit = this.miterLimit.val;

			return pen;
		}
	}

	// combines all the filling attributes
	export class _SvgFillAttributes {
		private _owner: _SvgElementBase;

		public color: _SvgColorAttr;
		public opacity: _SvgNumAttr;
		public rule: _SvgFillRuleAttr;

		constructor(owner: _SvgElementBase) {
			this._owner = owner;

			this.color = new _SvgColorAttr(this._owner, 'fill', 'black');
			this.opacity = new _SvgNumAttr(this._owner, 'fill-opacity', 1, _SvgNumConversion.None, undefined, true);
			this.rule = new _SvgFillRuleAttr(this._owner, 'fill-rule');
		}

		public toBrush(): PdfSolidBrush {
			var color = new wijmo.Color(this.color.val);

			if (this.opacity.hasVal) {
				color.a = this.opacity.val;
			}

			return new PdfSolidBrush(color);
		}
	}

	// combines all of the font attributes
	export class _SvgFontAttributes {
		private _owner: _SvgElementBase;

		public family: _SvgStrAttr;
		public size: _SvgAttr<string | number>;
		public style: _SvgStrAttr;
		public weight: _SvgStrAttr;

		constructor(owner: _SvgElementBase) {
			this._owner = owner;

			this.family = new _SvgStrAttr(this._owner, 'font-family', undefined, true);
			this.size = new _SvgAttr<string | number>(this._owner, 'font-size', _SvgAttrType.Number | _SvgAttrType.String, 'medium', undefined, _SvgLengthContext.Other, true);
			this.style = new _SvgStrAttr(this._owner, 'font-style', 'normal', true);
			this.weight = new _SvgStrAttr(this._owner, 'font-weight', 'normal', true);
		}

		public toFont(): PdfFont {
			var size = wijmo.pdf._asPt(this.size.val); // handle string values like 'small', 'medium' etc
			return new PdfFont(this.family.val, size, this.style.val, this.weight.val);
		}
	}

	export class _SvgStyleAttributes {
		private _owner: _SvgElementBase;
		public fill: _SvgFillAttributes;
		public font: _SvgFontAttributes;
		public stroke: _SvgStrokeAttributes;
		public clipRule: _SvgFillRuleAttr;

		constructor(owner: _SvgElementBase) {
			this._owner = owner;
			this.clipRule = new _SvgFillRuleAttr(this._owner, 'clip-rule');
			this.fill = new _SvgFillAttributes(this._owner);
			this.font = new _SvgFontAttributes(this._owner);
			this.stroke = new _SvgStrokeAttributes(this._owner);
		}

		public apply(element: _SvgElementBase, fill?: boolean, stroke?: boolean): void {
			var area = element.ctx.area;

			if (element.renderMode === _SvgRenderMode.Clip) {
				// Clipping has been moved to the _SvgClippableElementBase.render() method because in PDF the clipping operator
				// intersects (not unites) a given path with the current clipping path to create a new one, so we need to call
				// the clip() method only once to unite all the clipPath's nested elements.

				// area.paths.clip(this.clipRule.val);
			} else { // fill + stroke
				if (fill && stroke && this.fill.color.val !== 'none' && this.stroke.color.val !== 'none') {
					area.paths.fillAndStroke(this.fill.toBrush(), this.stroke.toPen(), this.fill.rule.val);
				} else {
					if (fill && (this.fill.color.val !== 'none')) {
						area.paths.fill(this.fill.toBrush(), this.fill.rule.val);
					} else {
						if (stroke && (this.stroke.color.val !== 'none')) {
							area.paths.stroke(this.stroke.toPen());
						} else { // use transparent color then (we need to finish the current path anyway).
							area.paths.stroke(wijmo.Color.fromRgba(0, 0, 0, 0));
						}
					}
				}
			}
		}
	}
}