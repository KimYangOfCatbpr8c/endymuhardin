/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    protected dataSvc: DataSvc;
    itemsSource: {
        name: string;
        value: number;
    }[];
    header: string;
    footer: string;
    legendPosition: string;
    innerRadius: number;
    offset: number;
    startAngle: number;
    reversed: boolean;
    palette: string;
    palettes: string[];
    selectedPosition: string;
    selectedOffset: number;
    isAnimated: boolean;
    chartPalette: wjcChart.Palettes;
    constructor(dataSvc: DataSvc);
    paletteChanged: (sender: wjcInput.Menu) => void;
    innerRadiusChanged: (sender: wjcInput.InputNumber) => void;
    offsetChanged: (sender: wjcInput.InputNumber) => void;
    startAngleChanged: (sender: wjcInput.InputNumber) => void;
    selectedOffsetChanged: (sender: wjcInput.InputNumber) => void;
}
export declare class AppModule {
}
