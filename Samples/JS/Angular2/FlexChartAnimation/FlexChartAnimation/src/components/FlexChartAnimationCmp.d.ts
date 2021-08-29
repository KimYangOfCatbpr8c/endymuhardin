import * as wjcCore from 'wijmo/wijmo';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcChartAnimation from 'wijmo/wijmo.chart.animation';
import * as wjcInput from 'wijmo/wijmo.input';
import { DataSvc } from './../services/DataSvc';
export declare class FlexChartAnimationCmp {
    dataService: DataSvc;
    data: wjcCore.ObservableArray;
    flexChartPoints: number;
    title: string;
    duration: number;
    chartType: string;
    easing: string;
    animationMode: string;
    flexChart: wjcChart.FlexChart;
    animation: wjcChartAnimation.ChartAnimation;
    constructor(dataSvc: DataSvc);
    _setDataSource(): void;
    resetChartData(): void;
    itemAdd(args: any): void;
    itemRemove(args: any): void;
    func(oper: any, idx: any): void;
    addChartSeriesFirstPoint: () => void;
    addChartSeriesLastPoint: () => void;
    removeChartSeriesFirstPoint: () => void;
    removeChartSeriesLastPoint: () => void;
    valueChanged: (sender: wjcInput.InputNumber) => void;
    addChartSeries: () => void;
    removeChartSeries: () => void;
    animationModeChanged(): void;
}
export declare class FlexChartAnimationModule {
}
