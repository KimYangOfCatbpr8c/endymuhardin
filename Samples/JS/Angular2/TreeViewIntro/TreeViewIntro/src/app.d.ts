/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcNav from 'wijmo/wijmo.nav';
import { AfterViewInit } from '@angular/core';
export declare class AppCmp implements AfterViewInit {
    items: any[];
    editableItems: any[];
    accordionItems: any[];
    lazyItems: any[];
    lazyLoadODataItems: any[];
    dragItems1: any[];
    dragItems2: any[];
    isAnimated: boolean;
    autoCollapse: boolean;
    expandOnClick: boolean;
    useCustomCss: boolean;
    navItem: string;
    accordioItem: string;
    chkStatus: string;
    allowDraggingParentNodes: boolean;
    allowDroppingIntoEmpty: boolean;
    allowDragging: boolean;
    lazyLoadFunction: Function;
    lazyLoadODataFunction: Function;
    tvAccordion: wjcNav.TreeView;
    private _saveCheckedItems;
    private _nwindService;
    constructor();
    ngAfterViewInit(): void;
    navTo(treeView: wjcNav.TreeView): void;
    dragStart(sender: wjcNav.TreeView, e: wjcNav.TreeNodeEventArgs): void;
    dragOver(sender: wjcNav.TreeView, e: wjcNav.TreeNodeDragDropEventArgs): void;
    dragOverBetweenTrees(tvDragDrop1: wjcNav.TreeView, tvDragDrop2: wjcNav.TreeView, e: wjcNav.TreeNodeDragDropEventArgs): void;
    nodeEditStarting(sender: wjcNav.TreeView, e: wjcNav.TreeNodeEventArgs): void;
    checkedItems(treeView: wjcNav.TreeView): void;
    saveCheckedItems(treeView: wjcNav.TreeView): void;
    restoreCheckedItems(treeView: wjcNav.TreeView): void;
    disableNode(treeView: wjcNav.TreeView): void;
    enableAllNodes(treeView: wjcNav.TreeView): void;
    formatItem(treeView: wjcNav.TreeView, e: wjcNav.FormatNodeEventArgs): void;
    private _lazyLoadFunction(node, callback);
    private _lazyLoadODataFunction(node, callback);
    private _getItems();
    private _getAccordionItems();
    private _getLazyItems();
}
export declare class AppModule {
}
