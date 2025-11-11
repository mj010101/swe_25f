# SafeHome Business Logic Layer - Class Diagrams

> Detailed UML Class Diagrams for 11 Core Business Logic Components in the Backend Layer

## 📑 Table of Contents

- [Complete Business Logic Layer Integration Diagram](#complete-business-logic-layer-integration-diagram)
- [Security Management](#security-management)
  - [1. SecurityModeManager](#1-securitymodemanager)
  - [2. AlarmManager](#2-alarmmanager)
- [Recording & Streaming Management](#recording--streaming-management)
  - [3. RecordingManager](#3-recordingmanager)
  - [4. StreamingService](#4-streamingservice)
  - [5. PTZControlService](#5-ptzcontrolservice)
- [Notification Management](#notification-management)
  - [6. NotificationManager](#6-notificationmanager)
- [Device Management](#device-management)
  - [7. DeviceRegistry](#7-deviceregistry)
  - [8. DeviceHealthMonitor](#8-devicehealthmonitor)
  - [9. DeviceConfigService](#9-deviceconfigservice)
- [User & Authentication Management](#user--authentication-management)
  - [10. LoginManager](#10-loginmanager)
  - [11. UserPermissionManager](#11-userpermissionmanager)

---

## Complete Business Logic Layer Integration Diagram

```mermaid
graph TB
    subgraph "Security Management"
        SMM[SecurityModeManager]
        AM[AlarmManager]
    end

    subgraph "Recording & Streaming"
        RM[RecordingManager]
        SS[StreamingService]
        PTZ[PTZControlService]
    end

    subgraph "Device Management"
        DR[DeviceRegistry]
        DHM[DeviceHealthMonitor]
        DCS[DeviceConfigService]
    end

    subgraph "Notification"
        NM[NotificationManager]
    end

    subgraph "User & Auth"
        LM[LoginManager]
        UPM[UserPermissionManager]
    end

    SMM --> AM
    AM --> NM

    SS --> RM
    PTZ --> SS

    DR --> DHM
    DR --> DCS

    LM --> UPM

    style SMM fill:#667eea
    style AM fill:#F44336
    style RM fill:#4CAF50
    style NM fill:#FF9800
```

---

## Security Management

### 1. SecurityModeManager

**Responsibility:** Security mode and zone management, arming/disarming logic

```mermaid
classDiagram
    direction TB

    class SecurityModeManager {
        -currentMode: SecurityMode
        -armingState: SecurityArmingState
        -zones: Map~int, SafetyZone~
        -entryDelaySeconds: int
        -exitDelaySeconds: int
        -bypassedSensors: Set~String~
        +setMode(mode: SecurityMode) void
        +getMode() SecurityMode
        +armZone(zoneId: int) void
        +disarmZone(zoneId: int) void
        +armAllZones() void
        +disarmAllZones() void
        +findZonesBySensorId(sensorId: String) List~SafetyZone~
        +isSensorActive(sensorId: String) bool
        +startEntryCountdown(e: SensorEvent) void
        +cancelEntryCountdown() void
        +bypassSensor(sensorId: String, duration: int) void
        +clearBypass(sensorId: String) void
        +getZones() Collection~SafetyZone~
        +addZone(zone: SafetyZone) void
        +removeZone(zoneId: int) void
        +updateZone(zoneId: int, zone: SafetyZone) void
    }

    note for SecurityModeManager "Core security management\nHandles all arming/disarming logic\nManages zones and sensors"
```

---

### 2. AlarmManager

**Responsibility:** Alarm triggering, verification, and escalation logic

```mermaid
classDiagram
    direction TB

    class AlarmManager {
        -activeAlarms: List~Alarm~
        -alarmPolicies: Map~SecurityMode, Map~String, Any~~
        +triggerAlarm(event: SensorEvent) Alarm
        +verifyAlarm(alarmId: UUID, confirmed: bool) void
        +cancelAlarm(alarmId: UUID) void
        +escalateAlarm(alarmId: UUID) void
        +getActiveAlarms() List~Alarm~
        +configureAlarmPolicy(mode: SecurityMode, policy: Map) void
        +getAlarmPolicy(mode: SecurityMode) Map
        +dispatchEmergency(alarm: Alarm) void
        +startVerificationTimer(alarmId: UUID, timeout: int) void
        +activateSiren(alarmType: AlarmType) void
    }

    note for AlarmManager "Central alarm management\nHandles verification and escalation\nDispatch emergency services"
```

---

## Recording & Streaming Management

### 3. RecordingManager

**Responsibility:** Recording management, storage, search, and export

```mermaid
classDiagram
    direction TB

    class RecordingManager {
        -recordings: List~Recording~
        -recordingSettings: Map~String, Map~String, Any~~
        -activeRecordings: Map~String, bool~
        +startRecording(cameraId: String, trigger: RecordingTrigger) void
        +stopRecording(cameraId: String) void
        +searchRecordings(startDate: Date, endDate: Date, cameraId: String) List~Recording~
        +getRecording(recordingId: UUID) Recording
        +exportRecording(recordingId: UUID, format: ExportFormat) File
        +shareRecording(recordingId: UUID, expirationHours: int) String
        +deleteRecording(recordingId: UUID) void
        +configureRecording(cameraId: String, settings: Map) void
        +getRecordingSetting(cameraId: String) Map
        +getStorageUsage() Map~String, float~
    }

    note for RecordingManager "Central recording management\nHandles all recording operations\nManages storage and search"
```

---

### 4. StreamingService

**Responsibility:** Camera streaming and session management (excluding PTZ)

```mermaid
classDiagram
    direction TB

    class StreamingService {
        -activeSessions: Map~String, Map~String, Any~~
        -maxConcurrentStreams: int
        +startLiveStream(cameraId: String, userId: UUID) Map
        +stopLiveStream(sessionId: UUID) void
        +getActiveStreams(cameraId: String) List~Map~
        +getStreamUrl(sessionId: UUID) String
        +enableTwoWayAudio(sessionId: UUID) void
        +disableTwoWayAudio(sessionId: UUID) void
        +getStreamQuality(sessionId: UUID) String
        +adjustStreamQuality(sessionId: UUID, quality: String) void
    }

    note for StreamingService "Manages video streaming\nHandles concurrent sessions\nTwo-way audio support"
```

---

### 5. PTZControlService

**Responsibility:** PTZ control and lock management

```mermaid
classDiagram
    direction TB

    class PTZControlService {
        -ptzLocks: Map~String, Map~String, Any~~
        -lockDuration: int
        -defaultTimeout: int
        +controlPTZ(cameraId: String, command: PTZCommand, userId: UUID) void
        +pan(cameraId: String, degrees: int, userId: UUID) void
        +tilt(cameraId: String, degrees: int, userId: UUID) void
        +zoom(cameraId: String, level: int, userId: UUID) void
        +acquirePTZLock(cameraId: String, userId: UUID) bool
        +releasePTZLock(cameraId: String, userId: UUID) void
        +isPTZLocked(cameraId: String) bool
        +getLockOwner(cameraId: String) UUID
    }

    note for PTZControlService "Prevents concurrent PTZ control\nManages exclusive access\nEnsures only one user controls PTZ"
```

---

## Notification Management

### 6. NotificationManager

**Responsibility:** Notification sending, cooldown management, policy application

```mermaid
classDiagram
    direction TB

    class NotificationManager {
        -notificationQueue: List~Notification~
        -notificationPolicies: Map~String, Map~String, Any~~
        -cooldowns: Map~String, Date~
        +sendNotification(recipient: User, notification: Notification) void
        +sendPushNotification(userId: UUID, message: String, data: Map) void
        +sendSMS(phoneNumber: String, message: String) void
        +sendEmail(email: String, subject: String, body: String) void
        +checkCooldown(deviceId: String, eventType: EventType) bool
        +updateCooldown(deviceId: String, eventType: EventType) void
        +configureCooldown(deviceId: String, duration: int) void
        +getNotificationPolicy(userId: UUID) Map
        +updateNotificationPolicy(userId: UUID, policy: Map) void
    }

    note for NotificationManager "Central notification hub\nManages all notification delivery\nPrevents notification spam"
```

---

## Device Management

### 7. DeviceRegistry

**Responsibility:** Device registration and discovery

```mermaid
classDiagram
    direction TB

    class DeviceRegistry {
        -devices: List~Device~
        +discoverDevices() List~Device~
        +registerDevice(device: Device) void
        +removeDevice(deviceId: UUID) void
        +getDevice(deviceId: UUID) Device
        +getAllDevices() List~Device~
        +getDevicesByType(type: DeviceType) List~Device~
        +getDevicesByCategory(category: DeviceCategory) List~Device~
    }

    note for DeviceRegistry "Central device registry\nManages all connected devices\nDevice discovery and registration"
```

---

### 8. DeviceHealthMonitor

**Responsibility:** Device status monitoring and health checks

```mermaid
classDiagram
    direction TB

    class DeviceHealthMonitor {
        -heartbeatInterval: int
        -offlineThreshold: int
        +checkDeviceHealth() Map~UUID, Map~String, Any~~
        +getDeviceStatus(deviceId: UUID) DeviceStatus
        +isDeviceOnline(deviceId: UUID) bool
        +recordHeartbeat(deviceId: UUID) void
        +detectOfflineDevices() List~Device~
        +sendHealthAlert(deviceId: UUID, issue: String) void
    }

    note for DeviceHealthMonitor "Monitors device health\nProactive issue detection\nHeartbeat management"
```

---

### 9. DeviceConfigService

**Responsibility:** Device configuration management

```mermaid
classDiagram
    direction TB

    class DeviceConfigService {
        -deviceSettings: Map~UUID, Map~String, Any~~
        +updateDeviceSettings(deviceId: UUID, settings: Map) void
        +getDeviceSettings(deviceId: UUID) Map
        +activateDevice(deviceId: UUID) void
        +deactivateDevice(deviceId: UUID) void
        +resetDeviceToDefault(deviceId: UUID) void
        +validateSettings(settings: Map) bool
        +applyBulkSettings(deviceIds: List~UUID~, settings: Map) void
    }

    note for DeviceConfigService "Manages device configuration\nValidates settings\nBulk operations support"
```

---

## User & Authentication Management

### 10. LoginManager

**Responsibility:** Login and logout processing

```mermaid
classDiagram
    direction TB

    class LoginManager {
        -users: List~User~
        -maxFailedAttempts: int
        -lockoutDuration: int
        -failedAttempts: Map~String, int~
        +login(email: String, password: String) Session
        +logout(sessionId: UUID) void
        +validateCredentials(email: String, password: String) bool
        +recordFailedAttempt(email: String) void
        +isAccountLocked(email: String) bool
        +unlockAccount(email: String) void
        +resetPassword(email: String) void
        +changePassword(userId: UUID, oldPw: String, newPw: String) void
    }

    note for LoginManager "Handles authentication\nPrevents brute force attacks\nAccount lockout management"
```

---

### 11. UserPermissionManager

**Responsibility:** User permission management and role-based access control

```mermaid
classDiagram
    direction TB

    class UserPermissionManager {
        -roleTemplates: Map~UserRole, Set~Permission~~
        +assignRole(userId: UUID, role: UserRole) void
        +grantPermission(userId: UUID, permission: Permission) void
        +revokePermission(userId: UUID, permission: Permission) void
        +hasPermission(userId: UUID, permission: Permission) bool
        +getPermissions(userId: UUID) Set~Permission~
        +applyRoleTemplate(userId: UUID, role: UserRole) void
        +validatePermission(userId: UUID, action: Action, resource: String) bool
    }

    note for UserPermissionManager "Role-based access control\nGranular permission management\nRole template system"
```

---

## Component Relationships

### Service Dependencies

```mermaid
graph TB
    subgraph "Core Services"
        SMM[SecurityModeManager]
        AM[AlarmManager]
        NM[NotificationManager]
    end

    subgraph "Device Services"
        DR[DeviceRegistry]
        DHM[DeviceHealthMonitor]
        DCS[DeviceConfigService]
    end

    subgraph "Media Services"
        RM[RecordingManager]
        SS[StreamingService]
        PTZ[PTZControlService]
    end

    subgraph "User Services"
        LM[LoginManager]
        UPM[UserPermissionManager]
    end

    SMM -->|triggers| AM
    AM -->|sends| NM

    DR -->|monitors| DHM
    DR -->|configures| DCS

    SS -->|records| RM
    SS -->|controls| PTZ

    LM -->|checks| UPM

    style SMM fill:#667eea
    style AM fill:#F44336
    style NM fill:#FF9800
```

---

## Design Principles

### SOLID Principles

**Single Responsibility Principle (SRP)**

- Each service class has a single, well-defined responsibility

**Open/Closed Principle (OCP)**

- Services are open for extension through interfaces and inheritance

**Liskov Substitution Principle (LSP)**

- Interfaces can be substituted with implementations

**Interface Segregation Principle (ISP)**

- Focused interfaces for each service

**Dependency Inversion Principle (DIP)**

- Services depend on abstractions (interfaces) not concretions

---

## Statistics

| Category                | Count  |
| ----------------------- | ------ |
| **Core Services**       | 11     |
| **Security**            | 2      |
| **Recording/Streaming** | 3      |
| **Device Management**   | 3      |
| **Notification**        | 1      |
| **User/Auth**           | 2      |
| **Total Classes**       | **11** |

---

## Key Features

### ✅ Modularity

- Each service is independent and focused
- Clear boundaries between components
- Easy to test and maintain

### ✅ Scalability

- Services can be deployed independently
- Horizontal scaling support
- Load balancing ready

### ✅ Security

- Role-based access control
- Account lockout mechanism
- Audit logging support

### ✅ Reliability

- Health monitoring
- Error handling
- Automatic recovery

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11  
**Author:** SafeHome Development Team  
**Layer:** Business Logic Layer
