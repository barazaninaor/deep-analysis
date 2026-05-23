import { useNavigate } from "react-router-dom";
import "./Home.css";
import { SectionHeader } from "../../components/SectionHeader/SectionHeader";
import { FeatureGrid } from "../../components/FeatureGrid/FeatureGrid";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <SectionHeader
          title="Deep Analysis"
          description="The professional standard for fundamental stock research. We transform complex financial statements into actionable investment insights."
        />
        <div className="hero-cta">
          <button 
            className="primary-btn" 
            onClick={() => navigate('/analyze')}
          >
            Start Analyzing
          </button>
        </div>
      </header>

      {/* Main Content using FeatureGrid Component */}
      <main className="info-section">
        <FeatureGrid />

        {/* Closing Value Proposition */}
        {/* Closing Value Proposition */}
      <section className="about-section">
        <div className="about-content">
          <div className="quote-badge">Investment Wisdom</div>
          <h2>"Price is what you pay. Value is what you get."</h2>
          <p>
            Inspired by <strong>Warren Buffett’s</strong> fundamental principles, Deep Analysis 
            strips away market noise to reveal the true intrinsic value of a business. 
            We don't just track tickers; we evaluate moats, management, and margins. 
            Stop speculating on price charts and start investing in wonderful companies 
            at a significant margin of safety.
          </p>
        </div>
      </section>
      </main>

      
    </div>
  );
}

export default Home;