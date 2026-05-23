import React, { useMemo } from 'react';
import './StickerPrice.css';

interface StickerPriceProps {
    currentEPS: number;
    historicalPE: number;
    bvpsValues: number[];
    defaultGrowthRate: number; 
    marketPrice: number;       
}

const StickerPrice: React.FC<StickerPriceProps> = ({ 
    currentEPS, 
    historicalPE, 
    bvpsValues, 
    defaultGrowthRate,
    marketPrice
}) => {
    
    const calculateCAGR = (values: number[], periods: number) => {
        if (!values || values.length < periods + 1) {
            return defaultGrowthRate / 100;
        }
        const current = values[values.length - 1];
        const past = values[values.length - 1 - periods];
        if (current <= 0 || past <= 0) return defaultGrowthRate / 100;
        return Math.pow(current / past, 1 / periods) - 1;
    };

    const results = useMemo(() => {
        // 1. חישוב קצב צמיחה
        const growthRate = calculateCAGR(bvpsValues, Math.min(bvpsValues.length - 1, 5));
        const growthRatePct = growthRate * 100;
        
        // 2. תיקון: חישוב מכפיל עתידי כצמיחה כפול 2 בלבד
        // הסרתי את ה-Math.min עם ה-historicalPE כדי שלא יגביל אותך ל-15
        const estPE = growthRatePct * 2;
        
        // 3. חישוב EPS עתידי (10 שנים)
        const futureEPS = currentEPS * Math.pow(1 + growthRate, 10);
        
        // 4. מחיר מניה עתידי
        const futurePrice = futureEPS * estPE;
        
        // 5. STICKER PRICE (היוון ב-15%)
        const discountRate = 0.15;
        const stickerPrice = futurePrice / Math.pow(1 + discountRate, 10);
        
        // 6. Margin of Safety
        const mos = stickerPrice * 0.5;

        const isUndervalued = marketPrice < stickerPrice;
        const valuationDiff = stickerPrice > 0 ? ((marketPrice - stickerPrice) / stickerPrice) * 100 : 0;

        return {
            growthRate: growthRatePct.toFixed(1),
            estPE: estPE.toFixed(2),
            mosValue: mos,
            isUndervalued,
            valuationDiff: valuationDiff.toFixed(1),
            stickerPriceStr: stickerPrice > 0 ? stickerPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00",
            mosStr: mos > 0 ? mos.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"
        };
    }, [currentEPS, historicalPE, bvpsValues, defaultGrowthRate, marketPrice]);

    const isUnderMOS = marketPrice > 0 && marketPrice <= results.mosValue;

    return (
        <div className="sticker-wrapper">
            <div className="sticker-card">
                <div className="sticker-header">
                    <h4>Sticker Price </h4>
                </div>
                
                <table className="sticker-table">
                    <tbody>
                        <tr>
                            <td className="sticker-label">Current EPS</td>
                            <td className="sticker-value">${currentEPS.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className="sticker-label">Growth Rate (BVPS)</td>
                            <td className="sticker-value-blue">{results.growthRate}%</td>
                        </tr>
                        <tr>
                            <td className="sticker-label">Estimated PE (Growth × 2)</td>
                            <td className="sticker-value">{results.estPE}</td>
                        </tr>
                        <tr>
                            <td className="sticker-label">Minimum Yearly Return</td>
                            <td className="sticker-value">15%</td>
                        </tr>
                        <tr className="sticker-divider"><td colSpan={2}></td></tr>
                        <tr className="sticker-row-bold">
                            <td className="sticker-label">STICKER PRICE</td>
                            <td className="sticker-value sticker-price-text">${results.stickerPriceStr}</td>
                        </tr>
                        <tr className="sticker-mos-row">
                            <td className="sticker-mos-label">Margin of Safety</td>
                            <td className="sticker-mos-value">${results.mosStr}</td>
                        </tr>
                        <tr>
                            <td className="sticker-label">Current Market Price</td>
                            <td className="sticker-value">
                                ${marketPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                        <tr>
                            <td className="sticker-label">Valuation Status</td>
                            <td className={`sticker-value font-bold ${results.isUndervalued ? 'analysis-pos' : 'analysis-neg'}`}>
                                {results.isUndervalued ? 'UNDERVALUED' : 'OVERVALUED'} 
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                {isUnderMOS && (
                    <div className="buy-signal-badge">
                        🔥 Strong Buy!
                    </div>
                )}
            </div>
        </div>
    );
};

export default StickerPrice;