'use client';

import GlobalNavigation from '../components/GlobalNavigation';

export default function ProgramsPage() {
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
          margin-bottom: 80px;
        }

        .section-badge {
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

        .section-title {
          font-size: 84px;
          font-weight: 900;
          background: linear-gradient(135deg, #fff 0%, #64ffda 50%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
          letter-spacing: 3px;
          text-align: center;
          text-shadow: 0 0 80px rgba(100, 255, 218, 0.3);
        }

        .section-subtitle {
          font-size: 22px;
          color: rgba(230, 241, 255, 0.9);
          max-width: 900px;
          margin: 0 auto;
          line-height: 1.7;
          text-align: center;
          font-weight: 400;
        }

        .programs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 40px;
          margin-bottom: 100px;
        }

        .program-card {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.8) 0%, rgba(26, 31, 58, 0.6) 100%);
          border: 2px solid rgba(100, 255, 218, 0.2);
          border-radius: 32px;
          padding: 60px;
          transition: all 0.5s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .program-card::before {
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

        .program-card:hover::before {
          transform: scaleX(1);
        }

        .program-card:hover {
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.08) 0%, rgba(167, 139, 250, 0.08) 100%);
          border-color: #64ffda;
          transform: translateY(-15px);
          box-shadow: 0 30px 80px rgba(100, 255, 218, 0.25);
        }

        .program-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #64ffda 0%, #a78bfa 50%, #f59e0b 100%);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          font-size: 56px;
          box-shadow: 0 15px 50px rgba(100, 255, 218, 0.3);
        }

        .program-title {
          font-size: 36px;
          font-weight: 900;
          color: #64ffda;
          margin-bottom: 25px;
          letter-spacing: 1.5px;
          text-shadow: 0 0 30px rgba(100, 255, 218, 0.5);
        }

        .program-description {
          color: rgba(230, 241, 255, 0.85);
          margin-bottom: 40px;
          line-height: 1.8;
          font-size: 18px;
          font-weight: 400;
        }

        .program-features {
          list-style: none;
          padding: 0;
        }

        .program-feature {
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
          background: #64ffda;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(100, 255, 218, 0.6);
        }

        .track-record {
          background: linear-gradient(135deg, rgba(10, 14, 26, 0.9) 0%, rgba(26, 31, 58, 0.7) 100%);
          border: 3px solid rgba(100, 255, 218, 0.3);
          border-radius: 40px;
          padding: 80px;
          text-align: center;
          margin-top: 60px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(30px);
        }

        .track-record::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #64ffda 0%, #a78bfa 50%, #f59e0b 100%);
        }

        .track-title {
          font-size: 64px;
          font-weight: 900;
          background: linear-gradient(135deg, #64ffda 0%, #a78bfa 50%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
          letter-spacing: 2px;
          text-shadow: 0 0 50px rgba(100, 255, 218, 0.4);
        }

        .track-description {
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
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%);
          border: 1px solid rgba(100, 255, 218, 0.2);
          border-radius: 25px;
          transition: all 0.4s ease;
        }

        .metric-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(100, 255, 218, 0.2);
          border-color: rgba(100, 255, 218, 0.4);
        }

        .metric-value {
          font-size: 56px;
          font-weight: 900;
          background: linear-gradient(135deg, #64ffda 0%, #a78bfa 100%);
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

        @media (max-width: 768px) {
          .section-container {
            padding: 90px 20px 60px 20px;
          }

          .section-title {
            font-size: 64px;
          }

          .programs-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .program-card {
            padding: 40px 30px;
          }

          .program-icon {
            width: 100px;
            height: 100px;
            font-size: 48px;
          }

          .program-title {
            font-size: 28px;
          }

          .track-record {
            padding: 60px 30px;
          }

          .track-title {
            font-size: 48px;
          }

          .track-description {
            font-size: 20px;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }

          .metric-value {
            font-size: 44px;
          }
        }

        @media (max-width: 480px) {
          .section-container {
            padding: 80px 15px 40px 15px;
          }

          .section-title {
            font-size: 48px;
          }

          .programs-grid {
            grid-template-columns: 1fr;
          }

          .program-card {
            padding: 30px 20px;
          }

          .program-icon {
            width: 80px;
            height: 80px;
            font-size: 36px;
          }

          .program-title {
            font-size: 24px;
          }

          .track-record {
            padding: 40px 20px;
          }

          .track-title {
            font-size: 36px;
          }

          .track-description {
            font-size: 18px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .metric-value {
            font-size: 36px;
          }
        }
      `}</style>

      <div className="bg-grid"></div>
      <GlobalNavigation />

      <div className="section-container">
        <div className="section-header">
          <div className="section-badge">501(C)(3) NONPROFIT FOUNDATION</div>
          <h1 className="section-title">PROGRAMS</h1>
          <p className="section-subtitle">
            Creating relationships, credibility, and track record across youth development, medical missions, and workforce training.
            The foundation that makes everything else possible.
          </p>
        </div>

        <div className="programs-grid">
          {/* Medical & Wellness */}
          <div className="program-card">
            <div className="program-icon">🏥</div>
            <h2 className="program-title">MEDICAL & WELLNESS</h2>
            <p className="program-description">
              Co-led by Dr. Steve Silber. Medical missions, mobile clinics, Renewal Sanctuary vision,
              and healthcare access initiatives bringing quality care to underserved communities.
            </p>
            <ul className="program-features">
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Medical missions serving 500-1,000 people per trip</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Mobile clinics and healthcare infrastructure</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Renewal Sanctuary holistic wellness center vision</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Healthcare access where it's needed most</span>
              </li>
            </ul>
          </div>

          {/* Youth Leadership */}
          <div className="program-card">
            <div className="program-icon">👥</div>
            <h2 className="program-title">YOUTH LEADERSHIP</h2>
            <p className="program-description">
              Character formation, mentorship, international exchanges—developing the next generation
              of global leaders who lead with integrity, vision, and purpose.
            </p>
            <ul className="program-features">
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Character-based leadership training programs</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>International exchange and cultural immersion</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Mentorship and personal development pathways</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Global leadership network building</span>
              </li>
            </ul>
          </div>

          {/* Tech & Education */}
          <div className="program-card">
            <div className="program-icon">💻</div>
            <h2 className="program-title">TECH & EDUCATION</h2>
            <p className="program-description">
              Digital literacy, AI education platforms, technology access, and workforce development
              for the future economy. Preparing communities through access and training.
            </p>
            <ul className="program-features">
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>AI education platform development and deployment</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Digital literacy and technology access programs</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Workforce development for future economy</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Educational technology and innovation</span>
              </li>
            </ul>
          </div>

          {/* Ministry & Community */}
          <div className="program-card">
            <div className="program-icon">⛪</div>
            <h2 className="program-title">MINISTRY & COMMUNITY</h2>
            <p className="program-description">
              Spiritual development, community building, faith-based programs, and holistic transformation.
              Building strong communities rooted in purpose, values, and mutual support.
            </p>
            <ul className="program-features">
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Community spiritual development programs</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Faith-based transformation initiatives</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Church planting and community centers</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Holistic community development approach</span>
              </li>
            </ul>
          </div>

          {/* Workforce & Enterprise */}
          <div className="program-card">
            <div className="program-icon">🌾</div>
            <h2 className="program-title">WORKFORCE & ENTERPRISE</h2>
            <p className="program-description">
              Job training, entrepreneurship support, vocational programs, and economic empowerment.
              Creating pathways to prosperity and self-sufficiency.
            </p>
            <ul className="program-features">
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Vocational training and skills development</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Entrepreneurship support and business incubation</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Economic empowerment and job creation</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Market linkage and business development</span>
              </li>
            </ul>
          </div>

          {/* Feeding & Nutrition */}
          <div className="program-card">
            <div className="program-icon">🍽️</div>
            <h2 className="program-title">FEEDING & NUTRITION</h2>
            <p className="program-description">
              Nutrition programs, food security initiatives, feeding programs, and community health.
              Addressing food insecurity and building long-term food security.
            </p>
            <ul className="program-features">
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Community feeding programs serving hundreds</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Food security and systems development</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Nutrition education and health programs</span>
              </li>
              <li className="program-feature">
                <div className="feature-dot"></div>
                <span>Sustainable agriculture and food production</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 15+ Years Track Record */}
        <div className="track-record">
          <h2 className="track-title">15+ YEARS OF TRACK RECORD</h2>
          <p className="track-description">
            Building relationships, credibility, and trust across 25+ nations. Creating the foundation
            that opens doors for the entire ecosystem. The work that makes everything else possible.
          </p>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-value">25+</div>
              <div className="metric-label">Nations Impacted</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">147</div>
              <div className="metric-label">Churches Planted</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">50K+</div>
              <div className="metric-label">Lives Transformed</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">15+</div>
              <div className="metric-label">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}