import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/index.css";

// ─── FRAUD DATA ───────────────────────────────────────────────────────────────
const FRAUD_CASES = [
  {
    id: 1,
    type: "UPI Phishing",
    severity: "HIGH",
    icon: "📱",
    title: "Fake KYC Update Scam — Mumbai",
    location: "Mumbai, Maharashtra",
    lat: 19.076,
    lng: 72.877,
    amount: "₹1.2 Lakh",
    date: "March 2026",
    story:
      "A freelance designer received a call from someone posing as an SBI representative claiming his KYC had expired. The caller sent a link to a fake bank website — identical to the real one — and even used an AI deepfaked customer service video to build trust. After the victim entered his credentials, ₹1.2 lakh was drained instantly.",
    howItWorks: [
      "Fraudster impersonates bank official via phone",
      "Sends fake KYC update link via SMS/WhatsApp",
      "Victim enters banking credentials on fake site",
      "Account drained within seconds",
    ],
    tips: [
      "Banks NEVER ask for OTP or PIN over calls",
      "Always type bank URLs manually — never click links",
      "Check URL carefully for misspellings (e.g. sbi-bank.in vs sbi.co.in)",
    ],
    source: "NASSCOM-DSCI Research, 2025",
  },
  {
    id: 2,
    type: "SIM Swap",
    severity: "CRITICAL",
    icon: "📡",
    title: "SIM Swap FD Theft — Kolkata",
    location: "Kolkata, West Bengal",
    lat: 22.572,
    lng: 88.363,
    amount: "₹20 Lakh",
    date: "January 2026",
    story:
      "A retired bank employee lost ₹20 lakh from his fixed deposit through a SIM swap scam. Fraudsters presented fake documents to a telecom outlet to get a duplicate SIM. His phone stopped working one morning — thinking it was a network glitch, he waited. By the time he visited a store, fraudsters had already used OTPs from the cloned SIM to empty his joint FD account.",
    howItWorks: [
      "Fraudster collects victim's personal data (Aadhaar, name, DOB)",
      "Visits telecom store with fake ID to get duplicate SIM",
      "Original SIM loses signal — victim thinks it's network issue",
      "Fraudster receives all OTPs and clears bank accounts",
    ],
    tips: [
      "If your SIM stops working suddenly, call your telecom provider immediately",
      "Enable email alerts for all banking transactions",
      "Use a separate number for banking that you don't share publicly",
    ],
    source: "Razorpay Fraud Report, 2025",
  },
  {
    id: 3,
    type: "Synthetic Identity",
    severity: "HIGH",
    icon: "🤖",
    title: "AI-Generated Fake IDs Fraud Ring — Bengaluru",
    location: "Bengaluru, Karnataka",
    lat: 12.971,
    lng: 77.594,
    amount: "₹4 Crore",
    date: "February 2026",
    story:
      "A fraud ring in Bengaluru created over 200 synthetic identities using AI-generated PAN cards and stitched Aadhaar details. These fake IDs passed e-KYC verification, borrowed micro-credits from 5 fintech lenders, established repayment credibility, and then defaulted — vanishing with a combined ₹4 crore. Frauds were detected only months later.",
    howItWorks: [
      "AI tools generate realistic-looking PAN & Aadhaar documents",
      "Fake identities pass automated e-KYC verification",
      "Small loans taken and repaid to build trust score",
      "Large loans taken and defaulted — fraudsters disappear",
    ],
    tips: [
      "Verify any loan offer via RBI's registered NBFC list",
      "Never share your Aadhaar OTP with any lender app",
      "Report suspicious loan apps to cybercrime.gov.in",
    ],
    source: "JISA Softech Research, August 2025",
  },
  {
    id: 4,
    type: "Vishing",
    severity: "HIGH",
    icon: "📞",
    title: "Fake Bank Official Call Scam — Delhi NCR",
    location: "Delhi NCR",
    lat: 28.613,
    lng: 77.209,
    amount: "₹48,000",
    date: "December 2025",
    story:
      "Riya, a 24-year-old professional, received a call from a 'bank official' warning her of suspicious activity on her account. The caller knew her name, last 4 digits of her card, and even her recent transaction. Panicked, she shared an OTP to 'verify her identity'. ₹48,000 vanished within seconds. The caller had bought her partial data from a data broker.",
    howItWorks: [
      "Fraudster buys partial victim data from underground markets",
      "Calls victim impersonating bank, creates urgency/panic",
      "Asks for OTP to 'verify identity' or 'block suspicious transaction'",
      "Uses OTP to authorize transfer from victim's account",
    ],
    tips: [
      "No bank ever asks for OTP over a call — hang up immediately",
      "Call back your bank on the official number printed on your card",
      "Fraudsters create urgency — slow down and verify first",
    ],
    source: "Upstox Banking Report, FY25",
  },
  {
    id: 5,
    type: "OTP Bot Fraud",
    severity: "CRITICAL",
    icon: "🤖",
    title: "OTP-Sharing Bot Attack — Pune",
    location: "Pune, Maharashtra",
    lat: 18.52,
    lng: 73.856,
    amount: "₹85,000",
    date: "November 2025",
    story:
      "A student in Pune downloaded what appeared to be a legitimate 'study planner' app from a third-party site. The app silently installed malware that intercepted SMS messages. When the victim later used net banking, the malware redirected OTPs to fraudsters who drained ₹85,000. The RBI reported ATO (Account Takeover) frauds rose 310% YoY in June 2025.",
    howItWorks: [
      "Malicious app downloaded from unofficial source",
      "App gains SMS read permission silently",
      "OTPs are intercepted and forwarded to fraudster in real-time",
      "Fraudster logs into victim's banking app and transfers funds",
    ],
    tips: [
      "Only install apps from Google Play Store or Apple App Store",
      "Revoke SMS permissions from apps that don't need them",
      "Check your phone's app permissions regularly",
    ],
    source: "RBI Bulletin, June 2025",
  },
  {
    id: 6,
    type: "QR Code Fraud",
    severity: "MEDIUM",
    icon: "📷",
    title: "Tampered QR Code Scam — Ahmedabad",
    location: "Ahmedabad, Gujarat",
    lat: 23.022,
    lng: 72.571,
    amount: "₹12,000",
    date: "October 2025",
    story:
      "A shopkeeper in Ahmedabad noticed his daily UPI collections had dropped suddenly. Investigation revealed that fraudsters had pasted their own QR code stickers over his at the counter. Dozens of customers had unknowingly paid into the fraudster's account. Gujarat reported 3,800 cybercrime cases in 2025 with UPI fraud rising 85%.",
    howItWorks: [
      "Fraudster prints QR code sticker with their own UPI ID",
      "Sticker is placed over real merchant QR code at shops/parking",
      "Customers scan and pay — money goes to fraudster",
      "Merchant discovers discrepancy only after counting collections",
    ],
    tips: [
      "Always verify merchant name shown after scanning QR code",
      "Check for stickers pasted on top of original QR codes",
      "Pay small amount first and verify before paying full amount",
    ],
    source: "India Data Map, Fraud Analysis 2025",
  },
  {
    id: 7,
    type: "Digital Arrest",
    severity: "CRITICAL",
    icon: "👮",
    title: "'Digital Arrest' Extortion Scam — Chennai",
    location: "Chennai, Tamil Nadu",
    lat: 13.082,
    lng: 80.27,
    amount: "₹3.5 Lakh",
    date: "February 2026",
    story:
      "A retired teacher received a video call from people in police uniforms claiming she was implicated in a money laundering case. They kept her on a continuous video call for 9 hours — a 'digital arrest' — threatening her with immediate physical arrest unless she transferred funds to 'clear her name'. She transferred ₹3.5 lakh before her son intervened. Cross-border scam rings in Southeast Asia lost Indians ₹8,500 crore in H1 2025.",
    howItWorks: [
      "Fraudster calls on WhatsApp/Skype in police/CBI uniform",
      "Claims victim is linked to criminal case — creates extreme fear",
      "Keeps victim on video call for hours (digital arrest)",
      "Demands fund transfer to 'clear name' or 'secure bail'",
    ],
    tips: [
      "No real police or CBI conducts arrests over video calls",
      "Disconnect immediately and call 1930 (Cyber Helpline)",
      "Real government agencies send written notices — not video calls",
    ],
    source: "Whalesbook India Fraud Report, March 2026",
  },
  {
    id: 8,
    type: "Screen Share Fraud",
    severity: "HIGH",
    icon: "🖥️",
    title: "AnyDesk Remote Access Scam — Hyderabad",
    location: "Hyderabad, Telangana",
    lat: 17.385,
    lng: 78.486,
    amount: "₹2.8 Lakh",
    date: "January 2026",
    story:
      "A businessman searched online for his bank's customer care number to resolve a failed UPI transfer. The top search result showed a fake number. When he called, the 'support agent' asked him to install AnyDesk for 'remote assistance'. Once installed, the agent could see his full screen, watched him enter his banking password, and transferred ₹2.8 lakh before the victim realised.",
    howItWorks: [
      "Fraudster posts fake customer care numbers on Google/social media",
      "Victim calls fake helpline believing it's official support",
      "Agent asks victim to install AnyDesk/TeamViewer for 'assistance'",
      "Agent watches screen, captures credentials, transfers funds",
    ],
    tips: [
      "Never install screen-sharing apps at a stranger's request",
      "Get customer care numbers only from the back of your card or official app",
      "No legitimate bank requires remote access to your phone",
    ],
    source: "IDFC First Bank Security Advisory, 2025",
  },
];

