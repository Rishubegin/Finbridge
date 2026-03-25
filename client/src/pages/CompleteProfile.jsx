import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axiosInstance";
import "../styles/complete-profile.css";
import { extractTextFromImage } from "../utils/ocrService";

// Toast notification helper
const showToast = (message, type = "success") => {
  // Create a simple toast notification
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: ${type === "success" ? "#10b981" : "#ef4444"};
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideIn 0.3s ease-in-out;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-in-out";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

const STEPS = [
  { id: 1, title: "Personal Info", icon: "👤" },
  { id: 2, title: "Government ID", icon: "📄" },
  { id: 3, title: "Address", icon: "🏠" },
  { id: 4, title: "Financial", icon: "💰" },
  { id: 5, title: "Review", icon: "✓" },
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form with safe defaults - ensures all fields are strings for controlled inputs
  const [formData, setFormData] = useState(() => {
    console.log("📋 Initializing form with user data:", user);
    return {
      name: (user?.name || "").trim(),
      phone: (user?.phone || "").trim(),
      dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      pan: (user?.pan || "").trim().toUpperCase(),
      aadhar: (user?.aadhar || "").trim(),
      panDocument: null,
      panDocumentPreview: null,
      address: (user?.address || "").trim(),
      city: (user?.city || "").trim(),
      state: (user?.state || "").trim(),
      pincode: (user?.pincode || "").trim(),
      income: (user?.income || "").toString().trim(),
      occupation: (user?.occupation || "").trim(),
    };
  });

  // Clear error messages on input change for better UX
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          panDocumentPreview: event.target.result,
          panDocument: file,
        }));
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractText = async () => {
    if (!formData.panDocument) {
      setError("Please upload a document first");
      return;
    }

    setExtracting(true);
    setError("");

    try {
      const extractedText = await extractTextFromImage(
        formData.panDocumentPreview,
      );

      // Parse PAN and name from extracted text
      const panMatch = extractedText.match(/[A-Z]{5}[0-9]{4}[A-Z]/);
      const nameMatch = extractedText.match(/(?:name|नाम)[:\s]*([A-Za-z\s]+)/i);

      const updates = {};
      if (panMatch) {
        updates.pan = panMatch[0];
      }
      if (nameMatch) {
        updates.name = nameMatch[1].trim().toUpperCase();
      }

      if (Object.keys(updates).length > 0) {
        setFormData((prev) => ({
          ...prev,
          ...updates,
        }));
        setSuccess(
          "Document details extracted successfully! You can edit them below.",
        );
      } else {
        setSuccess("Document uploaded. Please fill in the details manually.");
      }
    } catch (err) {
      setError(
        "Failed to extract text from document. Please fill in the details manually.",
      );
      console.error("OCR Error:", err);
    } finally {
      setExtracting(false);
    }
  };

  const calculateProgress = () => {
    const totalFields = 10;
    const filledFields = [
      formData.name,
      formData.phone,
      formData.dob,
      formData.pan,
      formData.aadhar,
      formData.address,
      formData.city,
      formData.state,
      formData.pincode,
      formData.income,
      formData.occupation,
    ].filter(Boolean).length;

    return Math.round((filledFields / totalFields) * 100);
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.phone) {
        setError("Please fill in all required fields in this step");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.address || !formData.city || !formData.state) {
        setError("Please fill in all required address fields");
        return;
      }
    }

    setError("");
    setSuccess("");
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setError("");
    setSuccess("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all required fields with specific error messages
    const requiredFields = {
      name: "Name",
      phone: "Phone number",
      dob: "Date of birth",
      pan: "PAN number",
      aadhar: "Aadhar number",
      address: "Address",
      city: "City",
      state: "State",
      pincode: "Pincode",
      income: "Income",
      occupation: "Occupation",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(", ");
      const errorMsg = `Please fill in: ${fieldsList}`;
      setError(errorMsg);
      showToast(errorMsg, "error");
      return;
    }

    // Start loading - disable all interactions
    setLoading(true);

    try {
      // Step 1: Collect all form data from state
      const profileData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        dob: formData.dob,
        pan: formData.pan.trim().toUpperCase(),
        aadhar: formData.aadhar.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        income: formData.income.trim(),
        occupation: formData.occupation.trim(),
      };

      console.log("📤 Submitting profile data:", profileData);

      // Step 2: Send PUT request to backend API (/api/users/profile)
      const response = await updateUserProfile(profileData);

      console.log("✅ Profile update response:", response);

      // Step 3: Verify successful response
      if (response.success && response.user) {
        // Show immediate success feedback
        const successMsg = "✅ Profile completed successfully!";
        showToast(successMsg);
        setSuccess(successMsg);

        console.log("🔄 Global user state updated:", response.user);

        // Step 4: Brief delay to show success message
        // Then navigate to dashboard where updated data will be displayed
        setTimeout(() => {
          console.log("🚀 Navigating to dashboard...");
          navigate("/dashboard");
        }, 1500);
      } else {
        throw new Error("No success response from server");
      }
    } catch (err) {
      console.error("❌ Profile submission error:", err);

      // Step 5: Handle and display errors gracefully
      let errorMsg = "Failed to update profile. Please try again.";

      if (err.response?.status === 401) {
        errorMsg = "Session expired. Please login again.";
        // Optional: logout user and redirect to login
      } else if (err.response?.status === 400) {
        errorMsg = err.response?.data?.error || "Invalid profile data.";
      } else if (err.response?.status === 500) {
        errorMsg = "Server error. Please try again later.";
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      // Step 6: Always re-enable interactions
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const progress = calculateProgress();

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="logo-wrapper">
              <div className="logo-circle gradient-bg">
                <span className="logo-icon">📋</span>
              </div>
              <h1 className="app-title">Complete Your Profile</h1>
            </div>
            <p className="tagline">
              Just a few more details to unlock your financial insights
            </p>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              <span className="progress-percentage">{progress}% Complete</span>
              <span className="progress-hint">
                {progress >= 80 ? "Ready to submit!" : "Keep going..."}
              </span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="steps-indicator">
          {STEPS.map((step) => (
            <div key={step.id} className="step-item-wrapper">
              <div
                className={`step-item ${
                  currentStep === step.id
                    ? "active"
                    : currentStep > step.id
                      ? "completed"
                      : ""
                }`}
                onClick={() => {
                  if (currentStep > step.id) {
                    setCurrentStep(step.id);
                  }
                }}
              >
                <span className="step-icon">{step.icon}</span>
                <span className="step-number">{step.id}</span>
              </div>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-section fade-in">
              <h2 className="section-title">Personal Information</h2>
              <p className="section-subtitle">
                Let's start with your basic details
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className="form-input"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    className="form-input"
                    placeholder="e.g., Software Engineer"
                    value={formData.occupation}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Government ID */}
          {currentStep === 2 && (
            <div className="form-section fade-in">
              <h2 className="section-title">Government IDs</h2>
              <p className="section-subtitle">
                Upload and verify your government-issued documents
              </p>

              {/* Document Upload */}
              <div className="document-upload-container">
                <div className="upload-area">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleDocumentUpload}
                    className="file-input"
                    disabled={loading || extracting}
                  />

                  {formData.panDocumentPreview ? (
                    <div className="document-preview">
                      {formData.panDocument?.type.startsWith("image/") ? (
                        <img
                          src={formData.panDocumentPreview}
                          alt="Document preview"
                          className="preview-image"
                        />
                      ) : (
                        <div className="pdf-placeholder">
                          <span className="pdf-icon">📄</span>
                          <p>{formData.panDocument?.name}</p>
                        </div>
                      )}
                      <button
                        type="button"
                        className="btn-remove-doc"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            panDocument: null,
                            panDocumentPreview: null,
                          })
                        }
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <div
                      className="upload-placeholder"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="upload-icon">📸</span>
                      <h3>Upload PAN Card or ID Proof</h3>
                      <p>Click to browse or drag & drop</p>
                      <small>Supports JPG, PNG, PDF (Max 5MB)</small>
                    </div>
                  )}
                </div>

                {formData.panDocumentPreview && (
                  <button
                    type="button"
                    className="btn btn-primary btn-extract"
                    onClick={handleExtractText}
                    disabled={extracting || loading}
                  >
                    {extracting ? (
                      <>
                        <span className="spinner"></span> Extracting...
                      </>
                    ) : (
                      "🔍 Auto-Extract Details"
                    )}
                  </button>
                )}
              </div>

              {/* ID Fields */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">PAN Number</label>
                  <input
                    type="text"
                    name="pan"
                    className="form-input"
                    placeholder="ABCDE1234F"
                    value={formData.pan}
                    onChange={handleChange}
                    disabled={loading}
                    maxLength="10"
                  />
                  <small className="form-hint">Format: ABCDE1234F</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Aadhar Number</label>
                  <input
                    type="text"
                    name="aadhar"
                    className="form-input"
                    placeholder="1234-5678-9012"
                    value={formData.aadhar}
                    onChange={handleChange}
                    disabled={loading}
                    maxLength="14"
                  />
                  <small className="form-hint">Format: 1234-5678-9012</small>
                </div>
              </div>

              <div className="info-box">
                <span className="info-icon">ℹ️</span>
                <p>
                  Your documents are secure and encrypted. We use OCR technology
                  to extract details, which you can review and edit before
                  submission.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="form-section fade-in">
              <h2 className="section-title">Address Information</h2>
              <p className="section-subtitle">Where can we reach you?</p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Street Address <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="form-input"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    State <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="form-input"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-input"
                    placeholder="400001"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={loading}
                    maxLength="6"
                  />
                </div>
              </div>

              <div className="map-placeholder">
                <span className="map-icon">🗺️</span>
                <p>
                  Address details will help us provide location-based insights
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Financial Information */}
          {currentStep === 4 && (
            <div className="form-section fade-in">
              <h2 className="section-title">Financial Information</h2>
              <p className="section-subtitle">
                Help us understand your financial profile
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Annual Income</label>
                  <div className="input-with-prefix">
                    <span className="currency-prefix">₹</span>
                    <input
                      type="number"
                      name="income"
                      className="form-input"
                      placeholder="500000"
                      value={formData.income}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="income-brackets">
                <p className="brackets-title">Income Brackets:</p>
                <div className="brackets-list">
                  <button
                    type="button"
                    className={`bracket ${
                      formData.income && parseInt(formData.income) < 500000
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, income: "400000" })
                    }
                  >
                    &lt; 5 Lakhs
                  </button>
                  <button
                    type="button"
                    className={`bracket ${
                      formData.income &&
                      parseInt(formData.income) >= 500000 &&
                      parseInt(formData.income) < 1000000
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, income: "750000" })
                    }
                  >
                    5L - 10L
                  </button>
                  <button
                    type="button"
                    className={`bracket ${
                      formData.income &&
                      parseInt(formData.income) >= 1000000 &&
                      parseInt(formData.income) < 2000000
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, income: "1500000" })
                    }
                  >
                    10L - 20L
                  </button>
                  <button
                    type="button"
                    className={`bracket ${
                      formData.income && parseInt(formData.income) >= 2000000
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, income: "2500000" })
                    }
                  >
                    20L+
                  </button>
                </div>
              </div>

              <div className="benefit-box">
                <h3 className="benefit-title">💡 Why share this?</h3>
                <ul className="benefit-list">
                  <li>Personalized loan recommendations</li>
                  <li>Better credit score insights</li>
                  <li>Financial health assessment</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="form-section fade-in">
              <h2 className="section-title">Review Your Information</h2>
              <p className="section-subtitle">
                Please verify all details before submitting
              </p>

              <div className="review-grid">
                <div className="review-card">
                  <h3>👤 Personal Information</h3>
                  <div className="review-items">
                    <div className="review-item">
                      <span className="review-label">Name:</span>
                      <span className="review-value">{formData.name}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Phone:</span>
                      <span className="review-value">{formData.phone}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">DOB:</span>
                      <span className="review-value">
                        {formData.dob || "Not provided"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Occupation:</span>
                      <span className="review-value">
                        {formData.occupation || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="review-card">
                  <h3>📄 Government ID</h3>
                  <div className="review-items">
                    <div className="review-item">
                      <span className="review-label">PAN:</span>
                      <span className="review-value">
                        {formData.pan || "Not provided"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Aadhar:</span>
                      <span className="review-value">
                        {formData.aadhar || "Not provided"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Document:</span>
                      <span className="review-value">
                        {formData.panDocument
                          ? "✅ Uploaded"
                          : "❌ Not uploaded"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="review-card">
                  <h3>🏠 Address</h3>
                  <div className="review-items">
                    <div className="review-item">
                      <span className="review-label">Address:</span>
                      <span className="review-value">
                        {formData.address || "Not provided"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">City:</span>
                      <span className="review-value">
                        {formData.city || "Not provided"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">State:</span>
                      <span className="review-value">
                        {formData.state || "Not provided"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Pincode:</span>
                      <span className="review-value">
                        {formData.pincode || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="review-card">
                  <h3>💰 Financial</h3>
                  <div className="review-items">
                    <div className="review-item">
                      <span className="review-label">Annual Income:</span>
                      <span className="review-value">
                        ₹{formData.income || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="terms-box">
                <input type="checkbox" id="terms" className="terms-checkbox" />
                <label htmlFor="terms">
                  I confirm that all information provided is accurate and
                  complete.
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (currentStep === 1) {
                  handleSkip();
                } else {
                  handlePrevStep();
                }
              }}
              disabled={loading || extracting}
            >
              {currentStep === 1 ? "⏭️ Skip for Now" : "← Previous"}
            </button>

            {currentStep === STEPS.length ? (
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading || extracting}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Submitting...
                  </>
                ) : (
                  "✓ Complete Profile"
                )}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextStep}
                disabled={loading || extracting}
              >
                Next →
              </button>
            )}
          </div>

          {/* Step Progress Footer */}
          <div className="step-progress-footer">
            <span>
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="dot-indicators">
              {STEPS.map((step) => (
                <span
                  key={step.id}
                  className={`dot ${currentStep === step.id ? "active" : ""}`}
                ></span>
              ))}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
