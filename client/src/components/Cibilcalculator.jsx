// ═══════════════════════════════════════════════════════════════════
//  CIBIL Score Calculator — Two-Component System
//  File 1: CibilDataForm  (data entry)
//  File 2: ScoreCard      (score display + breakdown)
//  File 3: App            (wires them together)
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────
// FICO / CIBIL Scoring Engine  (shared pure functions)
// ─────────────────────────────────────────────────────────────────
function calcPaymentHistoryScore(onTime, total) {
  if (!total) return 0;
  const r = onTime / total;
  if (r >= 0.99) return 100;
  if (r >= 0.95) return 85;
  if (r >= 0.9) return 70;
  if (r >= 0.8) return 50;
  if (r >= 0.7) return 30;
  return 10;
}
function calcUtilizationScore(used, limit) {
  if (!limit) return 0;
  const p = (used / limit) * 100;
  if (p <= 10) return 100;
  if (p <= 20) return 90;
  if (p <= 30) return 75;
  if (p <= 40) return 55;
  if (p <= 50) return 35;
  if (p <= 75) return 15;
  return 5;
}
function calcHistoryScore(years) {
  const y = Number(years);
  if (y >= 10) return 100;
  if (y >= 7) return 85;
  if (y >= 5) return 70;
  if (y >= 3) return 50;
  if (y >= 1) return 30;
  return 10;
}
function calcCreditMixScore(types) {
  const n = types.length;
  if (n >= 4) return 100;
  if (n === 3) return 80;
  if (n === 2) return 55;
  if (n === 1) return 30;
  return 0;
}
function calcInquiryScore(inquiries) {
  const n = Number(inquiries);
  if (n === 0) return 100;
  if (n === 1) return 85;
  if (n === 2) return 65;
  if (n === 3) return 45;
  if (n <= 5) return 25;
  return 5;
}
function computeScore(data) {
  const ph = calcPaymentHistoryScore(
    Number(data.onTimePayments),
    Number(data.totalPayments),
  );
  const ut = calcUtilizationScore(
    Number(data.creditUsed),
    Number(data.creditLimit),
  );
  const hi = calcHistoryScore(data.creditAgeYears);
  const mix = calcCreditMixScore(data.creditTypes);
  const inq = calcInquiryScore(data.hardInquiries);
  const weighted = ph * 0.35 + ut * 0.3 + hi * 0.15 + mix * 0.1 + inq * 0.1;
  const cibil = Math.round(300 + (weighted / 100) * 600);
  return {
    cibil,
    factors: [
      {
        key: "ph",
        label: "Payment History",
        score: ph,
        weight: 35,
        color: "#818cf8",
        detail: `${data.onTimePayments} of ${data.totalPayments} payments on time (${((Number(data.onTimePayments) / Number(data.totalPayments)) * 100).toFixed(1)}%)`,
        tip:
          ph >= 85
            ? "Consistently paying on time. Excellent!"
            : ph >= 65
              ? "A few missed payments are hurting you."
              : "Missed payments are the biggest score killer.",
      },
      {
        key: "ut",
        label: "Credit Utilization",
        score: ut,
        weight: 30,
        color: "#38bdf8",
        detail: `₹${Number(data.creditUsed).toLocaleString("en-IN")} used of ₹${Number(data.creditLimit).toLocaleString("en-IN")} (${((data.creditUsed / data.creditLimit) * 100).toFixed(1)}%)`,
        tip:
          ut >= 85
            ? "Outstanding — well below 30%."
            : ut >= 55
              ? "Decent. Aim to bring below 30%."
              : "High utilization signals risk. Pay down balances.",
      },
      {
        key: "hi",
        label: "Credit History Length",
        score: hi,
        weight: 15,
        color: "#34d399",
        detail: `${data.creditAgeYears} year${data.creditAgeYears == 1 ? "" : "s"} of credit history`,
        tip:
          hi >= 85
            ? "Long history builds strong trust."
            : hi >= 50
              ? "Keep old accounts open to grow this."
              : "Short history — it improves naturally over time.",
      },
      {
        key: "mix",
        label: "Credit Mix",
        score: mix,
        weight: 10,
        color: "#fbbf24",
        detail: `${data.creditTypes.length} type(s): ${data.creditTypes.map((t) => t.replace(/_/g, " ")).join(", ")}`,
        tip:
          mix >= 80
            ? "Great mix of credit types!"
            : mix >= 55
              ? "Add one more type to improve."
              : "Limited mix. A broader portfolio helps.",
      },
      {
        key: "inq",
        label: "New Hard Inquiries",
        score: inq,
        weight: 10,
        color: "#f472b6",
        detail: `${data.hardInquiries} hard inquir${data.hardInquiries == 1 ? "y" : "ies"} in last 12 months`,
        tip:
          inq >= 85
            ? "Minimal inquiries — you look stable."
            : inq >= 65
              ? "A couple is fine. Avoid new applications."
              : "Too many inquiries signals credit hunger.",
      },
    ],
  };
}
function getBand(score) {
  if (score >= 800) return { label: "EXCELLENT", color: "#00c9a7" };
  if (score >= 750) return { label: "VERY GOOD", color: "#38bdf8" };
  if (score >= 700) return { label: "GOOD", color: "#fbbf24" };
  if (score >= 650) return { label: "FAIR", color: "#f97316" };
  return { label: "POOR", color: "#f87171" };
}
function getFactorBand(score) {
  if (score >= 85) return { label: "EXCELLENT", color: "#00c9a7" };
  if (score >= 65) return { label: "GOOD", color: "#fbbf24" };
  if (score >= 40) return { label: "FAIR", color: "#f97316" };
  return { label: "POOR", color: "#f87171" };
}

