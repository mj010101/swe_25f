# SafeHome Presentation Layer - Class Diagrams

> Detailed UML Class Diagrams for 8 Core ViewControllers and Components in the Presentation Layer

## 📑 Table of Contents

- [Complete Presentation Layer Integration Diagram](#complete-presentation-layer-integration-diagram)
- [1. DashboardViewController](#1-dashboardviewcontroller)
- [2. CameraViewController](#2-cameraviewcontroller)
- [3. SecurityZoneViewController](#3-securityzoneviewcontroller)
- [4. DeviceManagementViewController](#4-devicemanagementviewcontroller)
- [5. EmergencyViewController](#5-emergencyviewcontroller)
- [6. UserAccountViewController](#6-useraccountviewcontroller)
- [7. RecordingViewController](#7-recordingviewcontroller)
- [8. NotificationPanel](#8-notificationpanel)

---

## Complete Presentation Layer Integration Diagram

```mermaid
graph TB
    subgraph "Presentation Layer"
        DVC[DashboardViewController]
        CVC[CameraViewController]
        SZVC[SecurityZoneViewController]
        DMVC[DeviceManagementViewController]
        EVC[EmergencyViewController]
        UAVC[UserAccountViewController]
        RVC[RecordingViewController]
        NP[NotificationPanel]
    end

    DVC --> SZVC
    DVC --> CVC
    DVC --> DMVC
    DVC --> EVC
    DVC --> UAVC
    CVC --> RVC
    SZVC --> DMVC

    style DVC fill:#667eea
    style EVC fill:#F44336
    style SZVC fill:#4CAF50
```

---

## 1. DashboardViewController

**Responsibility:** Main dashboard screen control and status management

```mermaid
classDiagram
    direction TB

    class DashboardViewController {
        -securityModeDisplay: SecurityModeDisplay
        -recentEventsPanel: EventsPanel
        -deviceStatusWidget: DeviceStatusWidget
        -quickActionsPanel: QuickActionsPanel
        -currentUser: User
        +initialize() void
        +refreshDashboard() void
        +handleModeChange(mode: SecurityMode) void
        +displayRecentEvents(events: List~Event~) void
        +updateDeviceStatus(devices: List~Device~) void
        +showNotification(notification: Notification) void
    }

    note for DashboardViewController "Main dashboard screen controller\nManages system status display\nCoordinates all dashboard widgets"
```

---

## 2. CameraViewController

**Responsibility:** Camera live view, recording playback, PTZ control UI

```mermaid
classDiagram
    direction TB

    class CameraViewController {
        -videoPlayer: VideoPlayer
        -ptzControlPanel: PTZControlPanel
        -audioControl: AudioControl
        -selectedCamera: Camera
        -streamSession: StreamSession
        +loadCamera(cameraId: UUID) void
        +startLiveView() void
        +stopLiveView() void
        +handlePTZControl(command: PTZCommand) void
        +toggleTwoWayAudio() void
        +showRecordings(cameraId: UUID) void
        +verifyPassword(password: String) bool
    }

    note for CameraViewController "Camera live view and PTZ control\nHandles streaming and audio\nPassword-protected access"
```

---

## 3. SecurityZoneViewController

**Responsibility:** Security Zone configuration and management UI (HW2 New Feature)

```mermaid
classDiagram
    direction TB

    class SecurityZoneViewController {
        -floorPlanView: FloorPlanView
        -zoneListPanel: ZoneListPanel
        -deviceSelectionPanel: DeviceSelectionPanel
        -selectedZone: SafetyZone
        +loadZones() void
        +createZone(zoneName: String) void
        +editZone(zoneId: int) void
        +deleteZone(zoneId: int) void
        +addDeviceToZone(zoneId: int, deviceId: UUID) void
        +removeDeviceFromZone(zoneId: int, deviceId: UUID) void
        +displayZoneDevices(zone: SafetyZone) void
        +validateDeviceAddition(device: Device) bool
    }

    note for SecurityZoneViewController "HW2 New Feature\nSecurity Zone management\nFloor plan visualization"
```

---

## 4. DeviceManagementViewController

**Responsibility:** Device addition, configuration, and status monitoring UI

```mermaid
classDiagram
    direction TB

    class DeviceManagementViewController {
        -deviceListView: DeviceListView
        -deviceDetailView: DeviceDetailView
        -addDeviceWizard: AddDeviceWizard
        -devices: List~Device~
        +displayDevices(devices: List~Device~) void
        +showDeviceDetail(deviceId: UUID) void
        +startAddDeviceFlow() void
        +updateDeviceSettings(deviceId: UUID, settings: DeviceSettings) void
        +removeDevice(deviceId: UUID) void
        +filterDevices(filter: DeviceFilter) void
        +sortDevices(sortBy: SortCriteria) void
    }

    note for DeviceManagementViewController "Device management controller\nAdd, configure, and monitor devices\nFilter and sort functionality"
```

---

## 5. EmergencyViewController

**Responsibility:** Emergency response UI (Panic Button, Alarm Verification)

```mermaid
classDiagram
    direction TB

    class EmergencyViewController {
        -panicButton: PanicButton
        -alarmVerificationPanel: AlarmVerificationPanel
        -emergencyContactsPanel: EmergencyContactsPanel
        -activeAlarms: List~Alarm~
        +displayPanicButton() void
        +handlePanicPress(duration: int) void
        +showAlarmVerification(alarm: Alarm) void
        +confirmAlarm(alarmId: UUID) void
        +dismissAlarm(alarmId: UUID) void
        +displayActiveAlarms() void
        +callEmergencyService(serviceType: EmergencyServiceType) void
    }

    note for EmergencyViewController "Emergency response handler\nPanic button management\nAlarm verification UI"
```

---

## 6. UserAccountViewController

**Responsibility:** User account management and settings UI

```mermaid
classDiagram
    direction TB

    class UserAccountViewController {
        -profileView: ProfileView
        -securitySettingsView: SecuritySettingsView
        -userPermissionsView: UserPermissionsView
        -currentUser: User
        +loadUserProfile() void
        +updateProfile(profile: UserProfile) void
        +changePassword(oldPw: String, newPw: String) void
        +manageUserPermissions(userId: UUID) void
        +logout() void
    }

    note for UserAccountViewController "User account management\nProfile and security settings\nPermission management"
```

---

## 7. RecordingViewController

**Responsibility:** Recording search, playback, and export UI

```mermaid
classDiagram
    direction TB

    class RecordingViewController {
        -recordingGrid: RecordingGrid
        -searchFilters: SearchFilterPanel
        -videoPlayer: VideoPlayer
        -exportPanel: ExportPanel
        +searchRecordings(filter: SearchFilter) void
        +displayRecordings(recordings: List~Recording~) void
        +playRecording(recordingId: UUID) void
        +exportRecording(recordingId: UUID, format: ExportFormat) void
        +shareRecording(recordingId: UUID) SecureLink
        +deleteRecording(recordingId: UUID) void
    }

    note for RecordingViewController "Recording management\nSearch, playback, and export\nSecure sharing functionality"
```

---

## 8. NotificationPanel

**Responsibility:** Real-time notification display and management

```mermaid
classDiagram
    direction TB

    class NotificationPanel {
        -notifications: Queue~Notification~
        -unreadCount: int
        -notificationSettings: NotificationSettings
        +displayNotification(notification: Notification) void
        +markAsRead(notificationId: UUID) void
        +clearAll() void
        +updateNotificationSettings(settings: NotificationSettings) void
        +filterNotifications(filter: NotificationFilter) void
    }

    note for NotificationPanel "Real-time notification center\nNotification management\nSettings and filtering"
```

---

## Component Relationships

### Navigation Flow

```mermaid
graph TB
    subgraph "Main Controllers"
        Dashboard[DashboardViewController]
        Camera[CameraViewController]
        Zone[SecurityZoneViewController]
        Device[DeviceManagementViewController]
        Emergency[EmergencyViewController]
        Account[UserAccountViewController]
        Recording[RecordingViewController]
        Notification[NotificationPanel]
    end

    Dashboard -->|Navigate| Camera
    Dashboard -->|Navigate| Zone
    Dashboard -->|Navigate| Device
    Dashboard -->|Navigate| Emergency
    Dashboard -->|Navigate| Account
    Camera -->|Navigate| Recording
    Zone -->|Uses| Device
    Emergency -->|Triggers| Notification

    style Dashboard fill:#667eea
    style Emergency fill:#F44336
    style Zone fill:#4CAF50
```

### Layer Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        VC[ViewControllers]
    end

    subgraph "Business Logic Layer"
        BL[Business Services]
    end

    subgraph "Data Layer"
        DL[Domain Models]
    end

    VC -->|Commands| BL
    BL -->|Data| DL
    BL -.Events.-> VC

    style VC fill:#667eea
    style BL fill:#4CAF50
    style DL fill:#FF9800
```

---

## Design Patterns

### 1. MVC (Model-View-Controller) Pattern

- **ViewController**: Handles user input and coordinates view updates
- **View Components**: UI rendering (Panel, Grid, Player, etc.)
- **Model**: Domain objects from Data Layer

### 2. Composite Pattern

- Each ViewController contains multiple child View components
- Hierarchical UI structure

### 3. Observer Pattern

- NotificationPanel observes system events
- Real-time updates across controllers

### 4. Command Pattern

- User actions encapsulated as commands
- Undo/redo functionality support

---

## Key Principles

### ✅ Separation of Concerns

- Each ViewController has single responsibility
- Clear separation between UI and business logic

### ✅ Reusability

- View components are reused across controllers
- Common patterns shared between similar UIs

### ✅ Extensibility

- Easy to add new ViewControllers
- Plugin-based architecture for new features

### ✅ Maintainability

- Clear interfaces and responsibilities
- Low coupling, high cohesion

---

## Statistics

| Category           | Count |
| ------------------ | ----- |
| **ViewController** | 7     |
| **Component**      | 1     |
| **Total Classes**  | **8** |

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11  
**Author:** SafeHome Development Team  
**Layer:** Presentation Layer
