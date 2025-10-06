'use client';

import Link from 'next/link';
import GlobalNavigation from '../components/GlobalNavigation';

export default function EnginePage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #0a0e1a;
          color: #e6f1ff;
          overflow-x: hidden;
          font-size: 18px;
        }

        .bg-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(rgba(100, 255, 218, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 255, 218, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .engine-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 120px 60px 80px 60px;
          position: relative;
          z-index: 1;
        }

        .engine-header {
          text-align: center;
          margin-bottom: 100px;
        }

        .engine-badge {
          display: inline-block;
          padding: 16px 32px;
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.15) 0%, rgba(167, 139, 250, 0.15) 100%);
          border: 2px solid rgba(100, 255, 218, 0.4);
          border-radius: 30px;
          color: #64ffda;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 15px 50px rgba(100, 255, 218, 0.2);
        }

        .engine-title {
          font-size: 96px;
          font-weight: 900;
          background: linear-gradient(135deg, #fff 0%, #64ffda 30%, #a78bfa 70%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
          letter-spacing: 4px;
          text-align: center;
          text-shadow: 0 0 100px rgba(100, 255, 218, 0.4);
        }

        .engine-subtitle {
          font-size: 24px;
          color: rgba(230, 241, 255, 0.9);
          max-width: 1000px;
          margin: 0 auto;
          line-height: 1.7;
          text-align: center;
          font-weight: 400;
        }

        .flow-visualization {
          display: grid;
          grid-template-columns: 1fr 200px 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 120px;
        }

        .flow-side {
          text-align: center;
        }

        .flow-icon {
          width: 160px;
          height: 160px;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 40px auto;
          font-size: 72px;
          box-shadow: 0 20px 60px rgba(100, 255, 218, 0.3);
        }

        .nonprofit-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
        }

        .forprofit-icon {
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
        }

        .flow-title {
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 25px;
          letter-spacing: 1.5px;
        }

        .nonprofit-title {
          color: #06b6d4;
          text-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
        }

        .forprofit-title {
          color: #10b981;
          text-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
        }

        .flow-description {
          color: rgba(230, 241, 255, 0.8);
          font-size: 18px;
          line-height: 1.7;
          margin-bottom: 30px;
        }

        .flow-link {
          display: inline-block;
          color: #64ffda;
          font-weight: 600;
          text-decoration: none;
          font-size: 16px;
          padding: 12px 24px;
          border: 1px solid rgba(100, 255, 218, 0.3);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .flow-link:hover {
          background: rgba(100, 255, 218, 0.1);
          border-color: rgba(100, 255, 218, 0.5);
          transform: translateY(-2px);
        }

        .flow-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .flow-arrow {
          font-size: 64px;
          margin-bottom: 20px;
          filter: drop-shadow(0 0 20px rgba(100, 255, 218, 0.5));
        }

        .perpetual-badge {
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(244, 63, 94, 0.2) 100%);
          border: 2px solid rgba(167, 139, 250, 0.4);
          border-radius: 25px;
          padding: 12px 20px;
          color: #a78bfa;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          backdrop-filter: blur(20px);
        }

        .principles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
          gap: 40px;
          margin-bottom: 120px;
        }

        .principle-card {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.8) 0%, rgba(26, 31, 58, 0.6) 100%);
          border: 2px solid rgba(100, 255, 218, 0.2);
          border-radius: 32px;
          padding: 50px;
          transition: all 0.5s ease;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .principle-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #64ffda 0%, #a78bfa 50%, #f59e0b 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s;
        }

        .principle-card:hover::before {
          transform: scaleX(1);
        }

        .principle-card:hover {
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.08) 0%, rgba(167, 139, 250, 0.08) 100%);
          border-color: #64ffda;
          transform: translateY(-10px);
          box-shadow: 0 25px 70px rgba(100, 255, 218, 0.2);
        }

        .principle-icon {
          font-size: 48px;
          margin-bottom: 25px;
          display: block;
        }

        .principle-title {
          font-size: 28px;
          font-weight: 900;
          color: #64ffda;
          margin-bottom: 20px;
          letter-spacing: 1px;
        }

        .principle-text {
          color: rgba(230, 241, 255, 0.85);
          margin-bottom: 25px;
          line-height: 1.8;
          font-size: 18px;
        }

        .principle-example {
          color: rgba(230, 241, 255, 0.7);
          font-size: 16px;
          line-height: 1.6;
          padding: 20px;
          background: rgba(100, 255, 218, 0.05);
          border-radius: 15px;
          border-left: 4px solid #64ffda;
        }

        .principle-example strong {
          color: #64ffda;
          font-weight: 700;
        }

        .kenya-showcase {
          background: linear-gradient(135deg, rgba(220, 38, 127, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%);
          border: 3px solid rgba(220, 38, 127, 0.3);
          border-radius: 40px;
          padding: 80px;
          text-align: center;
          margin-bottom: 80px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(30px);
        }

        .kenya-showcase::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #dc2626 0%, #dc2777 50%, #ef4444 100%);
        }

        .kenya-title {
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #dc2777 0%, #ef4444 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 25px;
          letter-spacing: 2px;
        }

        .kenya-description {
          font-size: 20px;
          color: rgba(230, 241, 255, 0.9);
          max-width: 800px;
          margin: 0 auto 40px auto;
          line-height: 1.7;
        }

        .kenya-cta {
          display: inline-block;
          background: linear-gradient(135deg, #dc2626 0%, #dc2777 100%);
          color: white;
          font-weight: 900;
          padding: 20px 40px;
          border-radius: 25px;
          text-decoration: none;
          font-size: 18px;
          letter-spacing: 1px;
          transition: all 0.4s ease;
          box-shadow: 0 15px 40px rgba(220, 38, 127, 0.3);
        }

        .kenya-cta:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 25px 60px rgba(220, 38, 127, 0.4);
        }

        .cta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
          gap: 40px;
        }

        .cta-card {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.8) 0%, rgba(26, 31, 58, 0.6) 100%);
          border: 2px solid rgba(100, 255, 218, 0.2);
          border-radius: 32px;
          padding: 50px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
          text-decoration: none;
          display: block;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s;
        }

        .cta-card.purple::before {
          background: linear-gradient(90deg, #a78bfa 0%, #ec4899 100%);
        }

        .cta-card.emerald::before {
          background: linear-gradient(90deg, #10b981 0%, #14b8a6 100%);
        }

        .cta-card:hover::before {
          transform: scaleX(1);
        }

        .cta-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(100, 255, 218, 0.2);
        }

        .cta-card.purple:hover {
          border-color: #a78bfa;
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%);
        }

        .cta-card.emerald:hover {
          border-color: #10b981;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%);
        }

        .cta-title {
          font-size: 24px;
          font-weight: 900;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }

        .cta-card.purple .cta-title {
          color: #a78bfa;
        }

        .cta-card.emerald .cta-title {
          color: #10b981;
        }

        .cta-description {
          color: rgba(230, 241, 255, 0.8);
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .cta-arrow {
          font-weight: 700;
          font-size: 16px;
        }

        .cta-card.purple .cta-arrow {
          color: #a78bfa;
        }

        .cta-card.emerald .cta-arrow {
          color: #10b981;
        }

        @media (max-width: 768px) {
          .engine-container {
            padding: 90px 20px 60px 20px;
          }

          .engine-title {
            font-size: 64px;
          }

          .flow-visualization {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .flow-icon {
            width: 120px;
            height: 120px;
            font-size: 56px;
          }

          .flow-title {
            font-size: 24px;
          }

          .flow-arrow {
            font-size: 48px;
            transform: rotate(90deg);
          }

          .principles-grid {
            grid-template-columns: 1fr;
          }

          .principle-card {
            padding: 40px 30px;
          }

          .kenya-showcase {
            padding: 60px 30px;
          }

          .kenya-title {
            font-size: 36px;
          }

          .cta-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .engine-container {
            padding: 80px 15px 40px 15px;
          }

          .engine-title {
            font-size: 48px;
          }

          .flow-icon {
            width: 100px;
            height: 100px;
            font-size: 44px;
          }

          .flow-title {
            font-size: 20px;
          }

          .principle-card {
            padding: 30px 20px;
          }

          .kenya-showcase {
            padding: 40px 20px;
          }

          .kenya-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="bg-grid"></div>
      <GlobalNavigation />

      <div className="engine-container">
        <div className="engine-header">
          <div className="engine-badge">THE PERPETUAL ENGINE</div>
          <h1 className="engine-title">HOW IT WORKS</h1>
          <p className="engine-subtitle">
            The first-of-its-kind dual-arm ecosystem where capital funds mission forever.
            A 501(c)(3) nonprofit + for-profit holding company in perfect harmony.
          </p>
        </div>

        <div className="flow-visualization">
          <div className="flow-side">
            <div className="flow-icon nonprofit-icon">
              <span>🏛️</span>
            </div>
            <h2 className="flow-title nonprofit-title">501(c)(3) NONPROFIT</h2>
            <p className="flow-description">
              Creates relationships, credibility, and track record through programs in youth development, medical missions, and workforce training.
            </p>
            <Link href="/programs" className="flow-link">
              View Programs →
            </Link>
          </div>

          <div className="flow-center">
            <div className="flow-arrow">↕️</div>
            <div className="perpetual-badge">10% PERPETUAL FLOW</div>
          </div>

          <div className="flow-side">
            <div className="flow-icon forprofit-icon">
              <span>🏢</span>
            </div>
            <h2 className="flow-title forprofit-title">FOR-PROFIT HOLDINGS</h2>
            <p className="flow-description">
              AI Incubator, $50M Impact Fund, education ventures, and strategic business units generating market-rate returns.
            </p>
            <Link href="/holdings" className="flow-link">
              View Holdings →
            </Link>
          </div>
        </div>

        <div className="principles-grid">
          <div className="principle-card">
            <span className="principle-icon">🔄</span>
            <h3 className="principle-title">The Perpetual Flow</h3>
            <p className="principle-text">
              10% of all profits from the for-profit side automatically flow back to the nonprofit foundation.
              This creates a perpetual funding mechanism that grows stronger over time.
            </p>
            <div className="principle-example">
              <strong>Example:</strong> $1M profit → $100K flows to nonprofit → More programs → Better relationships → More opportunities → Higher profits
            </div>
          </div>

          <div className="principle-card">
            <span className="principle-icon">🚀</span>
            <h3 className="principle-title">De-Risked Investment</h3>
            <p className="principle-text">
              The nonprofit creates relationships and deal flow that dramatically de-risks the for-profit investments.
              We build capacity first through our incubator before deploying capital.
            </p>
            <div className="principle-example">
              <strong>Result:</strong> Higher success rates, better returns, and measurable impact in every investment.
            </div>
          </div>

          <div className="principle-card">
            <span className="principle-icon">🌍</span>
            <h3 className="principle-title">First-of-Its-Kind Model</h3>
            <p className="principle-text">
              No one has successfully created a perpetual funding mechanism between nonprofit impact and for-profit returns.
              We're pioneering a new paradigm.
            </p>
            <div className="principle-example">
              <strong>Innovation:</strong> Solving the chronic underfunding problem in global development work forever.
            </div>
          </div>

          <div className="principle-card">
            <span className="principle-icon">📈</span>
            <h3 className="principle-title">Compound Impact</h3>
            <p className="principle-text">
              As the for-profit side grows, more money flows to the nonprofit. As the nonprofit expands,
              it creates more opportunities for the for-profit side. Both sides compound each other.
            </p>
            <div className="principle-example">
              <strong>Outcome:</strong> Exponential growth in both financial returns and social impact over time.
            </div>
          </div>
        </div>

        <div className="kenya-showcase">
          <h2 className="kenya-title">Kenya 2026: The Proof of Concept</h2>
          <p className="kenya-description">
            Our inaugural mission will demonstrate the entire ecosystem in action.
            Nonprofit programs + incubator training + capital deployment all working together.
          </p>
          <Link href="/perpetual-engine#kenya" className="kenya-cta">
            Learn About Kenya 2026 →
          </Link>
        </div>

        <div className="cta-grid">
          <Link href="/perpetual-engine" className="cta-card purple">
            <h3 className="cta-title">
              See Full Interactive Presentation
            </h3>
            <p className="cta-description">
              Complete walkthrough with impact calculator and donation options
            </p>
            <div className="cta-arrow">Explore Presentation →</div>
          </Link>

          <Link href="/lorenzo/connect" className="cta-card emerald">
            <h3 className="cta-title">
              Connect with Lorenzo
            </h3>
            <p className="cta-description">
              Investment opportunities, partnerships, and strategic discussions
            </p>
            <div className="cta-arrow">Get In Touch →</div>
          </Link>
        </div>
      </div>
    </>
  );
}