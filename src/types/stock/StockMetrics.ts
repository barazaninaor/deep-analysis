export interface StockMetrics {
    symbol: string;
    date: string;
    period: string;
    revenuePerShare: number;
    netIncomePerShare: number;
    operatingCashFlowPerShare: number;
    freeCashFlowPerShare: number;
    cashPerShare: number;
    bookValuePerShare: number;         
    tangibleBookValuePerShare: number;
    marketCap: number;
    enterpriseValue: number;
    peRatio: number;
    priceToSalesRatio: number;
    pocfratio: number;                 // Price to Operating Cash Flow
    pfcfRatio: number;                 // Price to Free Cash Flow
    pbRatio: number;
    ptbvRatio: number;
    evToSales: number;
    enterpriseValueOverEBITDA: number;
    evToOperatingCashFlow: number;
    earningsYield: number;
    freeCashFlowYield: number;
    debtToEquity: number;
    debtToAssets: number;
    netDebtToEBITDA: number;
    currentRatio: number;
    interestCoverage: number;
    incomeQuality: number;
    dividendYield: number;
    payoutRatio: number;
    salesGeneralAndAdministrativeToRevenue: number;
    researchAndDeverlopmentToRevenue: number;
    intangiblesToTotalAssets: number;
    capexToOperatingCashFlow: number;
    capexToRevenue: number;
    stockBasedCompensationToRevenue: number;
    roe: number;                       // Return on Equity
    roic: number;                      // Return on Invested Capital
}