module wijmo.grid.sheet {
	'use strict';

	/*
	 * Defines the _FlexSheetCellFactory class.
	 *
	 * This class extends the CellFactory of FlexGrid control.
	 * It updates the content of the row/column header for the FlexSheet control.
	 */
	export class _FlexSheetCellFactory extends CellFactory {

		/*
		 * Overrides the updateCell function of the CellFactory class.  
		 *
		 * @param panel Part of the grid that owns this cell.
		 * @param r Index of this cell's row.
		 * @param c Index of this cell's column.
		 * @param cell Element that represents the cell.
		 * @param rng @see:CellRange that contains the cell's merged range, or null if the cell is not merged.
		 */
		public updateCell(panel: wijmo.grid.GridPanel, r: number, c: number, cell: HTMLElement, rng?: wijmo.grid.CellRange) {
            var g = panel.grid,
                r2 = r,
                c2 = c,
                content: string,
                cellIndex: number,
                flex: FlexSheet,
                fc: Node,
                val: any,
                data: any,
                isFormula: boolean,
                styleInfo: ICellStyle,
                checkBox: HTMLInputElement,
                input: HTMLInputElement,
                bcol: Column,
                format: string;

			// We shall reset the styles of current cell before updating current cell.
			if (panel.cellType === wijmo.grid.CellType.Cell) {
				this._resetCellStyle(panel.columns[c], cell);
			}

			super.updateCell(panel, r, c, cell, rng);

			// adjust for merged ranges
			if (rng && !rng.isSingleCell) {
				r = rng.row;
                c = rng.col;
                r2 = rng.row2;
                c2 = rng.col2;
            }

            bcol = g._getBindingColumn(panel, r, panel.columns[c]);

			switch (panel.cellType) {
				case wijmo.grid.CellType.RowHeader:
					cell.textContent = (r + 1) + '';
					break;
				case wijmo.grid.CellType.ColumnHeader:
					content = FlexSheet.convertNumberToAlpha(c);
                    cell.innerHTML = cell.innerHTML.replace(wijmo.escapeHtml(cell.textContent), '') + content;
					cell.style.textAlign = 'center';
					break;
                case wijmo.grid.CellType.Cell:
                    flex = <FlexSheet>panel.grid;
                    cellIndex = r * flex.columns.length + c;
                    styleInfo = flex.selectedSheet && flex.selectedSheet._styledCells ? flex.selectedSheet._styledCells[cellIndex] : null;

					//process the header row with binding
					if (panel.rows[r] instanceof HeaderRow) {
						cell.innerHTML = wijmo.escapeHtml(panel.columns[c].header);
						addClass(cell, 'wj-header-row');
                    } else {
                        val = flex.getCellValue(r, c, false);
                        data = flex.getCellData(r, c, false);
                        isFormula = data != null && typeof data === 'string' && (<string>data)[0] === '=';
                        if (flex.editRange && flex.editRange.contains(r, c)) {
                            if (isNumber(val) && !bcol.dataMap && !isFormula) {
                                format = (styleInfo ? styleInfo.format : '') || bcol.format || 'n';
                                val = this._getFormattedValue(val, format);
                                input = <HTMLInputElement>cell.querySelector('input');
                                if (input) {
                                    input.value = val;
                                }
                            }
                        } else {
                            if (panel.columns[c].dataType === DataType.Boolean) {
                                checkBox = <HTMLInputElement>cell.querySelector('[type="checkbox"]');
                                if (checkBox) {
                                    checkBox.checked = flex.getCellValue(r, c);
                                }
                            } else if (bcol.dataMap) {
                                val = flex.getCellValue(r, c, true);
                                fc = cell.firstChild;
                                if (fc && fc.nodeType === 3 && fc.nodeValue !== val) {
                                    fc.nodeValue = val
                                }
                            } else {
                                if (isNumber(val) && !isFormula) {
                                    format = (styleInfo ? styleInfo.format : '') || bcol.format;
                                    if (!format) {
                                        val = this._getFormattedValue(val, 'n');
                                    } else {
                                        val = flex.getCellValue(r, c, true);
                                    }
                                } else {
                                    val = flex.getCellValue(r, c, true);
                                }
                                cell.innerHTML = val;
                            }
						}

						if (styleInfo) {
							var st = cell.style,
								styleInfoVal;
							for (var styleProp in styleInfo) {
								if (styleProp === 'className') {
									if (styleInfo.className) {
										addClass(cell, styleInfo.className + '-style');
									}
								} else if (styleProp !== 'format' && (styleInfoVal = styleInfo[styleProp])) {
									if ((hasClass(cell, 'wj-state-selected') || hasClass(cell, 'wj-state-multi-selected'))
                                        && (styleProp === 'color' || styleProp === 'backgroundColor')) {
										st[styleProp] = '';
									} else {
										st[styleProp] = styleInfoVal;
									}
								}
							}
						}
                    }

                    // customize the cell
                    if (g.itemFormatter) {
                        g.itemFormatter(panel, r, c, cell);
                    }
                    if (g.formatItem.hasHandlers) {
                        var rng = CellFactory._fmtRng;
                        if (!rng) { // avoid allocating a new CellRange each time (this may get called a lot!)
                            rng = CellFactory._fmtRng = new CellRange(r, c, r2, c2);
                        } else {
                            rng.setRange(r, c, r2, c2);
                        }
                        var e = new FormatItemEventArgs(panel, rng, cell);
                        g.onFormatItem(e);
                    }

                    if (!!cell.style.backgroundColor || !!cell.style.color) {
                        if (!styleInfo) {
                            flex.selectedSheet._styledCells[cellIndex] = styleInfo = {};
                        }
                        if (!!cell.style.backgroundColor) {
                            styleInfo.backgroundColor = cell.style.backgroundColor;
                        }
                        if (!!cell.style.color) {
                            styleInfo.color = cell.style.color;
                        }
                    }

					break;
            }

            if (r === (<FlexSheet>g)._lastVisibleFrozenRow && !hasClass(cell, 'wj-frozen-row')) {
                addClass(cell, 'wj-frozen-row');
            }

            if (c === (<FlexSheet>g)._lastVisibleFrozenColumn && !hasClass(cell, 'wj-frozen-col')) {
                addClass(cell, 'wj-frozen-col');
            }
		}

		// Reset the styles of the cell.
		private _resetCellStyle(column: Column, cell: HTMLElement) {
			['fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'textDecoration', 'textAlign', 'verticalAlign', 'backgroundColor', 'color'].forEach((val) => {
				if (val === 'textAlign') {
					cell.style.textAlign = column.getAlignment();
				} else {
					cell.style[val] = '';
				}
			});
        }

        // Get the formatted value.
        private _getFormattedValue(value: number, format: string): string {
            var val: string;

            if (value !== Math.round(value)) {
                format = format.replace(/([a-z])(\d*)(.*)/ig, '$0112$3');
            }
            val = Globalize.formatNumber(value, format, true);

            return val;
        }
	}
}