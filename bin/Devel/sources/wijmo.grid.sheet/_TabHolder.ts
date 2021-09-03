module wijmo.grid.sheet {
	'use strict';

	/*
	 * Defines the _TabHolder control.
	 */
	export class _TabHolder extends wijmo.Control {
		private _owner: FlexSheet;

		// child controls
		//private _hScrollbar: ScrollBar;
		private _sheetControl: _SheetTabs;

		// child elements
		private _divSheet: HTMLElement;
		private _divSplitter: HTMLElement;
		private _divRight: HTMLElement;
		//private _divHScrollbar: HTMLElement;

		// event handler
		private _funSplitterMousedown: (ev: MouseEvent) => any;
		private _splitterMousedownHdl = this._splitterMousedownHandler.bind(this);

		private _startPos: number;

		static controlTemplate = '<div>' +
		'<div wj-part="left" style ="float:left;height:100%;overflow:hidden"></div>' +  // left sheet
		'<div wj-part="splitter" style="float:left;height:100%;width:6px;background-color:#e9eaee;padding:2px;cursor:e-resize"><div style="background-color:#8a9eb2;height:100%"></div></div>' + // splitter
		'<div wj-part="right" style="float:left;height:100%;background-color:#e9eaee">' +
		// We will use the native scrollbar of the flexgrid instead of the custom scrollbar of flexsheet (TFS 121971)
		//'<div wj-part="hscrollbar" style="float:none;height:100%;border-left:1px solid #8a9eb2; padding-top:1px; display: none;"></div>' + // right scrollbar
		'</div>' +
		'</div>';

		/*
		 * Initializes a new instance of the _TabHolder class.
		 *
		 * @param element The DOM element that will host the control, or a jQuery selector (e.g. '#theCtrl').
		 * @param owner The @see: FlexSheet control that the _TabHolder control is associated to.
		 */
		constructor(element: any, owner: FlexSheet) {
			super(element);
			this._owner = owner;

			if (this.hostElement.attributes['tabindex']) {
				this.hostElement.attributes.removeNamedItem('tabindex');
			}
			// instantiate and apply template
			this.applyTemplate('', this.getTemplate(), {
				_divSheet: 'left',
				_divSplitter: 'splitter',
				_divRight: 'right'
				//_divHScrollbar: 'hscrollbar'
			});

			this._init();
		}

		/*
		 * Gets the SheetTabs control
		 */
		get sheetControl(): _SheetTabs {
			return this._sheetControl;
		}

		//get scrollBar(): ScrollBar {
		//	return this._hScrollbar;
		//}

		/*
		 * Gets or sets the visibility of the TabHolder control
		 */
		get visible(): boolean {
			return this.hostElement.style.display !== 'none';
		}
		set visible(value: boolean) {
			this.hostElement.style.display = value ? 'block' : 'none'; 
			this._divSheet.style.display = value ? 'block' : 'none'; 
		}

		/*
		 * Gets the Blanket size for the TabHolder control.
		 */
		public getSheetBlanketSize(): number {
			//var scrollBarSize = ScrollBar.getSize();
			//return (scrollBarSize === 0 ? 20 : scrollBarSize + 3);
			return 20;
		}

		/*
		 * Adjust the size of the TabHolder control 
		 */
		public adjustSize() {
			var hScrollDis = this._owner.scrollSize.width - this._owner.clientSize.width,
				vScrollDis = this._owner.scrollSize.height - this._owner.clientSize.height,
				eParent = this._divSplitter.parentElement,
				//totalWidth: number,
				leftWidth: number;

			if (hScrollDis <= 0) {
				eParent.style.minWidth = '100px';
				this._divSplitter.style.display = 'none';
				this._divRight.style.display = 'none';
				this._divSheet.style.width = '100%';
				this._divSplitter.removeEventListener('mousedown', this._splitterMousedownHdl, true);
				//this._hScrollbar.scrolled.removeHandler(this._scrollbarScrolled, this);
			} else {
				eParent.style.minWidth = '300px';
				this._divSplitter.style.display = 'none';
				this._divRight.style.display = 'none';
				//totalWidth = eParent.clientWidth - this._divSplitter.offsetWidth;
				this._divSheet.style.width = '100%';
				//leftWidth = Math.ceil(totalWidth / 2);
				//this._divSheet.style.width = leftWidth + 'px';
				//this._divRight.style.width = (totalWidth - leftWidth) + 'px';
				//if (vScrollDis <= 0) {
				//	this._divHScrollbar.style.marginRight = '0px';
				//} else {
				//	this._divHScrollbar.style.marginRight = '20px';
				//}
				//this._hScrollbar.scrollDistance = hScrollDis;
				//this._hScrollbar.scrollValue = -this._owner.scrollPosition.x;
				this._divSplitter.removeEventListener('mousedown', this._splitterMousedownHdl, true);
				this._divSplitter.addEventListener('mousedown', this._splitterMousedownHdl, true);
				//this._hScrollbar.scrolled.removeHandler(this._scrollbarScrolled, this);
				//this._hScrollbar.scrolled.addHandler(this._scrollbarScrolled, this);
				//this._hScrollbar.refresh();
            }

            this._sheetControl._adjustSize();
		}

		// Init the size of the splitter.
		// And init the ScrollBar, SheetTabs control 
		private _init() {
			var self = this;
			self._funSplitterMousedown = function (e: MouseEvent) {
				self._splitterMouseupHandler(e);
			};
			self._divSplitter.parentElement.style.height = self.getSheetBlanketSize() + 'px';
			//init scrollbar
			//self._hScrollbar = new ScrollBar(self._divHScrollbar);
			//init sheet
			self._sheetControl = new _SheetTabs(self._divSheet, this._owner);
			//self._owner.scrollPositionChanged.addHandler(() => {
			//	self._hScrollbar.scrollValue = -self._owner.scrollPosition.x;
			//});
		}

		// Mousedown event handler for the splitter
		private _splitterMousedownHandler(e: MouseEvent) {
			this._startPos = e.pageX;
			document.addEventListener('mousemove', this._splitterMousemoveHandler.bind(this), true);
			document.addEventListener('mouseup', this._funSplitterMousedown, true);
			e.preventDefault();
		}

		// Mousemove event handler for the splitter
		private _splitterMousemoveHandler(e: MouseEvent) {
			if (this._startPos === null || typeof (this._startPos) === 'undefined') {
				return;
			}
			this._adjustDis(e.pageX - this._startPos);
		}

		// Mouseup event handler for the splitter
		private _splitterMouseupHandler(e: MouseEvent) {
			document.removeEventListener('mousemove', this._splitterMousemoveHandler, true);
			document.removeEventListener('mouseup', this._funSplitterMousedown, true);
			this._adjustDis(e.pageX - this._startPos);
			this._startPos = null;
		}

		// Adjust the distance for the splitter
		private _adjustDis(dis: number) {
			var rightWidth = this._divRight.offsetWidth - dis,
				leftWidth = this._divSheet.offsetWidth + dis;

			if (rightWidth <= 100) {
				rightWidth = 100;
				dis = this._divRight.offsetWidth - rightWidth;
				leftWidth = this._divSheet.offsetWidth + dis;
			} else if (leftWidth <= 100) {
				leftWidth = 100;
				dis = leftWidth - this._divSheet.offsetWidth;
				rightWidth = this._divRight.offsetWidth - dis;
			}
			if (dis == 0) {
				return;
			}
			this._divRight.style.width = rightWidth + 'px';
			this._divSheet.style.width = leftWidth + 'px';
			this._startPos = this._startPos + dis;
			//this._hScrollbar.invalidate(false);
		}

		// scrolled event handler for the scrollbar control
		//private _scrollbarScrolled(sender, e) {
		//	var hs = <ScrollBar> sender,
		//		scrollValue = -hs.scrollValue;
			
		//	if (scrollValue !== this._owner.scrollPosition.x) {
		//		this._owner._ptScrl = new wijmo.Point(scrollValue, this._owner.scrollPosition.y);
		//		this._owner.refresh(true);
		//	}
		//}
	}
}