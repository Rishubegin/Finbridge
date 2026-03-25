import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import "../styles/fraud-checker-modal.css";

export default function FraudCheckerModal({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const textareaRef = useRef(null);

  // Get status color based on fraud status
  const getStatusColor = (status) => {
    switch (status) {
      case "Safe":
        return "#10b981"; // Green
      case "Suspicious":
        return "#f59e0b"; // Amber
      case "Fraud":
        return "#ef4444"; // Red
      default:
        return "#6b7280"; // Gray
    }
  };

  // Get status icon based on fraud status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Safe":
        return "✓";
      case "Suspicious":
        return "⚠";
      case "Fraud":
        return "✕";
      default:
        return "?";
    }
  };

  // Handle fraud check analysis
  const handleCheck = async () => {
    setError("");
    setResult(null);

    if (!message.trim()) {
      setError("Please enter email or SMS content to analyze.");
      return;
    }

    setLoading(true);

    try {
      console.log("🔍 Checking message for fraud:", message);
      const response = await axiosInstance.post("/fraud/check-message", {
        message,
      });

      console.log("✅ Fraud check result:", response.data);
      setResult(response.data);
      setMessage("");
    } catch (err) {
      console.error("❌ Fraud check error:", err);
      setError(
        err.response?.data?.error ||
          "Unable to analyze message. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      // Prevent background scroll when modal is open
      document.body.style.overflow = "hidden";

      // Focus on textarea for better UX
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click (close on overlay click)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle close button click
  const handleClose = () => {
    setMessage("");
    setResult(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fraud-modal-backdrop" onClick={handleBackdropClick}>
      {/* Modal Container */}
      <div className="fraud-modal-container" ref={modalRef}>
        {/* Header */}
        <div className="fraud-modal-header">
          <div className="fraud-modal-header-content">
            <div className="fraud-modal-avatar">🔍</div>
            <div className="fraud-modal-title-section">
              <h2 className="fraud-modal-title">Fraud Checker</h2>
              <p className="fraud-modal-subtitle">
                Detect suspicious messages instantly
              </p>
            </div>
          </div>
          <button
            className="fraud-modal-close-btn"
            onClick={handleClose}
            aria-label="Close Fraud Checker"
            title="Close (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="fraud-modal-content">
          {/* Description */}
          <p className="fraud-modal-description">
            Paste an email, SMS, or message content below to analyze it for
            fraud indicators and phishing attempts.
          </p>

          {/* Textarea Input */}
          <div className="fraud-input-group">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError("");
              }}
              placeholder="Paste email or SMS message here..."
              className="fraud-textarea"
              disabled={loading}
              rows={6}
              aria-label="Message content"
            />
            <div className="fraud-char-count">
              {message.length} / 5000 characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="fraud-error-alert">
              <span className="fraud-error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Analyze Button */}
          <button
            className="fraud-analyze-btn"
            onClick={handleCheck}
            disabled={loading || !message.trim()}
            title={
              !message.trim()
                ? "Enter a message to analyze"
                : "Analyze for fraud"
            }
          >
            {loading ? (
              <>
                <span className="fraud-spinner"></span> Analyzing...
              </>
            ) : (
              <>🔍 Analyze for Fraud</>
            )}
          </button>

          {/* Result Box */}
          {result && (
            <div className="fraud-result-container">
              <div className="fraud-result-header">
                <h3>Analysis Result</h3>
              </div>

              {/* Status Card */}
              <div
                className="fraud-status-card"
                style={{ borderLeftColor: getStatusColor(result.status) }}
              >
                <div className="fraud-status-row">
                  <span className="fraud-status-label">Status:</span>
                  <span
                    className="fraud-status-badge"
                    style={{ backgroundColor: getStatusColor(result.status) }}
                  >
                    <span className="fraud-status-icon">
                      {getStatusIcon(result.status)}
                    </span>
                    {result.status}
                  </span>
                </div>

                <div className="fraud-status-row">
                  <span className="fraud-status-label">Risk Score:</span>
                  <span className="fraud-risk-score">{result.riskScore}%</span>
                </div>

                {/* Risk Meter */}
                <div className="fraud-risk-meter">
                  <div
                    className="fraud-risk-bar"
                    style={{
                      width: `${result.riskScore}%`,
                      backgroundColor: getStatusColor(result.status),
                    }}
                  ></div>
                </div>
              </div>

              {/* Reasons List */}
              {result.reasons && result.reasons.length > 0 && (
                <div className="fraud-reasons-container">
                  <h4 className="fraud-reasons-title">Detected Issues:</h4>
                  <ul className="fraud-reasons-list">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="fraud-reason-item">
                        <span className="fraud-reason-icon">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div className="fraud-recommendations">
                {result.status === "Safe" && (
                  <div className="fraud-recommendation-box safe">
                    <span className="fraud-rec-icon">✓</span>
                    <span>
                      This message appears to be safe. No fraud indicators
                      detected.
                    </span>
                  </div>
                )}
                {result.status === "Suspicious" && (
                  <div className="fraud-recommendation-box suspicious">
                    <span className="fraud-rec-icon">⚠</span>
                    <span>
                      This message shows suspicious indicators. Be cautious
                      before clicking links or providing personal information.
                    </span>
                  </div>
                )}
                {result.status === "Fraud" && (
                  <div className="fraud-recommendation-box fraud">
                    <span className="fraud-rec-icon">✕</span>
                    <span>
                      This appears to be a fraudulent message. Do not click
                      links or provide any personal information. Report it if
                      possible.
                    </span>
                  </div>
                )}
              </div>

              {/* Analyze Another Button */}
              <button
                className="fraud-analyze-another-btn"
                onClick={() => {
                  setMessage("");
                  setResult(null);
                  textareaRef.current?.focus();
                }}
              >
                Analyze Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
