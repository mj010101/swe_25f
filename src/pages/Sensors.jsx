import React, { useState } from "react";
import "./Sensors.css";

const Sensors = () => {
  const [selectedType, setSelectedType] = useState("all");

  const sensors = [
    {
      id: 1,
      name: "Entrance Door Sensor",
      type: "door",
      room: "Entrance",
      status: "closed",
      battery: 85,
      lastUpdate: "Just now",
    },
    {
      id: 2,
      name: "Entrance Motion Sensor",
      type: "motion",
      room: "Entrance",
      status: "idle",
      battery: 72,
      lastUpdate: "1 min ago",
    },
    {
      id: 3,
      name: "Living Room Motion Sensor",
      type: "motion",
      room: "Living Room",
      status: "idle",
      battery: 90,
      lastUpdate: "5 min ago",
    },
    {
      id: 4,
      name: "Living Room Temperature Sensor",
      type: "temperature",
      room: "Living Room",
      status: "22°C",
      battery: 68,
      lastUpdate: "Just now",
    },
    {
      id: 5,
      name: "Living Room Humidity Sensor",
      type: "humidity",
      room: "Living Room",
      status: "45%",
      battery: 55,
      lastUpdate: "10 min ago",
    },
    {
      id: 6,
      name: "Kitchen Gas Sensor",
      type: "gas",
      room: "Kitchen",
      status: "warning",
      battery: 40,
      lastUpdate: "Just now",
    },
    {
      id: 7,
      name: "Kitchen Smoke Detector",
      type: "smoke",
      room: "Kitchen",
      status: "normal",
      battery: 92,
      lastUpdate: "2 min ago",
    },
    {
      id: 8,
      name: "Kitchen Temperature Sensor",
      type: "temperature",
      room: "Kitchen",
      status: "24°C",
      battery: 78,
      lastUpdate: "1 min ago",
    },
    {
      id: 9,
      name: "Bedroom 1 Window Sensor",
      type: "window",
      room: "Bedroom 1",
      status: "closed",
      battery: 88,
      lastUpdate: "30 min ago",
    },
    {
      id: 10,
      name: "Bedroom 1 Temperature Sensor",
      type: "temperature",
      room: "Bedroom 1",
      status: "20°C",
      battery: 75,
      lastUpdate: "Just now",
    },
    {
      id: 11,
      name: "Bedroom 2 Motion Sensor",
      type: "motion",
      room: "Bedroom 2",
      status: "idle",
      battery: 15,
      lastUpdate: "5 min ago",
    },
    {
      id: 12,
      name: "Bedroom 2 Window Sensor",
      type: "window",
      room: "Bedroom 2",
      status: "open",
      battery: 82,
      lastUpdate: "1 hour ago",
    },
    {
      id: 13,
      name: "Bathroom Humidity Sensor",
      type: "humidity",
      room: "Bathroom",
      status: "65%",
      battery: 70,
      lastUpdate: "2 min ago",
    },
    {
      id: 14,
      name: "Bathroom Water Leak Sensor",
      type: "water",
      room: "Bathroom",
      status: "normal",
      battery: 95,
      lastUpdate: "Just now",
    },
    {
      id: 15,
      name: "Garage Door Sensor",
      type: "door",
      room: "Garage",
      status: "closed",
      battery: 60,
      lastUpdate: "10 min ago",
    },
    {
      id: 16,
      name: "Garage Motion Sensor",
      type: "motion",
      room: "Garage",
      status: "detected",
      battery: 77,
      lastUpdate: "Just now",
    },
  ];

  const sensorTypes = [
    {
      id: "all",
      label: "All",
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
    },
    {
      id: "door",
      label: "Door",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="1" width="18" height="22" rx="2" ry="2" />
          <circle cx="17" cy="12" r="1" />
        </svg>
      ),
    },
    {
      id: "window",
      label: "Window",
      icon: (
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
      ),
    },
    {
      id: "motion",
      label: "Motion",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="2" />
          <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
        </svg>
      ),
    },
    {
      id: "temperature",
      label: "Temp",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      ),
    },
    {
      id: "humidity",
      label: "Humidity",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
    {
      id: "gas",
      label: "Gas",
      icon: (
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
      ),
    },
    {
      id: "smoke",
      label: "Smoke",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      ),
    },
    {
      id: "water",
      label: "Water",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
  ];

  const getSensorStatus = (sensor) => {
    if (sensor.battery < 20) return "critical";
    if (
      sensor.status === "warning" ||
      sensor.status === "detected" ||
      sensor.status === "open"
    )
      return "warning";
    return "normal";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "var(--danger-color)";
      case "warning":
        return "var(--warning-color)";
      case "normal":
        return "var(--secondary-color)";
      default:
        return "var(--text-secondary)";
    }
  };

  const filteredSensors =
    selectedType === "all"
      ? sensors
      : sensors.filter((s) => s.type === selectedType);

  const stats = {
    total: sensors.length,
    active: sensors.filter((s) => getSensorStatus(s) === "normal").length,
    warning: sensors.filter((s) => getSensorStatus(s) === "warning").length,
    critical: sensors.filter((s) => getSensorStatus(s) === "critical").length,
  };

  return (
    <div className="sensors">
      <div className="sensors-header">
        <h2>Sensor Monitoring</h2>
      </div>

      <div className="sensors-stats">
        <div className="stat-box">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-box normal">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Normal</div>
        </div>
        <div className="stat-box warning">
          <div className="stat-number">{stats.warning}</div>
          <div className="stat-label">Warning</div>
        </div>
        <div className="stat-box critical">
          <div className="stat-number">{stats.critical}</div>
          <div className="stat-label">Critical</div>
        </div>
      </div>

      <div className="sensor-types">
        {sensorTypes.map((type) => (
          <button
            key={type.id}
            className={`type-btn ${selectedType === type.id ? "active" : ""}`}
            onClick={() => setSelectedType(type.id)}
          >
            <span className="type-icon">{type.icon}</span>
            <span className="type-label">{type.label}</span>
          </button>
        ))}
      </div>

      <div className="sensors-grid">
        {filteredSensors.map((sensor) => {
          const status = getSensorStatus(sensor);
          return (
            <div key={sensor.id} className={`sensor-card ${status}`}>
              <div className="sensor-card-header">
                <div className="sensor-type-icon">
                  {sensorTypes.find((t) => t.id === sensor.type)?.icon}
                </div>
                <div
                  className="sensor-status-indicator"
                  style={{ backgroundColor: getStatusColor(status) }}
                ></div>
              </div>

              <div className="sensor-card-body">
                <div className="sensor-card-name">{sensor.name}</div>
                <div className="sensor-card-room">{sensor.room}</div>
                <div className="sensor-card-value">{sensor.status}</div>
              </div>

              <div className="sensor-card-footer">
                <div className="battery-indicator">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
                    <line x1="23" y1="13" x2="23" y2="11" />
                    <rect
                      x="3"
                      y="8"
                      width={sensor.battery * 0.14}
                      height="8"
                      fill={
                        sensor.battery < 20
                          ? "var(--danger-color)"
                          : "currentColor"
                      }
                    />
                  </svg>
                  <span className={sensor.battery < 20 ? "low-battery" : ""}>
                    {sensor.battery}%
                  </span>
                </div>
                <div className="last-update">{sensor.lastUpdate}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sensors;
