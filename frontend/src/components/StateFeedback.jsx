import React from "react";
import { AlertTriangle, Database, Info, RefreshCw, Compass } from "lucide-react";

export default function StateFeedback({ 
  type = "empty", // "loading" | "error" | "empty"
  message, 
  onRetry,
  title,
  actionButton
}) {
  if (type === "loading") {
    return (
      <div className="state-feedback-container loading glass-panel fade-in" style={{ 
        padding: "48px 32px", 
        textAlign: "center", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        gap: "16px",
        width: "100%",
        minHeight: "250px"
      }}>
        <Compass className="animate-spin" size={40} color="var(--primary)" />
        <div>
          <h4 style={{ color: "var(--text)", fontWeight: 600, fontSize: "16px", marginBottom: "4px" }}>{title || "Retrieving Data..."}</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{message || "Connecting to server. Please wait."}</p>
        </div>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="state-feedback-container error glass-panel fade-in" style={{ 
        padding: "48px 32px", 
        textAlign: "center", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        gap: "16px",
        width: "100%",
        minHeight: "250px",
        border: "1px dashed rgba(239, 68, 68, 0.3)",
        background: "rgba(239, 68, 68, 0.02)"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <AlertTriangle size={24} color="#ef4444" />
        </div>
        <div>
          <h4 style={{ color: "#ef4444", fontWeight: 600, fontSize: "16px", marginBottom: "4px" }}>{title || "Server Connection Failed"}</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
            {message || "We encountered an issue connecting to our servers. Check your network or retry."}
          </p>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="btn-primary" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              marginTop: "8px"
            }}
          >
            <RefreshCw size={14} className="retry-spinner" /> Retry Connection
          </button>
        )}
      </div>
    );
  }

  // Default: Empty state
  return (
    <div className="state-feedback-container empty glass-panel fade-in" style={{ 
      padding: "48px 32px", 
      textAlign: "center", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      gap: "16px",
      width: "100%",
      minHeight: "250px"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "rgba(100, 116, 139, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Database size={24} color="var(--text-muted)" style={{ opacity: 0.8 }} />
      </div>
      <div>
        <h4 style={{ color: "var(--text)", fontWeight: 600, fontSize: "16px", marginBottom: "4px" }}>{title || "No Results Found"}</h4>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
          {message || "There is no data to display here matching your request."}
        </p>
      </div>
      {actionButton}
    </div>
  );
}
