// CibilDataForm.jsx
// Collects all financial inputs needed to compute CIBIL score via FICO model.
// On submit it calls onSubmit(data) — wire this to ScoreCard.

import React, { useState } from "react";

const CREDIT_TYPES = [
  { id: "credit_card", label: "Credit Card" },
  { id: "home_loan", label: "Home Loan" },
  { id: "personal_loan", label: "Personal Loan" },
  { id: "auto_loan", label: "Auto / Car Loan" },
  { id: "education_loan", label: "Education Loan" },
  { id: "gold_loan", label: "Gold Loan" },
];

const defaultForm = {
  totalPayments: "",
  onTimePayments: "",
  creditLimit: "",
  creditUsed: "",
  creditAgeYears: "",
  creditTypes: [],
  hardInquiries: "",
};

export default function CibilDataForm({ onSubmit }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleType = (id) => {
    setForm((p) => ({
      ...p,
      creditTypes: p.creditTypes.includes(id)
        ? p.creditTypes.filter((t) => t !== id)
        : [...p.creditTypes, id],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.totalPayments || Number(form.totalPayments) < 1)
      e.totalPayments = "Enter total EMI / bill payments made";
    if (form.onTimePayments === "" || Number(form.onTimePayments) < 0)
      e.onTimePayments = "Enter on-time payment count";
    if (Number(form.onTimePayments) > Number(form.totalPayments))
      e.onTimePayments = "Cannot exceed total payments";
    if (!form.creditLimit || Number(form.creditLimit) < 1)
      e.creditLimit = "Enter your total credit limit";
    if (form.creditUsed === "" || Number(form.creditUsed) < 0)
      e.creditUsed = "Enter amount currently used";
    if (Number(form.creditUsed) > Number(form.creditLimit))
      e.creditUsed = "Used amount cannot exceed limit";
    if (!form.creditAgeYears || Number(form.creditAgeYears) < 0)
      e.creditAgeYears = "Enter credit history length in years";
    if (form.creditTypes.length === 0)
      e.creditTypes = "Select at least one credit type";
    if (form.hardInquiries === "" || Number(form.hardInquiries) < 0)
      e.hardInquiries = "Enter number of hard inquiries (0 if none)";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) onSubmit({ ...form });
  };

  const handleReset = () => {
    setForm(defaultForm);
    setErrors({});
  };

  return (
    <div style={styles.wrapper}>
      <style>{css}</style>

      <div style={styles.header}>
        <div style={styles.headerAccent} />
        <h2 style={styles.title}>CIBIL Score Calculator</h2>
        <p style={styles.subtitle}>
          Enter your credit data below — we apply the FICO model to compute your
          score instantly.
        </p>
      </div>

      <div style={styles.grid}>
        {/* ── Payment History ── */}
        <Section
          number="01"
          title="Payment History"
          weight="35%"
          color="#6366f1"
          hint="Includes all EMIs, credit card bills, loan repayments."
        >
          <Row>
            <Field
              label="Total Payments Made"
              placeholder="e.g. 48"
              value={form.totalPayments}
              onChange={(v) => set("totalPayments", v)}
              error={errors.totalPayments}
              type="number"
            />
            <Field
              label="On-Time Payments"
              placeholder="e.g. 44"
              value={form.onTimePayments}
              onChange={(v) => set("onTimePayments", v)}
              error={errors.onTimePayments}
              type="number"
            />
          </Row>
          {form.totalPayments && form.onTimePayments && (
            <div style={styles.liveCalc}>
              On-time rate:{" "}
              <strong style={{ color: "#6366f1" }}>
                {((form.onTimePayments / form.totalPayments) * 100).toFixed(1)}%
              </strong>
            </div>
          )}
        </Section>

        {/* ── Credit Utilization ── */}
        <Section
          number="02"
          title="Credit Utilization"
          weight="30%"
          color="#0ea5e9"
          hint="Total across all credit cards. Keep utilization below 30%."
        >
          <Row>
            <Field
              label="Total Credit Limit (₹)"
              placeholder="e.g. 500000"
              value={form.creditLimit}
              onChange={(v) => set("creditLimit", v)}
              error={errors.creditLimit}
              type="number"
            />
            <Field
              label="Amount Currently Used (₹)"
              placeholder="e.g. 140000"
              value={form.creditUsed}
              onChange={(v) => set("creditUsed", v)}
              error={errors.creditUsed}
              type="number"
            />
          </Row>
          {form.creditLimit && form.creditUsed && (
            <div style={styles.liveCalc}>
              Utilization:{" "}
              <strong
                style={{
                  color:
                    (form.creditUsed / form.creditLimit) * 100 > 50
                      ? "#ef4444"
                      : (form.creditUsed / form.creditLimit) * 100 > 30
                        ? "#f59e0b"
                        : "#0ea5e9",
                }}
              >
                {((form.creditUsed / form.creditLimit) * 100).toFixed(1)}%
              </strong>
            </div>
          )}
        </Section>

        {/* ── Credit History ── */}
        <Section
          number="03"
          title="Credit History Length"
          weight="15%"
          color="#10b981"
          hint="Years since your oldest credit account was opened."
        >
          <Field
            label="Credit History (years)"
            placeholder="e.g. 3.5"
            value={form.creditAgeYears}
            onChange={(v) => set("creditAgeYears", v)}
            error={errors.creditAgeYears}
            type="number"
            step="0.5"
          />
        </Section>

        {/* ── Credit Mix ── */}
        <Section
          number="04"
          title="Credit Mix"
          weight="10%"
          color="#f59e0b"
          hint="Having a variety of credit types improves your score."
        >
          <div style={styles.checkGrid}>
            {CREDIT_TYPES.map((t) => (
              <label
                key={t.id}
                style={styles.checkLabel}
                className="check-item"
              >
                <input
                  type="checkbox"
                  checked={form.creditTypes.includes(t.id)}
                  onChange={() => toggleType(t.id)}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    ...styles.checkBox,
                    background: form.creditTypes.includes(t.id)
                      ? "#f59e0b"
                      : "transparent",
                    borderColor: form.creditTypes.includes(t.id)
                      ? "#f59e0b"
                      : "#334155",
                  }}
                >
                  {form.creditTypes.includes(t.id) && "✓"}
                </span>
                {t.label}
              </label>
            ))}
          </div>
          {errors.creditTypes && (
            <p style={styles.error}>{errors.creditTypes}</p>
          )}
        </Section>

        {/* ── New Inquiries ── */}
        <Section
          number="05"
          title="New Hard Inquiries"
          weight="10%"
          color="#ec4899"
          hint="Hard inquiries in the last 12 months from loan / card applications."
        >
          <Field
            label="Number of Hard Inquiries"
            placeholder="e.g. 2"
            value={form.hardInquiries}
            onChange={(v) => set("hardInquiries", v)}
            error={errors.hardInquiries}
            type="number"
            min="0"
          />
        </Section>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={styles.resetBtn}
          onClick={handleReset}
          className="reset-btn"
        >
          Reset
        </button>
        <button
          style={styles.submitBtn}
          onClick={handleSubmit}
          className="submit-btn"
        >
          Calculate CIBIL Score →
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ number, title, weight, color, hint, children }) {
  return (
    <div style={{ ...styles.section, borderLeftColor: color }}>
      <div style={styles.sectionHeader}>
        <span style={{ ...styles.sectionNum, color }}>{number}</span>
        <div>
          <h3 style={styles.sectionTitle}>{title}</h3>
          <p style={styles.sectionHint}>{hint}</p>
        </div>
        <span
          style={{ ...styles.weightBadge, background: color + "22", color }}
        >
          Weight {weight}
        </span>
      </div>
      <div style={styles.sectionBody}>{children}</div>
    </div>
  );
}

