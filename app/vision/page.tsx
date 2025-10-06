'use client';

import Link from 'next/link';
import GlobalNavigation from '../components/GlobalNavigation';

export default function VisionPage() {
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

        .vision-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 120px 60px 80px 60px;
          position: relative;
          z-index: 1;
        }

        .vision-header {
          text-align: center;
          margin-bottom: 100px;
        }

        .vision-badge {
          display: inline-block;
          padding: 16px 32px;
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(34, 197, 94, 0.15) 100%);
          border: 2px solid rgba(20, 184, 166, 0.4);
          border-radius: 30px;
          color: #14b8a6;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 15px 50px rgba(20, 184, 166, 0.2);
        }

        .vision-title {
          font-size: 96px;
          font-weight: 900;
          background: linear-gradient(135deg, #fff 0%, #14b8a6 30%, #22c55e 70%, #84cc16 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
          letter-spacing: 4px;
          text-align: center;
          text-shadow: 0 0 100px rgba(20, 184, 166, 0.4);
        }

        .vision-subtitle {
          font-size: 24px;
          color: rgba(230, 241, 255, 0.9);
          max-width: 1000px;
          margin: 0 auto;
          line-height: 1.7;
          text-align: center;
          font-weight: 400;
        }

        .vision-statement {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.9) 0%, rgba(26, 31, 58, 0.7) 100%);
          border: 3px solid rgba(20, 184, 166, 0.3);
          border-radius: 40px;
          padding: 80px;
          text-align: center;
          margin-bottom: 100px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(30px);
        }

        .vision-statement::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #14b8a6 0%, #22c55e 50%, #84cc16 100%);
        }

        .statement-text {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.6;
          color: rgba(230, 241, 255, 0.95);
          max-width: 1000px;
          margin: 0 auto;
          letter-spacing: 0.5px;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 40px;
          margin-bottom: 100px;
        }

        .pillar-card {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.8) 0%, rgba(26, 31, 58, 0.6) 100%);
          border: 2px solid rgba(20, 184, 166, 0.2);
          border-radius: 32px;
          padding: 60px;
          transition: all 0.5s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .pillar-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #14b8a6 0%, #22c55e 50%, #84cc16 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s;
        }

        .pillar-card:hover::before {
          transform: scaleX(1);
        }

        .pillar-card:hover {
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%);
          border-color: #14b8a6;
          transform: translateY(-15px);
          box-shadow: 0 30px 80px rgba(20, 184, 166, 0.25);
        }

        .pillar-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #14b8a6 0%, #22c55e 50%, #84cc16 100%);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          font-size: 56px;
          box-shadow: 0 15px 50px rgba(20, 184, 166, 0.3);
        }

        .pillar-title {
          font-size: 36px;
          font-weight: 900;
          color: #14b8a6;
          margin-bottom: 25px;
          letter-spacing: 1.5px;
          text-shadow: 0 0 30px rgba(20, 184, 166, 0.5);
        }

        .pillar-description {
          color: rgba(230, 241, 255, 0.85);
          margin-bottom: 40px;
          line-height: 1.8;
          font-size: 18px;
          font-weight: 400;
        }

        .pillar-features {
          list-style: none;
          padding: 0;
        }

        .pillar-feature {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          color: rgba(230, 241, 255, 0.75);
          font-size: 16px;
          font-weight: 500;
        }

        .feature-dot {
          width: 10px;
          height: 10px;
          background: #14b8a6;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(20, 184, 166, 0.6);
        }

        .impact-metrics {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.9) 0%, rgba(26, 31, 58, 0.7) 100%);
          border: 3px solid rgba(20, 184, 166, 0.3);
          border-radius: 40px;
          padding: 80px;
          text-align: center;
          margin-bottom: 80px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(30px);
        }

        .impact-metrics::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #14b8a6 0%, #22c55e 50%, #84cc16 100%);
        }

        .impact-title {
          font-size: 64px;
          font-weight: 900;
          background: linear-gradient(135deg, #14b8a6 0%, #22c55e 50%, #84cc16 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
          letter-spacing: 2px;
          text-shadow: 0 0 50px rgba(20, 184, 166, 0.4);
        }

        .impact-description {
          font-size: 24px;
          color: rgba(230, 241, 255, 0.9);
          max-width: 900px;
          margin: 0 auto 60px auto;
          line-height: 1.7;
          font-weight: 400;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 50px;
          margin-top: 60px;
        }

        .metric-item {
          text-align: center;
          padding: 30px;
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 25px;
          transition: all 0.4s ease;
        }

        .metric-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(20, 184, 166, 0.2);
          border-color: rgba(20, 184, 166, 0.4);
        }

        .metric-value {
          font-size: 56px;
          font-weight: 900;
          background: linear-gradient(135deg, #14b8a6 0%, #22c55e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }

        .metric-label {
          color: rgba(230, 241, 255, 0.8);
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .cta-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 40px;
        }

        .cta-card {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.8) 0%, rgba(26, 31, 58, 0.6) 100%);
          border: 2px solid rgba(20, 184, 166, 0.2);
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
          background: linear-gradient(90deg, #14b8a6 0%, #22c55e 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s;
        }

        .cta-card:hover::before {
          transform: scaleX(1);
        }

        .cta-card:hover {
          border-color: #14b8a6;
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%);
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(20, 184, 166, 0.2);
        }

        .cta-title {
          font-size: 24px;
          font-weight: 900;
          color: #14b8a6;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }

        .cta-description {
          color: rgba(230, 241, 255, 0.8);
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .cta-arrow {
          color: #14b8a6;
          font-weight: 700;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .vision-container {
            padding: 90px 20px 60px 20px;
          }

          .vision-title {
            font-size: 64px;
          }

          .vision-statement {
            padding: 60px 30px;
          }

          .statement-text {
            font-size: 24px;
          }

          .pillars-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .pillar-card {
            padding: 40px 30px;
          }

          .pillar-icon {
            width: 100px;
            height: 100px;
            font-size: 48px;
          }

          .pillar-title {
            font-size: 28px;
          }

          .impact-metrics {
            padding: 60px 30px;
          }

          .impact-title {
            font-size: 48px;
          }

          .impact-description {
            font-size: 20px;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .vision-container {
            padding: 80px 15px 40px 15px;
          }

          .vision-title {
            font-size: 48px;
          }

          .statement-text {
            font-size: 20px;
          }

          .pillar-card {
            padding: 30px 20px;
          }

          .pillar-icon {
            width: 80px;
            height: 80px;
            font-size: 36px;
          }

          .pillar-title {
            font-size: 24px;
          }

          .impact-metrics {
            padding: 40px 20px;
          }

          .impact-title {
            font-size: 36px;
          }

          .impact-description {
            font-size: 18px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="bg-grid"></div>
      <GlobalNavigation />

      <div className="vision-container">
        <div className="vision-header">
          <div className="vision-badge">GLOBAL TRANSFORMATION</div>
          <h1 className="vision-title">VISION</h1>
          <p className="vision-subtitle">
            A world where capital systematically flows to solve humanity's greatest challenges,
            creating perpetual cycles of impact and sustainable returns.
          </p>
        </div>

        <div className="vision-statement">
          <p className="statement-text">
            "To pioneer a new paradigm where the pursuit of financial returns and the pursuit of global transformation
            are not just aligned, but inseparable—creating self-sustaining systems that generate both
            measurable impact and market-rate returns in perpetuity."
          </p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">🌍</div>
            <h2 className="pillar-title">SYSTEMIC TRANSFORMATION</h2>
            <p className="pillar-description">
              Moving beyond charity to create self-sustaining systems that address root causes
              and generate lasting change across communities and nations.
            </p>
            <ul className="pillar-features">
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Root cause solutions, not symptom treatment</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Self-sustaining impact mechanisms</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Scalable transformation models</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Multi-generational impact planning</span>
              </li>
            </ul>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">💰</div>
            <h2 className="pillar-title">PERPETUAL FUNDING</h2>
            <p className="pillar-description">
              Creating funding mechanisms that grow stronger over time, ensuring that
              the work never stops and impact compounds across generations.
            </p>
            <ul className="pillar-features">
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>10% profit flow creates growing endowment</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Market-rate returns fund exponential impact</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Compounding capital for compounding change</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Independence from donor dependency</span>
              </li>
            </ul>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">🚀</div>
            <h2 className="pillar-title">GLOBAL SCALABILITY</h2>
            <p className="pillar-description">
              Building replicable models that can be deployed across cultures, economies,
              and contexts while maintaining effectiveness and local relevance.
            </p>
            <ul className="pillar-features">
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Proven model replication across markets</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Cultural adaptation with core principles</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Local capacity building emphasis</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Network effects across regions</span>
              </li>
            </ul>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">🤝</div>
            <h2 className="pillar-title">ECOSYSTEM INTEGRATION</h2>
            <p className="pillar-description">
              Connecting impact and investment in ways that strengthen both,
              creating virtuous cycles where success in one area fuels success in others.
            </p>
            <ul className="pillar-features">
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Nonprofit credibility opens business doors</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Business success funds expanded impact</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Relationship capital compounds returns</span>
              </li>
              <li className="pillar-feature">
                <div className="feature-dot"></div>
                <span>Integrated strategy across all verticals</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="impact-metrics">
          <h2 className="impact-title">PROJECTED GLOBAL IMPACT</h2>
          <p className="impact-description">
            By 2030, our vision encompasses measurable transformation across multiple continents,
            with self-sustaining systems generating both financial returns and lasting change.
          </p>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-value">50+</div>
              <div className="metric-label">Nations Impacted</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">$500M</div>
              <div className="metric-label">Capital Deployed</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">1M+</div>
              <div className="metric-label">Lives Transformed</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">$50M</div>
              <div className="metric-label">Annual Impact Fund</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">25%</div>
              <div className="metric-label">IRR Target</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">∞</div>
              <div className="metric-label">Perpetual Duration</div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link href="/perpetual-engine" className="cta-card">
            <h3 className="cta-title">
              Experience The Model
            </h3>
            <p className="cta-description">
              See how the perpetual engine creates lasting transformation through our interactive presentation
            </p>
            <div className="cta-arrow">Explore Interactive Demo →</div>
          </Link>

          <Link href="/lorenzo/connect" className="cta-card">
            <h3 className="cta-title">
              Join The Vision
            </h3>
            <p className="cta-description">
              Investment opportunities, strategic partnerships, and collaboration discussions
            </p>
            <div className="cta-arrow">Connect with Lorenzo →</div>
          </Link>
        </div>
      </div>
    </>
  );
}