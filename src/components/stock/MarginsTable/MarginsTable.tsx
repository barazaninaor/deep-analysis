import React from 'react';
import '../GrowthTable/AnalysisTables.css';
import GrowthChart from '../../BarChart/BarChart';

interface MarginsProps {
    incomeData: any[];
}

const Margins: React.FC<MarginsProps> = ({ incomeData = [] }) => {

    if (!incomeData || incomeData.length === 0) {
        return <div className="placeholder-view">Waiting for financial data...</div>;
    }

    const calculateChange = (current: number, previous: number) => {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / Math.abs(previous)) * 100;
    };

    const calculateSimpleAvg = (values: number[], periods: number) => {
        if (values.length < periods) return null;
        const slice = values.slice(-periods);
        const sum = slice.reduce((a, b) => a + b, 0);
        return sum / periods;
    };

    const calculateCAGR = (values: number[], periods: number) => {
        if (values.length < periods + 1) return null;
        const current = values[values.length - 1];
        const past = values[values.length - 1 - periods];
        if (current <= 0 || past <= 0) return null;
        return (Math.pow(current / past, 1 / periods) - 1) * 100;
    };

    const formatValue = (label: string, v: number | null, isPercentageRow: boolean) => {
        if (v === undefined || v === null || isNaN(v)) return "-";
        if (isPercentageRow || label.includes("Margin") || label === "Growth Rate") {
            return `${v.toFixed(1)}%`;
        }
        return (v / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 });
    };

    const dataDisplay = [...incomeData].reverse();
    const years = dataDisplay.map(d => d.date?.split('-')[0] || "N/A");

    // אלו הערכים שנציג בגרפים (המספרים עצמם)
    const revenueValues = dataDisplay.map(d => d.revenue || 0);
    const grossProfitValues = dataDisplay.map(d => d.grossProfit || 0);
    const operatingIncomeValues = dataDisplay.map(d => d.operatingIncome || 0);
    const netIncomeValues = dataDisplay.map(d => d.netIncome || 0);

    const grossMarginValues = revenueValues.map((rev, i) => rev ? (grossProfitValues[i] / rev) * 100 : 0);
    const operatingMarginValues = revenueValues.map((rev, i) => rev ? (operatingIncomeValues[i] / rev) * 100 : 0);
    const profitMarginValues = revenueValues.map((rev, i) => rev ? (netIncomeValues[i] / rev) * 100 : 0);

    // הכנת נתונים לגרף שמציג ערכים כספיים (חלוקה במיליון לתצוגה נוחה)
    const prepareChartData = (values: number[]) => 
        years.map((year, index) => ({ 
            year, 
            value: values[index] / 1000000 
        }));

    const renderRow = (label: string, values: number[], isMargin = false) => {
        const growthValues = values.map((v, i) => i === 0 ? 0 : calculateChange(v, values[i-1]));
        
        const summaryAverages = isMargin 
            ? [
                calculateSimpleAvg(values, 10),
                calculateSimpleAvg(values, 5),
                calculateSimpleAvg(values, 3)
              ]
            : [
                calculateCAGR(values, 9),
                calculateCAGR(values, 4),
                calculateCAGR(values, 2)
              ];

        const isRevenue = label === "Revenue";
        const mainRowClass = isRevenue ? "revenue-row-top" : "analysis-row-bold";
        const growthRowClass = isRevenue ? "revenue-row-bottom" : "analysis-growth-row";

        return (
            <React.Fragment key={label}>
                <tr className={mainRowClass}>
                    <td className="analysis-sticky-col">{label}</td>
                    {values.map((v, i) => (
                        <td key={i}>{formatValue(label, v, isMargin)}</td>
                    ))}
                    {summaryAverages.map((avg, i) => (
                        <td key={`avg-${i}`} className={avg !== null ? (avg >= 10 ? 'analysis-pos' : 'analysis-neg') : ''}>
                            {avg !== null ? `${avg.toFixed(1)}%` : ""}
                        </td>
                    ))}
                </tr>
                <tr className={growthRowClass}>
                    <td className="analysis-sticky-col">Growth Rate</td>
                    {growthValues.map((v, i) => (
                        <td key={i} className={i === 0 ? "" : (v >= 0 ? 'analysis-pos' : 'analysis-neg')}>
                            {i === 0 ? "" : `${v.toFixed(1)}%`}
                        </td>
                    ))}
                    <td></td><td></td><td></td>
                </tr>
            </React.Fragment>
        );
    };

    return (
        <div className="analysis-table-container">
            <div className="table-wrapper">
                <h3 className="table-section-title">Margins & Profitability</h3>
                <table className="analysis-table">
                    <thead>
                        <tr>
                            <th className="analysis-sticky-col">Metric</th>
                            {years.map((y, idx) => <th key={idx}>{y}</th>)}
                            <th className="avg-header">10 Years</th>
                            <th className="avg-header">5 Years</th>
                            <th className="avg-header">3 Years</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderRow("Revenue", revenueValues)}
                        <tr className="table-spacer"><td colSpan={years.length + 4}></td></tr>
                        {renderRow("Gross Profit", grossProfitValues)}
                        {renderRow("Operating Profit", operatingIncomeValues)}
                        {renderRow("Net Income", netIncomeValues)}
                        <tr className="table-spacer"><td colSpan={years.length + 4}></td></tr>
                        {renderRow("Gross Margin", grossMarginValues, true)}
                        {renderRow("Operating Margin", operatingMarginValues, true)}
                        {renderRow("Profit Margin", profitMarginValues, true)}
                    </tbody>
                </table>
            </div>

            <h3 className="table-section-title" style={{ marginTop: '50px' }}>Visual Trend Analysis</h3>
            <div className="charts-grid">
                {/* <GrowthChart title="Revenue" data={prepareChartData(revenueValues)} dataKey="value" /> */}
                <GrowthChart title="Gross Profit" data={prepareChartData(grossProfitValues)} dataKey="value" />
                <GrowthChart title="Operating Profit" data={prepareChartData(operatingIncomeValues)} dataKey="value" />
                <GrowthChart title="Net Income" data={prepareChartData(netIncomeValues)} dataKey="value" />
            </div>
        </div>
    );
};

export default Margins;