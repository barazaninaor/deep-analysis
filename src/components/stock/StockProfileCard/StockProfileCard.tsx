import React from 'react';
import { type StockProfile } from '../../../types/stock';
import './StockProfileCard.css';

interface Props {
    profile: StockProfile;
}

const StockProfileCard: React.FC<Props> = ({ profile }) => {
    // פונקציה לפרמוט מספרים גדולים (M, B, T)
    const formatLargeNumber = (num: number) => {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'; // Trillion
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';  // Billion
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';  // Million
        return num.toLocaleString();
    };

    const isPositive = profile.change >= 0;

    return (
        <div className="stock-profile-card">
            <div className="profile-header">
                <div className="company-info">
                    <div className="logo-container">
                        <img src={profile.image} alt={`${profile.companyName} logo`} />
                    </div>
                    <div className="name-box">
                        <h2 className="company-name">{profile.companyName}</h2>
                        <span className="ticker-label">
                            {profile.symbol} • {profile.exchange} • {profile.currency}
                        </span>
                    </div>
                </div>

                <div className="price-box">
                    <span className="current-price">${profile.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className={`price-change ${isPositive ? 'up' : 'down'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(profile.change).toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className="profile-stats-grid">
                <div className="stat-item">
                    <span className="stat-label">Sector</span>
                    <span className="stat-value">{profile.sector}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Industry</span>
                    <span className="stat-value">{profile.industry}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Market Cap</span>
                    <span className="stat-value">
                        {/* שימוש בפונקציה החדשה */}
                        ${formatLargeNumber(profile.marketCap)}
                    </span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">CEO</span>
                    <span className="stat-value">{profile.ceo}</span>
                </div>
            </div>

            <div className="company-description">
                <h3>About {profile.companyName}</h3>
                <p>{profile.description}</p>
            </div>
        </div>
    );
};

export default StockProfileCard;