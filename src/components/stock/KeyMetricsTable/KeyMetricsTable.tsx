import React from 'react';
import './KeyMetricsTable.css';

interface MetricData {
    date: string;
    marketCap: number;
    evToEBITDA: number;
    returnOnInvestedCapital: number;
    returnOnEquity: number;
    freeCashFlowYield: number;
    currentRatio: number;
    cashConversionCycle: number;
    daysOfSalesOutstanding: number;
    daysOfInventoryOutstanding: number;
    operatingCycle: number;
    netDebtToEBITDA: number;
    capexToRevenue: number;
    researchAndDevelopementToRevenue: number;
}

interface Props {
    metrics: MetricData[];
}

const KeyMetricsTable: React.FC<Props> = ({ metrics }) => {
    // הפיכת סדר הנתונים כדי שהשנה החדשה תהיה מימין (או משמאל, תלוי בהעדפה שלך)
    // אם הנתונים מגיעים מה-API מהחדש לישן, reverse() יציג אותם מהישן לחדש
    const sortedMetrics = [...metrics].reverse();

    const formatCurrency = (val: number) => (val / 1e12).toFixed(2) + 'T';
    const formatPercent = (val: number) => (val * 100).toFixed(2) + '%';
    
    // פונקציה שמחזירה רק את השנה
    const formatYearOnly = (dateString: string) => new Date(dateString).getFullYear().toString();

    const renderRow = (label: string, key: keyof MetricData, formatter: (v: any) => string = (v) => v.toFixed(2)) => (
        <tr>
            <td>{label}</td>
            {sortedMetrics.map(m => <td key={m.date}>{formatter(m[key])}</td>)}
        </tr>
    );

    return (
        <div className="metrics-table-container">
            <table className="metrics-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        {sortedMetrics.map(m => <th key={m.date}>{formatYearOnly(m.date)}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr className="section-header"><td colSpan={sortedMetrics.length + 1}>Valuation & Market</td></tr>
                    {renderRow('Market Cap', 'marketCap', formatCurrency)}
                    {renderRow('EV/EBITDA', 'evToEBITDA')}
                    {renderRow('FCF Yield', 'freeCashFlowYield', formatPercent)}

                    <tr className="section-header"><td colSpan={sortedMetrics.length + 1}>Profitability & Efficiency</td></tr>
                    {renderRow('ROIC', 'returnOnInvestedCapital', formatPercent)}
                    {renderRow('ROE', 'returnOnEquity', formatPercent)}
                    {renderRow('R&D / Revenue', 'researchAndDevelopementToRevenue', formatPercent)}
                    {renderRow('CapEx / Revenue', 'capexToRevenue', formatPercent)}

                    <tr className="section-header"><td colSpan={sortedMetrics.length + 1}>Operating Cycles (Days)</td></tr>
                    {renderRow('Days Sales Outstanding', 'daysOfSalesOutstanding')}
                    {renderRow('Days Inventory Outstanding', 'daysOfInventoryOutstanding')}
                    {renderRow('Operating Cycle', 'operatingCycle')}
                    {renderRow('Cash Conversion Cycle', 'cashConversionCycle')}

                    <tr className="section-header"><td colSpan={sortedMetrics.length + 1}>Financial Health</td></tr>
                    {renderRow('Current Ratio', 'currentRatio')}
                    {renderRow('Net Debt / EBITDA', 'netDebtToEBITDA')}
                </tbody>
            </table>
        </div>
    );
};

export default KeyMetricsTable;