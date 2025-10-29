import React, { useState } from "react";
import "./Cameras.css";

const Cameras = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isRecording, setIsRecording] = useState({});

  const cameras = [
    {
      id: 1,
      name: "Entrance Camera",
      location: "Entrance",
      status: "Online",
      quality: "1080p",
    },
    {
      id: 2,
      name: "Living Room Camera",
      location: "Living Room",
      status: "Online",
      quality: "1080p",
    },
    {
      id: 3,
      name: "Kitchen Camera",
      location: "Kitchen",
      status: "Online",
      quality: "720p",
    },
    {
      id: 4,
      name: "Bedroom Camera",
      location: "Bedroom",
      status: "Offline",
      quality: "1080p",
    },
    {
      id: 5,
      name: "Back Door Camera",
      location: "Back Door",
      status: "Online",
      quality: "720p",
    },
    {
      id: 6,
      name: "Garage Camera",
      location: "Garage",
      status: "Online",
      quality: "1080p",
    },
  ];

  const toggleRecording = (id) => {
    setIsRecording((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="cameras">
      <div className="cameras-header">
        <h2>Live Cameras</h2>
        <div className="cameras-stats">
          <span className="stat-item">
            <span className="stat-value">
              {cameras.filter((c) => c.status === "Online").length}
            </span>
            <span className="stat-label">Online</span>
          </span>
          <span className="stat-item">
            <span className="stat-value">
              {Object.keys(isRecording).filter((k) => isRecording[k]).length}
            </span>
            <span className="stat-label">Recording</span>
          </span>
        </div>
      </div>

      {selectedCamera ? (
        <div className="camera-fullscreen">
          <button
            className="close-button"
            onClick={() => setSelectedCamera(null)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="camera-feed-large">
            <div className="live-indicator">● LIVE</div>
            <div className="camera-feed-placeholder">
              <svg
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
              <p>{cameras.find((c) => c.id === selectedCamera)?.name}</p>
            </div>
          </div>

          <div className="camera-controls">
            <button className="control-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Snapshot
            </button>
            <button
              className={`control-btn ${
                isRecording[selectedCamera] ? "recording" : ""
              }`}
              onClick={() => toggleRecording(selectedCamera)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isRecording[selectedCamera] ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              {isRecording[selectedCamera] ? "Stop Recording" : "Record"}
            </button>
            <button className="control-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              Audio
            </button>
          </div>

          <div className="direction-controls">
            <div className="direction-pad">
              <button className="dir-btn up">▲</button>
              <button className="dir-btn left">◀</button>
              <button className="dir-btn center">●</button>
              <button className="dir-btn right">▶</button>
              <button className="dir-btn down">▼</button>
            </div>
            <div className="zoom-controls">
              <button className="zoom-btn">+</button>
              <button className="zoom-btn">−</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="cameras-grid">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className={`camera-card ${
                camera.status === "Offline" ? "offline" : ""
              }`}
              onClick={() =>
                camera.status === "Online" && setSelectedCamera(camera.id)
              }
            >
              <div className="camera-preview">
                {camera.status === "Online" ? (
                  <>
                    <div className="live-badge">● LIVE</div>
                    <div className="camera-placeholder">
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
                    </div>
                  </>
                ) : (
                  <div className="offline-overlay">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.3" />
                      <path d="M7 17a5 5 0 0 1 9.7-1.7" />
                    </svg>
                    <p>Offline</p>
                  </div>
                )}
                {isRecording[camera.id] && (
                  <div className="recording-indicator">● REC</div>
                )}
              </div>
              <div className="camera-info">
                <h3>{camera.name}</h3>
                <div className="camera-meta">
                  <span className="location">{camera.location}</span>
                  <span className="quality">{camera.quality}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cameras;
