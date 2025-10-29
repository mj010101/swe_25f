import React, { useState } from "react";
import "./Emergency.css";

const Emergency = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const emergencyContacts = [
    { name: "Police", number: "112", type: "police" },
    { name: "Fire Department", number: "119", type: "fire" },
    { name: "Hospital", number: "1339", type: "medical" },
    { name: "Security", number: "02-1234-5678", type: "security" },
  ];

  const emergencyActions = [
    { label: "Sound Alarm", action: "alarm" },
    { label: "Call Police", action: "police" },
    { label: "Lock All Doors", action: "lockall" },
    { label: "Turn On Lights", action: "lights" },
  ];

  const getContactIcon = (type) => {
    switch (type) {
      case "police":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case "fire":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        );
      case "medical":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        );
      case "security":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "alarm":
        return (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
      case "police":
        return (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        );
      case "lockall":
        return (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case "lights":
        return (
          <svg
            width="28"
            height="28"
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
        );
      default:
        return null;
    }
  };

  const recentAlerts = [
    {
      time: "2 days ago",
      type: "Intrusion Detected",
      location: "Back Door",
      severity: "high",
    },
    {
      time: "1 week ago",
      type: "Fire Sensor",
      location: "Kitchen",
      severity: "medium",
    },
    {
      time: "2 weeks ago",
      type: "Door Open",
      location: "Entrance",
      severity: "low",
    },
  ];

  const handleEmergencyToggle = () => {
    setIsEmergencyActive(!isEmergencyActive);
  };

  return (
    <div className="emergency">
      <section className="emergency-panel">
        <button
          className={`emergency-button ${isEmergencyActive ? "active" : ""}`}
          onClick={handleEmergencyToggle}
        >
          <div className="emergency-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="emergency-text">
            {isEmergencyActive ? "Emergency Mode Active" : "Emergency Alert"}
          </div>
        </button>
        {isEmergencyActive && (
          <div className="emergency-message">
            All entrances are locked. Police have been notified.
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Emergency Contacts</h2>
        <div className="contacts-grid">
          {emergencyContacts.map((contact, index) => (
            <a
              key={index}
              href={`tel:${contact.number}`}
              className={`contact-card ${contact.type}`}
            >
              <div className="contact-icon">{getContactIcon(contact.type)}</div>
              <div className="contact-name">{contact.name}</div>
              <div className="contact-number">{contact.number}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Emergency Actions</h2>
        <div className="actions-grid">
          {emergencyActions.map((action, index) => (
            <button key={index} className="action-card">
              <div className="action-icon">{getActionIcon(action.action)}</div>
              <div className="action-label">{action.label}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Recent Alerts</h2>
        <div className="alerts-list">
          {recentAlerts.map((alert, index) => (
            <div
              key={index}
              className={`alert-item severity-${alert.severity}`}
            >
              <div className="alert-indicator"></div>
              <div className="alert-content">
                <div className="alert-header">
                  <span className="alert-type">{alert.type}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <div className="alert-location">Location: {alert.location}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Emergency;
