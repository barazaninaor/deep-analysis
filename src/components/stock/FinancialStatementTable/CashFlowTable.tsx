import React from 'react';
import './FinancialStatments.css';

interface CashFlowTableProps {
    data: any[];
}

const CashFlowTable: React.FC<CashFlowTableProps> = ({ data }) => {
    if (!data || data.length === 0) return null;

    const sortedData = [...data].sort((a, b) => {
        const yearA = parseInt(a.fiscalYear || a.calendarYear || a.year || "0");
        const yearB = parseInt(b.fiscalYear || b.calendarYear || b.year || "0");
        return yearA - yearB;
    });

    const years = sortedData.map(d => d.fiscalYear || d.calendarYear || d.year || "N/A");

    const formatNumber = (num: any) => {
        if (num === 0) return "0";
        if (!num || isNaN(num)) return "-";
        // חילוק במיליון לעיגול מספרים גדולים כפי שמופיע בדוח
        return (num / 1000000).toLocaleString(undefined, { 
            maximumFractionDigits: 0 
        });
    };

    const renderRow = (label: string, key: string, isBold: boolean = false, isTotal: boolean = false, hasMargin: boolean = false) => (
        <tr className={`
            ${isBold ? 'row-bold' : ''} 
            ${isTotal ? 'row-total' : ''} 
            ${hasMargin ? 'row-margin-bottom' : ''}
        `}>
            <td className="sticky-col">{label}</td>
            {sortedData.map((d, i) => (
                <td key={i}>{formatNumber(d[key])}</td>
            ))}
        </tr>
    );

    const renderSectionHeader = (label: string) => (
        <tr className="section-header">
            <td className="sticky-col" colSpan={years.length + 1}>{label}</td>
        </tr>
    );

    return (
        <div className="financial-table-container">
            <table className="financial-table">
                <thead>
                    <tr>
                        <th className="sticky-col">Metric (Millions)</th>
                        {years.map((year, index) => <th key={index}>{year}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {/* Operating Activities */}
                    {renderRow("Net Income", "netIncome")}
                    {renderRow("Depreciation & Amortization", "depreciationAndAmortization")}
                    {renderRow("Stock-Based Compensation", "stockBasedCompensation")}
                    {renderRow("Change in Working Capital", "changeInWorkingCapital")}
                    {renderRow("Other Non-Cash Items", "otherNonCashItems")}
                    {renderRow("Total Cash From Operations", "netCashProvidedByOperatingActivities", true, true, true)}

                    {/* Investing Activities */}
                    {renderSectionHeader("Investing Activities")}
                    {renderRow("Capital Expenditure", "capitalExpenditure")}
                    {renderRow("Investments", "purchasesOfInvestments")}
                    {renderRow("Other Investing Activities", "otherInvestingActivities")}
                    {renderRow("Total Cash From Investing", "netCashProvidedByInvestingActivities", true, true, true)}

                    {/* Financing Activities */}
                    {renderSectionHeader("Financing Activities")}
                    {renderRow("Issuance and Repurchase of Common Stocks", "netCommonStockIssuance")}
                    {renderRow("Net Issuance of Debt", "netDebtIssuance")}
                    {renderRow("Dividends Paid", "netDividendsPaid")}
                    {renderRow("Other Financing Activities", "otherFinancingActivities")}
                    {renderRow("Total Cash From Financing", "netCashProvidedByFinancingActivities", true, true, true)}

                    {/* Supplemental */}
                    {renderSectionHeader("Supplemental")}
                    {renderRow("Net Change in Cash", "netChangeInCash", true)}
                    {renderRow("Free Cash Flow", "freeCashFlow", true, true)}
                </tbody>
            </table>
        </div>
    );
};

export default CashFlowTable;