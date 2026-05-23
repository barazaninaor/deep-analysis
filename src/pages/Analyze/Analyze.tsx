import React, { useState } from 'react';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { useAuth } from '../../context/AuthContext';

// ייבוא רשימת המניות מה-JSON המקומי
import stock_list from '../../data/stock-list.json';

// ==============================================================
// 1. ייבוא דאטה מקומי (Mock)
// ==============================================================
import aaplData from '../../data/mocks/aapl_data.json'; 

import { 
    StockProfileCard, 
    KeyMetricsTable, 
    IncomeStatementTable, 
    BalanceSheetTable, 
    CashFlowTable,
    GrowthTable,
    MarginsTable,
    StickerPrice 
} from '../../components/stock';
import Spinner from '../../components/Spinner/Spinner';
import AnalyzeNavbar from '../../components/AnalyzeNavbar/AnalyzeNavbar';
import './Analyze.css';
import { type StockProfile } from '../../types/stock';

interface SearchItem {
    symbol: string;
    companyName: string;
}

const API_KEY = import.meta.env.VITE_FMP_API_KEY;
const STABLE_URL = "https://financialmodelingprep.com/stable";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Analyze: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const [query, setQuery] = useState("");
    const [profile, setProfile] = useState<StockProfile | null>(null);
    const [metrics, setMetrics] = useState<any[]>([]);
    const [incomeData, setIncomeData] = useState<any[]>([]);
    const [balanceData, setBalanceData] = useState<any[]>([]);
    const [cashflowData, setCashflowData] = useState<any[]>([]);
    const [ratios, setRatios] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // שימוש ברשימה המיובאת ישירות
    const [searchIndex] = useState<SearchItem[]>(stock_list as any[]);
    const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
    
    const [activeTab, setActiveTab] = useState("Profile");
    const [financialTab, setFinancialTab] = useState("Income Statement");
    const [analysisTab, setAnalysisTab] = useState("Growth"); 
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [bvpsGrowth5Y, setBvpsGrowth5Y] = useState<number>(15);

    const getLatestEPS = () => (incomeData.length > 0 ? incomeData[0].eps || 0 : 0);

    const getAvgHistoricalPE = () => {
        if (ratios.length === 0) return 15;
        const validRatios = ratios.filter(r => r.priceEarningsRatio);
        if (validRatios.length === 0) return 15;
        return validRatios.reduce((acc, curr) => acc + curr.priceEarningsRatio, 0) / validRatios.length;
    };

    const getBVPSValues = () => {
        if (metrics.length === 0) return [];
        return [...metrics].reverse().map(m => m.bookValuePerShare || 0);
    };

    const handleGrowthCalculated = (value: number) => {
        if (value && value !== bvpsGrowth5Y) setBvpsGrowth5Y(value);
    };

    // ==============================================================
    // לוגיקת החיפוש - סינון לפי Symbol בלבד מתוך stock_list
    // ==============================================================
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedIndex(-1);

        if (value.length > 0) {
            const lowerVal = value.toLowerCase();
            const filtered = searchIndex.filter(item => 
                item.symbol.toLowerCase().startsWith(lowerVal)
            ).slice(0, 10);
            
            setSuggestions(filtered);
        } else { 
            setSuggestions([]); 
        }
    };

    const handleSearch = async (symbol: string) => {
        if (!symbol) return;
        
        setLoading(true);
        setSuggestions([]); 
        const ticker = symbol.toUpperCase();
        setQuery(ticker);

        if (ticker === "AAPL") {
            console.log("Using Mock Data for AAPL");
            setTimeout(() => {
                setProfile(aaplData.profile as any);
                setMetrics(aaplData.metrics);
                setIncomeData(aaplData.incomeData);
                setBalanceData(aaplData.balanceData);
                setCashflowData(aaplData.cashflowData);
                setRatios(aaplData.ratios);
                setLoading(false);
                setActiveTab("Profile");
            }, 300);
            return;
        }

        try {
            const endpoints = [
                { name: "Profile", setter: setProfile, url: `${STABLE_URL}/profile?symbol=${ticker}&apikey=${API_KEY}`, isSingle: true },
                { name: "Metrics", setter: setMetrics, url: `${STABLE_URL}/key-metrics?symbol=${ticker}&apikey=${API_KEY}` },
                { name: "Income", setter: setIncomeData, url: `${STABLE_URL}/income-statement?symbol=${ticker}&limit=5&apikey=${API_KEY}` },
                { name: "Balance", setter: setBalanceData, url: `${STABLE_URL}/balance-sheet-statement?symbol=${ticker}&limit=5&apikey=${API_KEY}` },
                { name: "CashFlow", setter: setCashflowData, url: `${STABLE_URL}/cash-flow-statement?symbol=${ticker}&limit=5&apikey=${API_KEY}` },
                { name: "Ratios", setter: setRatios, url: `${STABLE_URL}/ratios?symbol=${ticker}&limit=5&apikey=${API_KEY}` }
            ];

            for (let i = 0; i < endpoints.length; i++) {
                const ep = endpoints[i];
                console.log(`Fetching ${ep.name}: ${ep.url}`);

                try {
                    const res = await fetch(ep.url);
                    if (res.ok) {
                        const data = await res.json();
                        ep.setter(ep.isSingle ? data[0] : data);
                    } else {
                        console.error(`Error fetching ${ep.name}. Status: ${res.status}`);
                    }
                } catch (err) {
                    console.error(`Network error for ${ep.name}:`, err);
                }

                if (i < endpoints.length - 1) await delay(300);
            }
            setActiveTab("Profile");
        } catch (error) {
            console.error("General Fetch error:", error);
        } finally { 
            setLoading(false); 
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (suggestions.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const targetSymbol = selectedIndex >= 0 ? suggestions[selectedIndex].symbol : query;
            handleSearch(targetSymbol);
        }
    };

    if (!isLoggedIn) return (
        <div className="auth-page">
            <SectionHeader title="Private Area" description="Please login to access tools." />
            <button className="auth-btn" onClick={() => window.location.href='/login'}>Go to Login</button>
        </div>
    );

    return (
        <div className="analyze-page">
            <SectionHeader title="Analyze a Stock" description="Uncover long-term value" />
            <div className="search-container">
                <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}>
                    <input 
                        type="text" 
                        value={query} 
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown} 
                        placeholder="Search by Ticker (e.g. MSFT)..."
                        autoComplete="off"
                    />
                    <button type="submit" className="analyze-btn" disabled={loading}>
                        {loading ? "..." : "Analyze"}
                    </button>
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((item, i) => (
                                <li 
                                    key={i} 
                                    className={i === selectedIndex ? 'selected' : ''} 
                                    onClick={() => handleSearch(item.symbol)}
                                >
                                    <strong>{item.symbol}</strong> | {item.companyName}
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
            </div>

            {loading ? (
                <div className="analyze-loading-container">
                    <Spinner message={`Analyzing ${query}...`} />
                </div>
            ) : profile && (
                <div className="analyze-main-layout">
                    <AnalyzeNavbar 
                        activeTab={activeTab} setActiveTab={setActiveTab} 
                        financialTab={financialTab} setFinancialTab={setFinancialTab}
                        analysisTab={analysisTab} setAnalysisTab={setAnalysisTab}
                        hasProfile={!!profile}
                    />
                    <main className="analyze-content">
                        {activeTab === "Profile" && <StockProfileCard profile={profile} />}
                        {activeTab === "Key Metrics" && <KeyMetricsTable metrics={metrics} />}
                        {activeTab === "Financials" && (
                             financialTab === "Income Statement" ? <IncomeStatementTable data={incomeData} /> :
                             financialTab === "Balance Sheet" ? <BalanceSheetTable data={balanceData} /> :
                             <CashFlowTable data={cashflowData} />
                        )}
                        
                        {activeTab === "Analysis" && (
                            analysisTab === "Growth" ? (
                                <GrowthTable 
                                    key={`${query}-growth`} 
                                    incomeData={incomeData} 
                                    balanceData={balanceData} 
                                    cashflowData={cashflowData} 
                                    metrics={metrics}
                                    ratios={ratios} 
                                    onGrowthCalculated={handleGrowthCalculated}
                                />
                            ) : analysisTab === "Margins" ? (
                                <MarginsTable 
                                    key={`${query}-margins`} 
                                    incomeData={incomeData} 
                                />
                            ) : analysisTab === "Sticker Price" ? (
                                <StickerPrice 
                                    key={`${query}-sticker`}
                                    currentEPS={getLatestEPS()}
                                    historicalPE={getAvgHistoricalPE()}
                                    bvpsValues={getBVPSValues()} 
                                    defaultGrowthRate={bvpsGrowth5Y}
                                    marketPrice={profile.price || 0}
                                />
                            ) : (
                                <div className="placeholder-view">Coming Soon: {analysisTab}</div>
                            )
                        )}
                    </main>
                </div>
            )}
        </div>
    );
};

export default Analyze;