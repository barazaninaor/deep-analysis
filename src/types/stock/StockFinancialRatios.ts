export interface FinancialRatios {
    date: string;
    symbol: string;
    bookValuePerShare: number;
    shareholdersEquityPerShare: number;
    netIncomePerShare: number; // EPS חלופי
    revenuePerShare: number;
    freeCashFlowPerShare: number;
    dividendYield: number;
    currentRatio: number;
    priceToBookRatio: number;
    debtToEquityRatio: number;
}