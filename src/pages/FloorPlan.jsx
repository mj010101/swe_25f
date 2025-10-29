import React, { useState } from "react";
import "./FloorPlan.css";

const FloorPlan = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const rooms = [
    {
      id: "entrance",
      name: "Entrance",
      x: 10,
      y: 10,
      width: 25,
      height: 20,
      sensors: 3,
      status: "safe",
    },
    {
      id: "living",
      name: "Living Room",
      x: 10,
      y: 35,
      width: 50,
      height: 45,
      sensors: 5,
      status: "safe",
    },
    {
      id: "kitchen",
      name: "Kitchen",
      x: 65,
      y: 35,
      width: 25,
      height: 30,
      sensors: 4,
      status: "warning",
    },
    {
      id: "bedroom1",
      name: "Bedroom 1",
      x: 10,
      y: 85,
      width: 30,
      height: 25,
      sensors: 3,
      status: "safe",
    },
    {
      id: "bedroom2",
      name: "Bedroom 2",
      x: 45,
      y: 85,
      width: 30,
      height: 25,
      sensors: 2,
      status: "safe",
    },
    {
      id: "bathroom",
      name: "Bathroom",
      x: 65,
      y: 70,
      width: 25,
      height: 15,
      sensors: 2,
      status: "safe",
    },
    {
      id: "garage",
      name: "Garage",
      x: 35,
      y: 10,
      width: 30,
      height: 20,
      sensors: 2,
      status: "safe",
    },
  ];

  const sensors = [
    {
      id: 1,
      room: "entrance",
      name: "Entrance Door Sensor",
      type: "door",
      status: "closed",
      x: 15,
      y: 15,
    },
    {
      id: 2,
      room: "entrance",
      name: "Entrance Motion Sensor",
      type: "motion",
      status: "idle",
      x: 25,
      y: 20,
    },
    {
      id: 3,
      room: "living",
      name: "Living Room Motion Sensor",
      type: "motion",
      status: "idle",
      x: 30,
      y: 55,
    },
    {
      id: 4,
      room: "living",
      name: "Living Room Temperature Sensor",
      type: "temperature",
      status: "22°C",
      x: 45,
      y: 60,
    },
    {
      id: 5,
      room: "kitchen",
      name: "Kitchen Gas Sensor",
      type: "gas",
      status: "warning",
      x: 75,
      y: 50,
    },
    {
      id: 6,
      room: "kitchen",
      name: "Kitchen Smoke Detector",
      type: "smoke",
      status: "normal",
      x: 80,
      y: 55,
    },
    {
      id: 7,
      room: "bedroom1",
      name: "Bedroom 1 Window Sensor",
      type: "window",
      status: "closed",
      x: 20,
      y: 95,
    },
    {
      id: 8,
      room: "bedroom2",
      name: "Bedroom 2 Motion Sensor",
      type: "motion",
      status: "idle",
      x: 55,
      y: 95,
    },
    {
      id: 9,
      room: "garage",
      name: "Garage Door Sensor",
      type: "door",
      status: "closed",
      x: 50,
      y: 18,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "safe":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "alert":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  const getSensorIcon = (type) => {
    const icons = {
      door: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="1" width="18" height="22" rx="2" ry="2" />
          <circle cx="17" cy="12" r="1" />
        </svg>
      ),
      window: (
        <svg
          width="16"
          height="16"
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
      motion: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="2" />
          <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49" />
        </svg>
      ),
      temperature: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      ),
      gas: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
      ),
      smoke: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6" />
        </svg>
      ),
    };
    return icons[type] || icons.door;
  };

  return (
    <div className="floorplan">
      <div className="floorplan-header">
        <h2>Floor Plan</h2>
        <div className="legend">
          <span className="legend-item">
            <span className="legend-dot safe"></span>Safe
          </span>
          <span className="legend-item">
            <span className="legend-dot warning"></span>Warning
          </span>
          <span className="legend-item">
            <span className="legend-dot alert"></span>Alert
          </span>
        </div>
      </div>

      <div className="floorplan-container">
        <svg
          className="floorplan-svg"
          viewBox="0 0 100 120"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Border */}
          <rect
            x="5"
            y="5"
            width="90"
            height="110"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="0.5"
          />

          {/* Rooms */}
          {rooms.map((room) => (
            <g
              key={room.id}
              onClick={() =>
                setSelectedRoom(room.id === selectedRoom ? null : room.id)
              }
              style={{ cursor: "pointer" }}
            >
              <rect
                x={room.x}
                y={room.y}
                width={room.width}
                height={room.height}
                fill={
                  selectedRoom === room.id
                    ? "var(--primary-color)"
                    : "var(--card-bg)"
                }
                stroke={getStatusColor(room.status)}
                strokeWidth="0.8"
                opacity={selectedRoom === room.id ? "0.3" : "0.1"}
              />
              <text
                x={room.x + room.width / 2}
                y={room.y + room.height / 2}
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="3"
                fontWeight="600"
              >
                {room.name}
              </text>
              <text
                x={room.x + room.width / 2}
                y={room.y + room.height / 2 + 4}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="2"
              >
                {room.sensors} sensors
              </text>
            </g>
          ))}

          {/* Sensors */}
          {sensors
            .filter((sensor) => !selectedRoom || sensor.room === selectedRoom)
            .map((sensor) => (
              <g key={sensor.id}>
                <circle
                  cx={sensor.x}
                  cy={sensor.y}
                  r="2"
                  fill={
                    sensor.status === "warning"
                      ? "#f59e0b"
                      : "var(--primary-color)"
                  }
                  opacity="0.8"
                />
                <circle
                  cx={sensor.x}
                  cy={sensor.y}
                  r="3"
                  fill="none"
                  stroke={
                    sensor.status === "warning"
                      ? "#f59e0b"
                      : "var(--primary-color)"
                  }
                  strokeWidth="0.3"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    from="3"
                    to="5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
        </svg>
      </div>

      <div className="sensors-list">
        <h3>
          {selectedRoom
            ? rooms.find((r) => r.id === selectedRoom)?.name + " Sensors"
            : "All Sensors"}
        </h3>
        <div className="sensors-grid">
          {sensors
            .filter((sensor) => !selectedRoom || sensor.room === selectedRoom)
            .map((sensor) => (
              <div
                key={sensor.id}
                className={`sensor-item ${
                  sensor.status === "warning" ? "warning" : ""
                }`}
              >
                <span className="sensor-icon">
                  {getSensorIcon(sensor.type)}
                </span>
                <div className="sensor-details">
                  <div className="sensor-name">{sensor.name}</div>
                  <div className="sensor-status">{sensor.status}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {selectedRoom && (
        <button
          className="clear-selection"
          onClick={() => setSelectedRoom(null)}
        >
          View All
        </button>
      )}
    </div>
  );
};

export default FloorPlan;
