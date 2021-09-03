var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        'use strict';
        /**
         * Render to svg.
         */
        var _SvgRenderEngine = (function () {
            function _SvgRenderEngine(element) {
                this._strokeWidth = 1;
                this._fontSize = null;
                this._fontFamily = null;
                this._element = element;
                this._create();
                this._element.appendChild(this._svg);
                if (_SvgRenderEngine._isff === undefined) {
                    _SvgRenderEngine._isff = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;
                }
            }
            _SvgRenderEngine.prototype.beginRender = function () {
                while (this._svg.firstChild) {
                    this._svg.removeChild(this._svg.firstChild);
                }
                this._svg.appendChild(this._textGroup);
            };
            _SvgRenderEngine.prototype.endRender = function () {
                if (this._textGroup.parentNode) {
                    this._svg.removeChild(this._textGroup);
                }
            };
            _SvgRenderEngine.prototype.setViewportSize = function (w, h) {
                this._svg.setAttribute('width', w.toString());
                this._svg.setAttribute('height', h.toString());
            };
            Object.defineProperty(_SvgRenderEngine.prototype, "element", {
                get: function () {
                    return this._svg;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgRenderEngine.prototype, "fill", {
                get: function () {
                    return this._fill;
                },
                set: function (value) {
                    this._fill = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgRenderEngine.prototype, "fontSize", {
                get: function () {
                    return this._fontSize;
                },
                set: function (value) {
                    this._fontSize = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgRenderEngine.prototype, "fontFamily", {
                get: function () {
                    return this._fontFamily;
                },
                set: function (value) {
                    this._fontFamily = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgRenderEngine.prototype, "stroke", {
                get: function () {
                    return this._stroke;
                },
                set: function (value) {
                    this._stroke = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgRenderEngine.prototype, "strokeWidth", {
                get: function () {
                    return this._strokeWidth;
                },
                set: function (value) {
                    this._strokeWidth = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgRenderEngine.prototype, "textFill", {
                get: function () {
                    return this._textFill;
                },
                set: function (value) {
                    this._textFill = value;
                },
                enumerable: true,
                configurable: true
            });
            _SvgRenderEngine.prototype.addClipRect = function (clipRect, id) {
                if (clipRect && id) {
                    var clipPath = document.createElementNS(_SvgRenderEngine.svgNS, 'clipPath');
                    var rect = document.createElementNS(_SvgRenderEngine.svgNS, 'rect');
                    rect.setAttribute('x', (clipRect.left - 1).toFixed());
                    rect.setAttribute('y', (clipRect.top - 1).toFixed());
                    rect.setAttribute('width', (clipRect.width + 2).toFixed());
                    rect.setAttribute('height', (clipRect.height + 2).toFixed());
                    clipPath.appendChild(rect);
                    clipPath.setAttribute('id', id);
                    this._svg.appendChild(clipPath);
                }
            };
            _SvgRenderEngine.prototype.drawEllipse = function (cx, cy, rx, ry, className, style) {
                var ell = document.createElementNS(_SvgRenderEngine.svgNS, 'ellipse');
                ell.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    ell.setAttribute('stroke-width', this._strokeWidth.toString());
                }
                ell.setAttribute('fill', this._fill);
                ell.setAttribute('cx', cx.toFixed(1));
                ell.setAttribute('cy', cy.toFixed(1));
                ell.setAttribute('rx', rx.toFixed(1));
                ell.setAttribute('ry', ry.toFixed(1));
                //ell.setAttribute('cx', cx.toString());
                //ell.setAttribute('cy', cy.toString());
                //ell.setAttribute('rx', rx.toString());
                //ell.setAttribute('ry', ry.toString());
                if (className) {
                    ell.setAttribute('class', className);
                }
                this._applyStyle(ell, style);
                //this._svg.appendChild(ell);
                this._appendChild(ell);
                return ell;
            };
            _SvgRenderEngine.prototype.drawRect = function (x, y, w, h, className, style, clipPath) {
                var rect = document.createElementNS(_SvgRenderEngine.svgNS, 'rect');
                rect.setAttribute('fill', this._fill);
                rect.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    rect.setAttribute('stroke-width', this._strokeWidth.toString());
                }
                rect.setAttribute('x', x.toFixed(1));
                rect.setAttribute('y', y.toFixed(1));
                if (w > 0 && w < 0.05) {
                    rect.setAttribute('width', '0.1');
                }
                else {
                    rect.setAttribute('width', w.toFixed(1));
                }
                if (h > 0 && h < 0.05) {
                    rect.setAttribute('height', '0.1');
                }
                else {
                    rect.setAttribute('height', h.toFixed(1));
                }
                if (clipPath) {
                    rect.setAttribute('clip-path', 'url(#' + clipPath + ')');
                }
                if (className) {
                    rect.setAttribute('class', className);
                }
                this._applyStyle(rect, style);
                this._appendChild(rect);
                return rect;
            };
            _SvgRenderEngine.prototype.drawLine = function (x1, y1, x2, y2, className, style) {
                var line = document.createElementNS(_SvgRenderEngine.svgNS, 'line');
                line.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    line.setAttribute('stroke-width', this._strokeWidth.toString());
                }
                line.setAttribute('x1', x1.toFixed(1));
                line.setAttribute('x2', x2.toFixed(1));
                line.setAttribute('y1', y1.toFixed(1));
                line.setAttribute('y2', y2.toFixed(1));
                //line.setAttribute('x1', x1.toString());
                //line.setAttribute('x2', x2.toString());
                //line.setAttribute('y1', y1.toString());
                //line.setAttribute('y2', y2.toString());
                if (className) {
                    line.setAttribute('class', className);
                }
                this._applyStyle(line, style);
                this._appendChild(line);
                return line;
            };
            _SvgRenderEngine.prototype.drawLines = function (xs, ys, className, style, clipPath) {
                if (xs && ys) {
                    var len = Math.min(xs.length, ys.length);
                    if (len > 0) {
                        var pline = document.createElementNS(_SvgRenderEngine.svgNS, 'polyline');
                        pline.setAttribute('stroke', this._stroke);
                        if (this._strokeWidth !== null) {
                            pline.setAttribute('stroke-width', this._strokeWidth.toString());
                        }
                        pline.setAttribute('fill', 'none');
                        var spts = '';
                        for (var i = 0; i < len; i++) {
                            spts += xs[i].toFixed(1) + ',' + ys[i].toFixed(1) + ' ';
                        }
                        pline.setAttribute('points', spts);
                        if (className) {
                            pline.setAttribute('class', className);
                        }
                        if (clipPath) {
                            pline.setAttribute('clip-path', 'url(#' + clipPath + ')');
                        }
                        this._applyStyle(pline, style);
                        this._appendChild(pline);
                        return pline;
                    }
                }
                return null;
            };
            _SvgRenderEngine.prototype.drawSplines = function (xs, ys, className, style, clipPath) {
                if (xs && ys) {
                    var spline = new chart._Spline(xs, ys);
                    var s = spline.calculate();
                    var sx = s.xs;
                    var sy = s.ys;
                    var len = Math.min(sx.length, sy.length);
                    if (len > 0) {
                        var pline = document.createElementNS(_SvgRenderEngine.svgNS, 'polyline');
                        pline.setAttribute('stroke', this._stroke);
                        if (this._strokeWidth !== null) {
                            pline.setAttribute('stroke-width', this._strokeWidth.toString());
                        }
                        pline.setAttribute('fill', 'none');
                        var spts = '';
                        for (var i = 0; i < len; i++) {
                            spts += sx[i].toFixed(1) + ',' + sy[i].toFixed(1) + ' ';
                        }
                        pline.setAttribute('points', spts);
                        if (className) {
                            pline.setAttribute('class', className);
                        }
                        if (clipPath) {
                            pline.setAttribute('clip-path', 'url(#' + clipPath + ')');
                        }
                        this._applyStyle(pline, style);
                        this._appendChild(pline);
                        return pline;
                    }
                }
                return null;
            };
            _SvgRenderEngine.prototype.drawPolygon = function (xs, ys, className, style, clipPath) {
                if (xs && ys) {
                    var len = Math.min(xs.length, ys.length);
                    if (len > 0) {
                        var poly = document.createElementNS(_SvgRenderEngine.svgNS, 'polygon');
                        poly.setAttribute('stroke', this._stroke);
                        if (this._strokeWidth !== null) {
                            poly.setAttribute('stroke-width', this._strokeWidth.toString());
                        }
                        poly.setAttribute('fill', this._fill);
                        var spts = '';
                        for (var i = 0; i < len; i++) {
                            //spts += xs[i].toString() + ',' + ys[i].toString() + ' ';
                            spts += xs[i].toFixed(1) + ',' + ys[i].toFixed(1) + ' ';
                        }
                        poly.setAttribute('points', spts);
                        if (className) {
                            poly.setAttribute('class', className);
                        }
                        if (clipPath) {
                            poly.setAttribute('clip-path', 'url(#' + clipPath + ')');
                        }
                        this._applyStyle(poly, style);
                        this._appendChild(poly);
                        return poly;
                    }
                }
                return null;
            };
            _SvgRenderEngine.prototype.drawPieSegment = function (cx, cy, r, startAngle, sweepAngle, className, style, clipPath) {
                if (sweepAngle >= Math.PI * 2) {
                    return this.drawEllipse(cx, cy, r, r, className, style);
                }
                var path = document.createElementNS(_SvgRenderEngine.svgNS, 'path');
                path.setAttribute('fill', this._fill);
                path.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    path.setAttribute('stroke-width', this._strokeWidth.toString());
                }
                var p1 = new wijmo.Point(cx, cy);
                p1.x += r * Math.cos(startAngle);
                p1.y += r * Math.sin(startAngle);
                var a2 = startAngle + sweepAngle;
                var p2 = new wijmo.Point(cx, cy);
                p2.x += r * Math.cos(a2);
                p2.y += r * Math.sin(a2);
                var opt = ' 0 0,1 ';
                if (Math.abs(sweepAngle) > Math.PI) {
                    opt = ' 0 1,1 ';
                }
                //var d = 'M ' + cx.toFixed(1) + ',' + cy.toFixed(1);
                //d += ' L ' + p1.x.toFixed(1) + ',' + p1.y.toFixed(1);
                //d += ' A ' + r.toFixed(1) + ',' + r.toFixed(1) + opt;
                //d += p2.x.toFixed(1) + ',' + p2.y.toFixed(1) + ' z';
                var d = 'M ' + p1.x.toFixed(1) + ',' + p1.y.toFixed(1);
                d += ' A ' + r.toFixed(1) + ',' + r.toFixed(1) + opt;
                d += p2.x.toFixed(1) + ',' + p2.y.toFixed(1);
                d += ' L ' + cx.toFixed(1) + ',' + cy.toFixed(1) + ' z';
                path.setAttribute('d', d);
                if (clipPath) {
                    path.setAttribute('clip-path', 'url(#' + clipPath + ')');
                }
                if (className) {
                    path.setAttribute('class', className);
                }
                this._applyStyle(path, style);
                this._appendChild(path);
                return path;
            };
            _SvgRenderEngine.prototype.drawDonutSegment = function (cx, cy, radius, innerRadius, startAngle, sweepAngle, className, style, clipPath) {
                var isFull = false;
                if (sweepAngle >= Math.PI * 2) {
                    isFull = true;
                    sweepAngle -= 0.001;
                }
                var path = document.createElementNS(_SvgRenderEngine.svgNS, 'path');
                path.setAttribute('fill', this._fill);
                path.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    path.setAttribute('stroke-width', this._strokeWidth.toString());
                }
                var p1 = new wijmo.Point(cx, cy);
                p1.x += radius * Math.cos(startAngle);
                p1.y += radius * Math.sin(startAngle);
                var a2 = startAngle + sweepAngle;
                var p2 = new wijmo.Point(cx, cy);
                p2.x += radius * Math.cos(a2);
                p2.y += radius * Math.sin(a2);
                var p3 = new wijmo.Point(cx, cy);
                p3.x += innerRadius * Math.cos(a2);
                p3.y += innerRadius * Math.sin(a2);
                var p4 = new wijmo.Point(cx, cy);
                p4.x += innerRadius * Math.cos(startAngle);
                p4.y += innerRadius * Math.sin(startAngle);
                var opt1 = ' 0 0,1 ', opt2 = ' 0 0,0 ';
                if (Math.abs(sweepAngle) > Math.PI) {
                    opt1 = ' 0 1,1 ';
                    opt2 = ' 0 1,0 ';
                }
                var d = 'M ' + p1.x.toFixed(3) + ',' + p1.y.toFixed(3);
                d += ' A ' + radius.toFixed(3) + ',' + radius.toFixed(3) + opt1;
                d += p2.x.toFixed(3) + ',' + p2.y.toFixed(3);
                if (isFull) {
                    d += ' M ' + p3.x.toFixed(3) + ',' + p3.y.toFixed(3);
                }
                else {
                    d += ' L ' + p3.x.toFixed(3) + ',' + p3.y.toFixed(3);
                }
                d += ' A ' + innerRadius.toFixed(3) + ',' + innerRadius.toFixed(3) + opt2;
                d += p4.x.toFixed(3) + ',' + p4.y.toFixed(3);
                if (!isFull) {
                    d += ' z';
                }
                path.setAttribute('d', d);
                if (clipPath) {
                    path.setAttribute('clip-path', 'url(#' + clipPath + ')');
                }
                if (className) {
                    path.setAttribute('class', className);
                }
                this._applyStyle(path, style);
                this._appendChild(path);
                return path;
            };
            _SvgRenderEngine.prototype.drawString = function (s, pt, className, style) {
                var text = this._createText(pt, s);
                if (className) {
                    text.setAttribute('class', className);
                }
                this._applyStyle(text, style);
                this._appendChild(text);
                var bb = this._getBBox(text); // text.getBBox();
                text.setAttribute('y', (pt.y - (bb.y + bb.height - pt.y)).toFixed(1));
                return text;
            };
            _SvgRenderEngine.prototype.drawStringRotated = function (s, pt, center, angle, className, style) {
                var text = this._createText(pt, s);
                if (className) {
                    text.setAttribute('class', className);
                }
                this._applyStyle(text, style);
                var g = document.createElementNS(_SvgRenderEngine.svgNS, 'g');
                g.setAttribute('transform', 'rotate(' + angle.toFixed(1) + ',' + center.x.toFixed(1) + ',' + center.y.toFixed(1) + ')');
                //g.setAttribute('transform', 'rotate(' + angle.toString() + ',' + center.x.toString() + ',' + center.y.toString() + ')');
                g.appendChild(text);
                //this._svg.appendChild(g);
                this._appendChild(g);
                var bb = this._getBBox(text); // text.getBBox();
                text.setAttribute('y', (pt.y - (bb.y + bb.height - pt.y)).toFixed(1));
                return text;
            };
            _SvgRenderEngine.prototype.measureString = function (s, className, groupName, style) {
                var sz = new wijmo.Size(0, 0);
                if (this._fontSize) {
                    this._text.setAttribute('font-size', this._fontSize);
                }
                if (this._fontFamily) {
                    this._text.setAttribute('font-family', this._fontFamily);
                }
                if (className) {
                    this._text.setAttribute('class', className);
                }
                if (groupName) {
                    this._textGroup.setAttribute('class', groupName);
                }
                this._applyStyle(this._text, style);
                this._setText(this._text, s);
                var rect = this._getBBox(this._text); // this._text.getBBox();
                sz.width = rect.width;
                sz.height = rect.height;
                this._text.removeAttribute('font-size');
                this._text.removeAttribute('font-family');
                this._text.removeAttribute('class');
                if (style) {
                    for (var key in style) {
                        this._text.removeAttribute(this._deCase(key));
                    }
                }
                this._textGroup.removeAttribute('class');
                this._text.textContent = null;
                return sz;
            };
            _SvgRenderEngine.prototype.startGroup = function (className, clipPath, createTransform) {
                if (createTransform === void 0) { createTransform = false; }
                var group = document.createElementNS(_SvgRenderEngine.svgNS, 'g');
                if (className) {
                    group.setAttribute('class', className);
                }
                if (clipPath) {
                    group.setAttribute('clip-path', 'url(#' + clipPath + ')');
                }
                this._appendChild(group);
                if (createTransform) {
                    group.transform.baseVal.appendItem(this._svg.createSVGTransform());
                }
                this._group = group;
                return group;
            };
            _SvgRenderEngine.prototype.endGroup = function () {
                if (this._group) {
                    var parent = this._group.parentNode;
                    if (parent == this._svg) {
                        this._group = null;
                    }
                    else {
                        this._group = parent;
                    }
                }
            };
            _SvgRenderEngine.prototype.drawImage = function (imageHref, x, y, w, h) {
                var img = document.createElementNS(_SvgRenderEngine.svgNS, 'image');
                img.setAttributeNS(_SvgRenderEngine.xlinkNS, 'href', imageHref);
                img.setAttribute('x', x.toFixed(1));
                img.setAttribute('y', y.toFixed(1));
                img.setAttribute('width', w.toFixed(1));
                img.setAttribute('height', h.toFixed(1));
                this._appendChild(img);
                return img;
            };
            _SvgRenderEngine.prototype._appendChild = function (element) {
                var group = this._group;
                if (!group) {
                    group = this._svg;
                }
                group.appendChild(element);
            };
            _SvgRenderEngine.prototype._create = function () {
                this._svg = document.createElementNS(_SvgRenderEngine.svgNS, 'svg');
                this._defs = document.createElementNS(_SvgRenderEngine.svgNS, 'defs');
                this._svg.appendChild(this._defs);
                this._text = this._createText(new wijmo.Point(-1000, -1000), '');
                this._textGroup = document.createElementNS(_SvgRenderEngine.svgNS, 'g');
                this._textGroup.appendChild(this._text);
                this._svg.appendChild(this._textGroup);
            };
            _SvgRenderEngine.prototype._setText = function (element, s) {
                var text = s ? s.toString() : null;
                if (text && text.indexOf('tspan') >= 0) {
                    try {
                        element.textContent = null;
                        // Parse the markup into valid nodes.
                        var dXML = new DOMParser();
                        //dXML.async = false;
                        // Wrap the markup into a SVG node to ensure parsing works.
                        var sXML = '<svg xmlns="http://www.w3.org/2000/svg\">' + text + '</svg>';
                        var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;
                        // Now take each node, import it and append to this element.
                        var childNode = svgDocElement.firstChild;
                        while (childNode) {
                            element.appendChild(element.ownerDocument.importNode(childNode, true));
                            childNode = childNode.nextSibling;
                        }
                    }
                    catch (e) {
                        throw new Error('Error parsing XML string.');
                    }
                    ;
                }
                else {
                    element.textContent = text;
                }
            };
            _SvgRenderEngine.prototype._createText = function (pos, text) {
                var textel = document.createElementNS(_SvgRenderEngine.svgNS, 'text');
                this._setText(textel, text);
                textel.setAttribute('fill', this._textFill);
                textel.setAttribute('x', pos.x.toFixed(1));
                textel.setAttribute('y', pos.y.toFixed(1));
                //textel.setAttribute('x', pos.x.toString());
                //textel.setAttribute('y', pos.y.toString());
                if (this._fontSize) {
                    textel.setAttribute('font-size', this._fontSize);
                }
                if (this._fontFamily) {
                    textel.setAttribute('font-family', this._fontFamily);
                }
                return textel;
            };
            _SvgRenderEngine.prototype._applyStyle = function (el, style) {
                if (style) {
                    for (var key in style) {
                        el.setAttribute(this._deCase(key), style[key]);
                    }
                }
            };
            _SvgRenderEngine.prototype._deCase = function (s) {
                return s.replace(/[A-Z]/g, function (a) { return '-' + a.toLowerCase(); });
            };
            _SvgRenderEngine.prototype._getBBox = function (text) {
                if (_SvgRenderEngine._isff) {
                    try {
                        return text.getBBox();
                    }
                    catch (e) {
                        return { x: 0, y: 0, width: 0, height: 0 };
                    }
                }
                else {
                    return text.getBBox();
                }
            };
            _SvgRenderEngine.svgNS = 'http://www.w3.org/2000/svg';
            _SvgRenderEngine.xlinkNS = 'http://www.w3.org/1999/xlink';
            return _SvgRenderEngine;
        }());
        chart._SvgRenderEngine = _SvgRenderEngine;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=SvgRenderEngine.js.map