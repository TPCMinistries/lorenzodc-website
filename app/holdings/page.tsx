'use client';

import GlobalNavigation from '../components/GlobalNavigation';

export default function HoldingsPage() {
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

        .section-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 120px 60px 80px 60px;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-badge {
          display: inline-block;
          padding: 12px 24px;
          background: rgba(100, 255, 218, 0.1);
          border: 1px solid rgba(100, 255, 218, 0.3);
          border-radius: 25px;
          color: #64ffda;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 72px;
          font-weight: 900;
          background: linear-gradient(135deg, #fff 0%, #64ffda 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 20px;
          letter-spacing: 2px;
          text-align: center;
        }

        .section-subtitle {
          font-size: 20px;
          color: rgba(230, 241, 255, 0.8);
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .holdings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 30px;
          margin-bottom: 80px;
        }

        .holding-card {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.8) 0%, rgba(26, 31, 58, 0.6) 100%);
          border: 2px solid rgba(100, 255, 218, 0.2);
          border-radius: 28px;
          padding: 50px;
          transition: all 0.4s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .holding-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #64ffda 0%, #a78bfa 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s;
        }

        .holding-card:hover::before {
          transform: scaleX(1);
        }

        .holding-card:hover {
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.08) 0%, rgba(167, 139, 250, 0.08) 100%);
          border-color: #64ffda;
          transform: translateY(-10px);
          box-shadow: 0 25px 70px rgba(100, 255, 218, 0.2);
        }

        .holding-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #64ffda 0%, #a78bfa 100%);
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          font-size: 48px;
          box-shadow: 0 10px 40px rgba(100, 255, 218, 0.3);
        }

        .holding-title {
          font-size: 32px;
          font-weight: 800;
          color: #64ffda;
          margin-bottom: 20px;
          letter-spacing: 1px;
        }

        .holding-description {
          color: rgba(230, 241, 255, 0.8);
          margin-bottom: 30px;
          line-height: 1.7;
          font-size: 16px;
        }

        .holding-features {
          list-style: none;
          padding: 0;
        }

        .holding-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          color: rgba(230, 241, 255, 0.7);
          font-size: 15px;
        }

        .feature-dot {
          width: 8px;
          height: 8px;
          background: #64ffda;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(100, 255, 218, 0.5);
        }

        .perpetual-flow {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.9) 0%, rgba(26, 31, 58, 0.7) 100%);
          border: 2px solid rgba(100, 255, 218, 0.25);
          border-radius: 28px;
          padding: 60px;
          text-align: center;
          margin-top: 40px;
          position: relative;
          overflow: hidden;
        }

        .perpetual-flow::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #64ffda 0%, #a78bfa 100%);
        }

        .flow-title {
          font-size: 56px;
          font-weight: 900;
          background: linear-gradient(135deg, #64ffda 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 25px;
          letter-spacing: 2px;
        }

        .flow-description {
          font-size: 20px;
          color: rgba(230, 241, 255, 0.8);
          max-width: 800px;
          margin: 0 auto 50px auto;
          line-height: 1.6;
        }

        .flow-visualization {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          margin-top: 40px;
        }

        .flow-step {
          text-align: center;
          padding: 30px;
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%);
          border: 1px solid rgba(100, 255, 218, 0.2);
          border-radius: 20px;
          min-width: 200px;
          transition: all 0.3s ease;
        }

        .flow-step:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(100, 255, 218, 0.15);
          border-color: rgba(100, 255, 218, 0.4);
        }

        .flow-step-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #64ffda 0%, #a78bfa 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          font-size: 24px;
          font-weight: 900;
          color: #0a0e1a;
          box-shadow: 0 8px 25px rgba(100, 255, 218, 0.3);
        }

        .flow-step-title {
          font-size: 18px;
          font-weight: 700;
          color: #64ffda;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .flow-step-desc {
          font-size: 14px;
          color: rgba(230, 241, 255, 0.7);
          line-height: 1.5;
        }

        .flow-arrow {
          color: #64ffda;
          font-size: 32px;
          font-weight: bold;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 90px 20px 60px 20px;
          }

          .section-title {
            font-size: 48px;
          }

          .holdings-grid {
            grid-template-columns: 1fr;
          }

          .holding-card {
            padding: 30px 20px;
          }

          .perpetual-flow {
            padding: 40px 20px;
          }

          .flow-visualization {
            flex-direction: column;
            gap: 20px;
          }

          .flow-arrow {
            transform: rotate(90deg);
          }
        }

        @media (max-width: 480px) {
          .section-container {
            padding: 80px 15px 40px 15px;
          }

          .section-title {
            font-size: 36px;
          }

          .flow-title {
            font-size: 36px;
          }
        }
      `}</style>

      <div className="bg-grid"></div>
      <GlobalNavigation />

      <div className="section-container">
        <div className="section-header">
          <div className="section-badge">FOR-PROFIT ECOSYSTEM</div>
          <h1 className="section-title">HOLDINGS</h1>
          <p className="section-subtitle">
            Revenue-generating entities that fuel the perpetual engine. Each business unit generates market-rate returns while maintaining mission focus.
          </p>
        </div>

        <div className="holdings-grid">
          {/* AI Incubator */}
          <div className="holding-card">
            <div className="holding-icon">🚀</div>
            <h2 className="holding-title">AI INCUBATOR</h2>
            <p className="holding-description">
              Identifies, vets, and trains entrepreneurs. Takes 3-10% equity in all participants.
              De-risks investments by building capacity first. Only top 5-10% advance to capital deployment.
            </p>
            <ul className="holding-features">
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Intensive (6-12 months) or accelerated programs</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>3-10% equity stakes in ALL participants</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Creates vetted deal flow for investment fund</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Mentorship and pilot program structure</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Only top 5-10% advance to capital deployment</span>
              </li>
            </ul>
          </div>

          {/* Impact Fund */}
          <div className="holding-card">
            <div className="holding-icon">💰</div>
            <h2 className="holding-title">$50M IMPACT FUND</h2>
            <p className="holding-description">
              Deploys capital into incubator-vetted opportunities plus strategic investments.
              Target 20%+ IRR with mandatory 10% profit flow back to nonprofit foundation.
            </p>
            <ul className="holding-features">
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>$50M target fund size, first close $10-15M</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Diversified: businesses, real estate, bonds, crypto, alternatives</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>10% of profits flow to nonprofit perpetually</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Hybrid debt + equity structures</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Target 20%+ IRR across portfolio</span>
              </li>
            </ul>
          </div>

          {/* Education Ventures */}
          <div className="holding-card">
            <div className="holding-icon">🎓</div>
            <h2 className="holding-title">EDUCATION VENTURES</h2>
            <p className="holding-description">
              AI education platforms, digital literacy programs, and workforce development initiatives.
              Scalable technology solutions for underserved markets generating sustainable revenue.
            </p>
            <ul className="holding-features">
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>AI education platform development and deployment</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Digital literacy and technology access programs</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Workforce development for future economy</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Scalable solutions for underserved markets</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Technology-enabled revenue streams</span>
              </li>
            </ul>
          </div>

          {/* Strategic Business Units */}
          <div className="holding-card">
            <div className="holding-icon">🏢</div>
            <h2 className="holding-title">STRATEGIC BUSINESS UNITS</h2>
            <p className="holding-description">
              Medical operations, AI companies, and other revenue-generating entities.
              Diversified portfolio approach maintaining mission alignment while generating market returns.
            </p>
            <ul className="holding-features">
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Medical and healthcare operations</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>AI and technology companies</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Target 20%+ IRR across portfolio</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Mission-aligned revenue generation</span>
              </li>
              <li className="holding-feature">
                <div className="feature-dot"></div>
                <span>Diversified business model approach</span>
              </li>
            </ul>
          </div>
        </div>

        {/* The Perpetual Flow */}
        <div className="perpetual-flow">
          <h2 className="flow-title">THE PERPETUAL FLOW</h2>
          <p className="flow-description">
            10% of all profits from the for-profit holdings automatically flow back to the nonprofit foundation,
            creating a perpetual funding mechanism that grows stronger over time. The work never stops. The impact never ends.
          </p>
          <div className="flow-visualization">
            <div className="flow-step">
              <div className="flow-step-number">1</div>
              <div className="flow-step-title">REVENUE GENERATION</div>
              <div className="flow-step-desc">Holdings generate market-rate returns through diversified business operations</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-step-number">2</div>
              <div className="flow-step-title">10% PROFIT FLOW</div>
              <div className="flow-step-desc">Automatic perpetual transfer to nonprofit foundation</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-step-number">3</div>
              <div className="flow-step-title">NONPROFIT IMPACT</div>
              <div className="flow-step-desc">Expanded programs create more relationships and opportunities</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-step-number">4</div>
              <div className="flow-step-title">COMPOUND GROWTH</div>
              <div className="flow-step-desc">More opportunities mean higher returns, creating exponential impact</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}