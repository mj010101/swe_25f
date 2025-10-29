import React, { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Emergency from "./pages/Emergency";
import Device from "./pages/Device";
import Preference from "./pages/Preference";
import Cameras from "./pages/Cameras";
import FloorPlan from "./pages/FloorPlan";
import Notifications from "./pages/Notifications";
import Sensors from "./pages/Sensors";
import Recordings from "./pages/Recordings";
import BottomNav from "./components/BottomNav";
import { useTheme } from "./contexts/ThemeContext";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { isDark } = useTheme();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "emergency":
        return <Emergency />;
      case "device":
        return <Device />;
      case "cameras":
        return <Cameras />;
      case "floorplan":
        return <FloorPlan />;
      case "notifications":
        return <Notifications />;
      case "sensors":
        return <Sensors />;
      case "recordings":
        return <Recordings />;
      case "preference":
        return <Preference />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app" data-theme={isDark ? "dark" : "light"}>
      <header className="app-header">
        <h1>SafeHome</h1>
        <div className="header-status">
          <span className="status-indicator active"></span>
          <span className="status-text">System Active</span>
        </div>
      </header>

      <main className="app-content">{renderPage()}</main>

      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
