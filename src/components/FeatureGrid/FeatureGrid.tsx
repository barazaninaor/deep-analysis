import React from 'react';
import './FeatureGrid.css';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: "📊",
    title: "Fundamental Data",
    description: "Direct access to standardized Income Statements, Balance Sheets, and Cash Flow reports. Analyze the raw numbers that drive business value."
  },
  {
    icon: "🎯",
    title: "Valuation Engine",
    description: "Calculate the Sticker Price and Margin of Safety. Use historical PE ratios and BVPS growth to determine if a stock is undervalued."
  },
  {
    icon: "📈",
    title: "Growth Tracking",
    description: "Review 5-year and 10-year performance trends. Identify consistent compounders by monitoring long-term equity and earnings growth."
  }
];

export const FeatureGrid: React.FC = () => {
  return (
    <section className="feature-grid-container">
      <div className="feature-grid">
        {FEATURES.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-card-title">{feature.title}</h3>
            <p className="feature-card-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};