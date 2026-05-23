import React from 'react';
import './FinancialStatments.css';

interface BalanceSheetTableProps {
    data: any[];
}

const BalanceSheetTable: React.FC<BalanceSheetTableProps> = ({ data }) => {
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
        return (num / 1000000).toLocaleString(undefined, { 
            maximumFractionDigits: 0 
        });
    };

    const renderRow = (label: string, key: string, isBold: boolean = false, isTotal: boolean = false) => (
        <tr className={`${isBold ? 'row-bold' : ''} ${isTotal ? 'row-total' : ''}`}>
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
                    {renderSectionHeader("Assets")}
                    {renderRow("Cash & Equivalents", "cashAndCashEquivalents")}
                    {renderRow("Short-Term Investments", "shortTermInvestments")}
                    {renderRow("Accounts Receivable", "netReceivables")}
                    {renderRow("Inventory", "inventory")}
                    {renderRow("Other Current Assets", "otherCurrentAssets")}
                    {renderRow("Total Current Assets", "totalCurrentAssets", true, true)}
                    
                    {renderRow("Investments", "longTermInvestments")}
                    {renderRow("Property, Plant & Equipment", "propertyPlantEquipmentNet")}
                    {renderRow("Goodwill", "goodwill")}
                    {renderRow("Intangible Assets", "intangibleAssets")}
                    {renderRow("Other Assets", "otherNonCurrentAssets")}
                    {renderRow("Total Assets", "totalAssets", true, true)}

                    {renderSectionHeader("Liabilities & Equity")}
                    {renderRow("Accounts Payable", "accountPayables")}
                    {renderRow("Tax Payable", "taxPayables")}
                    {renderRow("Short-Term Debt", "shortTermDebt")}
                    {renderRow("Deferred Revenue", "deferredRevenue")}
                    {renderRow("Other Current Liabilities", "otherCurrentLiabilities")}
                    {renderRow("Total Current Liabilities", "totalCurrentLiabilities", true, true)}

                    {renderRow("Long-Term Debt", "longTermDebt")}
                    {renderRow("Other Liabilities", "otherNonCurrentLiabilities")}
                    {renderRow("Total Liabilities", "totalLiabilities", true, true)}

                    {renderRow("Retained Earnings", "retainedEarnings")}
                    {renderRow("Common Stock", "commonStock")}
                    {renderRow("Treasury Stock", "commonStock")} 
                    {renderRow("Shareholders' Equity", "totalStockholdersEquity", true, true)}
                    {renderRow("Liabilities & Equity", "totalLiabilitiesAndTotalEquity", true, true)}
                </tbody>
            </table>
        </div>
    );
};

export default BalanceSheetTable;