module wijmo.pdf {
	'use strict;'

	export interface _ISvgRenderContext {
		area: PdfPageArea;
		urlResolver: (url: string) => string;
		getElement: (id: string) => _SvgElementBase;
		registerCssRule: (rule: _SvgCssRule) => void;
	}

	export class _SvgRenderer {
		private _elementsById: _TDictionary<_SvgElementBase> = {};
		private _registeredCssRules: _TDictionary<_SvgCssRule> = {};
		private _svg: _SvgSvgElementImpl;
		private _doc: PdfDocument;

		constructor(svgString: string, area: PdfPageArea, urlResolver?: (url: string) => string) {
			wijmo.assert(area != null, _Errors.ValueCannotBeEmpty('svgString'));

			this._doc = area._pdfdoc;

			var dom = this._parse(svgString);
			if (dom) {
				this._svg = new _SvgSvgElementImpl({
					area: area,
					urlResolver: urlResolver,
					getElement: this._getElementById.bind(this),
					registerCssRule: (rule: _SvgCssRule) => {
						this._registerCssRule(rule, urlResolver);
					}
				}, null);
				this._copyAttributes(dom, this._svg);
				this._buildTree(dom, this._svg);
				// pre-set viewport, so the outermost svg element's height and width properties can be resolved against the viewport before rendering
				this._svg.viewport = new Size(area.width, area.height);
			}
		}

		public get root(): _SvgSvgElementImpl {
			return this._svg;
		}

		public render(viewPort?: Size) {
			if (this._svg) {
				this._svg.render(viewPort || this._svg.viewport);
			}
		}

		private _parse(svg: string): SVGSVGElement {
			if (svg) {
				var parser = new DOMParser();
				(<any>parser).async = false;

				return <SVGSVGElement>parser.parseFromString(svg, 'text/xml').querySelector('svg');

				//// IE10\11 throws the "SyntaxError" exception if xmlns:xlink is missed and if the string being parsed contains elements which are use the 'xlink' attribute.
				//svg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink">' + svg + '</svg>';
				//return <SVGElement>parser.parseFromString(svg, 'text/xml').querySelector('svg').querySelector('svg');
			}
		}

		private _buildTree(dom: Node, tree: _SvgElementBase, handleTextNodes?: boolean): void {
			for (var i = 0; dom.childNodes && i < dom.childNodes.length; i++) {
				var domChild = <SVGElement>dom.childNodes.item(i),
					nodeName = domChild.nodeName;

				if (domChild.nodeType === 1) {
					var className = this._getClassName(nodeName);

					if (wijmo.pdf[className]) {
						var element = new (<_ISvgElementBaseCtor>wijmo.pdf[className])(tree.ctx, domChild);
						this._copyAttributes(domChild, element);
						tree.appendNode(element);

						if (domChild.id) {
							this._elementsById[domChild.id] = element;
						}

						this._buildTree(domChild, element, nodeName === 'text' || (handleTextNodes && nodeName === 'tspan'));
					} else {
						//DEBUG
						//alert('Not implemented: ' + nodeName);
					}
				} else {
					if (domChild.nodeType === 3 && handleTextNodes) {
						var textContent = domChild.textContent.trim();

						if (textContent) {
							// <tspan />\r\n[text] => <tspan />_text
							if (i != 0 && dom.childNodes[i - 1].nodeType === 1 && domChild.textContent.match(/^\s/)) {
								tree.appendNode(new _SvgTspanElementImpl(tree.ctx, null, ' '));
							}

							var text = _compressSpaces(domChild.textContent);
							tree.appendNode(new _SvgTspanElementImpl(tree.ctx, null, text));
						}

						// <tspan />\r\n<tspan /> => <tspan />_<tspan />
						// [text]\r\n[smth] -> [text]_[smth]
						if (!textContent || domChild.textContent.match(/\s$/)) {
							tree.appendNode(new _SvgTspanElementImpl(tree.ctx, null, ' '));
						}
					}
				}
			}
		}

		// Any class that wraps a SVG element must follow this naming pattern
		private _getClassName(nodeName: string): string {
			return '_Svg' + nodeName.charAt(0).toUpperCase() + nodeName.substring(1) + 'ElementImpl';
		}

		private _copyAttributes(node: SVGElement, element: _SvgElementBase): void {
			// copy attributes
			for (var i = 0; i < node.attributes.length; i++) {
				var attr = node.attributes.item(i);
				element.attr(attr.name, attr.value);
			}

			var css = _SvgCssHelper.getComputedStyle(node, this._registeredCssRules);

			// convert CSS to attributes (some of the presentation attributes will be overwritten as they have lower priority than CSS)
			for (var i = 0, keys = Object.keys(css); i < keys.length; i++) {
				var name = keys[i];
				element.attr(name, css[name]);
			}
		}

		private _getElementById(id: string): _SvgElementBase {
			id = (id || '').replace('#', '');
			return this._elementsById[id];
		}

		private _registerCssRule(rule: _SvgCssRule, urlResolver?: (url: string) => string): void {
			if (rule.selector[0] !== '@') {
				this._registeredCssRules[rule.selector] = rule;
			} else {
				if (rule.selector === '@font-face') {
					_SvgCssHelper.registerFontFace(this._doc, rule, urlResolver);
				}
			}
		}
	}
}