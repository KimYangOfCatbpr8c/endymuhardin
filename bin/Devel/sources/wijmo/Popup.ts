module wijmo {
    'use strict';

    /**
     * Shows an element as a popup.
     *
     * The popup element becomes a child of the body element,
     * and is positioned above or below a reference rectangle, 
     * depending on how much room is available.
     *
     * The reference rectangle may be specified as one of the following:
     *
     * <dl class="dl-horizontal">
     *   <dt>HTMLElement</dt>
     *   <dd>The bounding rectangle of the element.</dd>
     *   <dt>MouseEvent</dt>
     *   <dd>The bounding rectangle of the event's target element.</dd>
     *   <dt>Rect</dt>
     *   <dd>The given rectangle.</dd>
     *   <dt>null</dt>
     *   <dd>No reference rectangle; the popup is centered on the window.</dd>
     * </dl>
     *
     * Call the @see:hidePopup method to hide the popup.
     *
     * @param popup Element to show as a popup.
     * @param ref Reference element or rectangle used to position the popup.
     * @param above Position popup above the reference rectangle if possible.
     * @param fadeIn Use a fade-in animation to make the popup appear gradually.
     * @param copyStyles Copy font and color styles from reference element.
     */
    export function showPopup(popup: HTMLElement, ref: any = null, above = false, fadeIn = false, copyStyles = true) {

        // the popup parent will be the document body (to avoid clipping issues)
        var parent = document.body;

        // if the reference parameter is an element
        if (ref instanceof HTMLElement) {

            // 1 - make sure the reference is in the DOM
            if (!contains(document.body, ref)) {
                return;
            }

            // 2 - adjust the parent to account for ancestors with fixed position or scrollable content
            for (var e = <HTMLElement>ref.parentElement; e; e = e.parentElement) {
                if (getComputedStyle(e).position == 'fixed') {
                    parent = e;
                    break;
                }
            }
        } else {

            // 3 - no reference element, adjust the parent based on the current active element
            // (e.g.grid in dialog, jQuery panel)
            for (var e = getActiveElement(); e; e = e.parentElement) {
                if (!wijmo.hasClass(e, 'wj-popup') && // not our own popups: TFS 206009
                    getComputedStyle(e).position == 'fixed') {
                    parent = e;
                    break;
                }
            }
        }

        // make sure popup is the last child of the parent element (TFS 149728)
        // but don't call this unless we have to: it affects the focus
        if (parent.lastChild != popup) {
            parent.appendChild(popup);
        }

        // copy style elements from ref element to popup
        // (since the popup is no longer a child of the ref element)
        if (ref instanceof HTMLElement && copyStyles) {
            var sref = getComputedStyle(ref),
                bkg = new Color(sref.backgroundColor);
            if (bkg.a) { // don't copy anything if the background is transparent!!
                setCss(popup, {
                    color: sref.color,
                    backgroundColor: sref.backgroundColor,
                    fontFamily: sref.fontFamily,
                    fontSize: sref.fontSize,
                    fontWeight: sref.fontWeight,
                    fontStyle: sref.fontStyle
                });
            }
        }

        // get popup's size, including margins
        setCss(popup, {
            position: 'absolute',
            visibility: 'hidden',
            display: ''
        });

        // update layout for any Wijmo controls in the popup
        Control.refreshAll(popup);

        // ready to compute margins, size
        var sp = getComputedStyle(popup),
            my = parseFloat(sp.marginTop) + parseFloat(sp.marginBottom),
            mx = parseFloat(sp.marginLeft) + parseFloat(sp.marginRight),
            sz = new Size(popup.offsetWidth + mx, popup.offsetHeight + my);

        // ref can be a mouse event, a point, an element, or a rect
        var pos = new Point(),
            rc = null;
        if (ref && ref.clientX != null && ref.clientY != null && ref.pageX != null && ref.pageY != null) {
            if (ref.clientX <= 0 && ref.clientY <= 0 && ref.target) {
                // this looks like a fake mouse event (e.g. context menu key),
                // so use the event target as a reference TFS 117115
                rc = ref.target.getBoundingClientRect();
            } else {
                // use pageX/Y-offsetX/Y instead of clientX/Y, which gives wrong results in Chrome/Android
                // REVIEW: this seems to work OK, although in some other places we do the opposite... sigh...
                pos.x = Math.max(0, ref.pageX - pageXOffset);
                pos.y = Math.max(0, ref.pageY - pageYOffset);
                //pos.x = Math.max(0, ref.clientX);
                //pos.y = Math.max(0, ref.clientY);
            }
        } else if (ref instanceof Point) { 
            pos = ref;
        } else if (ref instanceof HTMLElement) { 
            rc = ref.getBoundingClientRect();
        } else if (ref && ref.top != null && ref.left != null) {
            rc = ref;
        } else if (ref == null) { // no reference: center a little above the window center
            pos.x = Math.max(0, (innerWidth - sz.width) / 2);
            pos.y = Math.max(0, Math.round((innerHeight - sz.height) / 2 * .7));
        } else {
            throw 'Invalid ref parameter.';
        }

        // calculate min width for the popup
        var minWidth = parseFloat(sp.minWidth);

        // if we have a rect, position popup above or below the rect
        if (rc) {
            var spcAbove = rc.top,
                spcBelow = innerHeight - rc.bottom,
                rtl = getComputedStyle(popup).direction == 'rtl';
            if (rtl) {
                pos.x = Math.max(0, rc.right - sz.width);
            } else { // TODO: honor this
                pos.x = Math.max(0, Math.min(rc.left, innerWidth - sz.width));
            }
            if (above) {
                pos.y = spcAbove > sz.height || spcAbove > spcBelow
                    ? Math.max(0, rc.top - sz.height)
                    : rc.bottom;
            } else {
                pos.y = spcBelow > sz.height || spcBelow > spcAbove
                    ? rc.bottom
                    : Math.max(0, rc.top - sz.height);
            }

            // make popup at least as wide as the element
            minWidth = Math.max(minWidth, rc.width);
        }

        // handle scroll offset (TFS 202906)
        var ptOffset = new Point(0, 0);
        if (ref != null) {
            if (parent == document.body) {
                ptOffset = new Point(-pageXOffset, -pageYOffset);
            } else if (parent) {
                var bcr = parent.getBoundingClientRect();
                ptOffset = new Point(bcr.left - parent.scrollLeft, bcr.top - parent.scrollTop);
            }
        }

        // calculate popup position
        var css: any = {
            position: ref == null ? 'fixed' : 'absolute',
            left: pos.x - ptOffset.x,
            top: pos.y - ptOffset.y,
            minWidth: minWidth,
            display: '',
            visibility: '',
            zIndex: 1500 // to work in Bootstrap dialogs (zIndex 1050)
        };

        // apply fade in effect
        if (fadeIn) {
            popup.style.opacity = '0';
            animate(function (pct) {
                popup.style.opacity = (pct == 1) ? '' : pct.toString();
            });
        }

        // show it
        setCss(popup, css);

        // hide the popup if the user scrolls an ancestor other than the body
        var anchor = ref instanceof MouseEvent ? ref.target : ref;
        if (anchor instanceof HTMLElement) {
            var ctl: Control; // listener to scroll events
            for (var se = anchor.parentElement; se && se != document.body; se = se.parentElement) {
                if (getComputedStyle(se).overflowY == 'auto' && se.scrollHeight > se.offsetHeight) {
                    if (!ctl) {
                        ctl = new Control(document.createElement('div'));
                    }
                    ctl.addEventListener(se, 'scroll', (e) => {
                        _hidePopup(popup, true);
                        ctl.dispose();
                    });
                }
            }
        }
    }
    /**
     * Hides a popup element previously displayed with the @see:showPopup
     * method.
     *
     * @param popup Popup element to hide.
     * @param remove Whether to remove the popup from the DOM or just
     * to hide it.
     * @param fadeOut Whether to use a fade-out animation to make the 
     * popup disappear gradually.
     */
    export function hidePopup(popup: HTMLElement, remove = true, fadeOut = false) {
        if (fadeOut) {
            animate(function (pct) {
                popup.style.opacity = (1 - pct).toString();
                if (pct == 1) {
                    _hidePopup(popup, remove);
                    popup.style.opacity = '';
                }
            });
        } else {
            _hidePopup(popup, remove);
        }
    }
    function _hidePopup(popup: HTMLElement, remove) {
        popup.style.display = 'none';
        if (remove && popup.parentElement) {
            popup.parentElement.removeChild(popup);
        }
    }
}
