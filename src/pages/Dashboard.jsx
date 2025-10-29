import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = ({ onNavigate }) => {
  const [homeMode, setHomeMode] = useState("home");
  const [devicesState, setDevicesState] = useState({
    ceilingLights: true,
    smartLamp: false,
    number: true,
    tv: false,
  });

  const modes = [
    {
      id: "away",
      label: "Away",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      id: "home",
      label: "Home",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "sleep",
      label: "Sleep",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      id: "wilson",
      title: "Wilson",
      subtitle: "Ambient Mode: On",
      value: "25°C",
      status: "active",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
        </svg>
      ),
    },
    {
      id: "cooling",
      title: "Cooling Lights",
      subtitle: "Outdoor Area: On",
      value: "12:34",
      status: "active",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2v20M2 12h20M6.34 6.34l11.32 11.32M17.66 6.34L6.34 17.66" />
        </svg>
      ),
    },
  ];

  const rooms = [
    {
      name: "Bedroom",
      temp: "22°C",
      status: "normal",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a2 2 0 0 1 4 0v4" />
          <path d="M13 11V7a2 2 0 0 1 4 0v4" />
        </svg>
      ),
    },
    {
      name: "Smart Lamp",
      temp: "On",
      status: "active",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
    },
    {
      name: "Air Conditioner",
      temp: "25°C",
      status: "normal",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2v20M17 7l-5 5-5-5M7 17l5-5 5 5" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      name: "Living Room",
      temp: "23°C",
      status: "normal",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="9" width="18" height="11" rx="2" ry="2" />
          <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
          <line x1="9" y1="20" x2="9" y2="14" />
          <line x1="15" y1="20" x2="15" y2="14" />
        </svg>
      ),
    },
  ];

  // All stats colors are now blue theme
  const stats = [
    { label: "Active Devices", value: "8", color: "var(--accent-blue)" },
    { label: "Today's Events", value: "3", color: "rgba(10, 132, 255, 0.8)" },
    { label: "Alerts", value: "2", color: "rgba(10, 132, 255, 0.6)" },
  ];

  // Recent Activity Logs with video recording
  const recentLogs = [
    {
      id: 1,
      time: "10:30 AM",
      title: "Front Door Motion Detected",
      location: "Entrance",
      hasVideo: true,
      type: "motion",
    },
    {
      id: 2,
      time: "09:15 AM",
      title: "Door Lock Activated",
      location: "Front Door",
      hasVideo: false,
      type: "lock",
    },
    {
      id: 3,
      time: "08:00 AM",
      title: "Window Opened",
      location: "Bedroom",
      hasVideo: true,
      type: "window",
    },
  ];

  const toggleDevice = (device) => {
    setDevicesState((prev) => ({ ...prev, [device]: !prev[device] }));
  };

  const getLogIcon = (type) => {
    switch (type) {
      case "motion":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="2" />
            <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49" />
          </svg>
        );
      case "lock":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case "window":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {/* Hero Status Card - Premium Design */}
      <div className="hero-card">
        <div className="hero-header">
          <h2 className="hero-title">SMART CONTROL</h2>
          <div className="mode-selector-compact">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={`mode-btn-compact ${
                  homeMode === mode.id ? "active" : ""
                }`}
                onClick={() => setHomeMode(mode.id)}
                title={mode.label}
              >
                {mode.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Camera Preview Area */}
        <div className="camera-preview">
          <div className="live-indicator">
            <span className="live-dot"></span>
            LIVE
          </div>
          <svg
            className="camera-icon"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <p className="camera-label">Living Room Camera</p>
        </div>

        {/* Room Info */}
        <div className="hero-room-info">
          <div className="room-name">Living Room</div>
          <div className="room-status">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
            <span>Automatic Mode - 25°</span>
          </div>
        </div>

        {/* Device Toggles */}
        <div className="device-toggles">
          {[
            { id: "ceilingLights", label: "Ceiling lights" },
            { id: "smartLamp", label: "Smart lamp" },
            { id: "number", label: "Number" },
            { id: "tv", label: "TV" },
          ].map((device) => (
            <button
              key={device.id}
              className={`toggle-device ${
                devicesState[device.id] ? "active" : ""
              }`}
              onClick={() => toggleDevice(device.id)}
            >
              <div className="toggle-icon">
                {devicesState[device.id] ? "◼" : "◻"}
              </div>
              <span className="toggle-label">{device.label}</span>
            </button>
          ))}
        </div>

        {/* Status Footer */}
        <div className="hero-footer">
          <div className="armed-status">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Armed Status</span>
          </div>
          <div className="time-status">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="status-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "68%" }}></div>
          </div>
        </div>

        {/* Configure Button */}
        <div className="hero-actions">
          <button className="btn-secondary">Configure</button>
          <button className="btn-primary">
            <span className="status-dot active"></span>
            On
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <section className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className={`quick-action-card ${action.status}`}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h4 className="action-title">{action.title}</h4>
                <p className="action-subtitle">{action.subtitle}</p>
                <div className="action-value">{action.value}</div>
              </div>
              <button className="action-btn">Connect</button>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Row */}
      <section className="stats-section">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ "--stat-color": stat.color }}
          >
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Recent Activity Logs */}
      <section className="logs-section">
        <h3 className="section-title">Recent Activity</h3>
        <div className="logs-list">
          {recentLogs.map((log) => (
            <div key={log.id} className="log-item">
              <div className="log-icon">{getLogIcon(log.type)}</div>
              <div className="log-content">
                <div className="log-title">{log.title}</div>
                <div className="log-meta">
                  <span className="log-time">{log.time}</span>
                  <span className="log-divider">•</span>
                  <span className="log-location">{log.location}</span>
                </div>
              </div>
              {log.hasVideo && (
                <button
                  className="log-video-btn"
                  onClick={() => onNavigate && onNavigate("recordings")}
                  title="View Recording"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* All Conditions Grid */}
      <section className="conditions-section">
        <h3 className="section-title">All Conditions</h3>
        <div className="conditions-grid">
          {rooms.map((room, index) => (
            <div key={index} className={`condition-card ${room.status}`}>
              <div className="condition-icon">{room.icon}</div>
              <div className="condition-name">{room.name}</div>
              <div className="condition-value">{room.temp}</div>
              {room.status === "active" && (
                <div className="condition-indicator"></div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
