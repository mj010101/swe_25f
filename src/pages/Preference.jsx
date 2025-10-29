import React, { useState } from "react";
import "./Preference.css";
import { useTheme } from "../contexts/ThemeContext";

const Preference = () => {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    autoLock: true,
    nightMode: false,
    soundAlerts: true,
    emailAlerts: false,
    smsAlerts: true,
  });

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const settingGroups = [
    {
      title: "Display",
      items: [
        {
          key: "darkMode",
          label: "Dark Mode",
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ),
          isTheme: true,
        },
      ],
    },
    {
      title: "Notification Settings",
      items: [
        {
          key: "notifications",
          label: "Push Notifications",
          icon: (
            <svg
              width="20"
              height="20"
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
          key: "emailAlerts",
          label: "Email Alerts",
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          ),
        },
        {
          key: "smsAlerts",
          label: "SMS Alerts",
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
        },
        {
          key: "soundAlerts",
          label: "Sound Alerts",
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "Security Settings",
      items: [
        {
          key: "autoLock",
          label: "Auto Lock",
          icon: (
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
          ),
        },
        {
          key: "nightMode",
          label: "Night Mode",
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ),
        },
      ],
    },
  ];

  const menuItems = [
    {
      label: "Account Info",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      action: "account",
    },
    {
      label: "Connected Devices",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      action: "devices",
    },
    {
      label: "Security Logs",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      action: "logs",
    },
    {
      label: "Usage Statistics",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      action: "stats",
    },
    {
      label: "Help",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      action: "help",
    },
    {
      label: "Customer Support",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      action: "support",
    },
  ];

  return (
    <div className="preference">
      <section className="profile-section">
        <div className="profile-card">
          <div className="profile-avatar">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="profile-info">
            <div className="profile-name">John Doe</div>
            <div className="profile-email">john.doe@example.com</div>
          </div>
          <button className="edit-profile-button">Edit</button>
        </div>
      </section>

      {settingGroups.map((group, index) => (
        <section key={index} className="section">
          <h2 className="section-title">{group.title}</h2>
          <div className="settings-list">
            {group.items.map((item) => (
              <div key={item.key} className="setting-item">
                <div className="setting-info">
                  <span className="setting-icon">{item.icon}</span>
                  <span className="setting-label">{item.label}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={item.isTheme ? isDark : settings[item.key]}
                    onChange={() =>
                      item.isTheme ? toggleTheme() : toggleSetting(item.key)
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="section">
        <h2 className="section-title">More</h2>
        <div className="menu-list">
          {menuItems.map((item, index) => (
            <button key={index} className="menu-item">
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow">›</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <button className="logout-button">Logout</button>
        <div className="app-version">Version 1.0.0</div>
      </section>
    </div>
  );
};

export default Preference;
