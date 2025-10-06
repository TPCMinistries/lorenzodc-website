'use client';

import Link from 'next/link';
import GlobalNavigation from '../components/GlobalNavigation';

export default function Kenya2026Page() {
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

        .kenya-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 120px 60px 80px 60px;
          position: relative;
          z-index: 1;
        }

        .kenya-header {
          text-align: center;
          margin-bottom: 100px;
        }

        .kenya-badge {
          display: inline-block;
          padding: 16px 32px;
          background: linear-gradient(135deg, rgba(220, 38, 127, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%);
          border: 2px solid rgba(220, 38, 127, 0.4);
          border-radius: 30px;
          color: #dc2777;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 15px 50px rgba(220, 38, 127, 0.2);
        }

        .kenya-title {
          font-size: 96px;
          font-weight: 900;
          background: linear-gradient(135deg, #fff 0%, #dc2777 30%, #ef4444 70%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
          letter-spacing: 4px;
          text-align: center;
          text-shadow: 0 0 100px rgba(220, 38, 127, 0.4);
        }

        .kenya-subtitle {
          font-size: 24px;
          color: rgba(230, 241, 255, 0.9);
          max-width: 1000px;
          margin: 0 auto;
          line-height: 1.7;
          text-align: center;
          font-weight: 400;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 40px;
          margin-bottom: 100px;
        }

        .mission-card {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.8) 0%, rgba(26, 31, 58, 0.6) 100%);
          border: 2px solid rgba(220, 38, 127, 0.2);
          border-radius: 32px;
          padding: 60px;
          transition: all 0.5s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .mission-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #dc2777 0%, #ef4444 50%, #f59e0b 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s;
        }

        .mission-card:hover::before {
          transform: scaleX(1);
        }

        .mission-card:hover {
          background: linear-gradient(135deg, rgba(220, 38, 127, 0.08) 0%, rgba(239, 68, 68, 0.08) 100%);
          border-color: #dc2777;
          transform: translateY(-15px);
          box-shadow: 0 30px 80px rgba(220, 38, 127, 0.25);
        }

        .mission-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #dc2777 0%, #ef4444 50%, #f59e0b 100%);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          font-size: 56px;
          box-shadow: 0 15px 50px rgba(220, 38, 127, 0.3);
        }

        .mission-title {
          font-size: 36px;
          font-weight: 900;
          color: #dc2777;
          margin-bottom: 25px;
          letter-spacing: 1.5px;
          text-shadow: 0 0 30px rgba(220, 38, 127, 0.5);
        }

        .mission-description {
          color: rgba(230, 241, 255, 0.85);
          margin-bottom: 40px;
          line-height: 1.8;
          font-size: 18px;
          font-weight: 400;
        }

        .mission-features {
          list-style: none;
          padding: 0;
        }

        .mission-feature {
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
          background: #dc2777;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(220, 38, 127, 0.6);
        }

        .timeline-section {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.9) 0%, rgba(26, 31, 58, 0.7) 100%);
          border: 3px solid rgba(220, 38, 127, 0.3);
          border-radius: 40px;
          padding: 80px;
          text-align: center;
          margin-bottom: 80px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(30px);
        }

        .timeline-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #dc2777 0%, #ef4444 50%, #f59e0b 100%);
        }

        .timeline-title {
          font-size: 64px;
          font-weight: 900;
          background: linear-gradient(135deg, #dc2777 0%, #ef4444 50%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
          letter-spacing: 2px;
          text-shadow: 0 0 50px rgba(220, 38, 127, 0.4);
        }

        .timeline-description {
          font-size: 24px;
          color: rgba(230, 241, 255, 0.9);
          max-width: 900px;
          margin: 0 auto 60px auto;
          line-height: 1.7;
          font-weight: 400;
        }

        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .timeline-phase {
          text-align: center;
          padding: 40px 30px;
          background: linear-gradient(135deg, rgba(220, 38, 127, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
          border: 1px solid rgba(220, 38, 127, 0.2);
          border-radius: 25px;
          transition: all 0.4s ease;
        }

        .timeline-phase:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(220, 38, 127, 0.2);
          border-color: rgba(220, 38, 127, 0.4);
        }

        .phase-date {
          font-size: 20px;
          font-weight: 900;
          background: linear-gradient(135deg, #dc2777 0%, #ef4444 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }

        .phase-title {
          font-size: 18px;
          font-weight: 700;
          color: #dc2777;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .phase-description {
          color: rgba(230, 241, 255, 0.8);
          font-size: 14px;
          line-height: 1.6;
        }

        .cta-section {
          text-align: center;
          margin-top: 80px;
        }

        .cta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .cta-card {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.8) 0%, rgba(26, 31, 58, 0.6) 100%);
          border: 2px solid rgba(220, 38, 127, 0.2);
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
          background: linear-gradient(90deg, #dc2777 0%, #ef4444 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s;
        }

        .cta-card:hover::before {
          transform: scaleX(1);
        }

        .cta-card:hover {
          border-color: #dc2777;
          background: linear-gradient(135deg, rgba(220, 38, 127, 0.08) 0%, rgba(239, 68, 68, 0.08) 100%);
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(220, 38, 127, 0.2);
        }

        .cta-title {
          font-size: 24px;
          font-weight: 900;
          color: #dc2777;
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
          color: #dc2777;
          font-weight: 700;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .kenya-container {
            padding: 90px 20px 60px 20px;
          }

          .kenya-title {
            font-size: 64px;
          }

          .mission-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .mission-card {
            padding: 40px 30px;
          }

          .mission-icon {
            width: 100px;
            height: 100px;
            font-size: 48px;
          }

          .mission-title {
            font-size: 28px;
          }

          .timeline-section {
            padding: 60px 30px;
          }

          .timeline-title {
            font-size: 48px;
          }

          .timeline-description {
            font-size: 20px;
          }

          .timeline-grid {
            grid-template-columns: 1fr;
          }

          .cta-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .kenya-container {
            padding: 80px 15px 40px 15px;
          }

          .kenya-title {
            font-size: 48px;
          }

          .mission-card {
            padding: 30px 20px;
          }

          .mission-icon {
            width: 80px;
            height: 80px;
            font-size: 36px;
          }

          .mission-title {
            font-size: 24px;
          }

          .timeline-section {
            padding: 40px 20px;
          }

          .timeline-title {
            font-size: 36px;
          }

          .timeline-description {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="bg-grid"></div>
      <GlobalNavigation />

      <div className="kenya-container">
        <div className="kenya-header">
          <div className="kenya-badge">INAUGURAL MISSION</div>
          <h1 className="kenya-title">KENYA 2026</h1>
          <p className="kenya-subtitle">
            Our proof-of-concept mission demonstrating the entire perpetual engine ecosystem in action.
            Nonprofit programs + incubator training + capital deployment working together.
          </p>
        </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">🌍</div>
            <h2 className="mission-title">ECOSYSTEM DEMONSTRATION</h2>
            <p className="mission-description">
              Kenya 2026 will be the first live demonstration of our complete dual-arm model.
              Showing how nonprofit relationship-building directly feeds for-profit opportunities.
            </p>
            <ul className="mission-features">
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Complete ecosystem proof-of-concept</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Nonprofit + for-profit integration live demo</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Real-time perpetual flow validation</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Measurable impact + financial returns</span>
              </li>
            </ul>
          </div>

          <div className="mission-card">
            <div className="mission-icon">🎓</div>
            <h2 className="mission-title">INCUBATOR PROGRAM</h2>
            <p className="mission-description">
              Training 20-30 Kenyan entrepreneurs through our AI Incubator methodology.
              Building local capacity while creating vetted deal flow for capital deployment.
            </p>
            <ul className="mission-features">
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>20-30 entrepreneurs in intensive training</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>3-10% equity stakes in all participants</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>De-risked investment pipeline creation</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Local capacity building focus</span>
              </li>
            </ul>
          </div>

          <div className="mission-card">
            <div className="mission-icon">💰</div>
            <h2 className="mission-title">CAPITAL DEPLOYMENT</h2>
            <p className="mission-description">
              Strategic investments in incubator-vetted opportunities plus existing high-potential ventures.
              Targeting 20%+ IRR with immediate 10% profit flow back to nonprofit.
            </p>
            <ul className="mission-features">
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>$2-5M capital deployment target</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Diversified investment portfolio</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>20%+ IRR target across investments</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>10% profit flow to nonprofit immediately</span>
              </li>
            </ul>
          </div>

          <div className="mission-card">
            <div className="mission-icon">🏥</div>
            <h2 className="mission-title">IMPACT PROGRAMS</h2>
            <p className="mission-description">
              Medical missions, youth development, and community programs creating relationships
              and credibility that open doors for business opportunities.
            </p>
            <ul className="mission-features">
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Medical missions serving 1,000+ people</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Youth leadership development programs</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Community transformation initiatives</span>
              </li>
              <li className="mission-feature">
                <div className="feature-dot"></div>
                <span>Relationship & credibility building focus</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="timeline-section">
          <h2 className="timeline-title">MISSION TIMELINE</h2>
          <p className="timeline-description">
            18-month comprehensive execution from preparation to perpetual flow validation.
            Each phase builds toward proving the complete ecosystem model.
          </p>
          <div className="timeline-grid">
            <div className="timeline-phase">
              <div className="phase-date">Q1 2025</div>
              <div className="phase-title">Preparation Phase</div>
              <div className="phase-description">
                Team assembly, partnership development, local relationship building, and program design
              </div>
            </div>
            <div className="timeline-phase">
              <div className="phase-date">Q2-Q3 2025</div>
              <div className="phase-title">Foundation Building</div>
              <div className="phase-description">
                Incubator curriculum development, entrepreneur recruitment, initial impact programs launch
              </div>
            </div>
            <div className="timeline-phase">
              <div className="phase-date">Q4 2025</div>
              <div className="phase-title">Program Launch</div>
              <div className="phase-description">
                Incubator training begins, medical missions commence, investment pipeline development
              </div>
            </div>
            <div className="timeline-phase">
              <div className="phase-date">Q1-Q2 2026</div>
              <div className="phase-title">Capital Deployment</div>
              <div className="phase-description">
                Strategic investments made, portfolio companies launched, revenue generation begins
              </div>
            </div>
            <div className="timeline-phase">
              <div className="phase-date">Q3 2026</div>
              <div className="phase-title">Perpetual Flow</div>
              <div className="phase-description">
                First profit distributions to nonprofit, ecosystem validation, impact measurement
              </div>
            </div>
            <div className="timeline-phase">
              <div className="phase-date">Q4 2026</div>
              <div className="phase-title">Model Proven</div>
              <div className="phase-description">
                Complete ecosystem demonstration, scalability planning, next market identification
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-grid">
            <Link href="/perpetual-engine" className="cta-card">
              <h3 className="cta-title">
                See Interactive Presentation
              </h3>
              <p className="cta-description">
                Experience the complete perpetual engine model with calculator and visualizations
              </p>
              <div className="cta-arrow">Explore Full Presentation →</div>
            </Link>

            <Link href="/lorenzo/connect" className="cta-card">
              <h3 className="cta-title">
                Join Kenya 2026 Mission
              </h3>
              <p className="cta-description">
                Investment opportunities, partnership discussions, and mission participation
              </p>
              <div className="cta-arrow">Connect with Lorenzo →</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}