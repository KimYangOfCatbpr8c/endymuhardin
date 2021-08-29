import { Company } from './Company';
import { Portfolio } from './Portfolio';
/**
 * Represents a portfolio item.
 * Each item corresponds to a company and includes quote infotmation.
 */
export declare class PortfolioItem {
    _portfolio: Portfolio;
    _company: Company;
    _chart: boolean;
    _chartData: any[];
    _fullChartData: any[];
    _analysisData: any[];
    _maData: any[];
    constructor(portfolio: Portfolio, symbol: string, chart: boolean, withEvent?: boolean);
    readonly symbol: string;
    readonly name: string;
    readonly color: string;
    chart: boolean;
    readonly events: any;
    readonly chartData: any[];
    readonly fullChartData: any[];
    readonly analysisData: any[];
    getMAData(period: any): any[];
    updateChartData(): void;
}
