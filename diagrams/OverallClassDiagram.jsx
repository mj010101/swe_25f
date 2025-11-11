import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "monospace",
});

// Individual Diagram Components
const SystemArchitectureOverview = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>System Architecture Overview</h2>
      <div className="mermaid" ref={diagramRef}>
        {`graph TB
    subgraph "Frontend Layer"
        MobileApp[Mobile App Client]
        WebClient[Web Client]
        ControlPanel[Control Panel Client]
    end

    subgraph "Core Platform"
        Hub[SafeHome Hub]
        Cloud[Cloud Service]
        Config[Configuration Manager]
        Storage[Storage Manager]
    end

    subgraph "Security Layer"
        Auth[Authentication Service]
        Authz[Authorization Service]
        SecurityMode[Security Mode Manager]
    end

    subgraph "Device Layer"
        Sensors[Sensors]
        Cameras[Cameras]
        SmartDevices[Smart Home Devices]
        Sirens[Internal Sirens]
    end

    subgraph "Service Layer"
        Notification[Notification Service]
        Incident[Incident Manager]
        Automation[Automation Rules]
        Media[Media Repository]
    end

    subgraph "Emergency Layer"
        Emergency[External Security Service]
        AutoCall[Automated Call Service]
        Panic[Panic Button]
    end

    MobileApp --> Hub
    WebClient --> Cloud
    ControlPanel --> Hub

    Hub --> Cloud
    Hub --> Config
    Hub --> SecurityMode
    Hub --> Sensors
    Hub --> Cameras

    Auth --> Cloud
    Authz --> Auth

    SecurityMode --> Sensors

    Incident --> Emergency
    Incident --> Notification

    Sensors --> Incident
    Cameras --> Media

    style Hub fill:#2196F3
    style Cloud fill:#4CAF50
    style Auth fill:#FF9800
    style Incident fill:#F44336`}
      </div>
    </div>
  );
};

const BaseClassesDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>1. Base Classes & Common Abstractions</h2>
      <div className="mermaid" ref={diagramRef}>
        {`classDiagram
    class Service {
        <<abstract>>
        +execute() void
        +validate() boolean
        +handleError(error: Error) void
    }

    class Device {
        <<abstract>>
        +deviceId: string
        +name: string
        +model: string
        +manufacturer: string
        +firmwareVersion: string
        +batteryLevel: number
        +isOnline: boolean
        +lastSeen: DateTime
        +installationDate: DateTime
        +location: string
        +status: DeviceStatus
        +powerOn() void
        +powerOff() void
        +getStatus() DeviceStatus
        +updateFirmware() void
    }

    class Sensor {
        <<abstract>>
        +sensorType: string
        +sensitivity: number
        +calibrationDate: DateTime
        +detectionRange: number
        +isBypassed: boolean
        +tamperDetected: boolean
        +readValue() SensorReading
        +calibrate() void
        +triggerAlert() void
        +bypass(duration: number) void
    }

    class EnvironmentalSensor {
        <<abstract>>
        +threshold: number
        +unit: string
        +measurementInterval: number
        +lastReading: SensorReading
        +checkThreshold() boolean
        +adjustThreshold(newThreshold: number) void
    }

    class Media {
        <<abstract>>
        +mediaId: string
        +timestamp: DateTime
        +size: number
        +format: string
        +source: string
        +metadata: Object
        +getUrl() string
        +download() Blob
        +delete() void
    }

    class Notification {
        <<abstract>>
        +notificationId: string
        +timestamp: DateTime
        +priority: Priority
        +recipient: string
        +content: string
        +status: NotificationStatus
        +send() void
        +retry() void
        +markAsRead() void
    }

    class SystemEvent {
        <<abstract>>
        +eventId: string
        +timestamp: DateTime
        +eventType: string
        +severity: Severity
        +source: string
        +description: string
        +metadata: Object
        +log() void
        +acknowledge() void
    }

    Device <|-- Sensor
    Sensor <|-- EnvironmentalSensor

    note for Service "Base service interface\\nfor all system services"
    note for Device "Abstract base class\\nfor all physical devices"
    note for Sensor "Extends Device with\\nsensor-specific capabilities"`}
      </div>
    </div>
  );
};

const AuthenticationDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>2. Actors, Account & Authentication</h2>
      <div className="mermaid" ref={diagramRef}>
        {`classDiagram
    class Account {
        +accountId: string
        +email: string
        +passwordHash: string
        +phoneNumber: string
        +createdAt: DateTime
        +lastLogin: DateTime
        +isActive: boolean
        +profile: UserProfile
        +authenticate(password: string) boolean
        +changePassword(oldPassword: string, newPassword: string) void
        +updateProfile(profile: UserProfile) void
        +deactivate() void
    }

    class Homeowner {
        +ownerId: string
        +homeAddress: string
        +emergencyContacts: Contact[]
        +preferences: HomeownerPreferences
        +addGuest(guest: Guest) void
        +removeGuest(guestId: string) void
        +grantPermission(userId: string, permission: Permission) void
    }

    class Guest {
        +guestId: string
        +invitedBy: string
        +validFrom: DateTime
        +validUntil: DateTime
        +accessLevel: AccessLevel
        +isTemporary: boolean
        +extendAccess(duration: number) void
        +revokeAccess() void
    }

    class AuthenticationService {
        <<Service>>
        -sessionManager: SessionManager
        -tokenGenerator: TokenGenerator
        +login(email: string, password: string) AuthToken
        +logout(token: string) void
        +validateToken(token: string) boolean
        +refreshToken(refreshToken: string) AuthToken
        +resetPassword(email: string) void
        +verifyEmail(token: string) boolean
    }

    Account <|-- Homeowner
    Account <|-- Guest

    Service <|-- AuthenticationService

    AuthenticationService --> Account : authenticates

    note for AuthenticationService "Handles user login,\\nlogout, and token management"`}
      </div>
    </div>
  );
};

const CorePlatformDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>3. Core Platform (Hub/Cloud/Config/Log)</h2>
      <div className="mermaid" ref={diagramRef}>
        {`classDiagram
    class SafeHomeHub {
        +hubId: string
        +serialNumber: string
        +firmwareVersion: string
        +ipAddress: string
        +macAddress: string
        +cloudConnectionStatus: ConnectionStatus
        +connectedDevices: Device[]
        +securityModeManager: SecurityModeManager
        +commandQueue: Command[]
        +registerDevice(device: Device) void
        +unregisterDevice(deviceId: string) void
        +executeCommand(command: Command) void
        +syncWithCloud() void
        +reboot() void
        +factoryReset() void
        +updateFirmware() void
        +getSystemStatus() SystemStatus
    }

    class CloudService {
        <<Service>>
        -apiEndpoint: string
        -authToken: string
        +connect() void
        +disconnect() void
        +syncData(data: Object) void
        +fetchConfiguration() Configuration
        +uploadLogs(logs: LogRecord[]) void
        +backupData() void
        +restoreData(backupId: string) void
    }

    class MobileAppClient {
        +appVersion: string
        +platform: Platform
        +deviceToken: string
        +userId: string
        +isLoggedIn: boolean
        +lastSync: DateTime
        +connect() void
        +sendCommand(command: Command) void
        +receiveNotification(notification: Notification) void
    }

    Service <|-- CloudService

    SafeHomeHub --> CloudService : uses
    MobileAppClient --> SafeHomeHub : connects

    note for SafeHomeHub "Central hub that manages\\nall devices and services"
    note for CloudService "Provides cloud connectivity\\nand data synchronization"`}
      </div>
    </div>
  );
};

const SecurityModesDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>4. Security Modes & Zones</h2>
      <div className="mermaid" ref={diagramRef}>
        {`classDiagram
    class SecurityMode {
        +modeId: string
        +modeName: string
        +description: string
        +activeSensors: Sensor[]
        +entryDelay: number
        +exitDelay: number
        +sirenEnabled: boolean
        +notificationLevel: NotificationLevel
        +autoArm: boolean
        +schedule: Schedule
    }

    class SecurityArmingState {
        <<enumeration>>
        DISARMED
        ARMED_HOME
        ARMED_AWAY
        ARMED_NIGHT
        ENTRY_DELAY
        EXIT_DELAY
        ALARMED
    }

    class SecurityModeManager {
        -currentMode: SecurityMode
        -armingState: SecurityArmingState
        -zones: SafetyZone[]
        -bypassList: SensorBypassList
        +getCurrentMode() SecurityMode
        +setMode(mode: SecurityMode) void
        +armSystem(mode: SecurityMode) void
        +disarmSystem(code: string) boolean
        +startEntryDelay() void
        +startExitDelay() void
        +cancelDelay() void
        +triggerAlarm(reason: string) void
        +getArmingState() SecurityArmingState
    }

    SecurityModeManager --> SecurityMode : manages
    SecurityModeManager --> SecurityArmingState : maintains

    note for SecurityModeManager "Core component managing\\nsecurity states and modes"
    note for SecurityArmingState "Represents current\\nsystem arming state"`}
      </div>
    </div>
  );
};

const DevicesSensorsDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>5. Devices & Sensors</h2>
      <div className="mermaid" ref={diagramRef}>
        {`classDiagram
    class MotionSensor {
        <<Sensor>>
        +detectionAngle: number
        +maxRange: number
        +petImmune: boolean
        +lastMotionDetected: DateTime
        +motionCount: number
        +detectMotion() void
        +resetCount() void
    }

    class WindowDoorSensor {
        <<Sensor>>
        +isOpen: boolean
        +openedAt: DateTime
        +openCount: number
        +notifyOnOpen: boolean
        +notifyOnClose: boolean
        +getState() ContactState
    }

    class FireSmokeSensor {
        <<EnvironmentalSensor>>
        +smokeLevel: number
        +temperatureReading: number
        +isSmokeDetected: boolean
        +isFireDetected: boolean
        +testAlarm() void
        +silence() void
    }

    class SmartLight {
        <<SmartHomeDevice>>
        +brightness: number
        +color: Color
        +isOn: boolean
        +schedule: Schedule
        +turnOn() void
        +turnOff() void
        +setBrightness(level: number) void
        +setColor(color: Color) void
        +dim(percentage: number) void
    }

    Sensor <|-- MotionSensor
    Sensor <|-- WindowDoorSensor
    EnvironmentalSensor <|-- FireSmokeSensor
    SmartHomeDevice <|-- SmartLight

    note for MotionSensor "Detects movement\\nwith pet immunity option"
    note for FireSmokeSensor "Critical life safety sensor"
    note for SmartLight "Controllable lighting\\nwith color support"`}
      </div>
    </div>
  );
};

const SurveillanceDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>6. Surveillance, Media & Audio</h2>
      <div className="mermaid" ref={diagramRef}>
        {`classDiagram
    class Camera {
        <<Device>>
        +resolution: Resolution
        +fieldOfView: number
        +nightVision: boolean
        +motionDetection: boolean
        +audioEnabled: boolean
        +recordingMode: RecordingMode
        +stream: VideoStream
        +storageUsed: number
        +startRecording() void
        +stopRecording() void
        +captureSnapshot() Snapshot
        +getStream() VideoStream
        +enableMotionDetection() void
        +disableMotionDetection() void
        +panTilt(pan: number, tilt: number) void
        +zoom(level: number) void
    }

    class MediaRepository {
        -storage: StorageRepository
        -indexDb: Database
        +storeMedia(media: Media) string
        +retrieveMedia(mediaId: string) Media
        +deleteMedia(mediaId: string) void
        +queryMedia(filters: MediaFilter) Media[]
        +getStorageStats() StorageStats
    }

    class Snapshot {
        <<Media>>
        +cameraId: string
        +resolution: Resolution
        +trigger: string
        +thumbnail: Blob
    }

    class Recording {
        <<Media>>
        +cameraId: string
        +duration: number
        +resolution: Resolution
        +codec: string
        +startTime: DateTime
        +endTime: DateTime
        +isLive: boolean
        +play() void
        +pause() void
    }

    Device <|-- Camera
    Media <|-- Snapshot
    Media <|-- Recording

    Camera --> Snapshot : captures
    Camera --> Recording : creates
    MediaRepository --> Media : stores

    note for Camera "Multi-functional camera\\nwith PTZ and audio"
    note for MediaRepository "Central storage for\\nall media files"`}
      </div>
    </div>
  );
};

const NotificationsDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>7. Notifications & Automation</h2>
      <div className="mermaid" ref={diagramRef}>
        {`classDiagram
    class PushNotification {
        <<Notification>>
        +deviceToken: string
        +title: string
        +body: string
        +badge: number
        +sound: string
        +data: Object
        +actionButtons: Button[]
    }

    class SMSMessage {
        <<Notification>>
        +phoneNumber: string
        +message: string
        +sender: string
        +deliveryStatus: DeliveryStatus
    }

    class NotificationService {
        <<Service>>
        -queue: NotificationQueue
        -policies: NotificationPolicy[]
        +sendNotification(notification: Notification) void
        +sendBatch(notifications: Notification[]) void
        +scheduleNotification(notification: Notification, time: DateTime) void
        +cancelScheduled(notificationId: string) void
        +getDeliveryStatus(notificationId: string) DeliveryStatus
    }

    class AutomationRule {
        <<CloudService>>
        +ruleId: string
        +ruleName: string
        +description: string
        +trigger: Trigger
        +conditions: Condition[]
        +actions: Action[]
        +isEnabled: boolean
        +evaluate() boolean
        +execute() void
    }

    Notification <|-- PushNotification
    Notification <|-- SMSMessage
    Service <|-- NotificationService
    CloudService <|-- AutomationRule

    NotificationService --> Notification : sends

    note for NotificationService "Manages all notification\\ndelivery channels"
    note for AutomationRule "User-defined automation\\nrules and schedules"`}
      </div>
    </div>
  );
};

const IncidentsDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>8. Incidents, Verification & Emergency</h2>
      <div className="mermaid" ref={diagramRef}>
        {`classDiagram
    class Alarm {
        <<SystemEvent>>
        +alarmId: string
        +alarmType: AlarmType
        +triggeredBy: string
        +triggeredAt: DateTime
        +isActive: boolean
        +acknowledgedBy: string
        +acknowledgedAt: DateTime
        +resolvedAt: DateTime
        +notes: string
    }

    class IncidentManager {
        <<Service>>
        -activeIncidents: Alarm[]
        -verificationQueue: Queue
        +createIncident(event: SystemEvent) Alarm
        +verifyIncident(alarmId: string) boolean
        +escalateIncident(alarmId: string) void
        +resolveIncident(alarmId: string, notes: string) void
        +getActiveIncidents() Alarm[]
        +notifyEmergencyServices(incident: Alarm) void
    }

    class ExternalSecurityService {
        <<Service>>
        +serviceName: string
        +contactNumber: string
        +responseTime: number
        +isAvailable: boolean
        +notifyIncident(incident: Alarm) void
        +requestDispatch(location: string, incidentType: string) void
    }

    class PanicButton {
        +buttonId: string
        +location: string
        +userId: string
        +lastPressed: DateTime
        +press() void
        +triggerSilentAlarm() void
        +triggerAudibleAlarm() void
    }

    SystemEvent <|-- Alarm
    Service <|-- IncidentManager
    Service <|-- ExternalSecurityService

    IncidentManager --> Alarm : manages
    IncidentManager --> ExternalSecurityService : notifies
    PanicButton --> Alarm : triggers

    note for IncidentManager "Central incident management\\nand response coordination"
    note for PanicButton "Emergency trigger for\\nimmediate response"`}
      </div>
    </div>
  );
};

const SystemIntegrationDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>Complete System Integration</h2>
      <div className="mermaid" ref={diagramRef}>
        {`graph LR
    A[Homeowner] -->|owns| B[SafeHome Hub]
    B -->|manages| C[Devices]
    B -->|connects to| D[Cloud Service]
    C -->|includes| E[Sensors]
    C -->|includes| F[Cameras]
    E -->|triggers| G[Alarms]
    G -->|handled by| H[Incident Manager]
    H -->|sends| I[Notifications]
    F -->|stores to| J[Media Repository]
    B -->|uses| K[Security Mode Manager]
    K -->|controls| E
    A -->|authenticated by| L[Auth Service]

    style B fill:#2196F3
    style D fill:#4CAF50
    style H fill:#F44336
    style L fill:#FF9800`}
      </div>
    </div>
  );
};

