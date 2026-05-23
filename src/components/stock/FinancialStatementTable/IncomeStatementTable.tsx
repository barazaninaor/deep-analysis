import React from 'react';
import './FinancialStatments.css';

interface IncomeStatementTableProps {
    data: any[];
}

const IncomeStatementTable: React.FC<IncomeStatementTableProps> = ({ data }) => {
    if (!data || data.length === 0) return null;

    const sortedData = [...data].sort((a, b) => {
        const yearA = parseInt(a.fiscalYear || a.calendarYear || a.year || "0");
        const yearB = parseInt(b.fiscalYear || b.calendarYear || b.year || "0");
        return yearA - yearB;
    });

    const years = sortedData.map(d => d.fiscalYear || d.calendarYear || d.year || "N/A");

    const formatNumber = (num: any, isEPS: boolean = false) => {
        if (num === 0) return "0";
        if (!num || isNaN(num)) return "-";
        
        if (isEPS) {
            return num.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        }

        return (num / 1000000).toLocaleString(undefined, { 
            maximumFractionDigits: 0 
        });
    };

    const renderRow = (label: string, key: string, isBold: boolean = false, isTotal: boolean = false, isEPS: boolean = false) => (
        <tr className={`${isBold ? 'row-bold' : ''} ${isTotal ? 'row-total' : ''}`}>
            <td className="sticky-col">{label}</td>
            {sortedData.map((d, i) => (
                <td key={i}>{formatNumber(d[key], isEPS)}</td>
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
                    {renderRow("Revenue", "revenue")}
                    {renderRow("Cost of Goods Sold", "costOfRevenue")}
                    {renderRow("Gross Profit", "grossProfit", true, true)}
                    
                    {renderSectionHeader("Operating Expenses")}
                    {renderRow("Sales, General & Admin", "sellingGeneralAndAdministrativeExpenses")}
                    {renderRow("R&D Expenses", "researchAndDevelopmentExpenses")}
                    {renderRow("Other Operating Expense", "otherOperatingExpenses")}
                    {renderRow("Total Operating Expenses", "operatingExpenses")}
                    {renderRow("Operating Profit", "operatingIncome", true, true)}
                    
                    {renderSectionHeader("Other Income/Expense")}
                    {renderRow("Interest Income", "interestIncome")}
                    {renderRow("Interest Expense", "interestExpense")}
                    {renderRow("Other Non-Operating Income", "totalOtherIncomeExpensesNet")}
                    {renderRow("Pre-Tax Income", "incomeBeforeTax", true, true)}
                    
                    {renderRow("Income Tax", "incomeTaxExpense")}
                    {renderRow("Net Income", "netIncome", true, true)}
                    
                    {renderSectionHeader("Per Share Data")}
                    {renderRow("EPS (Basic)", "eps", true, false, true)}
                    {renderRow("EPS (Diluted)", "epsDiluted", true, false, true)}
                </tbody>
            </table>
        </div>
    );
};

export default IncomeStatementTable;