// ─────────────────────────────────────────────────────────────────
// Animated Counter
// ─────────────────────────────────────────────────────────────────
function Counter({ to }) {
  const [val, setVal] = useState(300);
  useEffect(() => {
    let s = null;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 1400, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(300 + (to - 300) * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{val}</>;
}

// ─────────────────────────────────────────────────────────────────
// Arc Gauge
// ─────────────────────────────────────────────────────────────────
function ArcGauge({ score, color }) {
  const R = 88,
    stroke = 11,
    r = R - stroke / 2;
  const circ = 2 * Math.PI * r;
  const pct = (score - 300) / 600;
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let s = null;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 1400, 1);
      setAnim((1 - Math.pow(1 - p, 4)) * pct);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score, pct]);
  const offset = circ * (1 - anim);
  return (
    <svg width={R * 2 + 16} height={R * 2 + 16}>
      <circle
        cx={R + 8}
        cy={R + 8}
        r={r}
        fill="none"
        stroke="#1e293b"
        strokeWidth={stroke}
      />
      <circle
        cx={R + 8}
        cy={R + 8}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${R + 8} ${R + 8})`}
        style={{ transition: "stroke 0.4s" }}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// Bar
// ─────────────────────────────────────────────────────────────────
function Bar({ value, color }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 80);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div
      style={{
        height: 6,
        background: "#1e293b",
        borderRadius: 99,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${w}%`,
          background: color,
          borderRadius: 99,
          transition: "width 1.2s cubic-bezier(.22,1,.36,1)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENT 1 — CibilDataForm
// ─────────────────────────────────────────────────────────────────
const CREDIT_TYPES = [
  { id: "credit_card", label: "Credit Card" },
  { id: "home_loan", label: "Home Loan" },
  { id: "personal_loan", label: "Personal Loan" },
  { id: "auto_loan", label: "Auto / Car Loan" },
  { id: "education_loan", label: "Education Loan" },
  { id: "gold_loan", label: "Gold Loan" },
];
const blank = {
  totalPayments: "",
  onTimePayments: "",
  creditLimit: "",
  creditUsed: "",
  creditAgeYears: "",
  creditTypes: [],
  hardInquiries: "",
};

export function CibilDataForm({ onSubmit }) {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const toggle = (id) =>
    setForm((p) => ({
      ...p,
      creditTypes: p.creditTypes.includes(id)
        ? p.creditTypes.filter((t) => t !== id)
        : [...p.creditTypes, id],
    }));

  const validate = () => {
    const e = {};
    if (!form.totalPayments || Number(form.totalPayments) < 1)
      e.totalPayments = "Required — enter total EMI / bill payments";
    if (form.onTimePayments === "") e.onTimePayments = "Required";
    if (Number(form.onTimePayments) > Number(form.totalPayments))
      e.onTimePayments = "Cannot exceed total payments";
    if (!form.creditLimit || Number(form.creditLimit) < 1)
      e.creditLimit = "Required";
    if (form.creditUsed === "") e.creditUsed = "Required";
    if (Number(form.creditUsed) > Number(form.creditLimit))
      e.creditUsed = "Cannot exceed credit limit";
    if (!form.creditAgeYears) e.creditAgeYears = "Required";
    if (form.creditTypes.length === 0) e.creditTypes = "Select at least one";
    if (form.hardInquiries === "")
      e.hardInquiries = "Required (enter 0 if none)";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (!Object.keys(e).length) onSubmit({ ...form });
  };

  const utilPct =
    form.creditLimit && form.creditUsed
      ? ((Number(form.creditUsed) / Number(form.creditLimit)) * 100).toFixed(1)
      : null;
  const onTimePct =
    form.totalPayments && form.onTimePayments
      ? (
          (Number(form.onTimePayments) / Number(form.totalPayments)) *
          100
        ).toFixed(1)
      : null;

  return (
    <div style={F.wrap}>
      <style>{formCss}</style>
      <div style={F.header}>
        <div style={F.accentBar} />
        <h2 style={F.title}>CIBIL Score Calculator</h2>
        <p style={F.sub}>
          Enter your credit data — we apply the FICO model to compute your score
          instantly.
        </p>
      </div>

      {/* Section helper */}
      {[
        {
          num: "01",
          title: "Payment History",
          weight: "35%",
          color: "#818cf8",
          hint: "All EMIs, credit card bills, loan repayments.",
          body: (
            <>
              <div style={F.row}>
                <Field
                  label="Total Payments Made"
                  ph="e.g. 48"
                  val={form.totalPayments}
                  onChange={(v) => set("totalPayments", v)}
                  err={errors.totalPayments}
                />
                <Field
                  label="On-Time Payments"
                  ph="e.g. 44"
                  val={form.onTimePayments}
                  onChange={(v) => set("onTimePayments", v)}
                  err={errors.onTimePayments}
                />
              </div>
              {onTimePct && (
                <p style={F.live}>
                  On-time rate:{" "}
                  <strong style={{ color: "#818cf8" }}>{onTimePct}%</strong>
                </p>
              )}
            </>
          ),
        },
        {
          num: "02",
          title: "Credit Utilization",
          weight: "30%",
          color: "#38bdf8",
          hint: "Total across all credit cards. Aim below 30%.",
          body: (
            <>
              <div style={F.row}>
                <Field
                  label="Total Credit Limit (₹)"
                  ph="e.g. 500000"
                  val={form.creditLimit}
                  onChange={(v) => set("creditLimit", v)}
                  err={errors.creditLimit}
                />
                <Field
                  label="Amount Currently Used (₹)"
                  ph="e.g. 140000"
                  val={form.creditUsed}
                  onChange={(v) => set("creditUsed", v)}
                  err={errors.creditUsed}
                />
              </div>
              {utilPct && (
                <p style={F.live}>
                  Utilization:{" "}
                  <strong
                    style={{
                      color:
                        Number(utilPct) > 50
                          ? "#f87171"
                          : Number(utilPct) > 30
                            ? "#fbbf24"
                            : "#38bdf8",
                    }}
                  >
                    {utilPct}%
                  </strong>
                </p>
              )}
            </>
          ),
        },
        {
          num: "03",
          title: "Credit History Length",
          weight: "15%",
          color: "#34d399",
          hint: "Years since your oldest credit account was opened.",
          body: (
            <Field
              label="Credit History (years)"
              ph="e.g. 3.5"
              val={form.creditAgeYears}
              onChange={(v) => set("creditAgeYears", v)}
              err={errors.creditAgeYears}
              step="0.5"
            />
          ),
        },
        {
          num: "04",
          title: "Credit Mix",
          weight: "10%",
          color: "#fbbf24",
          hint: "A variety of credit types improves your score.",
          body: (
            <>
              <div style={F.checkGrid}>
                {CREDIT_TYPES.map((t) => (
                  <label key={t.id} style={F.checkLabel} className="ci-check">
                    <input
                      type="checkbox"
                      checked={form.creditTypes.includes(t.id)}
                      onChange={() => toggle(t.id)}
                      style={{ display: "none" }}
                    />
                    <span
                      style={{
                        ...F.checkBox,
                        background: form.creditTypes.includes(t.id)
                          ? "#fbbf24"
                          : "transparent",
                        borderColor: form.creditTypes.includes(t.id)
                          ? "#fbbf24"
                          : "#334155",
                        color: "#0b1120",
                      }}
                    >
                      {form.creditTypes.includes(t.id) && "✓"}
                    </span>
                    {t.label}
                  </label>
                ))}
              </div>
              {errors.creditTypes && <p style={F.err}>{errors.creditTypes}</p>}
            </>
          ),
        },
        {
          num: "05",
          title: "New Hard Inquiries",
          weight: "10%",
          color: "#f472b6",
          hint: "Hard inquiries from loan / card applications in last 12 months.",
          body: (
            <Field
              label="Number of Hard Inquiries"
              ph="e.g. 2"
              val={form.hardInquiries}
              onChange={(v) => set("hardInquiries", v)}
              err={errors.hardInquiries}
            />
          ),
        },
      ].map((s) => (
        <div key={s.num} style={{ ...F.section, borderLeftColor: s.color }}>
          <div style={F.secHead}>
            <span style={{ ...F.secNum, color: s.color }}>{s.num}</span>
            <div style={{ flex: 1 }}>
              <p style={F.secTitle}>{s.title}</p>
              <p style={F.secHint}>{s.hint}</p>
            </div>
            <span
              style={{
                ...F.wBadge,
                background: s.color + "22",
                color: s.color,
              }}
            >
              Weight {s.weight}
            </span>
          </div>
          {s.body}
        </div>
      ))}

      <div style={F.actions}>
        <button
          style={F.resetBtn}
          onClick={() => {
            setForm(blank);
            setErrors({});
          }}
          className="ci-reset"
        >
          Reset
        </button>
        <button
          style={F.submitBtn}
          onClick={handleSubmit}
          className="ci-submit"
        >
          Calculate CIBIL Score →
        </button>
      </div>
    </div>
  );
}

function Field({ label, ph, val, onChange, err, step, min }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
      <label style={F.label}>{label}</label>
      <input
        type="number"
        step={step || "1"}
        min={min || "0"}
        placeholder={ph}
        value={val}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...F.input, borderColor: err ? "#f87171" : "#1e293b" }}
        className="ci-input"
      />
      {err && <p style={F.err}>{err}</p>}
    </div>
  );
}

