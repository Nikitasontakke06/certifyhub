import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to CertifyHub! 👋 I am your learning assistant. Ask me anything about programming, data science, careers, salaries, or comparing courses!",
      isBot: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputVal,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputVal("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseText = getBotResponse(userMessage.text);
      const botReply = {
        id: Date.now() + 1,
        text: responseText,
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (query) => {
    const text = query.toLowerCase();

    if (text.includes("python") || text.includes("javascript") || text.includes("programming") || text.includes("web") || text.includes("coding") || text.includes("developer")) {
      return "For Programming & Web Development, Udemy's **Complete Python Bootcamp** and PW Skills' **Full Stack Web Development** are excellent options. You can use our sidebar filters to narrow down platforms!";
    }
    if (text.includes("data") || text.includes("datascience") || text.includes("ai") || text.includes("ml") || text.includes("machine") || text.includes("neural")) {
      return "For Data Science & AI, I highly recommend Coursera's **IBM Data Science Professional Certificate** or Great Learning's **PG Program in AI & ML**. Both offer strong foundations and verified syllabi.";
    }
    if (text.includes("cloud") || text.includes("devops") || text.includes("aws") || text.includes("azure")) {
      return "Cloud & DevOps is in high demand! Great Learning's **Cloud Computing** program covers multi-cloud architectures (AWS & Azure) and infrastructure-as-code.";
    }
    if (text.includes("compare") || text.includes("comparison") || text.includes("matrix")) {
      return "To compare courses side-by-side: go to the **COURSES** page, hover over a course card, and click **Add to Compare**. You can overlay up to 3 courses to see syllabus details, user reviews, and INR prices!";
    }
    if (text.includes("salary") || text.includes("jobs") || text.includes("lpa") || text.includes("careers")) {
      return "Check out our **Trending Careers** page! It displays real-time vacancies, Expected Salary ranges in LPA (Lakhs Per Annum), and required skill maps, complete with 7-day demand trend charts.";
    }
    if (text.includes("swayam") || text.includes("free") || text.includes("government")) {
      return "Swayam is India's national education portal. It hosts free, government-approved certifications from premium institutes (like IITs and IIMs), offering verified quality at no cost.";
    }
    if (text.includes("udemy") || text.includes("coursera") || text.includes("great learning") || text.includes("simplilearn") || text.includes("pw skills")) {
      return "We aggregate courses from top platforms including Udemy, Coursera, Great Learning, Simplilearn, PW Skills, and Swayam. You can sort listings by price to get the best tiers in Indian Rupees (INR)!";
    }
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return "Hello! How can I assist you with your learning path today? Try asking me about 'Python', 'Compare courses', or 'LPA salaries'.";
    }

    return "I'm here to help! You can ask me about particular topics like 'Python courses', 'Swayam certifications', 'How to compare', or 'Trending careers' to get started.";
  };

  return (
    <div className="chatbot-container">
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`chatbot-toggle-btn ${isOpen ? "active" : ""}`}
        title="Chat with CertifyHub Helper"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window glass-panel fade-in">
          {/* Header */}
          <div className="chat-header">
            <div className="bot-profile">
              <div className="bot-avatar">
                <Bot size={18} />
              </div>
              <div className="bot-info">
                <h4>CertifyHub Helper</h4>
                <div className="status">
                  <span className="dot"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="chat-close-btn">
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message-row ${msg.isBot ? "bot" : "user"}`}>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="msg-time">{msg.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-row bot">
                <div className="message-bubble typing-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Area */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              placeholder="Ask about courses, salaries, compare..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!inputVal.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .chatbot-container {
          position: relative;
        }

        .chatbot-toggle-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, #ff5500 100%);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(255, 115, 0, 0.4);
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .chatbot-toggle-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 10px 28px rgba(255, 115, 0, 0.6);
        }

        .chatbot-toggle-btn:active {
          transform: scale(0.95);
        }

        .chatbot-toggle-btn.active {
          background: var(--bg-tertiary);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
        }

        /* Chat Window styling */
        .chat-window {
          position: fixed;
          bottom: 96px;
          right: 28px;
          width: 380px;
          height: 520px;
          background: rgba(22, 24, 32, 0.9);
          border: 1px solid var(--border-color);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          z-index: 9999;
          overflow: hidden;
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(13, 14, 18, 0.6);
          border-bottom: 1px solid var(--border-color);
        }

        .bot-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bot-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 115, 0, 0.2);
        }

        .bot-info h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 2px;
          text-align: left;
        }

        .bot-info .status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .bot-info .status .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10b981;
          display: inline-block;
        }

        .chat-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .chat-close-btn:hover {
          color: #fff;
        }

        /* Messages area styling */
        .chat-messages {
          flex-grow: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: rgba(0, 0, 0, 0.1);
        }

        .message-row {
          display: flex;
          width: 100%;
        }

        .message-row.bot {
          justify-content: flex-start;
        }

        .message-row.user {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.85rem;
          line-height: 1.5;
          text-align: left;
        }

        .bot .message-bubble {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-bottom-left-radius: 4px;
        }

        .user .message-bubble {
          background: linear-gradient(135deg, var(--primary) 0%, #ff5500 100%);
          color: #fff;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(255, 115, 0, 0.15);
        }

        .message-bubble p {
          margin: 0;
          word-break: break-word;
        }

        .msg-time {
          display: block;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-align: right;
          margin-top: 4px;
        }

        .bot .msg-time {
          color: var(--text-muted);
        }

        /* Typing indicator styling */
        .typing-bubble {
          padding: 12px 20px !important;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 12px;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background-color: var(--text-muted);
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        /* Input Form styling */
        .chat-input-form {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: rgba(13, 14, 18, 0.6);
          border-top: 1px solid var(--border-color);
          gap: 12px;
        }

        .chat-input {
          flex-grow: 1;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .chat-input:focus {
          border-color: var(--primary);
        }

        .chat-send-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .chat-send-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: scale(1.05);
        }

        .chat-send-btn:disabled {
          background: var(--bg-tertiary);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .chat-window {
            bottom: 84px;
            right: 16px;
            width: calc(100vw - 32px);
            height: calc(100vh - 120px);
          }
          .chatbot-toggle-btn {
            bottom: 16px;
            right: 16px;
          }
        }
      `}} />
    </div>
  );
}
