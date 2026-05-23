import './AnalyzeNavbar.css';

interface AnalyzeNavbarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    financialTab: string;
    setFinancialTab: (tab: string) => void;
    analysisTab: string;
    setAnalysisTab: (tab: string) => void;
    hasProfile: boolean;
}

const AnalyzeNavbar: React.FC<AnalyzeNavbarProps> = ({ 
    activeTab, 
    setActiveTab, 
    financialTab, 
    setFinancialTab,
    analysisTab,
    setAnalysisTab,
    hasProfile 
}) => {
    if (!hasProfile) return null;

    return (
        <div className="analyze-nav-container">
            <aside className="analyze-sidebar">
                <nav>
                    <button 
                        className={activeTab === "Profile" ? "active" : ""} 
                        onClick={() => setActiveTab("Profile")}
                    >
                        Profile
                    </button>
                    <button 
                        className={activeTab === "Key Metrics" ? "active" : ""} 
                        onClick={() => setActiveTab("Key Metrics")}
                    >
                        Key Metrics
                    </button>

                    {/* Financials Section */}
                    <button 
                        className={activeTab === "Financials" ? "active" : ""} 
                        onClick={() => setActiveTab("Financials")}
                    >
                        Financials
                    </button>
                    {activeTab === "Financials" && (
                        <div className="financials-sub-nav">
                            <button 
                                className={financialTab === "Income Statement" ? "active" : ""} 
                                onClick={() => setFinancialTab("Income Statement")}
                            >
                                Income Statement
                            </button>
                            <button 
                                className={financialTab === "Balance Sheet" ? "active" : ""} 
                                onClick={() => setFinancialTab("Balance Sheet")}
                            >
                                Balance Sheet
                            </button>
                            <button 
                                className={financialTab === "Cash Flow" ? "active" : ""} 
                                onClick={() => setFinancialTab("Cash Flow")}
                            >
                                Cash Flow
                            </button>
                        </div>
                    )}

                    {/* Analysis Section */}
                    <button 
                        className={activeTab === "Analysis" ? "active" : ""} 
                        onClick={() => setActiveTab("Analysis")}
                    >
                        Analysis
                    </button>
                    {activeTab === "Analysis" && (
                        <div className="financials-sub-nav">
                            <button 
                                className={analysisTab === "Growth" ? "active" : ""} 
                                onClick={() => setAnalysisTab("Growth")}
                            >
                                Growth
                            </button>
                            <button 
                                className={analysisTab === "Margins" ? "active" : ""} 
                                onClick={() => setAnalysisTab("Margins")}
                            >
                                Margins
                            </button>
                            <button 
                                className={analysisTab === "Sticker Price" ? "active" : ""} 
                                onClick={() => setAnalysisTab("Sticker Price")}
                            >
                                Sticker Price
                            </button>
                        </div>
                    )}
                </nav>
            </aside>
        </div>
    );
};

export default AnalyzeNavbar;