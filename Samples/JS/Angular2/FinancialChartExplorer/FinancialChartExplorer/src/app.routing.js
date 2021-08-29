"use strict";
var router_1 = require('@angular/router');
// Application route tree. "data.caption" defines captions for navigation links in markup.
exports.routeTree = [
    {
        section: "Chart Types",
        routes: [
            { path: '', redirectTo: 'charttype/heikinAshi', pathMatch: 'full' },
            {
                path: 'charttype/heikinAshi', data: { caption: 'Heikin-Ashi' },
                loadChildren: 'src/components/charttype/HeikinAshiCmp#HeikinAshiModule'
            },
            {
                path: 'charttype/lineBreak', data: { caption: 'Line Break' },
                loadChildren: 'src/components/charttype/LineBreakCmp#LineBreakModule'
            },
            {
                path: 'charttype/renko', data: { caption: 'Renko' },
                loadChildren: 'src/components/charttype/RenkoCmp#RenkoModule'
            },
            {
                path: 'charttype/kagi', data: { caption: 'Kagi' },
                loadChildren: 'src/components/charttype/KagiCmp#KagiModule'
            },
            {
                path: 'charttype/columnVolume', data: { caption: 'ColumnVolume' },
                loadChildren: 'src/components/charttype/ColumnVolumeCmp#ColumnVolumeModule'
            },
            {
                path: 'charttype/equiVolume', data: { caption: 'EquiVolume' },
                loadChildren: 'src/components/charttype/EquiVolumeCmp#EquiVolumeModule'
            },
            {
                path: 'charttype/candleVolume', data: { caption: 'CandleVolume' },
                loadChildren: 'src/components/charttype/CandleVolumeCmp#CandleVolumeModule'
            },
            {
                path: 'charttype/armsCandleVolume', data: { caption: 'Arms CandleVolume' },
                loadChildren: 'src/components/charttype/ArmsCandleVolumeCmp#ArmsCandleVolumeModule'
            },
        ]
    },
    {
        section: "Interaction",
        routes: [
            {
                path: 'interaction/markers', data: { caption: 'Markers' },
                loadChildren: 'src/components/interaction/MarkersCmp#MarkersModule'
            },
            {
                path: 'interaction/rangeSelector', data: { caption: 'Range Selector' },
                loadChildren: 'src/components/interaction/RangeSelectorCmp#RangeSelectorModule'
            },
        ]
    },
    {
        section: "Analytics",
        routes: [
            {
                path: 'analytics/movingAverages', data: { caption: 'Trend Lines' },
                loadChildren: 'src/components/analytics/TrendLinesCmp#TrendLinesModule'
            },
            {
                path: 'analytics/trendLines', data: { caption: 'Moving Averages' },
                loadChildren: 'src/components/analytics/MovingAveragesCmp#MovingAveragesModule'
            },
            {
                path: 'analytics/overlays', data: { caption: 'Overlays' },
                loadChildren: 'src/components/analytics/OverlaysCmp#OverlaysModule'
            },
            {
                path: 'analytics/indicators', data: { caption: 'Indicators' },
                loadChildren: 'src/components/analytics/IndicatorsCmp#IndicatorsModule'
            },
            {
                path: 'analytics/eventAnnotations', data: { caption: 'Event Annotations' },
                loadChildren: 'src/components/analytics/EventAnnotationsCmp#EventAnnotationsModule'
            },
            {
                path: 'analytics/fibonacciTool', data: { caption: 'Fibonacci Tool' },
                loadChildren: 'src/components/analytics/FibonacciToolCmp#FibonacciToolModule'
            },
        ]
    },
];
// Flattens RouteTree to an array of Route(s).
function getRoutes(routeTree) {
    return routeTree.reduce(function (prev, cur, idx) {
        return prev.concat(cur.routes);
    }, []);
}
exports.routing = router_1.RouterModule.forRoot(getRoutes(exports.routeTree), { useHash: true });
//# sourceMappingURL=app.routing.js.map