const F = {
  wrap: {
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    background: "#0b1120",
    color: "#e2e8f0",
    minHeight: "100vh",
    padding: "2.5rem 1.5rem",
    maxWidth: 860,
    margin: "0 auto",
  },
  header: {
    marginBottom: "2.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #1e293b",
  },
  accentBar: {
    width: 48,
    height: 4,
    background: "linear-gradient(90deg,#818cf8,#38bdf8)",
    borderRadius: 4,
    marginBottom: 14,
  },
  title: {
    fontSize: "1.9rem",
    fontWeight: 700,
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  sub: { fontSize: "0.88rem", color: "#64748b", margin: 0, lineHeight: 1.6 },
  section: {
    background: "#111827",
    border: "1px solid #1e293b",
    borderLeft: "4px solid",
    borderRadius: 12,
    padding: "1.4rem 1.6rem",
    marginBottom: "1rem",
  },
  secHead: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  secNum: {
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: 2,
    paddingTop: 3,
    minWidth: 22,
  },
  secTitle: {
    fontSize: "0.92rem",
    fontWeight: 700,
    margin: "0 0 3px",
    color: "#f1f5f9",
  },
  secHint: { fontSize: "0.76rem", color: "#475569", margin: 0 },
  wBadge: {
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    whiteSpace: "nowrap",
    flexShrink: 0,
    marginLeft: "auto",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  label: {
    fontSize: "0.76rem",
    fontWeight: 600,
    color: "#94a3b8",
    letterSpacing: "0.4px",
  },
  input: {
    background: "#0b1120",
    border: "1.5px solid",
    borderRadius: 8,
    color: "#f1f5f9",
    fontSize: "0.9rem",
    padding: "9px 13px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  err: { fontSize: "0.73rem", color: "#f87171", margin: "2px 0 0" },
  live: { marginTop: 9, fontSize: "0.8rem", color: "#64748b" },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "0.6rem",
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontSize: "0.8rem",
    color: "#94a3b8",
    userSelect: "none",
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    border: "1.5px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.68rem",
    fontWeight: 800,
    flexShrink: 0,
    transition: "all 0.15s",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "2rem",
  },
  resetBtn: {
    background: "transparent",
    border: "1.5px solid #1e293b",
    color: "#64748b",
    borderRadius: 10,
    padding: "10px 22px",
    fontSize: "0.86rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  submitBtn: {
    background: "linear-gradient(135deg,#818cf8,#38bdf8)",
    border: "none",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 26px",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

const formCss = `
  .ci-input:focus { border-color: #818cf8 !important; }
  .ci-submit:hover { opacity: 0.9; transform: translateY(-1px); transition: all 0.15s; }
  .ci-reset:hover  { border-color: #334155; color: #94a3b8; }
  .ci-check:hover span { border-color: #fbbf24 !important; }
  @media(max-width:560px){ .row{ grid-template-columns:1fr !important; } .checkGrid{ grid-template-columns:1fr 1fr !important; } }
`;

// ─────────────────────────────────────────────────────────────────
// COMPONENT 2 — ScoreCard
// ─────────────────────────────────────────────────────────────────
export function ScoreCard({ data, onBack }) {
  const { cibil, factors } = computeScore(data);
  const band = getBand(cibil);

  const ranges = [
    { label: "Poor", from: 300, to: 549, color: "#f87171" },
    { label: "Fair", from: 550, to: 649, color: "#f97316" },
    { label: "Good", from: 650, to: 749, color: "#fbbf24" },
    { label: "Very Good", from: 750, to: 799, color: "#38bdf8" },
    { label: "Excellent", from: 800, to: 900, color: "#00c9a7" },
  ];

  return (
    <div style={SC.wrap}>
      <style>{scCss}</style>

      {/* Hero */}
      <div style={SC.hero}>
        <div style={SC.heroLeft}>
          <span style={SC.back} onClick={onBack} className="sc-back">
            ← Recalculate
          </span>
          <p style={SC.eyebrow}>YOUR CIBIL SCORE</p>
          <div style={SC.scoreRow}>
            <span style={{ ...SC.big, color: band.color }}>
              <Counter to={cibil} />
            </span>
            <span style={SC.of}>/900</span>
            <span
              style={{
                ...SC.badge,
                background: band.color + "22",
                color: band.color,
              }}
            >
              {band.label}
            </span>
          </div>

          {/* Range bar */}
          <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
            {ranges.map((seg) => {
              const active = cibil >= seg.from && cibil <= seg.to;
              return (
                <div
                  key={seg.label}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      height: 6,
                      width: "100%",
                      borderRadius: 99,
                      background: seg.color,
                      opacity: active ? 1 : 0.2,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: active ? seg.color : "#334155",
                      textAlign: "center",
                    }}
                  >
                    {seg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gauge */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ArcGauge score={cibil} color={band.color} />
          <div style={{ ...SC.gaugeNum, color: band.color }}>
            <Counter to={cibil} />
          </div>
        </div>
      </div>

      {/* Factors */}
      <p style={SC.secTitle}>Score Breakdown — FICO Model</p>
      <div style={SC.grid}>
        {factors.map((f) => {
          const fb = getFactorBand(f.score);
          return (
            <div
              key={f.key}
              style={{ ...SC.card, borderTopColor: f.color }}
              className="sc-card"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <div>
                  <p style={SC.fLabel}>{f.label}</p>
                  <span
                    style={{
                      ...SC.fBadge,
                      background: fb.color + "22",
                      color: fb.color,
                    }}
                  >
                    {fb.label}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ ...SC.fScore, color: f.color }}>{f.score}</p>
                  <p style={SC.fWeight}>Weight {f.weight}%</p>
                </div>
              </div>
              <Bar value={f.score} color={f.color} />
              <p style={SC.fDetail}>{f.detail}</p>
              <p style={SC.fTip}>💡 {f.tip}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SC = {
  wrap: {
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    background: "#0b1120",
    color: "#e2e8f0",
    minHeight: "100vh",
    padding: "2.5rem 1.5rem",
    maxWidth: 900,
    margin: "0 auto",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "2rem",
    background: "#111827",
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: "2rem 2.2rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  heroLeft: { flex: 1, minWidth: 240 },
  back: {
    fontSize: "0.78rem",
    color: "#475569",
    cursor: "pointer",
    display: "inline-block",
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "2.5px",
    color: "#475569",
    margin: "0 0 8px",
  },
  scoreRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 10,
    flexWrap: "wrap",
  },
  big: {
    fontSize: "4rem",
    fontWeight: 800,
    letterSpacing: "-2px",
    lineHeight: 1,
  },
  of: { fontSize: "1.3rem", color: "#334155", fontWeight: 700 },
  badge: {
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "1.5px",
    padding: "4px 12px",
    borderRadius: 20,
    alignSelf: "center",
  },
  gaugeNum: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    fontSize: "1.75rem",
    fontWeight: 800,
    letterSpacing: "-1px",
  },
  secTitle: {
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "2px",
    color: "#475569",
    textTransform: "uppercase",
    margin: "0 0 14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
    gap: "1rem",
  },
  card: {
    background: "#111827",
    border: "1px solid #1e293b",
    borderTop: "3px solid",
    borderRadius: 12,
    padding: "1.2rem 1.3rem",
    display: "flex",
    flexDirection: "column",
    gap: 9,
    transition: "transform 0.2s,box-shadow 0.2s",
  },
  fLabel: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#f1f5f9",
    margin: "0 0 4px",
  },
  fBadge: {
    fontSize: "0.63rem",
    fontWeight: 800,
    letterSpacing: "1px",
    padding: "2px 8px",
    borderRadius: 20,
  },
  fScore: { fontSize: "1.5rem", fontWeight: 800, margin: 0, lineHeight: 1 },
  fWeight: { fontSize: "0.68rem", color: "#475569", margin: "2px 0 0" },
  fDetail: {
    fontSize: "0.76rem",
    color: "#64748b",
    margin: 0,
    lineHeight: 1.5,
  },
  fTip: {
    fontSize: "0.76rem",
    color: "#94a3b8",
    margin: 0,
    lineHeight: 1.5,
    borderTop: "1px solid #1e293b",
    paddingTop: 8,
  },
};

const scCss = `
  .sc-back:hover { color: #94a3b8 !important; }
  .sc-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px #00000050; }
`;

// ─────────────────────────────────────────────────────────────────
// App.jsx — wires both components
// ─────────────────────────────────────────────────────────────────
export default function CibilCalculator() {
  const [data, setData] = useState(null);
  return data ? (
    <ScoreCard data={data} onBack={() => setData(null)} />
  ) : (
    <CibilDataForm onSubmit={setData} />
  );
}
