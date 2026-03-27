import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FraudCheckerModal from "../components/FraudCheckerModal.jsx";
import "../styles/index.css";

export default function Index() {
  const navigate = useNavigate();
  const [isFraudOpen, setIsFraudOpen] = useState(false);

  const features = [
    {
      icon: "📊",
      title: "Real-Time Score Tracking",
      description:
        "Monitor your credit score with live updates and AI-powered insights. Get instant notifications when your score changes.",
    },
    {
      icon: "🤖",
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms provide personalized recommendations tailored to your unique financial profile and goals.",
    },
    {
      icon: "📈",
      title: "Detailed Reports",
      description:
        "Comprehensive credit reports with factor breakdown, trend analysis, and actionable insights for improvement.",
    },
    {
      icon: "💰",
      title: "Loan Suggestions",
      description:
        "AI-matched loan and credit card products based on your score, ensuring you get the best rates and terms available.",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description:
        "Bank-level 256-bit encryption, compliance with GDPR and data protection laws, zero data sharing with third parties.",
    },
    {
      icon: "⚡",
      title: "Fast & Reliable",
      description:
        "Real-time processing with 99.9% uptime guarantee, cloud-based infrastructure for instant access anywhere, anytime.",
    },
    {
      icon: "🎯",
      title: "Smart Action Plans",
      description:
        "Get personalized step-by-step action plans to improve your score faster with realistic timelines and milestones.",
    },
    {
      icon: "📱",
      title: "Multi-Device Access",
      description:
        "Seamless experience across desktop, tablet, and mobile. Access your credit information on the go with our responsive app.",
    },
    {
      icon: "👥",
      title: "Family Dashboard",
      description:
        "Monitor multiple family members' credit profiles in one place, share insights, and build financial literacy together.",
    },
  ];

  const steps = [
    {
      icon: "👤",
      number: "01",
      title: "Sign In",
      description: "Create your account or log in to access your dashboard",
    },
    {
      icon: "📊",
      number: "02",
      title: "View Analytics",
      description: "See your credit score and comprehensive financial overview",
    },
    {
      icon: "💡",
      number: "03",
      title: "Get Insights",
      description: "Receive AI-powered recommendations to improve your score",
    },
    {
      icon: "🎯",
      number: "04",
      title: "Take Action",
      description: "Implement suggestions and track your progress in real-time",
    },
  ];

  return (
    <div className="index-page">
      {/* Navigation */}
      <nav className="index-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="nav-logo-icon">💳</span>
            <span className="nav-logo-text">FinBridge</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
            <Link to="/fraud-awareness" className="nav-link">
              Fraud Awareness
            </Link>
            <Link to="/">
              <button
                className="nav-link fraud-btn"
                onClick={() => setIsFraudOpen(true)}
              >
                <span className="fraud-icon">⚡</span>
                Fraud Checker
              </button>
            </Link>
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">✨ Welcome to FinBridge</div>
            <h1 className="hero-title">
              Take Control of Your{" "}
              <span className="highlight">Financial Future</span>
            </h1>
            <p className="hero-subtitle">
              FinBridge is your AI-powered platform for credit management, score
              tracking, and financial insights. Make smarter financial decisions
              with real-time data and personalized recommendations.
            </p>
            <div className="hero-buttons">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/register")}
              >
                🚀 Get Started
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/login")}
              >
                📖 Login
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <h3>50K+</h3>
                <p>Active Users</p>
              </div>
              <div className="stat">
                <h3>$2.5B+</h3>
                <p>Managed Assets</p>
              </div>
              <div className="stat">
                <h3>98%</h3>
                <p>Satisfaction</p>
              </div>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-box">
              <div className="illustration-card card-1">
                <span className="card-icon">📊</span>
                <p>Credit Score</p>
                <h3>750</h3>
              </div>
              <div className="illustration-card card-2">
                <span className="card-icon">🎯</span>
                <p>Your Goal</p>
                <h3>800+</h3>
              </div>
              <div className="illustration-card card-3">
                <span className="card-icon">📈</span>
                <p>Trend</p>
                <h3>+45pts</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need to master your credit score and financial
              health
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Get started in just 4 simple steps
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <span className="step-icon">{step.icon}</span>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <FraudCheckerModal
        isOpen={isFraudOpen}
        onClose={() => setIsFraudOpen(false)}
      />
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Transform Your Financial Life?</h2>
          <p className="cta-subtitle">
            Join thousands of users who are already using FinBridge to improve
            their credit scores
          </p>
          <div className="cta-buttons">
            <button
              className="btn btn-primary-large"
              onClick={() => navigate("/login")}
            >
              🎯 Get Started Free
            </button>
            <button
              className="btn btn-secondary-large"
              onClick={() => navigate("/login")}
            >
              👤 View Demo
            </button>
          </div>
          <p className="cta-note">
            ✨ No credit card required • 🔒 Completely secure • ⚡ Instant
            access
          </p>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="highlight-section">
        <div className="section-container">
          <div className="highlight-grid">
            <div className="highlight-item">
              <h3>🎯 Smart Analytics</h3>
              <p>
                Get AI-powered insights tailored to your financial profile and
                goals
              </p>
            </div>
            <div className="highlight-item">
              <h3>📊 Real-Time Updates</h3>
              <p>
                Monitor your credit score with live updates and instant
                notifications
              </p>
            </div>
            <div className="highlight-item">
              <h3>💡 Expert Tips</h3>
              <p>
                Receive personalized recommendations to boost your credit score
                faster
              </p>
            </div>
            <div className="highlight-item">
              <h3>🏆 Best Offers</h3>
              <p>
                Find the best loan and credit card options based on your profile
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FinBridge Section */}
      <section className="comparison-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose FinBridge?</h2>
            <p className="section-subtitle">
              What sets us apart from traditional credit monitoring services
            </p>
          </div>
          <div className="comparison-grid">
            <div className="comparison-card">
              <div className="comparison-icon">🎓</div>
              <h3>AI-Driven Intelligence</h3>
              <p>
                Unlike traditional bureaus, we use advanced AI to predict credit
                trends and provide proactive recommendations before issues
                arise.
              </p>
              <ul className="comparison-features">
                <li>✓ Predictive score forecasting</li>
                <li>✓ Behavioral pattern analysis</li>
                <li>✓ Personalized improvement paths</li>
              </ul>
            </div>
            <div className="comparison-card">
              <div className="comparison-icon">💎</div>
              <h3>Premium Features at No Cost</h3>
              <p>
                Access all premium features including detailed reports, loan
                suggestions, and expert advice completely free forever.
              </p>
              <ul className="comparison-features">
                <li>✓ No hidden fees</li>
                <li>✓ No premium tier lock-in</li>
                <li>✓ Unlimited access to all tools</li>
              </ul>
            </div>
            <div className="comparison-card">
              <div className="comparison-icon">⚡</div>
              <h3>Instant Updates</h3>
              <p>
                Real-time score monitoring with instant notifications. Updates
                within minutes, not weeks like traditional bureaus.
              </p>
              <ul className="comparison-features">
                <li>✓ Live score tracking</li>
                <li>✓ Instant alerts</li>
                <li>✓ Minute-level refresh rate</li>
              </ul>
            </div>
            <div className="comparison-card">
              <div className="comparison-icon">🎯</div>
              <h3>Actionable Insights</h3>
              <p>
                Go beyond scores and reports. Get specific, prioritized action
                items with expected impact on your credit score.
              </p>
              <ul className="comparison-features">
                <li>✓ Impact-ranked recommendations</li>
                <li>✓ Realistic timelines</li>
                <li>✓ Progress tracking</li>
              </ul>
            </div>
            <div className="comparison-card">
              <div className="comparison-icon">🌐</div>
              <h3>Global Reach, Local Focus</h3>
              <p>
                Comprehensive international credit data with localized insights
                for your specific region and financial circumstances.
              </p>
              <ul className="comparison-features">
                <li>✓ Multi-country support</li>
                <li>✓ Local bank partnerships</li>
                <li>✓ Regional insights</li>
              </ul>
            </div>
            <div className="comparison-card">
              <div className="comparison-icon">🤝</div>
              <h3>Expert Community</h3>
              <p>
                Access to financial experts, community forums, and peer
                learning. Learn from others' experiences and success stories.
              </p>
              <ul className="comparison-features">
                <li>✓ Expert Q&A support</li>
                <li>✓ Community forums</li>
                <li>✓ Educational resources</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="advanced-features">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Advanced Features</h2>
            <p className="section-subtitle">
              Tools designed to give you complete control over your financial
              future
            </p>
          </div>
          <div className="advanced-features-grid">
            <div className="advanced-feature">
              <div className="feature-number">01</div>
              <h4>Score Simulator</h4>
              <p>
                Test different financial scenarios to see how they impact your
                credit score before making decisions. Plan ahead with
                confidence.
              </p>
            </div>
            <div className="advanced-feature">
              <div className="feature-number">02</div>
              <h4>Budget Optimizer</h4>
              <p>
                Integrated budget planning tool that recommends spending
                adjustments to improve credit utilization and score faster.
              </p>
            </div>
            <div className="advanced-feature">
              <div className="feature-number">03</div>
              <h4>Debt Payoff Strategy</h4>
              <p>
                Smart algorithms calculate optimal debt repayment strategies
                (avalanche or snowball) customized for your profile.
              </p>
            </div>
            <div className="advanced-feature">
              <div className="feature-number">04</div>
              <h4>Credit Dispute Assistant</h4>
              <p>
                Identify potential errors in your credit report and get guided
                assistance with the dispute process directly through the app.
              </p>
            </div>
            <div className="advanced-feature">
              <div className="feature-number">05</div>
              <h4>Identity Protection</h4>
              <p>
                Monitor for unauthorized accounts, credit inquiries, and
                potential fraud with real-time alerts and identity theft
                insurance.
              </p>
            </div>
            <div className="advanced-feature">
              <div className="feature-number">06</div>
              <h4>Goal Tracking</h4>
              <p>
                Set financial goals like buying a home or car, and get a
                personalized roadmap showing how to achieve them with credit
                milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Real Benefits, Real Results</h2>
            <p className="section-subtitle">
              Users report significant improvements in their financial health
            </p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-stat">+120 pts</div>
              <p>Average score improvement in 6 months</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-stat">$2,500+</div>
              <p>Average annual savings on loan interest</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-stat">15 min</div>
              <p>Time to complete credit profile setup</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-stat">10x</div>
              <p>Faster insights than traditional bureaus</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-stat">98%</div>
              <p>User satisfaction rating</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-stat">24/7</div>
              <p>Dedicated support availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">What Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "FinBridge helped me increase my credit score by 120 points in
                just 6 months. The AI insights are incredibly accurate!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <p className="author-name">John Doe</p>
                  <p className="author-role">User since 2023</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The most intuitive credit management tool I've used. Highly
                recommended for anyone serious about improving their finances!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <p className="author-name">Sarah Miller</p>
                  <p className="author-role">User since 2023</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Outstanding service and support team. FinBridge is now my go-to
                platform for all my credit monitoring needs."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">MC</div>
                <div className="author-info">
                  <p className="author-name">Michael Chen</p>
                  <p className="author-role">User since 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="index-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-column">
              <div className="footer-logo">
                <span className="footer-logo-icon">💳</span>
                <span className="footer-logo-text">FinBridge</span>
              </div>
              <p className="footer-description">
                Your AI-powered credit management platform for better financial
                decisions.
              </p>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Product</h4>
              <ul className="footer-links">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#security">Security</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Legal</h4>
              <ul className="footer-links">
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms">Terms of Service</a>
                </li>
                <li>
                  <a href="#cookies">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <p>&copy; 2026 FinBridge. All rights reserved.</p>
            <div className="social-links">
              <a href="#twitter">𝕏</a>
              <a href="#facebook">f</a>
              <a href="#linkedin">in</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
