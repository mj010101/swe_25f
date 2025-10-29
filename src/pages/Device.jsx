import React, { useState } from "react";
import "./Device.css";

const Device = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);

  const rooms = [
    { id: "entrance", name: "Entrance", x: 10, y: 10, width: 25, height: 20 },
    { id: "living", name: "Living Room", x: 10, y: 35, width: 50, height: 45 },
    { id: "kitchen", name: "Kitchen", x: 65, y: 35, width: 25, height: 30 },
    { id: "bedroom1", name: "Bedroom 1", x: 10, y: 85, width: 30, height: 25 },
    { id: "bedroom2", name: "Bedroom 2", x: 45, y: 85, width: 30, height: 25 },
    { id: "bathroom", name: "Bathroom", x: 65, y: 70, width: 25, height: 15 },
    { id: "garage", name: "Garage", x: 35, y: 10, width: 30, height: 20 },
  ];

  const devicesByRoom = {
    entrance: [
      {
        id: 1,
        name: "Entrance Door Lock",
        type: "lock",
        status: "locked",
        active: true,
        settings: { autoLock: true, delay: 5 },
      },
      {
        id: 2,
        name: "Entrance Motion Sensor",
        type: "motion",
        status: "idle",
        active: true,
        settings: { sensitivity: 80 },
      },
      {
        id: 3,
        name: "Entrance Light",
        type: "light",
        status: "off",
        active: true,
        settings: { brightness: 100 },
      },
    ],
    living: [
      {
        id: 4,
        name: "Living Room Temperature Sensor",
        type: "temperature",
        status: "22°C",
        active: true,
        settings: { targetTemp: 22 },
      },
      {
        id: 5,
        name: "Living Room AC",
        type: "climate",
        status: "off",
        active: false,
        settings: { targetTemp: 24, mode: "cool" },
      },
      {
        id: 6,
        name: "Living Room TV",
        type: "entertainment",
        status: "on",
        active: true,
        settings: { volume: 15 },
      },
      {
        id: 7,
        name: "Living Room Light",
        type: "light",
        status: "on",
        active: true,
        settings: { brightness: 75 },
      },
    ],
    kitchen: [
      {
        id: 8,
        name: "Kitchen Gas Sensor",
        type: "gas",
        status: "warning",
        active: true,
        settings: { sensitivity: 90 },
      },
      {
        id: 9,
        name: "Kitchen Smoke Detector",
        type: "smoke",
        status: "normal",
        active: true,
        settings: { sensitivity: 85 },
      },
      {
        id: 10,
        name: "Kitchen Light",
        type: "light",
        status: "on",
        active: true,
        settings: { brightness: 100 },
      },
    ],
    bedroom1: [
      {
        id: 11,
        name: "Bedroom 1 Window Sensor",
        type: "window",
        status: "closed",
        active: true,
        settings: {},
      },
      {
        id: 12,
        name: "Bedroom 1 Temperature Sensor",
        type: "temperature",
        status: "20°C",
        active: true,
        settings: { targetTemp: 20 },
      },
      {
        id: 13,
        name: "Bedroom 1 Light",
        type: "light",
        status: "off",
        active: true,
        settings: { brightness: 50 },
      },
    ],
    bedroom2: [
      {
        id: 14,
        name: "Bedroom 2 Motion Sensor",
        type: "motion",
        status: "idle",
        active: true,
        settings: { sensitivity: 70 },
      },
      {
        id: 15,
        name: "Bedroom 2 Window Sensor",
        type: "window",
        status: "open",
        active: true,
        settings: {},
      },
    ],
    bathroom: [
      {
        id: 16,
        name: "Bathroom Humidity Sensor",
        type: "humidity",
        status: "65%",
        active: true,
        settings: {},
      },
      {
        id: 17,
        name: "Bathroom Water Leak Sensor",
        type: "water",
        status: "normal",
        active: true,
        settings: { sensitivity: 95 },
      },
    ],
    garage: [
      {
        id: 18,
        name: "Garage Door Sensor",
        type: "door",
        status: "closed",
        active: true,
        settings: {},
      },
      {
        id: 19,
        name: "Garage Motion Sensor",
        type: "motion",
        status: "detected",
        active: true,
        settings: { sensitivity: 85 },
      },
    ],
  };

  const camerasByRoom = {
    entrance: [
      {
        id: 1,
        name: "Entrance Camera",
        status: "Online",
        quality: "1080p",
        active: true,
        settings: { motion: true, night: true, recording: true },
      },
    ],
    living: [
      {
        id: 2,
        name: "Living Room Camera",
        status: "Online",
        quality: "1080p",
        active: true,
        settings: { motion: true, night: false, recording: true },
      },
    ],
    kitchen: [
      {
        id: 3,
        name: "Kitchen Camera",
        status: "Online",
        quality: "720p",
        active: true,
        settings: { motion: true, night: false, recording: false },
      },
    ],
    bedroom1: [
      {
        id: 4,
        name: "Bedroom 1 Camera",
        status: "Offline",
        quality: "1080p",
        active: false,
        settings: { motion: false, night: true, recording: false },
      },
    ],
    bedroom2: [],
    bathroom: [],
    garage: [
      {
        id: 5,
        name: "Garage Camera",
        status: "Online",
        quality: "720p",
        active: true,
        settings: { motion: true, night: true, recording: true },
      },
    ],
  };

  const getStatusColor = (room) => {
    const devices = devicesByRoom[room.id] || [];
    const hasWarning = devices.some(
      (d) =>
        d.status === "warning" ||
        d.status === "detected" ||
        d.status === "open",
    );
    if (hasWarning) return "#f59e0b";
    return "#10b981";
  };

  const toggleDeviceActive = () => {
    if (selectedDevice) {
      selectedDevice.active = !selectedDevice.active;
      setSelectedDevice({ ...selectedDevice });
    }
  };

  const toggleCameraActive = () => {
    if (selectedCamera) {
      selectedCamera.active = !selectedCamera.active;
      setSelectedCamera({ ...selectedCamera });
    }
  };

  return (
    <div className="device">
      {selectedDevice && (
        <div className="detail-modal">
          <button
            className="modal-back"
            onClick={() => setSelectedDevice(null)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <div className="detail-content">
            <div className="detail-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <h2>{selectedDevice.name}</h2>

            <div className="detail-status">
              <span className="status-label">Current Status:</span>
              <span
                className={`status-value ${
                  selectedDevice.status === "warning" ? "warning" : ""
                }`}
              >
                {selectedDevice.status}
              </span>
            </div>

            <div className="detail-toggle">
              <span>Active</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={selectedDevice.active}
                  onChange={toggleDeviceActive}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="detail-settings">
              <h3>Settings</h3>
              {Object.entries(selectedDevice.settings).map(([key, value]) => (
                <div key={key} className="setting-row">
                  <span className="setting-name">{key}</span>
                  <span className="setting-value">
                    {typeof value === "boolean"
                      ? value
                        ? "On"
                        : "Off"
                      : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedCamera && (
        <div className="detail-modal">
          <button
            className="modal-back"
            onClick={() => setSelectedCamera(null)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <div className="detail-content">
            <div className="camera-preview-large">
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              {selectedCamera.status === "Online" && (
                <div className="live-badge">● LIVE</div>
              )}
            </div>

            <h2>{selectedCamera.name}</h2>

            <div className="detail-status">
              <span className="status-label">Status:</span>
              <span
                className={`status-value ${
                  selectedCamera.status === "Offline" ? "offline" : ""
                }`}
              >
                {selectedCamera.status} • {selectedCamera.quality}
              </span>
            </div>

            <div className="detail-toggle">
              <span>Active</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={selectedCamera.active}
                  onChange={toggleCameraActive}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="detail-settings">
              <h3>Settings</h3>
              <div className="setting-row">
                <span className="setting-name">Motion Detection</span>
                <span className="setting-value">
                  {selectedCamera.settings.motion ? "On" : "Off"}
                </span>
              </div>
              <div className="setting-row">
                <span className="setting-name">Night Mode</span>
                <span className="setting-value">
                  {selectedCamera.settings.night ? "On" : "Off"}
                </span>
              </div>
              <div className="setting-row">
                <span className="setting-name">Recording</span>
                <span className="setting-value">
                  {selectedCamera.settings.recording ? "On" : "Off"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRoom && !selectedDevice && !selectedCamera && (
        <div className="room-detail">
          <button className="modal-back" onClick={() => setSelectedRoom(null)}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <h2 className="room-title">
            {rooms.find((r) => r.id === selectedRoom)?.name}
          </h2>

          <div className="section">
            <h3 className="section-title">
              Devices / Sensors
              <span className="count-badge">
                {(devicesByRoom[selectedRoom] || []).length}
              </span>
            </h3>
            <div className="device-list">
              {(devicesByRoom[selectedRoom] || []).map((device) => (
                <div
                  key={device.id}
                  className="device-item"
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="device-item-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="device-item-info">
                    <div className="device-item-name">{device.name}</div>
                    <div className="device-item-status">{device.status}</div>
                  </div>
                  <div
                    className={`device-item-indicator ${
                      device.active ? "active" : "inactive"
                    }`}
                  ></div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {(camerasByRoom[selectedRoom] || []).length > 0 && (
            <div className="section">
              <h3 className="section-title">
                CCTV Cameras
                <span className="count-badge">
                  {(camerasByRoom[selectedRoom] || []).length}
                </span>
              </h3>
              <div className="camera-list">
                {(camerasByRoom[selectedRoom] || []).map((camera) => (
                  <div
                    key={camera.id}
                    className="camera-item"
                    onClick={() => setSelectedCamera(camera)}
                  >
                    <div className="camera-thumbnail">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      {camera.status === "Online" && (
                        <div className="camera-live-badge">● LIVE</div>
                      )}
                    </div>
                    <div className="camera-item-info">
                      <div className="camera-item-name">{camera.name}</div>
                      <div className="camera-item-status">
                        {camera.status} • {camera.quality}
                      </div>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedRoom && (
        <>
          <h2 className="page-title">Device Management</h2>

          <div className="floorplan-container">
            <svg
              className="floorplan-svg"
              viewBox="0 0 100 120"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect
                x="5"
                y="5"
                width="90"
                height="110"
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="0.5"
              />

              {rooms.map((room) => (
                <g
                  key={room.id}
                  className="room"
                  onClick={() => setSelectedRoom(room.id)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={room.x}
                    y={room.y}
                    width={room.width}
                    height={room.height}
                    fill="var(--card-bg)"
                    stroke={getStatusColor(room)}
                    strokeWidth="0.8"
                    rx="1"
                  />
                  <text
                    x={room.x + room.width / 2}
                    y={room.y + room.height / 2 - 2}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="3"
                    fontWeight="600"
                  >
                    {room.name}
                  </text>
                  <text
                    x={room.x + room.width / 2}
                    y={room.y + room.height / 2 + 3}
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    fontSize="2.5"
                  >
                    {(devicesByRoom[room.id] || []).length +
                      (camerasByRoom[room.id] || []).length}{" "}
                    devices
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="device-summary">
            <div className="summary-item">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="summary-label">Total Devices</span>
              <span className="summary-value">
                {Object.values(devicesByRoom).flat().length}
              </span>
            </div>
            <div className="summary-item">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span className="summary-label">Cameras</span>
              <span className="summary-value">
                {Object.values(camerasByRoom).flat().length}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Device;
