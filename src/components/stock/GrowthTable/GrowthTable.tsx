import React, { useEffect, useMemo } from 'react';
import './AnalysisTables.css';
import GrowthChart from '../../BarChart/BarChart';

interface GrowthTableProps {
    incomeData: any[];
    balanceData: any[];
    cashflowData: any[];
    metrics: any[];
    ratios: any[];
    onGrowthCalculated?: (value: number) => void; // ה-Prop החדש לעדכון האבא
}

const GrowthTable: React.FC<GrowthTableProps> = ({
    incomeData = [],
    balanceData = [],
    cashflowData = [],
    metrics = [],
    ratios = [],
    onGrowthCalculated
}) => {

    if (!incomeData || incomeData.length === 0) {
        return <div className="placeholder-view">Waiting for financial data...</div>;
    }

    const calculateGrowth = (current: number, previous: number) => {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / Math.abs(previous)) * 100;
    };

    const calculateCAGR = (values: number[], periods: number) => {
        if (values.length < periods + 1) return null;
        const current = values[values.length - 1];
        const past = values[values.length - 1 - periods];
        if (current <= 0 || past <= 0) return null;
        return (Math.pow(current / past, 1 / periods) - 1) * 100;
    };

    const formatValue = (label: string, v: number | null, isGrowthRow: boolean) => {
        if (v === undefined || v === null || isNaN(v)) return "-";
        if (isGrowthRow) return `${v.toFixed(1)}%`;
        if (label === "ROIC") return `${v.toFixed(2)}%`;
        if (label === "Cash to Debt Ratio") return v.toFixed(2);
        
        if (["Revenue", "Free Cash Flow", "Long-Term Debt", "Long-Term-Debt"].includes(label)) {
            return (v / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 });
        }
        return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const dataDisplay = useMemo(() => [...incomeData].reverse(), [incomeData]);
    const years = dataDisplay.map(d => d.date?.split('-')[0] || "N/A");

    // Extracting Values
    const epsValues = dataDisplay.map(d => d.eps || 0);
    const revenueValues = dataDisplay.map(d => d.revenue || 0);
    const roicValues = dataDisplay.map(item => {
        const found = metrics.find(m => m.date === item.date);
        return found ? found.returnOnInvestedCapital * 100 : 0;
    });
    const bvpsValues = dataDisplay.map(item => {
        const foundRatio = ratios.find(r => r.date === item.date);
        return foundRatio?.bookValuePerShare || 0;
    });
    const fcfValues = dataDisplay.map(item => {
        const foundCash = cashflowData.find(c => c.date === item.date);
        return foundCash ? foundCash.freeCashFlow : 0;
    });
    const debtValues = dataDisplay.map(item => {
        const foundBalance = balanceData.find(b => b.date === item.date);
        return foundBalance ? foundBalance.longTermDebt : 0;
    });

    // --- שליחת נתון הצמיחה לאבא ---
    useEffect(() => {
        if (onGrowthCalculated) {
            // מחשבים CAGR ל-5 שנים (שזה 4 תקופות בחישוב CAGR)
            const growth5Y = calculateCAGR(bvpsValues, 4);
            if (growth5Y !== null) {
                onGrowthCalculated(growth5Y);
            }
        }
    }, [bvpsValues, onGrowthCalculated]);

    const yearsToPayDebt = debtValues.map((debt, i) => {
        const fcf = fcfValues[i];
        if (!debt || debt === 0) return fcf > 0 ? 10 : 0; 
        return fcf / debt;
    });

    const prepareChartData = (values: number[]) => 
        years.map((year, index) => ({ year, value: values[index] }));

    const renderMainRow = (label: string, values: number[], growthValues: (number | null)[], isGrowthRow = false) => {
        const averages = isGrowthRow ? [
            calculateCAGR(values, 9), 
            calculateCAGR(values, 4), 
            calculateCAGR(values, 2)
        ] : [null, null, null];

        const isRoic = label === "ROIC";

        return (
            <tr className={isRoic ? 'roic-row' : (isGrowthRow ? 'analysis-growth-row' : 'analysis-row-bold')}>
                <td className="analysis-sticky-col">{label}</td>
                {growthValues.map((v, i) => (
                    <td key={i} className={isGrowthRow && i !== 0 ? (v! >= 10 ? 'analysis-pos' : 'analysis-neg') : ''}>
                        {(isGrowthRow && i === 0) ? "" : formatValue(label, v, isGrowthRow)}
                    </td>
                ))}
                {averages.map((avg, i) => (
                    <td key={`avg-${i}`} className={avg !== null ? (avg >= 10 ? 'analysis-pos' : 'analysis-neg') : ''}>
                        {avg !== null ? `${avg.toFixed(1)}%` : ""}
                    </td>
                ))}
            </tr>
        );
    };

    return (
        <div className="analysis-table-container">
            <div className="tables-side-by-side">
                <div className="table-wrapper">
                    <h3 className="table-section-title">Growth & Performance</h3>
                    <table className="analysis-table">
                        <thead>
                            <tr>
                                <th className="analysis-sticky-col">Metric (Millions)</th>
                                {years.map((y, idx) => <th key={idx}>{y}</th>)}
                                <th className="avg-header">10Y</th>
                                <th className="avg-header">5Y</th>
                                <th className="avg-header">3Y</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderMainRow("ROIC", roicValues, roicValues, false)}
                            <tr className="table-spacer"><td colSpan={years.length + 4}></td></tr>
                            {renderMainRow("Book Value Per Share", bvpsValues, bvpsValues, false)}
                            {renderMainRow("Growth", bvpsValues, bvpsValues.map((v, i) => i === 0 ? 0 : calculateGrowth(v, bvpsValues[i-1])), true)}
                            {renderMainRow("Earnings Per Share", epsValues, epsValues, false)}
                            {renderMainRow("Growth", epsValues, epsValues.map((v, i) => i === 0 ? 0 : calculateGrowth(v, epsValues[i-1])), true)}
                            {renderMainRow("Revenue", revenueValues, revenueValues, false)}
                            {renderMainRow("Growth", revenueValues, revenueValues.map((v, i) => i === 0 ? 0 : calculateGrowth(v, revenueValues[i-1])), true)}
                            {renderMainRow("Free Cash Flow", fcfValues, fcfValues, false)}
                            {renderMainRow("Growth", fcfValues, fcfValues.map((v, i) => i === 0 ? 0 : calculateGrowth(v, fcfValues[i-1])), true)}
                        </tbody>
                    </table>
                </div>

                <div className="table-wrapper">
                    <h3 className="table-section-title">Debt & Liquidity</h3>
                    <table className="analysis-table">
                        <thead>
                            <tr>
                                <th className="analysis-sticky-col">Metric (Millions)</th>
                                {years.map((y, idx) => <th key={idx}>{y}</th>)}
                                <th className="avg-header"></th><th className="avg-header"></th><th className="avg-header"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="analysis-row-bold">
                                <td className="analysis-sticky-col">Long-Term Debt</td>
                                {debtValues.map((v, i) => <td key={i}>{formatValue("Long-Term Debt", v, false)}</td>)}
                                <td></td><td></td><td></td>
                            </tr>
                            <tr className="analysis-row-bold">
                                <td className="analysis-sticky-col">Cash to Debt Ratio</td>
                                {yearsToPayDebt.map((v, i) => (
                                    <td key={i} className={v >= 0.33 ? 'analysis-pos' : 'analysis-neg'}>
                                        {formatValue("Cash to Debt Ratio", v, false)}
                                    </td>
                                ))}
                                <td></td><td></td><td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <h3 className="table-section-title" style={{ marginTop: '50px' }}>Visual Trend Analysis</h3>
            <div className="charts-grid">
                <GrowthChart title="Return on Invested Capital" data={prepareChartData(roicValues)} dataKey="value" />
                <GrowthChart title="Book Value Per Share" data={prepareChartData(bvpsValues)} dataKey="value" />
                <GrowthChart title="Earnings Per Share" data={prepareChartData(epsValues)} dataKey="value" />
                <GrowthChart title="Revenue" data={prepareChartData(revenueValues.map(v => v / 1000000))} dataKey="value" />
                <GrowthChart title="Free Cash Flow" data={prepareChartData(fcfValues.map(v => v / 1000000))} dataKey="value" />
                <GrowthChart title="Long-Term Debt" data={prepareChartData(debtValues.map(v => v / 1000000))} dataKey="value" />
            </div>
        </div>
    );
};

export default GrowthTable;