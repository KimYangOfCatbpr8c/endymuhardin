import * as wjcCore from 'wijmo/wijmo';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcChartAnimation from 'wijmo/wijmo.chart.animation';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './../services/DataSvc';
export declare class FlexPieAnimationCmp {
    dataService: DataSvc;
    data: wjcCore.ObservableArray;
    flexPiePoints: number;
    title: string;
    duration: number;
    innerRadius: number;
    easing: string;
    animationMode: string;
    insertPieIdx: number;
    flexPie: wjcChart.FlexPie;
    animation: wjcChartAnimation.ChartAnimation;
    constructor(dataSvc: DataSvc);
    _setDataSource(): void;
    resetChartData(): void;
    addSlice: () => void;
    removeSlice: () => void;
    animationModeChanged(): void;
    innerRadiusChanged: (sender: wjcInput.InputNumber) => void;
    durationChanged: (sender: wjcInput.InputNumber) => void;
}
export declare class FlexPieAnimationModule {
}
