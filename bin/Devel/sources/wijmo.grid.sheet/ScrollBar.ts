module wijmo.grid.sheet {
	'use strict';

	/**
	 * Defines the @see:ScrollBar control.
	 */
	export class ScrollBar extends wijmo.Control {
		private _scrollDistance: number = 0;
		private _fill: HTMLDivElement;
		private _root: HTMLDivElement;
		private _size: number = 0;
		private _scrollValue: number = 0;
		private _scrollHdl = this._scrollEventHandler.bind(this);
		static scrollbarSize: number = 0;

		static controlTemplate = '<div wj-part="root" style="width:100px;height:100px">' + 
			'<div wj-part="fill" style="width:100%;height:100%"/>' + 
			'</div>';

		/**
		 * Initializes a new instance of the @see:ScrollBar class.
		 *
		 * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
		 * @param options JavaScript object containing initialization data for the control.
		 */
		constructor(element: any, options?: any) {
			super(element, options);
			var self = this;

			if (self.hostElement.attributes['tabindex']) {
				self.hostElement.attributes.removeNamedItem('tabindex');
			}

			self.deferUpdate(function(){
				self._initControl();
				if (options) {
					self.initialize(options);
				}
				self._adjustSize();
			});
		}

		/**
		 * Gets or sets the scroll distance of the ScrollBar control.
		 *
		 * This value indicate the range that ScrollBar control can scroll.
		 */
		get scrollDistance(): number {
			return this._scrollDistance;
		}
		set scrollDistance(value: number) {
			if (value !== this.scrollDistance && value >= 0) {
				this._scrollDistance = value;
				this.invalidate();
			}
		}

		/**
		 * Gets or sets the scroll value of the ScrollBar control
		 *
		 * This value is for synchronizing the scroll position of the FlexSheet control.
		 */
		get scrollValue(): number {
			return this._scrollValue;
		}
		set scrollValue(value: number) {
			if (value < 0 || value > this.scrollDistance) {
				return;
			}
			if (value !== this._scrollValue) {
				this._root.scrollLeft = value;
				this._scrollValue = value;
			}
		}

		/**
		 * Gets the size of the ScrollBar control
		 */
		get size(): number {
			return this._size;
		}

		/**
		 * Override to refresh the control.
		 *
		 * @param fullUpdate Whether to update the control layout as well as the content.
		 */
		refresh(fullUpdate = true) {
			super.refresh(fullUpdate);
			this._root.removeEventListener('mousedown', this._mousedownEventHandler);
			this._root.removeEventListener('scroll', this._scrollHdl, true);
			this._adjustSize(fullUpdate);
			this._root.addEventListener('mousedown', this._mousedownEventHandler);
			this._root.addEventListener('scroll', this._scrollHdl, true);
		}

		/**
		 * Occurs when the ScrollBar is scrolled
		 */
		scrolled = new wijmo.Event();

		// The scroll event handler for the ScrollBar control.
		private _scrollEventHandler() {
			this._scrollValue = this._root.scrollLeft;

			this.scrolled.raise(this);
		}

		// The mousedown event handler for the ScrollBar control.
		private _mousedownEventHandler(e: MouseEvent) {
			e.preventDefault();
		}

		// Initialize the ScrollBar control.
		private _initControl(){
			this.applyTemplate('', this.getTemplate(), {
				_fill: 'fill',
				_root: 'root'
			}); 

			this._root.addEventListener('mousedown', this._mousedownEventHandler);
			this._root.addEventListener('scroll', this._scrollHdl, true);
		}

		// Adjust the size for the ScrollBar control.
		private _adjustSize(fullUpdate = true) {
			var size: number,
				dis: number;

			if (fullUpdate) {
				this._root.style.overflowX = 'auto';
				this._root.style.overflowY = 'hidden';
				size = ScrollBar.scrollbarSize;
				if (!size) {
					dis = this._root.offsetWidth + this._scrollDistance;
					this._fill.style.width = dis + 'px';
					size = this._root.offsetHeight - this._root.clientHeight;
					ScrollBar.scrollbarSize = size;
				}
				this._root.style.height = '100%';
				this._fill.style.height = size + 'px';
				this._root.style.width = '100%';
				this._size = size;
			}
			dis = this._root.offsetWidth + this._scrollDistance;
			this._fill.style.width = dis + 'px';
		}

		/**
		 * Gets the size of the ScrollBar.
		 */
		static getSize(): number {
			var size = ScrollBar.scrollbarSize,
				tmp: HTMLDivElement,
				scrollbar: ScrollBar;

			if (size) {
				return size;
			}

			tmp = document.createElement('div');
			document.body.appendChild(tmp);
			scrollbar = new ScrollBar(tmp, { scrollDistance: 100});
			size = scrollbar.size;
			ScrollBar.scrollbarSize = size;
			document.body.removeChild(tmp);

			return size;
		}
	}
}