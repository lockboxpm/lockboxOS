// Infographic CV PDF / Print Generator for Nicholas J. Kraemer
// Produces an executive, infographic-grade printable dossier

export interface CvPrintOptions {
  theme?: 'dark' | 'light';
  autoPrint?: boolean;
}

export function openCvInfographicPrintWindow(options: CvPrintOptions = {}) {
  const theme = options.theme || 'dark';
  const autoPrint = options.autoPrint !== false;
  
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lockboxpm.com';
  const headshotUrl = `${origin}/Nick_HeadShot_blackshirt.jpeg`;

  const printWindow = window.open('', '_blank', 'width=1100,height=900,scrollbars=yes');
  if (!printWindow) {
    alert('Please allow popups to open the CV Infographic Print & PDF view.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nicholas J. Kraemer – Executive Dossier & Infographic CV</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(17, 24, 39, 0.9);
      --card-border: rgba(51, 65, 85, 0.6);
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --accent-cyan: #06b6d4;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --accent-violet: #8b5cf6;
      --accent-blue: #3b82f6;
    }

    body.theme-light {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --card-border: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #475569;
      --text-dim: #64748b;
      --accent-cyan: #0891b2;
      --accent-emerald: #059669;
      --accent-amber: #d97706;
      --accent-violet: #7c3aed;
      --accent-blue: #2563eb;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      line-height: 1.45;
      font-size: 13px;
      padding-bottom: 40px;
    }

    /* Floating Toolbar for interactive window */
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(51, 65, 85, 0.6);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }
    .toolbar-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 15px;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .btn {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #06b6d4, #0284c7);
      color: #ffffff;
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
    }
    .btn-secondary {
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
    }
    .btn-secondary:hover {
      background: #334155;
      color: #ffffff;
    }

    /* Paper canvas */
    .sheet-container {
      max-width: 960px;
      margin: 24px auto;
      padding: 0 16px;
    }

    .sheet {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 32px 36px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      position: relative;
      overflow: hidden;
      margin-bottom: 24px;
    }

    /* Decorative top accent glow */
    .sheet::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #06b6d4, #8b5cf6, #10b981, #f59e0b);
    }

    /* HEADER */
    .header-grid {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 24px;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 20px;
    }
    .headshot-wrap {
      width: 110px;
      height: 110px;
      border-radius: 16px;
      overflow: hidden;
      border: 2px solid var(--accent-cyan);
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.25);
      background: #0f172a;
    }
    .headshot-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .header-details h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: var(--text-main);
      margin-bottom: 4px;
    }
    .header-details .subtitle {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--accent-cyan);
      margin-bottom: 10px;
      letter-spacing: 0.2px;
    }
    .contact-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 11px;
      color: var(--text-muted);
    }
    .contact-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(30, 41, 59, 0.6);
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid var(--card-border);
    }

    /* METRIC STAT STRIP */
    .stat-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 22px;
    }
    .stat-card {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .stat-number {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--accent-cyan);
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .stat-label {
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-dim);
      font-weight: 600;
    }

    /* CREDENTIALS BADGE MATRIX */
    .sec-title {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sec-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--card-border);
    }

    .badge-matrix {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 22px;
    }
    .lic-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid var(--card-border);
    }
    .lic-icon {
      font-size: 18px;
      flex-shrink: 0;
    }
    .lic-title {
      font-weight: 600;
      font-size: 11.5px;
      color: var(--text-main);
      line-height: 1.2;
    }
    .lic-sub {
      font-size: 9.5px;
      color: var(--text-dim);
      font-family: 'Fira Code', monospace;
    }

    /* 2-COLUMN INFOGRAPHIC BODY */
    .body-grid {
      display: grid;
      grid-template-columns: 310px 1fr;
      gap: 24px;
    }

    /* LEFT COLUMN (Gauges, Skills, Education) */
    .skill-group {
      margin-bottom: 14px;
    }
    .skill-name {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--text-muted);
    }
    .meter-bar {
      width: 100%;
      height: 6px;
      background: rgba(51, 65, 85, 0.4);
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .meter-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald));
    }

    .edu-card {
      padding: 10px;
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid var(--card-border);
      margin-bottom: 10px;
    }
    .edu-degree {
      font-weight: 700;
      font-size: 12px;
      color: var(--text-main);
    }
    .edu-school {
      font-size: 11px;
      color: var(--accent-cyan);
    }
    .edu-year {
      font-size: 10px;
      color: var(--text-dim);
      font-family: 'Fira Code', monospace;
    }

    /* RIGHT COLUMN (Timeline) */
    .timeline {
      position: relative;
      padding-left: 18px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      top: 6px;
      bottom: 6px;
      left: 4px;
      width: 2px;
      background: linear-gradient(180deg, var(--accent-cyan), var(--accent-violet), var(--card-border));
    }
    .tl-item {
      position: relative;
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    .tl-dot {
      position: absolute;
      left: -18px;
      top: 4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent-cyan);
      border: 2px solid var(--bg);
      box-shadow: 0 0 8px var(--accent-cyan);
    }
    .tl-role {
      font-size: 12.5px;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .tl-period {
      font-size: 9.5px;
      font-family: 'Fira Code', monospace;
      color: var(--text-dim);
      font-weight: 500;
    }
    .tl-company {
      font-size: 11px;
      font-weight: 600;
      color: var(--accent-cyan);
      margin-bottom: 3px;
    }
    .tl-bullets {
      list-style: none;
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.35;
    }
    .tl-bullets li {
      position: relative;
      padding-left: 12px;
      margin-bottom: 2px;
    }
    .tl-bullets li::before {
      content: '›';
      position: absolute;
      left: 0;
      color: var(--accent-cyan);
      font-weight: bold;
    }

    /* TAG CLOUD */
    .tag-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .tag {
      font-size: 9.5px;
      font-family: 'Fira Code', monospace;
      padding: 3px 6px;
      border-radius: 4px;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid var(--card-border);
      color: #cbd5e1;
    }

    /* FOOTER */
    .dossier-footer {
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      color: var(--text-dim);
      font-family: 'Fira Code', monospace;
    }

    /* PRINT STYLES */
    @media print {
      .toolbar {
        display: none !important;
      }
      body {
        background: #ffffff !important;
        color: #0f172a !important;
        padding: 0 !important;
      }
      .sheet-container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .sheet {
        background: #ffffff !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .sheet::before {
        display: none !important;
      }
      .stat-card, .lic-badge, .edu-card {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
      }
      .headshot-wrap {
        border-color: #0891b2 !important;
        box-shadow: none !important;
      }
      .header-details h1, .sec-title, .tl-role, .edu-degree {
        color: #0f172a !important;
      }
      .header-details .subtitle, .tl-company, .edu-school {
        color: #0891b2 !important;
      }
      .stat-number {
        color: #0891b2 !important;
      }
      .tag {
        background: #f1f5f9 !important;
        border-color: #e2e8f0 !important;
        color: #334155 !important;
      }
      .contact-chip {
        background: #f1f5f9 !important;
        border-color: #e2e8f0 !important;
        color: #475569 !important;
      }
      .meter-bar {
        background: #e2e8f0 !important;
      }
      .meter-fill {
        background: #0891b2 !important;
      }
    }
  </style>
</head>
<body class="${theme === 'light' ? 'theme-light' : ''}">

  <!-- Interactive Print & Theme Toolbar (Hidden during actual print) -->
  <div class="toolbar">
    <div class="toolbar-title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      <span>Nicholas J. Kraemer – Executive Dossier & Infographic Profile</span>
    </div>
    <div class="toolbar-actions">
      <button class="btn btn-secondary" onclick="toggleTheme()">
        <span id="themeLabel">${theme === 'light' ? '🌙 Switch to Dark Theme' : '☀️ Switch to Light Theme'}</span>
      </button>
      <button class="btn btn-primary" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        <span>Print to PDF / Save</span>
      </button>
      <button class="btn btn-secondary" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="sheet-container">
    <div class="sheet">
      
      <!-- EXECUTIVE HEADER -->
      <div class="header-grid">
        <div class="headshot-wrap">
          <img src="${headshotUrl}" alt="Nicholas J. Kraemer" class="headshot-img" onerror="this.src='${origin}/headshot_nick.png'" />
        </div>
        <div class="header-details">
          <h1>Nicholas J. Kraemer</h1>
          <div class="subtitle">Fractional CFO • CTO • General B Contractor • AI & Operations Architect</div>
          <div class="contact-chips">
            <div class="contact-chip">📍 San Francisco, CA & Costa Rica</div>
            <div class="contact-chip">✉️ nick@lockboxpm.com</div>
            <div class="contact-chip">🌐 lockboxpm.com</div>
            <div class="contact-chip">📞 +1 (650) 450-0238</div>
            <div class="contact-chip">🌎 English (Native) / Spanish (Fluent)</div>
          </div>
        </div>
      </div>

      <!-- KPI METRIC DASHBOARD -->
      <div class="stat-strip">
        <div class="stat-card">
          <div class="stat-number">25+</div>
          <div class="stat-label">Years Leadership</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">$500M+</div>
          <div class="stat-label">Capital & Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">1,000+</div>
          <div class="stat-label">Certified Dives</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">150%</div>
          <div class="stat-label">Revenue Growth Scaled</div>
        </div>
      </div>

      <!-- CREDENTIALS & LICENSES MATRIX -->
      <div class="sec-title">Licensure & Authority Matrix</div>
      <div class="badge-matrix">
        <div class="lic-badge">
          <div class="lic-icon">🏗️</div>
          <div>
            <div class="lic-title">General B Contractor</div>
            <div class="lic-sub">CA License B382267 (Active)</div>
          </div>
        </div>
        <div class="lic-badge">
          <div class="lic-icon">🏠</div>
          <div>
            <div class="lic-title">California Broker (Retired)</div>
            <div class="lic-sub">DRE #01887570 (Exp. 07/2026)</div>
          </div>
        </div>
        <div class="lic-badge">
          <div class="lic-icon">🤿</div>
          <div>
            <div class="lic-title">SSI Open Water Instructor</div>
            <div class="lic-sub">Worldwide Commercial & Arch.</div>
          </div>
        </div>
        <div class="lic-badge">
          <div class="lic-icon">🚑</div>
          <div>
            <div class="lic-title">EMT & First Responder</div>
            <div class="lic-sub">Golden Gate Bridge Corridor</div>
          </div>
        </div>
        <div class="lic-badge">
          <div class="lic-icon">✈️</div>
          <div>
            <div class="lic-title">FAA Student Pilot</div>
            <div class="lic-sub">Cert #FF-0219426</div>
          </div>
        </div>
        <div class="lic-badge">
          <div class="lic-icon">🎓</div>
          <div>
            <div class="lic-title">BS Mathematics</div>
            <div class="lic-sub">Univ. of San Francisco (2002-2005)</div>
          </div>
        </div>
      </div>

      <!-- 2-COLUMN INFOGRAPHIC BODY -->
      <div class="body-grid">
        
        <!-- LEFT COLUMN -->
        <div>
          <div class="sec-title">Core Competencies</div>
          
          <div class="skill-group">
            <div class="skill-name"><span>Financial Modeling & Forecasting (VaR, ARIMA)</span><span>98%</span></div>
            <div class="meter-bar"><div class="meter-fill" style="width: 98%;"></div></div>
          </div>
          <div class="skill-group">
            <div class="skill-name"><span>Enterprise ERP (SAP, Oracle, Kyriba, Adaptive)</span><span>96%</span></div>
            <div class="meter-bar"><div class="meter-fill" style="width: 96%;"></div></div>
          </div>
          <div class="skill-group">
            <div class="skill-name"><span>AI Automation & Agentic Workflows (Gemini/Python)</span><span>95%</span></div>
            <div class="meter-bar"><div class="meter-fill" style="width: 95%;"></div></div>
          </div>
          <div class="skill-group">
            <div class="skill-name"><span>General Contracting & Materials Logistics</span><span>94%</span></div>
            <div class="meter-bar"><div class="meter-fill" style="width: 94%;"></div></div>
          </div>
          <div class="skill-group">
            <div class="skill-name"><span>Crisis Negotiation & Emergency Command</span><span>92%</span></div>
            <div class="meter-bar"><div class="meter-fill" style="width: 92%;"></div></div>
          </div>

          <div class="sec-title" style="margin-top: 20px;">Education & Honors</div>
          <div class="edu-card">
            <div class="edu-degree">BS Mathematics</div>
            <div class="edu-school">University of San Francisco</div>
            <div class="edu-year">2002 – 2005</div>
            <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 3px;">Specialized in advanced mathematical modeling, statistical analysis, and linear optimization.</div>
          </div>
          <div class="edu-card">
            <div class="edu-degree">AA Economics</div>
            <div class="edu-school">Santa Barbara City College</div>
            <div class="edu-year">2000 – 2002</div>
            <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 3px;">Microeconomics and macroeconomics principles & market dynamics.</div>
          </div>

          <div class="sec-title" style="margin-top: 20px;">Enterprise & Tech Stack</div>
          <div class="tag-cloud">
            <span class="tag">SAP</span>
            <span class="tag">Oracle Financials</span>
            <span class="tag">Adaptive Insights</span>
            <span class="tag">Kyriba</span>
            <span class="tag">Tableau</span>
            <span class="tag">Yardi Voyager</span>
            <span class="tag">AppFolio</span>
            <span class="tag">Stripe API</span>
            <span class="tag">Python</span>
            <span class="tag">Docker / Compose</span>
            <span class="tag">Node.js</span>
            <span class="tag">Linux Systems</span>
            <span class="tag">Caddy Proxy</span>
            <span class="tag">Merlin PM</span>
            <span class="tag">1031 Exchange</span>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div>
          <div class="sec-title">Executive Career Timeline</div>
          <div class="timeline">
            
            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-role"><span>Technical Director & President</span><span class="tl-period">2020 – PRESENT</span></div>
              <div class="tl-company">Selva Oculta de Sueños, SRL • Costa Rica</div>
              <ul class="tl-bullets">
                <li>Lead technical infrastructure and research initiatives for nature-inspired products.</li>
                <li>Spearheaded development of Puma Mala wellness center in Ojochal, Costa Rica.</li>
                <li>Direct cross-border financial governance, international logistics, and operations.</li>
              </ul>
            </div>

            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-role"><span>CEO & Founder</span><span class="tl-period">2019 – PRESENT</span></div>
              <div class="tl-company">My Digital Security Pro, LLC • NV & CA</div>
              <ul class="tl-bullets">
                <li>Direct product development, enterprise cybersecurity architecture, operations, and finance.</li>
                <li>Lead sales expansion and automated service delivery platforms.</li>
              </ul>
            </div>

            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-role"><span>Partner</span><span class="tl-period">2010 – PRESENT</span></div>
              <div class="tl-company">Doorman Property Management • San Francisco, CA</div>
              <ul class="tl-bullets">
                <li>Ascertain, negotiate, and execute property management and construction contracts.</li>
                <li>Oversee comprehensive accounting, budgeting, payroll, and capital expenditure forecasting.</li>
                <li>Plan and supervise residential & commercial building improvement projects.</li>
              </ul>
            </div>

            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-role"><span>Operator / First Responder & Crisis Negotiator</span><span class="tl-period">2005 – PRESENT</span></div>
              <div class="tl-company">Golden Gate Bridge Highway & Transportation District</div>
              <ul class="tl-bullets">
                <li>First responder to roadway and medical emergencies in the Golden Gate corridor.</li>
                <li>Certified crisis intervention and suicide negotiation specialist.</li>
                <li>Firefighting suppression, vehicle extrication, and traffic incident command.</li>
              </ul>
            </div>

            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-role"><span>Brokerage Director & VP</span><span class="tl-period">2022 – 2024</span></div>
              <div class="tl-company">Martello Group • California</div>
              <ul class="tl-bullets">
                <li>Optimized project profitability by deploying SAP advanced financial analysis tools.</li>
                <li>Implemented Kyriba treasury management system to optimize multimillion-dollar liquidity.</li>
                <li>Constructed comprehensive risk models (Value at Risk, liquidity stress testing).</li>
              </ul>
            </div>

            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-role"><span>CEO</span><span class="tl-period">2010 – 2022</span></div>
              <div class="tl-company">Onsite Property Systems • California</div>
              <ul class="tl-bullets">
                <li>Orchestrated 150% company revenue expansion through advanced financial forecasting.</li>
                <li>Implemented corporate planning in Adaptive Insights and Tableau visualization dashboards.</li>
              </ul>
            </div>

            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-role"><span>CTO</span><span class="tl-period">2014 – 2019</span></div>
              <div class="tl-company">PRISM PROJECTS • Worldwide</div>
              <ul class="tl-bullets">
                <li>Architected AI-driven business automation and full-stack web applications.</li>
                <li>Supervised engineering team delivering mission-critical client software.</li>
              </ul>
            </div>

            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-role"><span>SSI Open Water Scuba Instructor</span><span class="tl-period">2014 – PRESENT</span></div>
              <div class="tl-company">Worldwide Private Instruction</div>
              <ul class="tl-bullets">
                <li>1,000+ logged dives across open ocean, commercial, and underwater archeology expeditions.</li>
              </ul>
            </div>

          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="dossier-footer">
        <span>OFFICIAL EXECUTIVE DOSSIER • LOCKBOX PORTFOLIO MANAGEMENT</span>
        <span>VERIFIED RECORD: CA DRE #01887570 (EXP. 07/2026) • CSLB #B382267</span>
        <span>HTTPS://LOCKBOXPM.COM</span>
      </div>

    </div>
  </div>

  <script>
    function toggleTheme() {
      document.body.classList.toggle('theme-light');
      const isLight = document.body.classList.contains('theme-light');
      document.getElementById('themeLabel').innerText = isLight ? '🌙 Switch to Dark Theme' : '☀️ Switch to Light Theme';
    }

    ${autoPrint ? `
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 700);
    });
    ` : ''}
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
