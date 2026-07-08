import React, { useState } from "react";
import { X, Mail, Lock, UserPlus, LogIn, AlertCircle } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const loggedUser = { email: data.email };
        localStorage.setItem("current_user", JSON.stringify(loggedUser));
        onLoginSuccess(loggedUser);
        setSuccess(isLogin ? "Login successful!" : "Account created successfully!");
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1000);
      } else {
        setError(data.error || "Authentication failed. Please check credentials or sign up.");
      }
    } catch (err) {
      setError("Failed to connect to the authentication server.");
      console.error(err);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    setSuccess("");

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      "/google-auth-mock.html",
      "GoogleSignIn",
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=no`
    );

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type === "GOOGLE_AUTH_SUCCESS") {
        const loggedUser = { email: event.data.email };
        localStorage.setItem("current_user", JSON.stringify(loggedUser));
        onLoginSuccess(loggedUser);
        setSuccess("Logged in with Google!");
        window.removeEventListener("message", handleMessage);

        setTimeout(() => {
          onClose();
          resetForm();
        }, 1000);
      }
    };

    window.addEventListener("message", handleMessage);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal glass-panel fade-in">
        <button onClick={onClose} className="auth-close-btn">
          <X size={20} />
        </button>

        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Log in to compare and track your certifications" : "Sign up to access personalized recommendations"}</p>
        </div>

        {error && (
          <div className="auth-alert error-alert fade-in">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert success-alert fade-in">
            <AlertCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={16} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input text-input-padding"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={16} />
              <input
                type="password"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input text-input-padding"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={16} />
                <input
                  type="password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input text-input-padding"
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit-btn">
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            <span>{isLogin ? "Log In" : "Sign Up"}</span>
          </button>
        </form>

        {/* Separator and Google Auth Button */}
        <div className="auth-separator">
          <span>or continue with</span>
        </div>

        <button type="button" onClick={handleGoogleLogin} className="google-auth-btn">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
            alt="Google" 
            className="google-logo" 
          />
          <span>{isLogin ? "Sign In with Google" : "Sign In with Google"}</span>
        </button>

        <div className="auth-toggle">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }} 
            className="toggle-link-btn"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.34);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 24px;
        }

        .auth-modal {
          width: 100%;
          max-width: 440px;
          padding: 40px 32px 32px;
          position: relative;
          background: var(--bg-secondary);
        }

        .auth-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-sm);
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .auth-close-btn:hover {
          color: var(--text-primary);
          background: rgba(29, 92, 255, 0.06);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-header h2 {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .auth-header p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 20px;
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--error);
        }

        .success-alert {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--success);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .text-input-padding {
          padding-left: 42px !important;
          width: 100%;
        }

        .auth-submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 10px;
          padding: 12px;
        }

        /* Separator and Google Button Styling */
        .auth-separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0;
          color: var(--text-muted);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .auth-separator::before,
        .auth-separator::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }

        .auth-separator span {
          padding: 0 12px;
        }

        .google-auth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          background: rgba(148, 163, 184, 0.16);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .google-auth-btn:hover {
          background: rgba(29, 92, 255, 0.1);
          border-color: var(--border-color-hover);
        }

        .google-logo {
          width: 18px;
          height: 18px;
        }

        .auth-toggle {
          margin-top: 24px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .toggle-link-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 0;
          transition: color var(--transition-fast);
        }

        .toggle-link-btn:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }
      `}} />
    </div>
  );
}