const SEVERITY_CONFIG = {
  CRITICAL: {
    color: "#e53e3e",
    bg: "#fff5f5",
    border: "#fed7d7",
    label: "CRITICAL",
    dot: "#e53e3e",
  },
  HIGH: {
    color: "#dd6b20",
    bg: "#fffaf0",
    border: "#fbd38d",
    label: "HIGH RISK",
    dot: "#dd6b20",
  },
  MEDIUM: {
    color: "#d69e2e",
    bg: "#fffff0",
    border: "#faf089",
    label: "MEDIUM",
    dot: "#d69e2e",
  },
};

const TYPE_FILTERS = [
  "All",
  "UPI Phishing",
  "SIM Swap",
  "Vishing",
  "QR Code Fraud",
  "Digital Arrest",
  "Screen Share Fraud",
  "OTP Bot Fraud",
  "Synthetic Identity",
];

const EMERGENCY_CONTACTS = [
  {
    icon: "🚨",
    service: "Cyber Crime Reporting",
    platform: "National Cyber Crime Portal",
    value: "cybercrime.gov.in",
    url: "https://cybercrime.gov.in",
    color: "#e53e3e",
    bg: "#fff5f5",
    border: "#fed7d7",
    steps: [
      "Go to cybercrime.gov.in",
      "Click 'File a Complaint'",
      "Select 'Financial Fraud'",
      "Fill details & submit — get acknowledgement number",
    ],
  },
  {
    icon: "📞",
    service: "Emergency Helpline",
    platform: "National Cyber Helpline (India)",
    value: "Call 1930",
    url: null,
    color: "#2b6cb0",
    bg: "#ebf8ff",
    border: "#bee3f8",
    steps: [
      "Dial 1930 from any phone — available 24×7",
      "State your bank name and amount lost",
      "Get a complaint reference number",
      "Follow up with your bank to freeze the transaction",
    ],
  },
  {
    icon: "🏦",
    service: "Banking Complaints (RBI)",
    platform: "RBI CMS — Complaint Management System",
    value: "cms.rbi.org.in",
    url: "https://cms.rbi.org.in",
    color: "#276749",
    bg: "#f0fff4",
    border: "#9ae6b4",
    steps: [
      "Visit cms.rbi.org.in",
      "Click 'File a Complaint'",
      "Choose your bank from the list",
      "Describe the fraud with transaction details & submit",
    ],
  },
  {
    icon: "💳",
    service: "Payment / UPI Complaints",
    platform: "NPCI — National Payments Corporation",
    value: "npci.org.in",
    url: "https://www.npci.org.in",
    color: "#553c9a",
    bg: "#faf5ff",
    border: "#d6bcfa",
    steps: [
      "Visit npci.org.in → 'What We Do' → UPI",
      "Use 'Raise a Dispute' through your UPI app first",
      "If unresolved, escalate via NPCI portal",
      "Attach payment screenshots and UPI transaction ID",
    ],
  },
];

