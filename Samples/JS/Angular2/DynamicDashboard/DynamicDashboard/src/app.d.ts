/// <reference path="../typings/globals/core-js/index.d.ts" />
import { AfterViewInit } from '@angular/core';
import { DynamicCompService } from './services/DynamicCompService';
export declare class AppCmp implements AfterViewInit {
    tileTypes: string[];
    compContainer: any;
    private _compService;
    private dragSource;
    private dropTarget;
    constructor(_compService: DynamicCompService);
    ngAfterViewInit(): void;
    addTile(tileType: string): void;
    handleTile(e: any): void;
    dragstart(e: any): void;
    dragover(e: any): void;
    drop(e: any): void;
    dragend(e: any): void;
    getIndex(e: any): number;
}
export declare class AppModule {
}
