# SafeHome Presentation Layer - Class Diagrams

> Detailed UML Class Diagrams for 8 ViewControllers and Components in the Presentation Layer

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

    DVC -->|navigates| CVC
    DVC -->|navigates| SZVC
    DVC -->|navigates| DMVC
    DVC -->|navigates| EVC
    DVC -->|navigates| UAVC
    CVC -->|navigates| RVC

    style DVC fill:#667eea
    style EVC fill:#F44336
    style SZVC fill:#4CAF50
```

---

## 1. DashboardViewController

**Purpose:** Main dashboard screen controller and state management

```mermaid
classDiagram
    direction TB

    class DashboardViewController {
        -currentUser: User
        -securityMode: SecurityMode
        -recentEvents: List~SensorEvent~
        -deviceStatuses: Map~UUID, DeviceStatus~
        +initialize() void
        +refreshDashboard() void
        +handleModeChange(mode: SecurityMode) void
        +displayRecentEvents(events: List~SensorEvent~) void
        +updateDeviceStatus(devices: List~Device~) void
        +showNotification(notification: Notification) void
    }

    note for DashboardViewController "Main dashboard screen controller\nManages system status display\nCoordinates dashboard view"
```

---

## 2. CameraViewController

**Purpose:** Camera live view, recording playback, PTZ control UI

```mermaid
classDiagram
    direction TB

    class CameraViewController {
        -selectedCamera: Camera
        -isLiveViewing: bool
        -isAudioEnabled: bool
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

**Purpose:** Security Zone configuration and management UI

```mermaid
classDiagram
    direction TB

    class SecurityZoneViewController {
        -selectedZone: SafetyZone
        -availableDevices: List~Device~
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

**Purpose:** Device registration, configuration, status monitoring UI

```mermaid
classDiagram
    direction TB

    class DeviceManagementViewController {
        -devices: List~Device~
        -selectedDevice: Device
        +displayDevices(devices: List~Device~) void
        +showDeviceDetail(deviceId: UUID) void
        +startAddDeviceFlow() void
        +updateDeviceSettings(deviceId: UUID, settings: Map~String, Any~) void
        +removeDevice(deviceId: UUID) void
        +filterDevices(category: DeviceCategory) void
        +sortDevices(sortBy: String) void
    }

    note for DeviceManagementViewController "Device management controller\nAdd, configure, and monitor devices\nFilter and sort functionality"
```

---

## 5. EmergencyViewController

**Purpose:** Emergency response UI (Panic Button, Alarm Verification)

```mermaid
classDiagram
    direction TB

    class EmergencyViewController {
        -activeAlarms: List~Alarm~
        -panicButtonPressed: bool
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

**Purpose:** User account management and settings UI

```mermaid
classDiagram
    direction TB

    class UserAccountViewController {
        -currentUser: User
        +loadUserProfile() void
        +updateProfile(name: String, email: String, phone: String) void
        +changePassword(oldPw: String, newPw: String) void
        +manageUserPermissions(userId: UUID) void
        +logout() void
    }

    note for UserAccountViewController "User account management\nProfile and security settings\nPermission management"
```

---

## 7. RecordingViewController

**Purpose:** Recording search, playback, and export UI

```mermaid
classDiagram
    direction TB

    class RecordingViewController {
        -recordings: List~Recording~
        -searchFilter: Map~String, Any~
        +searchRecordings(startDate: Date, endDate: Date, cameraId: String) void
        +displayRecordings(recordings: List~Recording~) void
        +playRecording(recordingId: UUID) void
        +exportRecording(recordingId: UUID, format: ExportFormat) void
        +shareRecording(recordingId: UUID) String
        +deleteRecording(recordingId: UUID) void
    }

    note for RecordingViewController "Recording management\nSearch, playback, and export\nSecure sharing functionality"
```

---

## 8. NotificationPanel

**Purpose:** Real-time notification display and management

```mermaid
classDiagram
    direction TB

    class NotificationPanel {
        -notifications: List~Notification~
        -unreadCount: int
        +displayNotification(notification: Notification) void
        +markAsRead(notificationId: UUID) void
        +clearAll() void
        +updateSettings(pushEnabled: bool, emailEnabled: bool) void
        +filterNotifications(type: NotificationType) void
    }

    note for NotificationPanel "Real-time notification center\nNotification management\nSettings and filtering"
```

---

## Layer Architecture

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

### MVC (Model-View-Controller) Pattern

- **ViewController**: Handles user input and coordinates view updates
- **Business Logic**: Service layer processing
- **Model**: Domain objects from Data Layer

### Command Pattern

- User actions encapsulated as commands
- Separation of UI and business logic

---

## Key Principles

### ✅ Separation of Concerns

- Each ViewController has single responsibility
- Clear separation between UI and business logic

### ✅ Low Coupling

- ViewControllers depend on service interfaces
- Minimal direct dependencies

### ✅ High Cohesion

- Related functionality grouped together
- Clear boundaries between controllers

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
