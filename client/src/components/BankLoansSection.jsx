import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const LOAN_TYPES = ["Home Loan", "Business Loan", "Gold Loan", "Education Loan"];

const BANKS = [
  {
    id: "sbi",
    name: "State Bank of India",
    shortName: "SBI",
    type: "Public Sector",
    color: "#1a237e",
    accent: "#e53935",
    logo: "🏦",
    rates: {
      "Home Loan":      { min: 7.25, max: 8.45, note: "Based on CIBIL score & loan amount" },
      "Business Loan":  { min: 9.10, max: 13.50, note: "MSME & SME loans; varies by category" },
      "Gold Loan":      { min: 8.75, max: 9.60,  note: "Bullet & EMI repayment schemes" },
      "Education Loan": { min: 8.15, max: 10.50, note: "SBI Student Loan Scheme" },
    },
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    shortName: "HDFC",
    type: "Private Sector",
    color: "#004c97",
    accent: "#e65100",
    logo: "🏛️",
    rates: {
      "Home Loan":      { min: 8.50, max: 9.85, note: "Special rates for women borrowers" },
      "Business Loan":  { min: 10.00, max: 22.50, note: "Collateral-free up to ₹40L" },
      "Gold Loan":      { min: 9.10, max: 19.00, note: "Average IRR ~11.17% (Q3 FY26)" },
      "Education Loan": { min: 9.50, max: 13.25, note: "For premier Indian & foreign institutes" },
    },
  },
  {
    id: "icici",
    name: "ICICI Bank",
    shortName: "ICICI",
    type: "Private Sector",
    color: "#b71c1c",
    accent: "#f57f17",
    logo: "🏢",
    rates: {
      "Home Loan":      { min: 8.75, max: 9.95, note: "Instant approval via iMobile" },
      "Business Loan":  { min: 10.25, max: 19.00, note: "Business Instalment & OD facility" },
      "Gold Loan":      { min: 9.00, max: 17.00, note: "Up to 75% of gold value (LTV)" },
      "Education Loan": { min: 9.00, max: 13.75, note: "Overseas study loans available" },
    },
  },
  {
    id: "pnb",
    name: "Punjab National Bank",
    shortName: "PNB",
    type: "Public Sector",
    color: "#1b5e20",
    accent: "#fbc02d",
    logo: "🏦",
    rates: {
      "Home Loan":      { min: 7.20, max: 9.10, note: "Special concession for women & green homes" },
      "Business Loan":  { min: 9.35, max: 14.00, note: "Mudra & SME loans included" },
      "Gold Loan":      { min: 8.75, max: 9.50, note: "Agricultural & non-agricultural schemes" },
      "Education Loan": { min: 8.00, max: 11.00, note: "PNB Saraswati & Udaan schemes" },
    },
  },
  {
    id: "canara",
    name: "Canara Bank",
    shortName: "Canara",
    type: "Public Sector",
    color: "#4a148c",
    accent: "#00bcd4",
    logo: "🏦",
    rates: {
      "Home Loan":      { min: 7.15, max: 10.00, note: "One of the lowest starting rates" },
      "Business Loan":  { min: 9.25, max: 14.50, note: "Canara Vyapar & MSME products" },
      "Gold Loan":      { min: 8.75, max: 9.30, note: "Gold loans up to ₹35 lakh" },
      "Education Loan": { min: 7.85, max: 10.50, note: "IBA model loan scheme" },
    },
  },
  {
    id: "axis",
    name: "Axis Bank",
    shortName: "Axis",
    type: "Private Sector",
    color: "#880e4f",
    accent: "#0d47a1",
    logo: "🏛️",
    rates: {
      "Home Loan":      { min: 8.75, max: 10.30, note: "Fast Track Home Loan approval" },
      "Business Loan":  { min: 10.75, max: 20.00, note: "Unsecured & secured business loans" },
      "Gold Loan":      { min: 9.00, max: 17.50, note: "Linked to MCLR rate" },
      "Education Loan": { min: 9.70, max: 14.50, note: "For top 100 global universities" },
    },
  },
  {
    id: "bob",
    name: "Bank of Baroda",
    shortName: "BoB",
    type: "Public Sector",
    color: "#e65100",
    accent: "#1565c0",
    logo: "🏦",
    rates: {
      "Home Loan":      { min: 7.45, max: 9.60, note: "Baroda Home Loan Advantage" },
      "Business Loan":  { min: 9.15, max: 15.00, note: "Baroda MSME & Mudra loans" },
      "Gold Loan":      { min: 8.85, max: 9.50, note: "Baroda Gold Loan scheme" },
      "Education Loan": { min: 8.15, max: 11.25, note: "Baroda Gyan & Vidya schemes" },
    },
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    shortName: "Kotak",
    type: "Private Sector",
    color: "#e53935",
    accent: "#1a237e",
    logo: "🏢",
    rates: {
      "Home Loan":      { min: 8.65, max: 9.90, note: "Online processing with quick disbursal" },
      "Business Loan":  { min: 11.00, max: 24.00, note: "Unsecured business loans available" },
      "Gold Loan":      { min: 8.00, max: 17.00, note: "Lowest gold loan starting rate" },
      "Education Loan": { min: 10.00, max: 14.00, note: "For select premier institutions" },
    },
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getRateBarWidth(min, loanType) {
  const ranges = {
    "Home Loan":      { lo: 7.0, hi: 10.5 },
    "Business Loan":  { lo: 9.0, hi: 25.0 },
    "Gold Loan":      { lo: 7.5, hi: 20.0 },
    "Education Loan": { lo: 7.5, hi: 15.0 },
  };
  const { lo, hi } = ranges[loanType];
  return Math.round(((min - lo) / (hi - lo)) * 100);
}

function getBadgeColor(type) {
  return type === "Public Sector"
    ? { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" }
    : { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function BankLoansSection() {
  const [activeLoan, setActiveLoan] = useState("Home Loan");
  const [sortBy, setSortBy] = useState("minRate"); // "minRate" | "bank"
  const [filterType, setFilterType] = useState("All"); // "All" | "Public Sector" | "Private Sector"
  const [expandedBank, setExpandedBank] = useState(null);

  const filtered = BANKS
    .filter(b => filterType === "All" || b.type === filterType)
    .sort((a, b) => {
      if (sortBy === "minRate") return a.rates[activeLoan].min - b.rates[activeLoan].min;
      return a.name.localeCompare(b.name);
    });

  const lowestRate = Math.min(...filtered.map(b => b.rates[activeLoan].min));

  return (
    <section style={styles.section}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerBadge}>LIVE RATES · 2026</div>
        <h2 style={styles.title}>India Bank Loan Rates</h2>
        <p style={styles.subtitle}>
          Compare interest rates across leading Indian banks — updated March 2026
        </p>
      </div>

      {/* ── Loan Type Tabs ── */}
      <div style={styles.tabsWrapper}>
        {LOAN_TYPES.map(lt => (
          <button
            key={lt}
            onClick={() => setActiveLoan(lt)}
            style={{
              ...styles.tab,
              ...(activeLoan === lt ? styles.tabActive : {}),
            }}
          >
            {loanEmoji(lt)} {lt}
          </button>
        ))}
      </div>

      {/* ── Controls ── */}
      <div style={styles.controls}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Filter:</span>
          {["All", "Public Sector", "Private Sector"].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              style={{ ...styles.pill, ...(filterType === f ? styles.pillActive : {}) }}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Sort:</span>
          <button
            onClick={() => setSortBy("minRate")}
            style={{ ...styles.pill, ...(sortBy === "minRate" ? styles.pillActive : {}) }}
          >
            Lowest Rate
          </button>
          <button
            onClick={() => setSortBy("bank")}
            style={{ ...styles.pill, ...(sortBy === "bank" ? styles.pillActive : {}) }}
          >
            Bank Name
          </button>
        </div>
      </div>

      {/* ── Lowest Rate Banner ── */}
      <div style={styles.lowestBanner}>
        <span style={styles.lowestIcon}>⚡</span>
        <span>Lowest {activeLoan} rate among selected banks:</span>
        <strong style={styles.lowestRate}>&nbsp;{lowestRate.toFixed(2)}% p.a.</strong>
      </div>

      {/* ── Cards Grid ── */}
      <div style={styles.grid}>
        {filtered.map((bank, idx) => {
          const rate = bank.rates[activeLoan];
          const isLowest = rate.min === lowestRate;
          const isExpanded = expandedBank === bank.id;
          const badge = getBadgeColor(bank.type);
          const barW = getRateBarWidth(rate.min, activeLoan);

          return (
            <div
              key={bank.id}
              onClick={() => setExpandedBank(isExpanded ? null : bank.id)}
              style={{
                ...styles.card,
                ...(isLowest ? styles.cardLowest : {}),
                ...(isExpanded ? styles.cardExpanded : {}),
                borderTop: `4px solid ${bank.color}`,
                cursor: "pointer",
              }}
            >
              {/* Rank badge */}
              <div style={{ ...styles.rankBadge, background: bank.color }}>
                #{idx + 1}
              </div>

              {/* Lowest tag */}
              {isLowest && (
                <div style={styles.bestTag}>🏆 Best Rate</div>
              )}

              {/* Bank header */}
              <div style={styles.cardHeader}>
                <div style={{ ...styles.logoBox, background: bank.color + "18" }}>
                  <span style={styles.logoEmoji}>{bank.logo}</span>
                </div>
                <div>
                  <div style={styles.bankName}>{bank.name}</div>
                  <span style={{
                    ...styles.typeBadge,
                    background: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`,
                  }}>
                    {bank.type}
                  </span>
                </div>
              </div>

              {/* Rate display */}
              <div style={styles.rateRow}>
                <div style={styles.rateBlock}>
                  <div style={styles.rateLabel}>Starting From</div>
                  <div style={{ ...styles.rateValue, color: bank.color }}>
                    {rate.min.toFixed(2)}%
                  </div>
                </div>
                <div style={styles.rateDivider} />
                <div style={styles.rateBlock}>
                  <div style={styles.rateLabel}>Up To</div>
                  <div style={{ ...styles.rateValue, color: "#555" }}>
                    {rate.max.toFixed(2)}%
                  </div>
                </div>
                <div style={styles.rateDivider} />
                <div style={styles.rateBlock}>
                  <div style={styles.rateLabel}>Per Annum</div>
                  <div style={styles.paLabel}>p.a.</div>
                </div>
              </div>

              {/* Rate bar */}
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${barW}%`,
                    background: `linear-gradient(90deg, ${bank.color}, ${bank.accent})`,
                  }}
                />
              </div>
              <div style={styles.barLabels}>
                <span>Low</span><span>High</span>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={styles.expandedPanel}>
                  <div style={styles.expandedDivider} />
                  <div style={styles.noteTitle}>📌 Note</div>
                  <div style={styles.noteText}>{rate.note}</div>
                  <div style={styles.allRatesTitle}>All Loan Rates</div>
                  <div style={styles.allRatesGrid}>
                    {LOAN_TYPES.map(lt => (
                      <div key={lt} style={{
                        ...styles.miniRate,
                        background: lt === activeLoan ? bank.color + "18" : "#f8f8f8",
                        border: lt === activeLoan ? `1px solid ${bank.color}44` : "1px solid #eee",
                      }}>
                        <div style={styles.miniRateLabel}>{loanEmoji(lt)} {lt}</div>
                        <div style={{ ...styles.miniRateVal, color: bank.color }}>
                          {bank.rates[lt].min}% – {bank.rates[lt].max}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.expandHint}>
                {isExpanded ? "▲ Less info" : "▼ More info"}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Disclaimer ── */}
      <p style={styles.disclaimer}>
        * Rates are indicative as of March 2026 and subject to change. Final rates depend on
        credit score, loan amount, tenure & lender policy. Always verify with the respective bank.
      </p>
    </section>
  );
}

function loanEmoji(type) {
  const map = {
    "Home Loan": "🏠",
    "Business Loan": "💼",
    "Gold Loan": "🥇",
    "Education Loan": "🎓",
  };
  return map[type] || "💰";
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  section: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "60px 20px",
    background: "#fafafa",
  },
  header: {
    textAlign: "center",
    marginBottom: 36,
  },
  headerBadge: {
    display: "inline-block",
    background: "#1a237e",
    color: "#fff",
    fontSize: 11,
    fontFamily: "monospace",
    letterSpacing: 2,
    padding: "4px 14px",
    borderRadius: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 700,
    color: "#111",
    margin: "0 0 10px",
    letterSpacing: -1,
  },
  subtitle: {
    color: "#666",
    fontSize: 15,
    margin: 0,
    fontFamily: "sans-serif",
  },
  tabsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 24,
  },
  tab: {
    padding: "10px 20px",
    borderRadius: 40,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "sans-serif",
    color: "#444",
    transition: "all 0.2s",
    outline: "none",
  },
  tabActive: {
    background: "#1a237e",
    color: "#fff",
    border: "1.5px solid #1a237e",
    fontWeight: 600,
  },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    background: "#fff",
    borderRadius: 10,
    padding: "12px 18px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  filterLabel: {
    fontSize: 13,
    color: "#888",
    fontFamily: "sans-serif",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pill: {
    padding: "5px 14px",
    borderRadius: 20,
    border: "1.5px solid #ddd",
    background: "#f5f5f5",
    fontSize: 13,
    cursor: "pointer",
    color: "#555",
    fontFamily: "sans-serif",
    outline: "none",
    transition: "all 0.15s",
  },
  pillActive: {
    background: "#1a237e",
    color: "#fff",
    border: "1.5px solid #1a237e",
    fontWeight: 600,
  },
  lowestBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "linear-gradient(90deg, #1a237e 0%, #283593 100%)",
    color: "#fff",
    borderRadius: 8,
    padding: "12px 20px",
    marginBottom: 28,
    fontSize: 14,
    fontFamily: "sans-serif",
    boxShadow: "0 4px 14px rgba(26,35,126,0.25)",
  },
  lowestIcon: { fontSize: 18 },
  lowestRate: { fontSize: 18, color: "#ffd54f" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "22px 20px 14px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    position: "relative",
    transition: "transform 0.2s, box-shadow 0.2s",
    userSelect: "none",
  },
  cardLowest: {
    boxShadow: "0 4px 24px rgba(26,35,126,0.18)",
  },
  cardExpanded: {
    boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
  },
  rankBadge: {
    position: "absolute",
    top: 14,
    right: 16,
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "monospace",
    padding: "2px 8px",
    borderRadius: 20,
    letterSpacing: 0.5,
  },
  bestTag: {
    position: "absolute",
    top: -12,
    left: 18,
    background: "#ffd54f",
    color: "#333",
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "sans-serif",
    padding: "3px 10px",
    borderRadius: 20,
    boxShadow: "0 2px 8px rgba(255,213,79,0.5)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  logoBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoEmoji: { fontSize: 22 },
  bankName: {
    fontWeight: 700,
    fontSize: 15,
    color: "#111",
    lineHeight: 1.3,
    marginBottom: 4,
  },
  typeBadge: {
    fontSize: 10,
    fontFamily: "sans-serif",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 20,
    letterSpacing: 0.3,
  },
  rateRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    background: "#f8f9fc",
    borderRadius: 10,
    padding: "12px 10px",
  },
  rateBlock: {
    textAlign: "center",
    flex: 1,
  },
  rateLabel: {
    fontSize: 10,
    color: "#aaa",
    fontFamily: "sans-serif",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  rateValue: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: -0.5,
  },
  paLabel: {
    fontSize: 16,
    fontWeight: 700,
    color: "#bbb",
    fontFamily: "sans-serif",
  },
  rateDivider: {
    width: 1,
    height: 32,
    background: "#e0e0e0",
  },
  barTrack: {
    height: 5,
    background: "#eee",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
  },
  barFill: {
    height: "100%",
    borderRadius: 10,
    transition: "width 0.4s ease",
  },
  barLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#bbb",
    fontFamily: "sans-serif",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  expandHint: {
    textAlign: "center",
    fontSize: 11,
    color: "#aaa",
    fontFamily: "sans-serif",
    marginTop: 6,
    paddingTop: 6,
  },
  expandedPanel: {
    marginTop: 6,
  },
  expandedDivider: {
    height: 1,
    background: "#f0f0f0",
    margin: "10px 0",
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#444",
    fontFamily: "sans-serif",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "sans-serif",
    lineHeight: 1.5,
    marginBottom: 12,
  },
  allRatesTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#888",
    fontFamily: "sans-serif",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  allRatesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
  },
  miniRate: {
    borderRadius: 8,
    padding: "7px 10px",
  },
  miniRateLabel: {
    fontSize: 10,
    color: "#888",
    fontFamily: "sans-serif",
    marginBottom: 2,
  },
  miniRateVal: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "sans-serif",
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 12,
    color: "#aaa",
    fontFamily: "sans-serif",
    marginTop: 36,
    lineHeight: 1.6,
    maxWidth: 700,
    margin: "36px auto 0",
  },
};
