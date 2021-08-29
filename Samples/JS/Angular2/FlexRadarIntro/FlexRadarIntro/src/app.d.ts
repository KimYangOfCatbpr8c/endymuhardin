/// <reference path="../typings/globals/core-js/index.d.ts" />
import * as wjcChartRadar from 'wijmo/wijmo.chart.radar';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './services/DataSvc';
export declare class AppCmp {
    basicData: any[];
    basicChartType: string;
    basicTotalAngle: number;
    basicStartAngle: number;
    basicStacking: string;
    basicReversed: boolean;
    basicPolarData: any[];
    polarChartType: string;
    polarTotalAngle: number;
    polarStartAngle: number;
    polarStacking: string;
    polarReversed: boolean;
    animationData: any[];
    duration: number;
    easing: string;
    animationMode: string;
    animationChartType: string;
    animationBindingX: string;
    protected dataSvc: DataSvc;
    animationChart: wjcChartRadar.FlexRadar;
    constructor(dataSvc: DataSvc);
    basicStartAngleChanged: (sender: wjcInput.InputNumber) => void;
    basicTotalAngleChanged: (sender: wjcInput.InputNumber) => void;
    polarStartAngleChanged: (sender: wjcInput.InputNumber) => void;
    polarTotalAngleChanged: (sender: wjcInput.InputNumber) => void;
    durationChanged: (sender: wjcInput.InputNumber) => void;
    animationChanged: () => void;
    isPolarChanged: (sender: any) => void;
}
export declare class AppModule {
}
