module wijmo.grid.sheet {
	'use strict';

	/*
	 * Defines the ContextMenu for a @see:FlexSheet control.
	 */
	export class _ContextMenu extends wijmo.Control {
		private _owner: FlexSheet;
		private _insRows: HTMLElement;
		private _delRows: HTMLElement;
		private _insCols: HTMLElement;
		private _delCols: HTMLElement;

		static controlTemplate = '<div class="wj-context-menu" width="150px">' +
		'<div class="wj-context-menu-item" wj-part="insert-rows">Insert Row</div>' +
		'<div class="wj-context-menu-item" wj-part="delete-rows">Delete Rows</div>' +
		'<div class="wj-context-menu-item" wj-part="insert-columns">Insert Column</div>' +
		'<div class="wj-context-menu-item" wj-part="delete-columns">Delete Columns</div>' +
		'</div>';

		/*
		 * Initializes a new instance of the _ContextMenu class.
		 *
		 * @param element The DOM element that will host the control, or a jQuery selector (e.g. '#theCtrl').
		 * @param owner The @see: FlexSheet control what the ContextMenu works with.
		 */
		constructor(element: any, owner: FlexSheet) {
			super(element);

			this._owner = owner;

			this.applyTemplate('', this.getTemplate(), {
				_insRows: 'insert-rows',
				_delRows: 'delete-rows',
				_insCols: 'insert-columns',
				_delCols: 'delete-columns',
			});

			this._init();
		}

		/*
		 * Show the context menu.
		 *
		 * @param e The mouse event.
		 * @param point The point indicates the position for the context menu.
		 */
		show(e: MouseEvent, point?: wijmo.Point) {
			var posX = (point ? point.x : e.clientX) + (e ? window.pageXOffset : 0), //Left Position of Mouse Pointer
				posY = (point ? point.y : e.clientY) + (e ? window.pageYOffset : 0); //Top Position of Mouse Pointer
			this.hostElement.style.position = 'absolute';
			this.hostElement.style.display = 'inline';
			if (posY + this.hostElement.clientHeight > window.innerHeight) {
				posY -= this.hostElement.clientHeight;
			}
			if (posX + this.hostElement.clientWidth > window.innerWidth) {
				posX -= this.hostElement.clientWidth;
			}
			this.hostElement.style.top = posY + 'px';
			this.hostElement.style.left = posX + 'px';
		}

		/*
		 * Hide the context menu.
		 */
		hide() {
			this.hostElement.style.display = 'none';
		}

		// Initialize the context menu.
		private _init() {
			var self = this;

            self.hostElement.style.zIndex = '9999';
			document.querySelector('body').appendChild(self.hostElement);

			self.addEventListener(self.hostElement, 'contextmenu', (e: MouseEvent) => {
				e.preventDefault();
			});

			self.addEventListener(self._insRows, 'click', (e: MouseEvent) => {
				self._owner.insertRows();
                self.hide();
                self._owner.hostElement.focus();
			});
			self.addEventListener(self._delRows, 'click', (e: MouseEvent) => {
				self._owner.deleteRows();
                self.hide();
                self._owner.hostElement.focus();
			});
			self.addEventListener(self._insCols, 'click', (e: MouseEvent) => {
				self._owner.insertColumns();
                self.hide();
                self._owner.hostElement.focus();
			});
			self.addEventListener(self._delCols, 'click', (e: MouseEvent) => {
				self._owner.deleteColumns();
                self.hide();
                self._owner.hostElement.focus();
			});
		}
	}
}