// Main Component
const OverallClassDiagram = () => {
  const [activeTab, setActiveTab] = React.useState("overview");

  const diagrams = [
    { id: "overview", label: "System Overview", component: SystemArchitectureOverview },
    { id: "base", label: "Base Classes", component: BaseClassesDiagram },
    { id: "auth", label: "Authentication", component: AuthenticationDiagram },
    { id: "platform", label: "Core Platform", component: CorePlatformDiagram },
    { id: "security", label: "Security Modes", component: SecurityModesDiagram },
    { id: "devices", label: "Devices & Sensors", component: DevicesSensorsDiagram },
    { id: "surveillance", label: "Surveillance", component: SurveillanceDiagram },
    { id: "notifications", label: "Notifications", component: NotificationsDiagram },
    { id: "incidents", label: "Incidents", component: IncidentsDiagram },
    { id: "integration", label: "System Integration", component: SystemIntegrationDiagram },
  ];

  const ActiveDiagramComponent = diagrams.find((d) => d.id === activeTab)?.component;

  return (
    <div className="overall-class-diagram">
      <header className="diagram-header">
        <h1>SafeHome Overall System Class Diagram</h1>
        <p className="subtitle">
          Comprehensive UML Class Diagrams for the Entire SafeHome Security System
        </p>
      </header>

      <nav className="diagram-tabs">
        {diagrams.map((diagram) => (
          <button
            key={diagram.id}
            className={`tab-button ${activeTab === diagram.id ? "active" : ""}`}
            onClick={() => setActiveTab(diagram.id)}
          >
            {diagram.label}
          </button>
        ))}
      </nav>

      <main className="diagram-content">
        {ActiveDiagramComponent && <ActiveDiagramComponent />}
      </main>

      <footer className="diagram-footer">
        <div className="stats">
          <div className="stat-item">
            <strong>Total Classes:</strong> 82
          </div>
          <div className="stat-item">
            <strong>Total Diagrams:</strong> 13
          </div>
          <div className="stat-item">
            <strong>Version:</strong> 1.0.0
          </div>
        </div>
        <div className="legend">
          <h3>Status Legend</h3>
          <div className="legend-items">
            <span className="legend-item">
              <span className="badge implemented">🟢</span> Implemented
            </span>
            <span className="legend-item">
              <span className="badge not-implemented">🔴</span> Not Implemented
            </span>
            <span className="legend-item">
              <span className="badge partial">🟡</span> Partial
            </span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .overall-class-diagram {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: var(--bg-primary, #ffffff);
          color: var(--text-primary, #1a1a1a);
        }

        .diagram-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }

        .diagram-header h1 {
          font-size: 2.5rem;
          margin: 0 0 10px 0;
          font-weight: 700;
        }

        .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        .diagram-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
          padding: 20px;
          background: var(--bg-secondary, #f5f5f5);
          border-radius: 8px;
          overflow-x: auto;
        }

        .tab-button {
          padding: 12px 24px;
          border: none;
          background: white;
          color: #333;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .tab-button:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .tab-button.active {
          background: #667eea;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .diagram-content {
          min-height: 600px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .diagram-container {
          margin-bottom: 40px;
        }

        .diagram-container h2 {
          font-size: 1.8rem;
          color: #667eea;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 3px solid #667eea;
        }

        .mermaid {
          background: #fafafa;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
        }

        .diagram-footer {
          margin-top: 60px;
          padding: 40px 20px;
          background: var(--bg-secondary, #f5f5f5);
          border-radius: 8px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .stats {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .stat-item {
          font-size: 1.1rem;
          padding: 10px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-item strong {
          color: #667eea;
          margin-right: 10px;
        }

        .legend h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 1.2rem;
        }

        .legend-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background: white;
          border-radius: 6px;
        }

        .badge {
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .diagram-header h1 {
            font-size: 1.8rem;
          }

          .diagram-tabs {
            flex-direction: column;
          }

          .tab-button {
            width: 100%;
          }

          .diagram-footer {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-color-scheme: dark) {
          .overall-class-diagram {
            --bg-primary: #1a1a1a;
            --bg-secondary: #2d2d2d;
            --text-primary: #ffffff;
          }

          .tab-button {
            background: #2d2d2d;
            color: #ffffff;
          }

          .diagram-content {
            background: #2d2d2d;
          }

          .mermaid {
            background: #1a1a1a;
          }
        }
      `}</style>
    </div>
  );
};

export default OverallClassDiagram;



