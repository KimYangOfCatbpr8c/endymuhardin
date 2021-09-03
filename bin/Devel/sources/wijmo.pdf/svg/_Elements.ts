module wijmo.pdf {
	'use strict';

	//#region Base elements

	export enum _SvgRenderMode {
		Render,
		Ignore,
		Clip
	}

	export interface _ISvgElementBaseCtor {
		new (ctx: _ISvgRenderContext, node: SVGElement, defRenderMode?: _SvgRenderMode): _SvgElementBase;
	}

	export class _SvgElementBase {
		private _children: _SvgElementBase[] = [];
		private _attributes = {};
		private _parent: _SvgElementBase;
		private _style: _SvgStyleAttributes;
		private _ctx: _ISvgRenderContext;
		private _viewport: Size;
		private _defRenderMode: _SvgRenderMode;
		private _curRenderMode: _SvgRenderMode;

		// at the moment the 'node' argument is used ONLY by the _SvgStyleElementImpl class.
		constructor(ctx: _ISvgRenderContext, node: SVGElement, defRenderMode = _SvgRenderMode.Render) {
			this._defRenderMode = defRenderMode;
			this._ctx = ctx;
		}

		//#region public

		public get children(): _SvgElementBase[] {
			return this._children;
		}

		public get ctx(): _ISvgRenderContext {
			return this._ctx;
		}

		public get parent(): _SvgElementBase {
			return this._parent;
		}
		public set parent(value: _SvgElementBase) {
			this._parent = value;
		}

		public get style(): _SvgStyleAttributes {
			if (!this._style) {
				this._style = new _SvgStyleAttributes(this);
			}

			return this._style;
		}

		public get viewport(): Size {
			return this._viewport;
		}
		public set viewport(value: Size) {
			this._viewport = value.clone();
		}

		public attr(name: string, value?: any): any {
			name = name.toLowerCase();

			if (arguments.length > 1) {
				this._attributes[name] = value;
			}

			return this._attributes[name];
		}

		public appendNode(node: _SvgElementBase): void {
			if (!node || (node === this)) {
				return;
			}

			if (node.parent !== this) {
				node.remove();

				this.children.push(node);
				node.parent = this;
			}
		}

		public copyAttributesFrom(el: _SvgElementBase, except?: string[]): void {
			if (!el) {
				return;
			}

			var fa = el._attributes,
				ta = this._attributes;

			for (var key in fa) {
				if (fa.hasOwnProperty(key) && (ta[key] == null) && (!except || (except.indexOf(key) < 0))) {
					ta[key] = fa[key];
				}
			}
		}

		public clone(): _SvgElementBase {
			var el = <_SvgElementBase>new (Function.prototype.bind.call(this.constructor, null /*this*/, this.ctx, null /*node*/));

			el.copyAttributesFrom(this);

			// clone children
			this._children.forEach((item) => {
				el.appendNode(item.clone());
			});

			return el;
		}

		public remove(): void {
			var p = this.parent;

			if (p) {
				for (var i = 0; i < p.children.length; i++) {
					if (p.children[i] === this) {
						p.children.splice(i, 1);
						break;
					}
				}

				this.parent = null;
			}
		}

		public clearAttr(name: string): void {
			delete this._attributes[name.toLowerCase()];
		}

		public render(viewPort: Size, renderMode?: _SvgRenderMode): void {
			this._viewport = viewPort.clone();

			if ((this._curRenderMode = renderMode || this._defRenderMode) !== _SvgRenderMode.Ignore) {
				this._render();
			}
		}

		public get renderMode(): _SvgRenderMode {
			return this._curRenderMode;
		}

		//#endregion

		//#region protected

		protected _render(): void {
			this._renderContent();
		}

		protected _renderContent(): void {
			for (var i = 0; i < this._children.length; i++) {
				this._children[i].render(this.viewport, this.renderMode);
			}
		}

		//#endregion
	}

	export class _SvgClippableElementBase extends _SvgElementBase {
		private _clipPath: _SvgIdRefAttr;

		constructor(ctx: _ISvgRenderContext, node: SVGElement, defRenderMode = _SvgRenderMode.Render) {
			super(ctx, node, defRenderMode);
			this._clipPath = new _SvgIdRefAttr(this, 'clip-path');
		}

		protected _render(): void {
			var clip: boolean,
				area = this.ctx.area;

			if (this._clipPath.val) {
				var clipPath = <_SvgClipPathElementImpl>this.ctx.getElement(this._clipPath.val);
				if (clip = !!(clipPath && (clipPath instanceof _SvgClipPathElementImpl))) {
					area._pdfdoc.saveState();
					clipPath.render(this.viewport, _SvgRenderMode.Clip); // force rendering using a clipping mode
					area.paths.clip(this.style.clipRule.val);
				}
			}

			super._render();

			if (clip) {
				area._pdfdoc.restoreState();
			}
		}
	}

	export class _SvgTransformableElementBase extends _SvgClippableElementBase {
		private _transform: _SvgTransformAttr;

		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node);
			this._transform = new _SvgTransformAttr(this);
		}

		protected _render(): void {
			var transform = this._transform.hasVal && this.renderMode !== _SvgRenderMode.Clip; // clipping path cannot use tranformations

			if (transform) {
				this.ctx.area._pdfdoc.saveState();
				this._transform.apply(this);
			}

			super._render();

			if (transform) {
				this.ctx.area._pdfdoc.restoreState();
			}
		}
	}

	//#endregion Base elements



	//#region Shape elements

	export class _SvgShapeElementBase extends _SvgTransformableElementBase {
		protected _fill = true;
		protected _stroke = true;

		protected _renderContent(): void {
			//super._renderContent();
			this._draw();
			this.style.apply(this, this._fill, this._stroke);
		}

		protected _draw(): void {
			wijmo.assert(false, _Errors.AbstractMethod);
		}
	}

	export class _SvgCircleElementImpl extends _SvgShapeElementBase {
		protected _draw(): void {
			var r = new _SvgNumAttr(this, 'r', 0).val;

			if (r > 0) {
				var cx = new _SvgNumAttr(this, 'cx', 0, _SvgNumConversion.Default, _SvgLengthContext.Width).val,
					cy = new _SvgNumAttr(this, 'cy', 0, _SvgNumConversion.Default, _SvgLengthContext.Height).val;

				this.ctx.area.paths.circle(cx, cy, r);
			}
		}
	}

	export class _SvgEllipseElementImpl extends _SvgShapeElementBase {
		protected _draw(): void {
			var rx = new _SvgNumAttr(this, 'rx', 0, _SvgNumConversion.Default, _SvgLengthContext.Width).val,
				ry = new _SvgNumAttr(this, 'ry', 0, _SvgNumConversion.Default, _SvgLengthContext.Height).val;

			if (rx > 0 && ry > 0) {
				var cx = new _SvgNumAttr(this, 'cx', 0, _SvgNumConversion.Default, _SvgLengthContext.Width).val,
					cy = new _SvgNumAttr(this, 'cy', 0, _SvgNumConversion.Default, _SvgLengthContext.Height).val;

				this.ctx.area.paths.ellipse(cx, cy, rx, ry);
			}
		}
	}

	export class _SvgLineElementImpl extends _SvgShapeElementBase {
		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node);
			this._fill = false;
		}

		protected _draw(): void {
			var x1 = new _SvgNumAttr(this, 'x1', 0, _SvgNumConversion.Default, _SvgLengthContext.Width).val,
				y1 = new _SvgNumAttr(this, 'y1', 0, _SvgNumConversion.Default, _SvgLengthContext.Height).val,
				x2 = new _SvgNumAttr(this, 'x2', 0, _SvgNumConversion.Default, _SvgLengthContext.Width).val,
				y2 = new _SvgNumAttr(this, 'y2', 0, _SvgNumConversion.Default, _SvgLengthContext.Height).val;

			this.ctx.area.paths
				.moveTo(x1, y1)
				.lineTo(x2, y2);
		}
	}

	export class _SvgPathElementImpl extends _SvgShapeElementBase {
		private _d: _SvgStrAttr;

		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node);
			this._d = new _SvgStrAttr(this, 'd');
		}

		protected _renderContent() {
			var area = this.ctx.area;

			if (this.renderMode === _SvgRenderMode.Clip) {
				// the element is placed within the "clip-path" element, we can't use scale + saveState\ restoreState here
				// because it isolates clipping from an element that refers to the "clip-path" element.
				if (this._d.hasVal) {
					var path = _PdfSvgPathHelper.scale(this._d.val, 0.75); // px -> pt
					this.attr('d', path);
					this._d.reset();
				}
				super._renderContent();
			} else {
				area._pdfdoc.saveState();
				area.scale(0.75); // px -> pt
				super._renderContent();
				area._pdfdoc.restoreState();
			}
		}

		protected _draw(): void {
			if (this._d.hasVal) {
				this.ctx.area.paths.svgPath(this._d.val);
			}
		}
	}

	export class _SvgPolylineElementImpl extends _SvgShapeElementBase {
		protected _draw(): boolean {
			var _points = new _SvgPointsArrayAttr(this, 'points');

			if (_points.hasVal) {
				var points = _points.val,
					area = this.ctx.area;

				if (points.length > 1) {
					for (var i = 0; i < points.length; i++) {
						if (i == 0) {
							area.paths.moveTo(points[i].x, points[i].y);
						} else {
							area.paths.lineTo(points[i].x, points[i].y);
						}
					}

					return true;
				}
			}

			return false;
		}
	}

	export class _SvgPolygonElementImpl extends _SvgPolylineElementImpl {
		protected _draw(): boolean {
			if (super._draw()) {
				this.ctx.area.paths.closePath();
				return true;
			}

			return false;
		}
	}

	export class _SvgRectElementImpl extends _SvgShapeElementBase {
		protected _draw(): void {
			var w = new _SvgNumAttr(this, 'width', 0, _SvgNumConversion.Default, _SvgLengthContext.Width).val,
				h = new _SvgNumAttr(this, 'height', 0, _SvgNumConversion.Default, _SvgLengthContext.Height).val;

			if (w > 0 && h > 0) {
				var x = new _SvgNumAttr(this, 'x', 0, _SvgNumConversion.Default, _SvgLengthContext.Width).val,
					y = new _SvgNumAttr(this, 'y', 0, _SvgNumConversion.Default, _SvgLengthContext.Height).val,
					rx = Math.max(new _SvgNumAttr(this, 'rx', 0, _SvgNumConversion.Default, _SvgLengthContext.Width).val, 0),
					ry = Math.max(new _SvgNumAttr(this, 'ry', 0, _SvgNumConversion.Default, _SvgLengthContext.Height).val, 0),
					paths = this.ctx.area.paths;

				if (rx || ry) {
					rx = Math.min(rx || ry, w / 2);
					ry = Math.min(ry || rx, h / 2);

					// An updated version of the PdfKit's roundedRect method
					paths.moveTo(x + rx, y)
					paths.lineTo(x + w - rx, y)
					paths.quadraticCurveTo(x + w, y, x + w, y + ry);
					paths.lineTo(x + w, y + h - ry);
					paths.quadraticCurveTo(x + w, y + h, x + w - rx, y + h);
					paths.lineTo(x + rx, y + h);
					paths.quadraticCurveTo(x, y + h, x, y + h - ry);
					paths.lineTo(x, y + ry);
					paths.quadraticCurveTo(x, y, x + rx, y);
				} else {
					paths.rect(x, y, w, h);
				}
			}
		}
	}

	//#endregion Shape elements



	//#region Other elements

	export class _SvgClipPathElementImpl extends _SvgElementBase /*_TransformableElementBase*/ { // clipping path can not use tranformations
		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node, _SvgRenderMode.Ignore);
		}
	}

	export class _SvgDefsElementImpl extends _SvgClippableElementBase {
		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node, _SvgRenderMode.Ignore);
		}
	}

	export class _SvgGElementImpl extends _SvgTransformableElementBase {
	}

	export class _SvgImageElementImpl extends _SvgTransformableElementBase {
		private _x: _SvgNumAttr;
		private _y: _SvgNumAttr;
		private _width: _SvgNumAttr;
		private _height: _SvgNumAttr;
		private _href: _SvgHRefAttr;
		private _par: _SvgPreserveAspectRatioAttr;

		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node);

			this._x = new _SvgNumAttr(this, 'x', 0, _SvgNumConversion.Default, _SvgLengthContext.Width);
			this._y = new _SvgNumAttr(this, 'y', 0, _SvgNumConversion.Default, _SvgLengthContext.Height);
			this._width = new _SvgNumAttr(this, 'width', 0, _SvgNumConversion.Default, _SvgLengthContext.Width);
			this._height = new _SvgNumAttr(this, 'height', 0, _SvgNumConversion.Default, _SvgLengthContext.Height);
			this._href = new _SvgHRefAttr(this, 'xlink:href');

			this._par = new _SvgPreserveAspectRatioAttr(this);
		}

		protected _renderContent(): void {
			var width = this._width.val,
				height = this._height.val;

			if (width > 0 && height > 0 && this._href.hasVal) {
				var url = _resolveUrlIfRelative(this._href.val, this.ctx.urlResolver);

				if (url) {
					this.ctx.area._pdfdoc.saveState();

					if (this._x.val || this._y.val) {
						this.ctx.area.translate(this._x.val, this._y.val);
					}

					this.viewport = new Size(width, height);

					try {
						if (this._href.val.match(/\.svg$/i)) { // need a better detection??
							this._renderSvgImage(url);
						} else {
							this._renderRasterImage(url);
						}
					} catch (ex) {
					}

					this.ctx.area._pdfdoc.restoreState();
				}
			}
		}

		private _renderSvgImage(url: string): void {
			var xhrError: string,
				str = wijmo.pdf._XhrHelper.text(url, xhr => xhrError = xhr.statusText);

			wijmo.assert(xhrError == null, xhrError);

			var svg = new _SvgRenderer(str, this.ctx.area),
				r = svg.root;

			this.attr('viewBox', r.attr('viewBox'));
			r.clearAttr('viewBox');
			r.clearAttr('x');
			r.clearAttr('y');
			r.clearAttr('width');
			r.clearAttr('height');
			r.clearAttr('preserveAspectRatio');
			r.clearAttr('clip');
			r.clearAttr('overflow');

			this.ctx.area.paths.rect(0, 0, this.viewport.width, this.viewport.height).clip();

			var scale = new _SvgScaleAttributes(this); // uses fake 'viewBox' attribute, see above
			svg.render(scale.apply(this));
		}

		private _renderRasterImage(url: string): void {
			var dataUri = _PdfImageHelper.getDataUri(url),
				ar = this._par.val,
				opt: IPdfImageDrawSettings = {
					width: this.viewport.width,
					height: this.viewport.height,
					align: PdfImageHorizontalAlign.Left,
					vAlign: PdfImageVerticalAlign.Top
				};

			if (ar.align === 'none') {
				opt.stretchProportionally = false;
			} else {
				// * Uniform scaling. The preserveAspectRatio's 'slice' mode is ignored (treated as 'meet'), to support preserveAspectRatio completely we need to know the referenced image sizes. *

				opt.stretchProportionally = true;

				if (ar.align.match(/^xMid/)) {
					opt.align = PdfImageHorizontalAlign.Center;
				} else {
					if (ar.align.match(/^xMax/)) {
						opt.align = PdfImageHorizontalAlign.Right;
					}
				}

				if (ar.align.match(/YMid$/)) {
					opt.vAlign = PdfImageVerticalAlign.Center;
				} else {
					if (ar.align.match(/YMax$/)) {
						opt.vAlign = PdfImageVerticalAlign.Bottom;
					}
				}
			}

			this.ctx.area.drawImage(dataUri, 0, 0, opt);
		}
	}

	export class _SvgStyleElementImpl extends _SvgElementBase {
		constructor(ctx: _ISvgRenderContext, node: SVGStyleElement) {
			super(ctx, node, _SvgRenderMode.Ignore);

			if (node && (!node.type || node.type === 'text/css')) {
				var css = '';

				for (var i = 0; i < node.childNodes.length; i++) {
					css += node.childNodes[i].textContent;
				}

				css = _compressSpaces(css);
				css = css.replace(/\/\*([^*]|\*+[^*/])*\*+\//gm, ''); // remove comments

				var rules = css.match(/[^{}]*{[^}]*}/g);
				if (rules) {
					for (var i = 0; i < rules.length; i++) {
						var rule = rules[i].match(/([^{}]*){([^}]*)}/);

						if (rule) {
							var selectors = rule[1].trim().split(','),
								declaration = rule[2].trim();

							if (selectors.length && declaration) {
								selectors.forEach(selector => {
									if (selector = selector.trim()) {
										this.ctx.registerCssRule(new _SvgCssRule(selector, declaration));
									}
								});
							}
						}
					}
				}
			}
		}
	}

	export class _SvgSvgElementImpl extends _SvgClippableElementBase {
		private _x: _SvgNumAttr;
		private _y: _SvgNumAttr;
		private _width: _SvgNumAttr;
		private _height: _SvgNumAttr;
		private _scale: _SvgScaleAttributes;
		private _overflow: _SvgStrAttr;

		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node);

			this._x = new _SvgNumAttr(this, 'x', 0, _SvgNumConversion.Default, _SvgLengthContext.Width);
			this._y = new _SvgNumAttr(this, 'y', 0, _SvgNumConversion.Default, _SvgLengthContext.Height);
			this._width = new _SvgNumAttr(this, 'width', '100%', _SvgNumConversion.Default, _SvgLengthContext.Width);
			this._height = new _SvgNumAttr(this, 'height', '100%', _SvgNumConversion.Default, _SvgLengthContext.Height);
			this._scale = new _SvgScaleAttributes(this);
			this._overflow = new _SvgStrAttr(this, 'overflow', 'hidden');
		}

		public get width(): _SvgNumAttr {
			return this._width;
		}

		public get height(): _SvgNumAttr {
			return this._height;
		}

		protected _render(): void {
			var area = this.ctx.area;

			area._pdfdoc.saveState();

			// pecentage values of these attributes are resolved using the old ("parent") viewport.
			var width = this._width.val,
				height = this._height.val,
				x = this._x.val,
				y = this._y.val;

			if (this.parent && (x || y)) {
				area.translate(x, y);
			}

			this.viewport = new Size(width, height);

			// don't clip the outermost svg element
			if (/*this.parent && */this._overflow.val !== 'visible') {
				area.paths.rect(0, 0, width, height).clip();
			}

			// establish a new viewport using the viewBox and preserveAspectRatio attributes
			this.viewport = this._scale.apply(this);

			// debug
			//this.ctx.area.paths
			//	.rect(0, 0, this.viewPort.width, this.viewPort.height)
			//	.stroke(new PdfPen('lime', 2, new PdfDashPattern(5)));
			// debug

			// don't render if width = 0 or height = 0; viewBox.width = 0 or viewBox.height = 0
			if (this.viewport.width > 0 && this.viewport.height > 0) {
				super._render();
			}

			area._pdfdoc.restoreState();
		}
	}

	export class _SvgSymbolElementImpl extends _SvgClippableElementBase {
		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node, _SvgRenderMode.Ignore);
		}
	}

	export class _SvgUseElementImpl extends _SvgElementBase {
		private _xlink: _SvgIdRefAttr;

		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node);
			this._xlink = new _SvgIdRefAttr(this, 'xlink:href');
		}

		protected _render(): void {
			var ref: _SvgElementBase,
				foo: any;

			if (!this._xlink.hasVal || !(ref = this.ctx.getElement(this._xlink.val))) {
				return;
			}

			// ** https://www.w3.org/TR/SVG/struct.html#UseElement **

			var g = new _SvgGElementImpl(this.ctx, null);
			g.parent = this.parent;

			g.copyAttributesFrom(this, ['x', 'y', 'width', 'height', 'xlink:href']);

			// x, y
			if (this.attr('x') != null || this.attr('y') != null) {
				var trans = wijmo.format('translate({x},{y})', { x: this.attr('x') || 0, y: this.attr('y') || 0 });
				g.attr('transform', (foo = g.attr('transform')) ? foo + ' ' + trans : trans);
			}

			if (ref instanceof _SvgSymbolElementImpl) { // symbol
				// convert symbol to svg
				var svg = new _SvgSvgElementImpl(this.ctx, null);

				svg.copyAttributesFrom(ref);

				for (var i = 0; i < ref.children.length; i++) {
					svg.appendNode(ref.children[i].clone());
				}

				g.appendNode(svg);

				// width, height
				svg.attr('width', this.attr('width') || '100%');
				svg.attr('height', this.attr('height') || '100%');
			} else { // svg or any other element
				ref = ref.clone();
				g.appendNode(ref);

				if (ref instanceof _SvgSvgElementImpl) { // svg
					// width, height
					if ((foo = this.attr('width')) != null) {
						ref.attr('width', foo);
					}

					if ((foo = this.attr('height')) != null) {
						ref.attr('height', foo);
					}
				}
			}

			g.render(this.viewport, this.renderMode);
		}
	}

	//#endregion Other elements



	//#region Text elements

	export interface _TextDecorator {
		decoration: _SvgTextDecorationAttr;
		style: _SvgStyleAttributes;
	}

	export class _SvgTextElementImpl extends _SvgTransformableElementBase {
		private _x: _SvgNumAttr;
		private _y: _SvgNumAttr;
		private _dx: _SvgNumAttr;
		private _dy: _SvgNumAttr;
		private _textDecoration: _SvgTextDecorationAttr;

		constructor(ctx: _ISvgRenderContext, node: SVGElement) {
			super(ctx, node);

			this._x = new _SvgNumAttr(this, 'x', 0, _SvgNumConversion.Default, _SvgLengthContext.Width);
			this._y = new _SvgNumAttr(this, 'y', 0, _SvgNumConversion.Default, _SvgLengthContext.Height);
			this._dx = new _SvgNumAttr(this, 'dx', 0, _SvgNumConversion.Default, _SvgLengthContext.Width);
			this._dy = new _SvgNumAttr(this, 'dy', 0, _SvgNumConversion.Default, _SvgLengthContext.Height);
			this._textDecoration = new _SvgTextDecorationAttr(this);
		}

		protected _render() {
			if (this.renderMode === _SvgRenderMode.Render) { // render only; text elements cannot be used as a clipping path in PdfKit.
				super._render();
			}
		}

		protected _renderContent() {
			this._prepareNodes();

			var cx = this._x.val + this._dx.val,
				cy = this._y.val + this._dy.val,
				func = (node: _SvgTspanElementImpl, decorators: _TextDecorator[]): void => {
					if (node._x.hasVal) {
						cx = node._x.val;
					}

					if (node._y.hasVal) {
						cy = node._y.val;
					}

					cx += node._dx.val;
					cy += node._dy.val;

					if (node._text) {
						node._cx = cx;
						node._cy = cy;

						node._setDecorators(decorators);

						node.render(this.viewport, this.renderMode);

						cx += this.ctx.area.measureText(node._text, node.style.font.toFont(), { width: Infinity, height: Infinity }).size.width;
					} else {
						for (var i = 0; i < node.children.length; i++) {
							var dec = decorators.slice();
							dec.push({ decoration: node._textDecoration, style: node.style });
							func(<_SvgTspanElementImpl>node.children[i], dec);
						}
					}
				};

			for (var i = 0; i < this.children.length; i++) {
				func(<_SvgTspanElementImpl>this.children[i], [{ decoration: this._textDecoration, style: this.style }]);
			}
		}

		private _prepareNodes() {
			var removeEmptyNodes = (node: _SvgTspanElementImpl | _SvgTextElementImpl): boolean => {
				for (var i = 0; i < node.children.length; i++) {
					var child = <_SvgTspanElementImpl>node.children[i];

					if (!child._text && removeEmptyNodes(child)) {
						child.remove();
					}
				}

				return node.children.length === 0;
			};

			var list: _SvgTspanElementImpl[] = [];
			var buildTextList = (node: _SvgElementBase): void => {
				for (var i = 0; i < node.children.length; i++) {
					var child = <_SvgTspanElementImpl>node.children[i];

					if (child._text) {
						list.push(<any>child);
					} else {
						buildTextList(child);
					}
				}
			}

			removeEmptyNodes(this);
			buildTextList(this);

			for (var i = 0; i < list.length; i++) {
				var len = list.length;

				// remove whitespaces
				if (list[i]._text === ' ' && (
					(i === 0) || // leading
					(i === len - 1) || // trailing
					(i < len - 1 && list[i + 1]._text === ' '))) { // duplicate
					list[i].remove();
					list.splice(i, 1);
					i--;
				}
			}
		}
	}

	export class _SvgTspanElementImpl extends _SvgClippableElementBase {
		_text: string;
		_x: _SvgNumAttr;
		_y: _SvgNumAttr;
		_dx: _SvgNumAttr;
		_dy: _SvgNumAttr;
		_textDecoration = new _SvgTextDecorationAttr(this);
		_decorators: _TextDecorator[];

		_cx: number;
		_cy: number;

		constructor(ctx: _ISvgRenderContext, node: SVGElement, text?: string) {
			super(ctx, node);

			this._text = wijmo.asString(text);

			this._x = new _SvgNumAttr(this, 'x', 0, _SvgNumConversion.Default, _SvgLengthContext.Width);
			this._y = new _SvgNumAttr(this, 'y', 0, _SvgNumConversion.Default, _SvgLengthContext.Height);
			this._dx = new _SvgNumAttr(this, 'dx', 0, _SvgNumConversion.Default, _SvgLengthContext.Width);
			this._dy = new _SvgNumAttr(this, 'dy', 0, _SvgNumConversion.Default, _SvgLengthContext.Height);
			this._textDecoration = new _SvgTextDecorationAttr(this);
		}

		public clone(): _SvgElementBase {
			var clone = <_SvgTspanElementImpl>super.clone();
			clone._text = this._text;
			return clone;
		}

		_setDecorators(value: _TextDecorator[]) {
			this._decorators = value;
		}

		protected _renderContent(): void {
			if (this._text) {
				var opt: IPdfTextDrawSettings = {
					font: this.style.font.toFont(),
					width: Infinity,
					height: Infinity,
					lineBreak: false,
					fill: this.style.fill.color.val !== 'none',
					stroke: this.style.stroke.color.val !== 'none',
					_baseline: _PdfTextBaseline.Alphabetic
				};

				this._decorate();

				if (opt.fill || opt.stroke) {
					if (opt.fill) {
						opt.brush = this.style.fill.toBrush();
					}

					if (opt.stroke) {
						opt.pen = this.style.stroke.toPen();
					}

					this.ctx.area.drawText(this._text, this._cx, this._cy, opt);
				}
			}
		}

		private _decorate(): void {
			var area = this.ctx.area,
				hasValue = false;

			this._decorators.push({ decoration: this._textDecoration, style: this.style });

			for (var i = 0; i < this._decorators.length && !hasValue; i++) {
				hasValue = this._decorators[i].decoration.val != null;
			}

			if (hasValue) {
				area._pdfdoc.saveState();

				var d = <_IPdfKitDocument>area._pdfdoc._document,
					sz = area.measureText(this._text, this.style.font.toFont(), { width: Infinity, height: Infinity }).size,
					lineHeight = Math.max(d.currentFontSize() / 20, 0.1),
					ascender = d.currentFontAscender(),
					x = this._cx;

				for (var dec: _TextDecorator; dec = this._decorators.shift();) {
					var decVal = dec.decoration.val;

					if (decVal) {
						for (var j = 0; j < decVal.length; j++) {
							var y = this._cy - ascender; // baseline offset (Alphabetic)

							switch (decVal[j]) {
								case 'line-through':
									y = y + sz.height / 2 - lineHeight / 2;
									break;

								case 'overline':
									y = y - (d.currentFontBBox().ury - d.currentFontAscender());
									break;

								case 'underline':
									y = y + sz.height - lineHeight * 1.5;
									break;
							}

							area.paths.rect(x, y, sz.width, lineHeight);
						}

						dec.style.apply(this, true, true);
					}
				}

				area._pdfdoc.restoreState();
			}
		}
	}

	//#endregion Text elements
}