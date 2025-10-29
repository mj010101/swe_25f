import React, { useState } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Intrusion Detected",
      message: "Abnormal movement detected at the back door.",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Gas Sensor Warning",
      message: "Gas sensor in kitchen detected anomaly.",
      time: "15 min ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "System Update",
      message: "SafeHome system has been successfully updated.",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      type: "success",
      title: "Auto-Lock Activated",
      message: "All entrances have been automatically locked.",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 5,
      type: "alert",
      title: "Smoke Detected",
      message: "Smoke was detected in the kitchen.",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 6,
      type: "info",
      title: "Low Battery",
      message: "Entrance sensor battery is below 20%.",
      time: "5 hours ago",
      read: true,
    },
    {
      id: 7,
      type: "success",
      title: "Security Mode Disabled",
      message: "Home security mode has been deactivated.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 8,
      type: "info",
      title: "Camera Offline",
      message: "Bedroom camera is in offline status.",
      time: "Yesterday",
      read: true,
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "alert":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case "warning":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case "success":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case "info":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-tab ${filter === "unread" ? "active" : ""}`}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
        <button
          className={`filter-tab ${filter === "alert" ? "active" : ""}`}
          onClick={() => setFilter("alert")}
        >
          Alerts
        </button>
        <button
          className={`filter-tab ${filter === "info" ? "active" : ""}`}
          onClick={() => setFilter("info")}
        >
          Info
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${notif.type} ${
                notif.read ? "read" : "unread"
              }`}
            >
              <div className={`notification-icon ${notif.type}`}>
                {getIcon(notif.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notif.title}</div>
                <div className="notification-message">{notif.message}</div>
                <div className="notification-time">{notif.time}</div>
              </div>
              {!notif.read && <div className="unread-indicator"></div>}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
