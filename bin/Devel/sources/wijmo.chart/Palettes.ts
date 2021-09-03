module wijmo.chart
{
    'use strict';

    /**
     * These are predefined color palettes for chart @see:Series objects.
     *
     * To create custom color palettes, supply an array of strings or rgba values.
     *
     * You can specify palettes for @see:FlexChart and @see:FlexPie controls.
     * For example:
     *
     * <pre>chart.palette = Palettes.light;</pre>
     *
     * The following palettes are pre-defined:
     * <ul>
     *   <li>standard (default)</li>
     *   <li>cocoa</li>
     *   <li>coral</li>
     *   <li>dark</li>
     *   <li>highcontrast</li>
     *   <li>light</li>
     *   <li>midnight</li>
     *   <li>minimal</li>
     *   <li>modern</li>
     *   <li>organic</li>
     *   <li>slate</li>
     * </ul>
     */
    export class Palettes {
        static standard = ['#88bde6', '#fbb258', '#90cd97', '#f6aac9', '#bfa554', '#bc99c7', '#eddd46', '#f07e6e', '#8c8c8c'];
        static cocoa = ['#466bb0', '#c8b422', '#14886e', '#b54836', '#6e5944', '#8b3872', '#73b22b', '#b87320', '#141414'];
        static coral = ['#84d0e0', '#f48256', '#95c78c', '#efa5d6', '#ba8452', '#ab95c2', '#ede9d0', '#e96b7d', '#888888'];
        static dark = ['#005fad', '#f06400', '#009330', '#e400b1', '#b65800', '#6a279c', '#d5a211', '#dc0127', '#000000'];
        static highcontrast = ['#ff82b0', '#0dda2c', '#0021ab', '#bcf28c', '#19c23b', '#890d3a', '#607efd', '#1b7700', '#000000'];
        static light = ['#ddca9a', '#778deb', '#cb9fbb', '#b5eae2', '#7270be', '#a6c7a7', '#9e95c7', '#95b0c7', '#9b9b9b'];
        static midnight = ['#83aaca', '#e37849', '#14a46a', '#e097da', '#a26d54', '#a584b7', '#d89c54', '#e86996', '#2c343b'];
        static modern = ['#2d9fc7', '#ec993c', '#89c235', '#e377a4', '#a68931', '#a672a6', '#d0c041', '#e35855', '#68706a'];
        static organic = ['#9c88d9', '#a3d767', '#8ec3c0', '#e9c3a9', '#91ab36', '#d4ccc0', '#61bbd8', '#e2d76f', '#80715a'];
        static slate = ['#7493cd', '#f99820', '#71b486', '#e4a491', '#cb883b', '#ae83a4', '#bacc5c', '#e5746a', '#505d65'];
        static zen = ['#7bb5ae', '#e2d287', '#92b8da', '#eac4cb', '#7b8bbd', '#c7d189', '#b9a0c8', '#dfb397', '#a9a9a9'];
        static cyborg = ['#2a9fd6', '#77b300', '#9933cc', '#ff8800', '#cc0000', '#00cca3', '#3d6dcc', '#525252', '#000000'];
        static superhero = ['#5cb85c', '#f0ad4e', '#5bc0de', '#d9534f', '#9f5bde', '#46db8c', '#b6b86e', '#4e5d6c', '#2b3e4b'];
        static flatly = ['#18bc9c', '#3498db', '#f39c12', '#6cc1be', '#99a549', '#8f54b5', '#e74c3c', '#8a9899', '#2c3e50'];
        static darkly = ['#375a7f', '#00bc8c', '#3498db', '#f39c12', '#e74c3c', '#8f61b3', '#b08725', '#4a4949', '#000000'];
        static cerulan = ['#033e76', '#87c048', '#59822c', '#53b3eb', '#fc6506', '#d42323', '#e3bb00', '#cccccc', '#222222'];
    } 
}

