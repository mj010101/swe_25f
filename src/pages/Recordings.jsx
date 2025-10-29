import React, { useState } from "react";
import "./Recordings.css";

const Recordings = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const recordings = [
    {
      id: 1,
      title: "Front Door Lock Confirmed",
      camera: "Entrance Camera",
      date: "2024-10-29",
      time: "10:30:15",
      duration: "00:15",
      thumbnail: "entrance",
    },
    {
      id: 2,
      title: "Motion Detected - Bedroom",
      camera: "Bedroom Camera",
      date: "2024-10-29",
      time: "09:15:42",
      duration: "00:32",
      thumbnail: "bedroom",
    },
    {
      id: 3,
      title: "Living Room Activity Detected",
      camera: "Living Room Camera",
      date: "2024-10-28",
      time: "18:22:11",
      duration: "01:05",
      thumbnail: "living",
    },
    {
      id: 4,
      title: "Kitchen Gas Sensor Warning",
      camera: "Kitchen Camera",
      date: "2024-10-28",
      time: "12:45:33",
      duration: "00:45",
      thumbnail: "kitchen",
    },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: selectedVideo?.title,
          text: `Recording: ${selectedVideo?.title}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("Share link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    alert("Downloading video...");
  };

  return (
    <div className="recordings">
      {selectedVideo ? (
        <div className="video-viewer">
          <button
            className="back-button"
            onClick={() => {
              setSelectedVideo(null);
              setIsPlaying(false);
            }}
          >
            <svg
              width="24"
              height="24"
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

          <div className="video-container">
            <div className={`video-player ${isPlaying ? "playing" : ""}`}>
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <circle cx="12" cy="12" r="6" />
              </svg>
              {!isPlaying && (
                <button
                  className="play-button"
                  onClick={() => setIsPlaying(true)}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              )}
              <div className="video-time">{selectedVideo.time}</div>
            </div>

            <div className="video-controls">
              <button className="control-button">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                </svg>
              </button>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: isPlaying ? "50%" : "0%" }}
                ></div>
              </div>

              <span className="duration-text">{selectedVideo.duration}</span>
            </div>
          </div>

          <div className="video-info">
            <h2>{selectedVideo.title}</h2>
            <div className="video-meta">
              <span className="meta-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                {selectedVideo.camera}
              </span>
              <span className="meta-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {selectedVideo.date} {selectedVideo.time}
              </span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn share" onClick={handleShare}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
            <button className="action-btn download" onClick={handleDownload}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="recordings-header">
            <h2>Recordings</h2>
            <span className="recordings-count">{recordings.length} videos</span>
          </div>

          <div className="recordings-grid">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="recording-card"
                onClick={() => setSelectedVideo(recording)}
              >
                <div className="recording-thumbnail">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <div className="duration-badge">{recording.duration}</div>
                </div>
                <div className="recording-info">
                  <h3>{recording.title}</h3>
                  <p className="recording-camera">{recording.camera}</p>
                  <p className="recording-datetime">
                    {recording.date} {recording.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recordings;