const PROTECTION_TIPS = [
  {
    icon: "📱",
    title: "UPI & Digital Payments",
    color: "#2b6cb0",
    bg: "#ebf8ff",
    border: "#bee3f8",
    tips: [
      "Never share UPI PIN, OTP, or CVV with anyone — not even bank officials",
      "Always verify merchant name before confirming UPI payment",
      "Disable UPI collect requests on your app settings",
      "Use BHIM app with biometric login for extra security",
      "Report UPI fraud within 3 days for refund eligibility",
    ],
  },
  {
    icon: "📞",
    title: "Phone & Call Safety",
    color: "#e53e3e",
    bg: "#fff5f5",
    border: "#fed7d7",
    tips: [
      "Hang up immediately if someone claims to be police/CBI on video call",
      "Never install AnyDesk or TeamViewer at a caller's request",
      "Get customer care numbers from card back or official app only",
      "No real officer conducts a 'digital arrest' — it's always fraud",
      "Use Truecaller to identify spam calls before answering",
    ],
  },
  {
    icon: "🔗",
    title: "Links & Websites",
    color: "#553c9a",
    bg: "#faf5ff",
    border: "#d6bcfa",
    tips: [
      "Never click banking links from SMS, WhatsApp, or email",
      "Type bank URLs directly in browser — never rely on search results",
      "Check for HTTPS and verify domain spelling before entering details",
      "Fake sites look identical — always verify the full URL",
      "Enable Google Safe Browsing on your phone's browser",
    ],
  },
  {
    icon: "📡",
    title: "SIM & Network Safety",
    color: "#276749",
    bg: "#f0fff4",
    border: "#9ae6b4",
    tips: [
      "If your SIM stops working suddenly, call telecom provider immediately",
      "Use a separate number for banking — don't share it publicly",
      "Enable email alerts for all banking transactions as backup",
      "Contact your bank to freeze account if SIM is suddenly inactive",
      "Set a SIM card PIN from your phone's security settings",
    ],
  },
  {
    icon: "📲",
    title: "Apps & Device Safety",
    color: "#c05621",
    bg: "#fffaf0",
    border: "#fbd38d",
    tips: [
      "Only install apps from Google Play Store or Apple App Store",
      "Regularly review and revoke SMS permissions from suspicious apps",
      "Keep your phone OS and banking apps always updated",
      "Use a separate, secure email for banking communications",
      "Enable two-factor authentication on all banking apps",
    ],
  },
  {
    icon: "📋",
    title: "KYC & Documents",
    color: "#97266d",
    bg: "#fff5f7",
    border: "#fbb6ce",
    tips: [
      "Banks never request KYC updates over calls or SMS links",
      "Never share Aadhaar OTP with any app or website",
      "Verify lender registration on RBI's official NBFC list",
      "Mask your Aadhaar number when sharing physical copies",
      "Regularly check your CIBIL report for unauthorized loans",
    ],
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FraudAwarenessHub() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeTab, setActiveTab] = useState("news");
  const [animatedStats, setAnimatedStats] = useState({ cases: 0, amount: 0 });
  const [expandedContact, setExpandedContact] = useState(null);

  useEffect(() => {
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const p = step / steps;
      setAnimatedStats({
        cases: Math.round(1064000 * p),
        amount: Math.round(36014 * p),
      });
      if (step >= steps) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, []);

  const filtered =
    activeFilter === "All"
      ? FRAUD_CASES
      : FRAUD_CASES.filter((c) => c.type === activeFilter);

  return (
    <div style={s.page}>
      <nav className="index-nav">
        <div className="nav-container">
          <Link to="/">
            <div className="nav-logo">
              <span className="nav-logo-icon">💳</span>
              <span className="nav-logo-text">FinBridge</span>
            </div>
          </Link>

          <div className="nav-links">
            <Link to="/#features" className="nav-link">
              Features
            </Link>
            <Link to="/#how-it-works" className="nav-link">
              How It Works
            </Link>
            <Link to="/fraud-awareness" className="nav-link">
              Fraud Awareness
            </Link>

            <div className="nav-buttons">
              <button
                className="nav-link fraud-btn"
                onClick={() => navigate("/fraud-awareness")}
              >
                <span className="fraud-icon">⚡</span>
                Fraud Checker
              </button>
            </div>
          </div>

          <div className="nav-buttons">
            <button
              className="nav-button login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="nav-button signup-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* ── Alert Banner ── */}
      <div style={s.alertBanner}>
        <span style={s.pulse} />
        <span style={s.alertText}>
          🚨 RBI Alert: ₹36,014 crore lost to bank frauds in FY25 — a 3×
          increase. Stay informed, stay safe.
        </span>
        <span style={s.pulse} />
      </div>

      {/* ── Hero Header ── */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroLeft}>
            <div style={s.heroBadge}>🛡️ Financial Safety Hub</div>
            <h1 style={s.heroTitle}>
              India Bank Fraud
              <br />
              <span style={s.heroAccent}>Awareness Centre</span>
            </h1>
            <p style={s.heroDesc}>
              Real fraud cases. Real locations. Verified protection steps.
              <br />
              Updated March 2026 — based on RBI, NASSCOM & NPCI data.
            </p>
          </div>

          {/* Stat cards */}
          <div style={s.statGrid}>
            <div style={s.statBox}>
              <div style={s.statIcon}>📊</div>
              <div style={s.statNum}>
                {(animatedStats.cases / 100000).toFixed(1)}L+
              </div>
              <div style={s.statLbl}>UPI Fraud Cases FY25</div>
            </div>
            <div
              style={{
                ...s.statBox,
                background: "#fff5f5",
                border: "1px solid #fed7d7",
              }}
            >
              <div style={s.statIcon}>💸</div>
              <div style={{ ...s.statNum, color: "#e53e3e" }}>
                ₹{animatedStats.amount.toLocaleString()}Cr
              </div>
              <div style={s.statLbl}>Total Bank Fraud Loss</div>
            </div>
            <div
              style={{
                ...s.statBox,
                background: "#f0fff4",
                border: "1px solid #9ae6b4",
              }}
            >
              <div style={s.statIcon}>📞</div>
              <div style={{ ...s.statNum, color: "#276749" }}>1930</div>
              <div style={s.statLbl}>Cyber Crime Helpline</div>
            </div>
            <div
              style={{
                ...s.statBox,
                background: "#faf5ff",
                border: "1px solid #d6bcfa",
              }}
            >
              <div style={s.statIcon}>📈</div>
              <div style={{ ...s.statNum, color: "#553c9a" }}>85%</div>
              <div style={s.statLbl}>Rise in UPI Frauds YoY</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={s.tabBar}>
        <div style={s.tabInner}>
          {[
            { key: "news", label: "📰 Fraud Cases" },
            { key: "map", label: "🗺️ Fraud Map" },
            { key: "tips", label: "🛡️ Protection Guide" },
            { key: "report", label: "🚨 Report Fraud" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                ...s.tabBtn,
                ...(activeTab === t.key ? s.tabActive : {}),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ TAB: FRAUD CASES ══ */}
      {activeTab === "news" && (
        <div style={s.section}>
          <div style={s.filterRow}>
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{ ...s.chip, ...(activeFilter === f ? s.chipOn : {}) }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={s.cardsGrid}>
            {filtered.map((c) => {
              const sev = SEVERITY_CONFIG[c.severity];
              const open = selectedCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(open ? null : c)}
                  style={{
                    ...s.card,
                    borderLeft: `5px solid ${sev.color}`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      ...s.cardTopBadge,
                      background: sev.bg,
                      color: sev.color,
                      border: `1px solid ${sev.border}`,
                    }}
                  >
                    <span style={{ ...s.dot, background: sev.dot }} />
                    {sev.label}
                  </div>
                  <div style={s.cardHead}>
                    <span style={s.cardIcon}>{c.icon}</span>
                    <div>
                      <div style={s.cardType}>{c.type}</div>
                      <div style={s.cardTitle}>{c.title}</div>
                    </div>
                  </div>
                  <div style={s.metaRow}>
                    <span style={s.metaTag}>📍 {c.location}</span>
                    <span
                      style={{
                        ...s.metaTag,
                        color: "#e53e3e",
                        background: "#fff5f5",
                      }}
                    >
                      💸 {c.amount}
                    </span>
                    <span style={s.metaTag}>🗓 {c.date}</span>
                  </div>
                  <p style={s.story}>{c.story}</p>

                  {open && (
                    <div style={s.expandBox}>
                      <div style={s.expandBlock}>
                        <div style={s.expandHead}>⚙️ How This Scam Works</div>
                        <ol
                          style={{ margin: 0, padding: 0, listStyle: "none" }}
                        >
                          {c.howItWorks.map((step, i) => (
                            <li key={i} style={s.stepRow}>
                              <span style={s.stepNum}>{i + 1}</span>
                              <span style={s.stepText}>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div style={s.expandBlock}>
                        <div style={s.expandHead}>
                          🛡️ How to Protect Yourself
                        </div>
                        {c.tips.map((tip, i) => (
                          <div key={i} style={s.tipRow}>
                            <span style={s.checkMark}>✓</span>
                            <span style={s.tipText}>{tip}</span>
                          </div>
                        ))}
                      </div>
                      <div style={s.sourceTag}>📎 Source: {c.source}</div>
                    </div>
                  )}
                  <div style={s.hintBar}>
                    {open
                      ? "▲ Show less"
                      : "▼ Read full case + protection tips"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ TAB: MAP ══ */}
      {activeTab === "map" && (
        <div style={s.section}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h3 style={s.secTitle}>🗺️ India Fraud Hotspot Map</h3>
            <p style={s.secSub}>
              Click any pin to see the fraud case from that location
            </p>
          </div>
          <div style={s.mapWrap}>
            <IndiaFraudMap
              cases={FRAUD_CASES}
              onSelect={setSelectedCase}
              selected={selectedCase}
            />
          </div>
          {selectedCase && (
            <div style={s.mapDetail}>
              <div style={s.mapDetailTop}>
                <span style={s.cardIcon}>{selectedCase.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={s.cardType}>{selectedCase.type}</div>
                  <div style={s.cardTitle}>{selectedCase.title}</div>
                  <div style={s.metaRow}>
                    <span style={s.metaTag}>📍 {selectedCase.location}</span>
                    <span
                      style={{
                        ...s.metaTag,
                        color: "#e53e3e",
                        background: "#fff5f5",
                      }}
                    >
                      💸 {selectedCase.amount}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  style={s.closeBtn}
                >
                  ✕
                </button>
              </div>
              <p style={{ ...s.story, marginTop: 10 }}>{selectedCase.story}</p>
              <div style={s.expandHead}>🛡️ Quick Protection Tips</div>
              {selectedCase.tips.map((tip, i) => (
                <div key={i} style={s.tipRow}>
                  <span style={s.checkMark}>✓</span>
                  <span style={s.tipText}>{tip}</span>
                </div>
              ))}
            </div>
          )}
          <div style={s.legendRow}>
            {Object.entries(SEVERITY_CONFIG).map(([k, v]) => (
              <div key={k} style={s.legendItem}>
                <span
                  style={{
                    ...s.dot,
                    background: v.color,
                    width: 12,
                    height: 12,
                  }}
                />
                <span style={s.legendLbl}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB: PROTECTION TIPS ══ */}
      {activeTab === "tips" && (
        <div style={s.section}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h3 style={s.secTitle}>🛡️ Your Complete Fraud Protection Guide</h3>
            <p style={s.secSub}>
              Follow these rules to stay safe from all major fraud types in
              India
            </p>
          </div>
          <div style={s.tipsGrid}>
            {PROTECTION_TIPS.map((sec, i) => (
              <div
                key={i}
                style={{
                  ...s.tipCard,
                  border: `1.5px solid ${sec.border}`,
                  background: sec.bg,
                }}
              >
                <div style={{ ...s.tipCardIcon, background: "#fff" }}>
                  {sec.icon}
                </div>
                <div style={{ ...s.tipCardTitle, color: sec.color }}>
                  {sec.title}
                </div>
                {sec.tips.map((tip, j) => (
                  <div key={j} style={s.tipLine}>
                    <span style={{ ...s.checkMark, color: sec.color }}>✓</span>
                    <span style={s.tipText}>{tip}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB: REPORT FRAUD ══ */}
      {activeTab === "report" && (
        <div style={s.section}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h3 style={s.secTitle}>🚨 How to Report Bank Fraud in India</h3>
            <p style={s.secSub}>
              Act within 3 days — the faster you report, the better your chances
              of recovery
            </p>
          </div>

          {/* Timeline banner */}
          <div style={s.timelineBanner}>
            <div style={s.timelineStep}>
              <div style={s.tlCircle}>1</div>
              <div style={s.tlLabel}>
                Call 1930
                <br />
                <span style={s.tlSub}>Immediately</span>
              </div>
            </div>
            <div style={s.tlLine} />
            <div style={s.timelineStep}>
              <div style={s.tlCircle}>2</div>
              <div style={s.tlLabel}>
                Block Card/UPI
                <br />
                <span style={s.tlSub}>Within 1 hour</span>
              </div>
            </div>
            <div style={s.tlLine} />
            <div style={s.timelineStep}>
              <div style={s.tlCircle}>3</div>
              <div style={s.tlLabel}>
                File Online FIR
                <br />
                <span style={s.tlSub}>Within 24 hours</span>
              </div>
            </div>
            <div style={s.tlLine} />
            <div style={s.timelineStep}>
              <div style={s.tlCircle}>4</div>
              <div style={s.tlLabel}>
                RBI / NPCI
                <br />
                <span style={s.tlSub}>Within 3 days</span>
              </div>
            </div>
          </div>

          {/* Contact cards */}
          <div style={s.contactsGrid}>
            {EMERGENCY_CONTACTS.map((c, i) => (
              <div
                key={i}
                style={{
                  ...s.contactCard,
                  border: `2px solid ${c.border}`,
                  background: c.bg,
                }}
              >
                <div style={s.contactTop}>
                  <div style={{ ...s.contactIconBox, background: c.color }}>
                    <span style={{ fontSize: 24 }}>{c.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={s.contactService}>{c.service}</div>
                    <div style={{ ...s.contactPlatform, color: c.color }}>
                      {c.platform}
                    </div>
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...s.contactLink, color: c.color }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        🔗 {c.value} ↗
                      </a>
                    ) : (
                      <div style={{ ...s.contactLink, color: c.color }}>
                        📞 {c.value}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setExpandedContact(expandedContact === i ? null : i)
                  }
                  style={{
                    ...s.stepsBtn,
                    color: c.color,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  {expandedContact === i
                    ? "▲ Hide Steps"
                    : "▼ View Step-by-Step Guide"}
                </button>

                {expandedContact === i && (
                  <div style={s.stepsBox}>
                    <div style={s.stepsTitle}>Step-by-step:</div>
                    {c.steps.map((step, j) => (
                      <div key={j} style={s.stepRow}>
                        <span style={{ ...s.stepNum, background: c.color }}>
                          {j + 1}
                        </span>
                        <span style={s.stepText}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Important note */}
          <div style={s.noteBox}>
            <div style={s.noteTitle}>
              ⚠️ Important: What to Keep Ready Before Reporting
            </div>
            <div style={s.noteGrid}>
              {[
                "Transaction ID / UTR Number",
                "Date and time of fraud",
                "Bank account number & IFSC",
                "Screenshot of fraudulent message",
                "Fraudster's phone number or UPI ID",
                "Your registered mobile number",
              ].map((item, i) => (
                <div key={i} style={s.noteItem}>
                  <span style={s.checkMark}>✓</span>
                  <span style={s.tipText}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <p style={s.disclaimer}>
        * All fraud cases are based on publicly reported incidents and research
        data from RBI, NASSCOM, NPCI & cybersecurity firms. FinBridge does not
        store or share personal data. Always verify information with official
        sources.
      </p>
    </div>
  );
}

// ─── SVG INDIA MAP ────────────────────────────────────────────────────────────
function IndiaFraudMap({ cases, onSelect, selected }) {
  function toSVG(lat, lng) {
    return { x: ((lng - 68) / 29) * 500, y: ((37 - lat) / 29) * 400 };
  }
  return (
    <svg
      viewBox="0 0 500 420"
      style={{
        width: "100%",
        maxWidth: 620,
        margin: "0 auto",
        display: "block",
      }}
    >
      <rect width="500" height="420" fill="#f0f7ff" rx="16" />
      <path
        d="M 200 20 L 280 15 L 340 40 L 380 30 L 420 60 L 440 100 L 450 140 L 430 180 L 440 220 L 420 260 L 390 300 L 360 340 L 320 370 L 290 390 L 260 380 L 240 390 L 220 370 L 200 340 L 170 310 L 150 270 L 140 230 L 120 200 L 110 160 L 120 120 L 140 80 L 170 50 Z"
        fill="#dbeafe"
        stroke="#93c5fd"
        strokeWidth="1.5"
      />
      {[150, 200, 250, 300, 350].map((x) => (
        <line
          key={x}
          x1={x}
          y1="20"
          x2={x}
          y2="400"
          stroke="#bfdbfe"
          strokeWidth="0.4"
          strokeDasharray="4,4"
        />
      ))}
      {[100, 150, 200, 250, 300, 350].map((y) => (
        <line
          key={y}
          x1="100"
          y1={y}
          x2="460"
          y2={y}
          stroke="#bfdbfe"
          strokeWidth="0.4"
          strokeDasharray="4,4"
        />
      ))}
      {[
        { name: "Delhi", lat: 28.6, lng: 77.2 },
        { name: "Mumbai", lat: 19.1, lng: 72.9 },
        { name: "Bengaluru", lat: 12.9, lng: 77.6 },
        { name: "Kolkata", lat: 22.6, lng: 88.4 },
        { name: "Chennai", lat: 13.1, lng: 80.3 },
        { name: "Hyderabad", lat: 17.4, lng: 78.5 },
        { name: "Ahmedabad", lat: 23.0, lng: 72.6 },
        { name: "Pune", lat: 18.5, lng: 73.9 },
      ].map((city) => {
        const { x, y } = toSVG(city.lat, city.lng);
        return (
          <text
            key={city.name}
            x={x + 7}
            y={y + 4}
            fontSize="8"
            fill="#64748b"
            fontFamily="sans-serif"
          >
            {city.name}
          </text>
        );
      })}
      {cases.map((c) => {
        const { x, y } = toSVG(c.lat, c.lng);
        const sev = SEVERITY_CONFIG[c.severity];
        const sel = selected?.id === c.id;
        return (
          <g
            key={c.id}
            onClick={() => onSelect(sel ? null : c)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={x}
              cy={y}
              r={sel ? 22 : 15}
              fill={sev.color}
              opacity="0.12"
            />
            <circle
              cx={x}
              cy={y}
              r={sel ? 15 : 10}
              fill={sev.color}
              opacity="0.22"
            />
            <circle
              cx={x}
              cy={y}
              r={sel ? 10 : 7}
              fill={sev.color}
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize={sel ? "11" : "9"}
              fill="#fff"
            >
              {c.icon}
            </text>
            {sel && (
              <g>
                <rect
                  x={x - 30}
                  y={y - 30}
                  width="60"
                  height="18"
                  rx="5"
                  fill={sev.color}
                />
                <text
                  x={x}
                  y={y - 18}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#fff"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  {c.amount}
                </text>
              </g>
            )}
          </g>
        );
      })}
      <g transform="translate(466,28)">
        <circle
          cx="0"
          cy="0"
          r="15"
          fill="#fff"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        <text
          x="0"
          y="-5"
          textAnchor="middle"
          fontSize="8"
          fill="#334155"
          fontFamily="sans-serif"
        >
          N
        </text>
        <text
          x="0"
          y="12"
          textAnchor="middle"
          fontSize="6"
          fill="#94a3b8"
          fontFamily="sans-serif"
        >
          S
        </text>
        <line
          x1="0"
          y1="-11"
          x2="0"
          y2="-4"
          stroke="#e53e3e"
          strokeWidth="2.5"
        />
        <line x1="0" y1="4" x2="0" y2="11" stroke="#475569" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: "#f7fafc",
    minHeight: "100vh",
    paddingBottom: 48,
  },

  alertBanner: {
    background: "#fff5f5",
    borderBottom: "2px solid #fed7d7",
    color: "#c53030",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 14,
    fontWeight: 600,
    flexWrap: "wrap",
    textAlign: "center",
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#e53e3e",
    flexShrink: 0,
  },
  alertText: { lineHeight: 1.5 },

  hero: {
    background:
      "linear-gradient(135deg, #ebf8ff 0%, #e0f2fe 50%, #ede9fe 100%)",
    padding: "40px 24px 36px",
    borderBottom: "1px solid #bee3f8",
  },
  heroInner: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    gap: 32,
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLeft: { flex: "1 1 320px" },
  heroBadge: {
    display: "inline-block",
    background: "#2b6cb0",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    padding: "4px 14px",
    borderRadius: 20,
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: "clamp(24px,4vw,40px)",
    fontWeight: 800,
    color: "#1a202c",
    margin: "0 0 12px",
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  heroAccent: { color: "#2b6cb0" },
  heroDesc: { fontSize: 15, color: "#4a5568", lineHeight: 1.7, margin: 0 },

  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    flex: "1 1 280px",
    maxWidth: 380,
  },
  statBox: {
    background: "#ebf8ff",
    border: "1px solid #bee3f8",
    borderRadius: 14,
    padding: "16px 14px",
    textAlign: "center",
  },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statNum: {
    fontSize: 26,
    fontWeight: 800,
    color: "#2b6cb0",
    letterSpacing: -1,
    lineHeight: 1,
  },
  statLbl: {
    fontSize: 11,
    color: "#718096",
    marginTop: 4,
    fontWeight: 500,
    lineHeight: 1.3,
  },

  tabBar: {
    background: "#fff",
    borderBottom: "2px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  tabInner: {
    display: "flex",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    overflowX: "auto",
  },
  tabBtn: {
    padding: "15px 22px",
    border: "none",
    borderBottom: "3px solid transparent",
    background: "transparent",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    color: "#718096",
    whiteSpace: "nowrap",
    marginBottom: -2,
    outline: "none",
    transition: "all 0.2s",
  },
  tabActive: { color: "#2b6cb0", borderBottom: "3px solid #2b6cb0" },

  section: { maxWidth: 1100, margin: "0 auto", padding: "24px 24px 32px" },
  secTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: "#1a202c",
    margin: "0 0 8px",
  },
  secSub: { fontSize: 15, color: "#718096", margin: 0 },

  filterRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  chip: {
    padding: "6px 16px",
    borderRadius: 20,
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    fontSize: 13,
    cursor: "pointer",
    color: "#4a5568",
    fontWeight: 500,
    outline: "none",
    transition: "all 0.15s",
  },
  chipOn: {
    background: "#2b6cb0",
    color: "#fff",
    border: "1.5px solid #2b6cb0",
    fontWeight: 700,
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 18,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    position: "relative",
  },
  cardTopBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  dot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  cardHead: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  cardIcon: { fontSize: 30, flexShrink: 0, marginTop: 2 },
  cardType: {
    fontSize: 11,
    fontWeight: 700,
    color: "#a0aec0",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1a202c",
    lineHeight: 1.3,
  },
  metaRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  metaTag: {
    fontSize: 12,
    color: "#4a5568",
    background: "#f7fafc",
    border: "1px solid #e2e8f0",
    padding: "3px 10px",
    borderRadius: 10,
    fontWeight: 500,
  },
  story: { fontSize: 14, color: "#4a5568", lineHeight: 1.7, margin: 0 },

  expandBox: {
    background: "#f7fafc",
    borderRadius: 10,
    padding: 16,
    marginTop: 14,
  },
  expandBlock: { marginBottom: 14 },
  expandHead: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1a202c",
    marginBottom: 10,
  },
  stepRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  stepNum: {
    background: "#2b6cb0",
    color: "#fff",
    width: 20,
    height: 20,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  stepText: { fontSize: 13, color: "#4a5568", lineHeight: 1.5 },
  tipRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 7,
  },
  checkMark: {
    color: "#276749",
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0,
    marginTop: 1,
  },
  tipText: { fontSize: 13, color: "#4a5568", lineHeight: 1.6 },
  sourceTag: {
    fontSize: 11,
    color: "#a0aec0",
    fontStyle: "italic",
    marginTop: 6,
  },
  hintBar: {
    textAlign: "center",
    fontSize: 12,
    color: "#a0aec0",
    marginTop: 12,
    paddingTop: 10,
    borderTop: "1px dashed #e2e8f0",
  },

  mapWrap: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
    marginBottom: 16,
  },
  mapDetail: {
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    marginBottom: 16,
  },
  mapDetailTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 4,
  },
  closeBtn: {
    marginLeft: "auto",
    background: "#f7fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "50%",
    width: 30,
    height: 30,
    cursor: "pointer",
    fontSize: 13,
    color: "#718096",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  legendRow: {
    display: "flex",
    gap: 20,
    justifyContent: "center",
    flexWrap: "wrap",
    padding: "12px 0",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 13,
    color: "#4a5568",
  },
  legendLbl: { fontWeight: 600 },

  tipsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 18,
  },
  tipCard: { borderRadius: 14, padding: 20 },
  tipCardIcon: {
    fontSize: 28,
    width: 52,
    height: 52,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },
  tipCardTitle: { fontSize: 16, fontWeight: 800, marginBottom: 14 },
  tipLine: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },

  // REPORT TAB
  timelineBanner: {
    background: "#fff",
    borderRadius: 14,
    padding: "20px 24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 0,
    marginBottom: 28,
  },
  timelineStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "0 16px",
  },
  tlCircle: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#2b6cb0",
    color: "#fff",
    fontSize: 18,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tlLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1a202c",
    textAlign: "center",
    lineHeight: 1.4,
  },
  tlSub: { fontSize: 11, color: "#e53e3e", fontWeight: 600 },
  tlLine: { height: 2, width: 40, background: "#bee3f8", flexShrink: 0 },

  contactsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 18,
    marginBottom: 28,
  },
  contactCard: { borderRadius: 14, padding: 20 },
  contactTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 14,
  },
  contactIconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contactService: {
    fontSize: 11,
    fontWeight: 700,
    color: "#a0aec0",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  contactPlatform: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: 6,
  },
  contactLink: {
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
    display: "inline-block",
  },
  stepsBtn: {
    width: "100%",
    padding: "9px 14px",
    borderRadius: 8,
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    outline: "none",
    marginBottom: 0,
    transition: "all 0.15s",
  },
  stepsBox: {
    marginTop: 12,
    background: "rgba(255,255,255,0.7)",
    borderRadius: 10,
    padding: "12px 14px",
  },
  stepsTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  noteBox: {
    background: "#fff",
    borderRadius: 14,
    padding: 22,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    border: "1.5px solid #fbd38d",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#c05621",
    marginBottom: 16,
  },
  noteGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 8,
  },
  noteItem: { display: "flex", alignItems: "flex-start", gap: 8 },

  disclaimer: {
    textAlign: "center",
    fontSize: 12,
    color: "#a0aec0",
    padding: "20px 24px 0",
    maxWidth: 700,
    margin: "0 auto",
    lineHeight: 1.7,
  },
};