function Row({ children }) {
  return <div style={styles.row}>{children}</div>;
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  step,
  min,
}) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        step={step}
        min={min ?? "0"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.input, borderColor: error ? "#ef4444" : "#1e293b" }}
        className="cibil-input"
      />
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#0b1120",
    color: "#e2e8f0",
    minHeight: "100vh",
    padding: "2.5rem 1.5rem",
    maxWidth: 860,
    margin: "0 auto",
  },
  header: {
    position: "relative",
    marginBottom: "2.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #1e293b",
  },
  headerAccent: {
    width: 48,
    height: 4,
    background: "linear-gradient(90deg, #6366f1, #0ea5e9)",
    borderRadius: 4,
    marginBottom: 14,
  },
  title: {
    fontSize: "1.9rem",
    fontWeight: 700,
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    margin: 0,
    lineHeight: 1.6,
  },
  grid: { display: "flex", flexDirection: "column", gap: "1.2rem" },
  section: {
    background: "#111827",
    border: "1px solid #1e293b",
    borderLeft: "4px solid #6366f1",
    borderRadius: 12,
    padding: "1.4rem 1.6rem",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 16,
  },
  sectionNum: {
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: 2,
    paddingTop: 2,
    minWidth: 24,
  },
  sectionTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    margin: "0 0 3px",
    color: "#f1f5f9",
  },
  sectionHint: {
    fontSize: "0.78rem",
    color: "#475569",
    margin: 0,
  },
  weightBadge: {
    marginLeft: "auto",
    fontSize: "0.72rem",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  sectionBody: {},
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#94a3b8",
    letterSpacing: "0.4px",
  },
  input: {
    background: "#0b1120",
    border: "1.5px solid #1e293b",
    borderRadius: 8,
    color: "#f1f5f9",
    fontSize: "0.92rem",
    padding: "10px 14px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  error: {
    fontSize: "0.75rem",
    color: "#ef4444",
    margin: "2px 0 0",
  },
  liveCalc: {
    marginTop: 10,
    fontSize: "0.82rem",
    color: "#64748b",
  },
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
    fontSize: "0.82rem",
    color: "#94a3b8",
    userSelect: "none",
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    border: "1.5px solid #334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: 800,
    color: "#0b1120",
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
    padding: "11px 24px",
    fontSize: "0.88rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
    border: "none",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 28px",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.3px",
  },
};

const css = `
  .cibil-input:focus { border-color: #6366f1 !important; }
  .submit-btn:hover { opacity: 0.9; transform: translateY(-1px); transition: all 0.15s; }
  .reset-btn:hover { border-color: #334155; color: #94a3b8; transition: all 0.15s; }
  .check-item:hover span { border-color: #f59e0b !important; }
  @media (max-width: 600px) {
    .row { grid-template-columns: 1fr !important; }
    .check-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;
