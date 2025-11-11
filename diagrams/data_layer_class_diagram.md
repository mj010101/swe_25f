# SafeHome Data Layer - Class Diagrams

> Detailed UML Class Diagrams for Domain Models in the Data Layer

## 📑 Table of Contents

- [Complete Data Layer Integration Diagram](#complete-data-layer-integration-diagram)
- [Core Entities](#core-entities)
  - [1. User](#1-user)
  - [2. Device (Abstract)](#2-device-abstract)
  - [3. Sensor (extends Device)](#3-sensor-extends-device)
  - [4. Camera (extends Device)](#4-camera-extends-device)
- [Supporting Entities](#supporting-entities)
  - [5. PTZControl](#5-ptzcontrol)
  - [6. Recording](#6-recording)
  - [7. Alarm](#7-alarm)
  - [8. SensorEvent](#8-sensorevent)
  - [9. Session](#9-session)
  - [10. Notification](#10-notification)
- [Device Hierarchy](#device-hierarchy)
- [Entity Relationships](#entity-relationships)

---

## Complete Data Layer Integration Diagram

```mermaid
graph TB
    subgraph "User Management"
        U[User]
        S[Session]
    end

    subgraph "Device Hierarchy"
        D[Device Abstract]
        SEN[Sensor]
        CAM[Camera]
        SD[SmartDevice]
    end

    subgraph "Security & Events"
        A[Alarm]
        SE[SensorEvent]
        N[Notification]
    end

    subgraph "Media"
        R[Recording]
        PTZ[PTZControl]
    end

    U --> S
    U --> N

    D --> SEN
    D --> CAM
    D --> SD

    CAM --> PTZ
    CAM --> R

    SEN --> SE
    SE --> A
    A --> N

    style D fill:#667eea
    style U fill:#4CAF50
    style A fill:#F44336
    style R fill:#FF9800
```

---

## Core Entities

### 1. User

**Responsibility:** User entity and profile information

```mermaid
classDiagram
    direction TB

    class User {
        -userId: UUID
        -email: String
        -phoneNumber: String
        -name: String
        -passwordHash: String
        -role: UserRole
        -permissions: Set~Permission~
        -activeSessions: List~Session~
        -createdAt: Timestamp
        -lastLoginAt: Timestamp
        +authenticate(password: String) bool
        +hasPermission(permission: Permission) bool
        +updateProfile(profile: UserProfile) void
        +changePassword(newPasswordHash: String) void
        +generateBackupCodes() List~String~
    }

    class UserRole {
        <<enumeration>>
        HOMEOWNER
        FAMILY_MEMBER
        GUEST
        ADMIN
        SECURITY_MONITOR
    }

    class Permission {
        +permissionId: String
        +resource: String
        +action: String
        +scope: String
    }

    class UserProfile {
        +firstName: String
        +lastName: String
        +displayName: String
        +avatarUrl: String
        +preferences: Map~String, Object~
    }

    class Timestamp {
        +time: DateTime
        +toString() String
        +isAfter(other: Timestamp) bool
        +isBefore(other: Timestamp) bool
    }

    User --> UserRole : has
    User --> Permission : contains
    User --> UserProfile : has
    User --> Timestamp : uses

    note for User "Core user entity\nHandles authentication and permissions"
    note for UserRole "Defines user access level\nin the system"
```

---

### 2. Device (Abstract)

**Responsibility:** Base device entity and common behaviors

```mermaid
classDiagram
    direction TB

    class Device {
        <<abstract>>
        -deviceId: UUID
        -name: String
        -deviceType: DeviceType
        -deviceCategory: DeviceCategory
        -status: DeviceStatus
        -location: String
        -batteryLevel: int
        -signalStrength: int
        -lastHeartbeat: Timestamp
        -firmware: String
        -isEnabled: bool
        +getStatus() DeviceStatus
        +updateStatus(status: DeviceStatus) void
        +isOnline() bool
        +getBatteryLevel() int
        +getSignalStrength() int
        +isSecurityDevice() bool
        +isLifeSafetyDevice() bool
        +activate() void
        +deactivate() void
        +sendHeartbeat() void
    }

    class DeviceType {
        <<enumeration>>
        SENSOR
        CAMERA
        SIREN
        SMART_LOCK
        SMART_LIGHT
        THERMOSTAT
        VENTILATION
        HUB
    }

    class DeviceCategory {
        <<enumeration>>
        SECURITY
        AUTOMATION
        ENVIRONMENTAL
        COMMUNICATION
        LIFE_SAFETY
    }

    class DeviceStatus {
        <<enumeration>>
        ONLINE
        OFFLINE
        WARNING
        ERROR
        MAINTENANCE
        DISABLED
    }

    Device --> DeviceType : categorizes
    Device --> DeviceCategory : belongs to
    Device --> DeviceStatus : has

    note for Device "Abstract base class\nfor all physical devices"
    note for DeviceType "Type classification\nfor device capabilities"
```

---

### 3. Sensor (extends Device)

**Responsibility:** Common sensor functionality and event detection

```mermaid
classDiagram
    direction TB

    class Sensor {
        <<abstract>>
        -sensitivity: int
        -cooldownPeriod: int
        -bypassedUntil: Timestamp
        -lastTriggerTime: Timestamp
        +trigger() SensorEvent
        +setSensitivity(level: int) void
        +getCooldownPeriod() int
        +setCooldownPeriod(seconds: int) void
        +bypass(duration: int) void
        +clearBypass() void
        +isBypassed() bool
        +canTrigger() bool
    }

    class Device {
        <<abstract>>
        -deviceId: UUID
        -name: String
        -deviceType: DeviceType
        -status: DeviceStatus
    }

    class SensorEvent {
        +eventId: UUID
        +sensorId: String
        +eventType: EventType
        +timestamp: Timestamp
        +value: Any
        +metadata: Map~String, Any~
    }

    class EventType {
        <<enumeration>>
        MOTION_DETECTED
        DOOR_OPENED
        DOOR_CLOSED
        WINDOW_OPENED
        WINDOW_CLOSED
        GLASS_BREAK
        TEMPERATURE_ALERT
        SMOKE_DETECTED
        CO_DETECTED
        WATER_LEAK
        SOUND_DETECTED
    }

    Device <|-- Sensor : extends
    Sensor --> SensorEvent : generates
    SensorEvent --> EventType : categorizes

    note for Sensor "Base class for all sensors\nHandles triggering and cooldown"
    note for SensorEvent "Event generated by sensor\nwhen triggered"
```

---

### 4. Camera (extends Device)

**Responsibility:** Camera functionality and streaming control

```mermaid
classDiagram
    direction TB

    class Camera {
        <<extends Device>>
        -resolution: Resolution
        -frameRate: int
        -nightVision: bool
        -ptzControl: PTZControl
        -audioCapability: AudioCapability
        -passwordProtected: bool
        -passwordHash: String
        -recordingEnabled: bool
        -motionDetectionEnabled: bool
        +startLiveView() StreamSession
        +stopLiveView() void
        +captureSnapshot() Image
        +hasPTZ() bool
        +controlPTZ(command: PTZCommand) void
        +enableTwoWayAudio() AudioSession
        +disableTwoWayAudio() void
        +setPassword(password: String) void
        +removePassword() void
        +verifyPassword(input: String) bool
        +enableRecording() void
        +disableRecording() void
    }

    class Device {
        <<abstract>>
        -deviceId: UUID
        -name: String
        -deviceType: DeviceType
        -status: DeviceStatus
    }

    class Resolution {
        <<enumeration>>
        HD_720P
        FULL_HD_1080P
        UHD_4K
    }

    class AudioCapability {
        <<enumeration>>
        NONE
        LISTEN_ONLY
        TWO_WAY
    }

    class StreamSession {
        +sessionId: UUID
        +cameraId: String
        +startedAt: DateTime
        +streamUrl: String
        +isActive: bool
    }

    class AudioSession {
        +sessionId: UUID
        +isSpeaking: bool
        +isListening: bool
        +volume: float
    }

    class Image {
        +imageId: UUID
        +format: String
        +size: long
        +data: Blob
    }

    class PTZCommand {
        <<enumeration>>
        PAN_LEFT
        PAN_RIGHT
        TILT_UP
        TILT_DOWN
        ZOOM_IN
        ZOOM_OUT
        MOVE_TO_PRESET
    }

    Device <|-- Camera : extends
    Camera --> Resolution : has
    Camera --> AudioCapability : has
    Camera --> StreamSession : creates
    Camera --> AudioSession : creates
    Camera --> Image : captures
    Camera --> PTZCommand : executes

    note for Camera "Extends Device with\nstreaming and recording"
    note for StreamSession "Active video stream\nto a client"
```

---

## Supporting Entities

### 5. PTZControl

**Responsibility:** Pan-Tilt-Zoom control and constraint management

```mermaid
classDiagram
    direction TB

    class PTZControl {
        -panMin: int
        -panMax: int
        -tiltMin: int
        -tiltMax: int
        -zoomMin: int
        -zoomMax: int
        -currentPan: int
        -currentTilt: int
        -currentZoom: int
        -lockOwnerUserId: UUID
        -lockExpiration: Timestamp
        +pan(degrees: int, userId: UUID) void
        +tilt(degrees: int, userId: UUID) void
        +zoom(level: int, userId: UUID) void
        +acquireLock(userId: UUID, duration: int) bool
        +releaseLock(userId: UUID) void
        +isLocked() bool
        +validateCommand(cmd: PTZCommand) bool
        +getCurrentPosition() PTZPosition
    }

    class PTZPosition {
        +pan: int
        +tilt: int
        +zoom: int
        +presetId: int
        +presetName: String
    }

    class PTZCommand {
        <<enumeration>>
        PAN_LEFT
        PAN_RIGHT
        TILT_UP
        TILT_DOWN
        ZOOM_IN
        ZOOM_OUT
        MOVE_TO_PRESET
        SAVE_PRESET
        STOP
    }

    PTZControl --> PTZPosition : maintains
    PTZControl --> PTZCommand : validates

    note for PTZControl "Manages camera movement\nand exclusive access lock"
    note for PTZPosition "Current PTZ position\nand preset information"
```

---

### 6. Recording

**Responsibility:** Recording metadata and file information

```mermaid
classDiagram
    direction TB

    class Recording {
        -recordingId: UUID
        -cameraId: String
        -startTime: Timestamp
        -endTime: Timestamp
        -duration: int
        -fileSize: long
        -fileUrl: String
        -thumbnailUrl: String
        -eventType: EventType
        -metadata: Map~String, Any~
        +getStreamUrl() String
        +getDownloadUrl() String
        +generateShareLink(expirationHours: int) SecureLink
        +getMetadata() Map~String, Any~
    }

    class SecureLink {
        +linkId: UUID
        +url: String
        +expiresAt: DateTime
        +accessCount: int
        +maxAccessCount: int
        +isActive: bool
    }

    class EventType {
        <<enumeration>>
        MOTION_DETECTED
        ALARM_TRIGGERED
        SCHEDULED
        MANUAL
        CONTINUOUS
    }

    Recording --> SecureLink : generates
    Recording --> EventType : triggered by

    note for Recording "Stores recording metadata\nand file references"
    note for SecureLink "Time-limited shareable link\nfor recordings"
```

---

### 7. Alarm

**Responsibility:** Alarm state and history management

```mermaid
classDiagram
    direction TB

    class Alarm {
        -alarmId: UUID
        -alarmType: AlarmType
        -triggerEvent: SensorEvent
        -status: AlarmStatus
        -verificationStatus: VerificationStatus
        -createdAt: Timestamp
        -verifiedAt: Timestamp
        -resolvedAt: Timestamp
        -resolvedBy: UUID
        +verify(confirmed: bool, userId: UUID) void
        +escalate() void
        +cancel(userId: UUID) void
        +resolve() void
        +getStatus() AlarmStatus
    }

    class AlarmType {
        <<enumeration>>
        INTRUSION
        FIRE
        MEDICAL
        PANIC
        ENVIRONMENTAL
        TECHNICAL
    }

    class AlarmStatus {
        <<enumeration>>
        PENDING
        VERIFIED
        ESCALATED
        CANCELLED
        RESOLVED
    }

    class VerificationStatus {
        <<enumeration>>
        UNVERIFIED
        CONFIRMED
        FALSE_ALARM
        TIMEOUT
    }

    class SensorEvent {
        +eventId: UUID
        +sensorId: String
        +eventType: EventType
        +timestamp: Timestamp
    }

    Alarm --> AlarmType : categorizes
    Alarm --> AlarmStatus : has
    Alarm --> VerificationStatus : has
    Alarm --> SensorEvent : triggered by

    note for Alarm "Represents security alarm\nwith verification flow"
    note for AlarmStatus "Current state of alarm\nin lifecycle"
```

---

### 8. SensorEvent

**Responsibility:** Sensor event data

```mermaid
classDiagram
    direction TB

    class SensorEvent {
        -eventId: UUID
        -sensorId: String
        -eventType: EventType
        -timestamp: Timestamp
        -value: Any
        -metadata: Map~String, Any~
        +getSensorId() String
        +getEventType() EventType
        +getTimestamp() Timestamp
    }

    class EventType {
        <<enumeration>>
        MOTION_DETECTED
        DOOR_OPENED
        DOOR_CLOSED
        WINDOW_OPENED
        WINDOW_CLOSED
        GLASS_BREAK
        TEMPERATURE_ALERT
        SMOKE_DETECTED
        CO_DETECTED
        WATER_LEAK
        SOUND_DETECTED
    }

    class Timestamp {
        +time: DateTime
        +toString() String
        +isAfter(other: Timestamp) bool
        +isBefore(other: Timestamp) bool
    }

    SensorEvent --> EventType : categorizes
    SensorEvent --> Timestamp : has

    note for SensorEvent "Immutable event record\nfrom sensor trigger"
    note for EventType "Type of event detected\nby sensor"
```

---

### 9. Session

**Responsibility:** User session information

```mermaid
classDiagram
    direction TB

    class Session {
        -sessionId: UUID
        -userId: UUID
        -deviceInfo: DeviceInfo
        -ipAddress: String
        -userAgent: String
        -createdAt: Timestamp
        -expiresAt: Timestamp
        -lastActivityAt: Timestamp
        +isValid() bool
        +isExpired() bool
        +refresh() void
        +revoke() void
    }

    class DeviceInfo {
        +deviceId: String
        +platform: String
        +osVersion: String
        +appVersion: String
        +deviceModel: String
    }

    class Timestamp {
        +time: DateTime
        +toString() String
        +isAfter(other: Timestamp) bool
        +isBefore(other: Timestamp) bool
    }

    Session --> DeviceInfo : contains
    Session --> Timestamp : uses

    note for Session "Active user session\nwith expiration tracking"
    note for DeviceInfo "Information about\ndevice accessing system"
```

---

### 10. Notification

**Responsibility:** Notification message information

```mermaid
classDiagram
    direction TB

    class Notification {
        -notificationId: UUID
        -userId: UUID
        -type: NotificationType
        -title: String
        -message: String
        -data: Map~String, Any~
        -createdAt: Timestamp
        -readAt: Timestamp
        -priority: Priority
        +markAsRead() void
        +isRead() bool
    }

    class NotificationType {
        <<enumeration>>
        ALARM
        WARNING
        INFO
        SYSTEM
        DEVICE
        USER_ACTION
    }

    class Priority {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        CRITICAL
    }

    class Timestamp {
        +time: DateTime
        +toString() String
        +isAfter(other: Timestamp) bool
        +isBefore(other: Timestamp) bool
    }

    Notification --> NotificationType : categorizes
    Notification --> Priority : has
    Notification --> Timestamp : uses

    note for Notification "User notification\nwith read tracking"
    note for Priority "Notification importance\nfor filtering"
```

---

## Device Hierarchy

### Complete Device Class Hierarchy

```mermaid
classDiagram
    direction TB

    class Device {
        <<abstract>>
        -deviceId: UUID
        -name: String
        -deviceType: DeviceType
        -deviceCategory: DeviceCategory
        -status: DeviceStatus
        -location: String
    }

    class Sensor {
        <<abstract>>
        -sensitivity: int
        -cooldownPeriod: int
        -bypassedUntil: Timestamp
        +trigger() SensorEvent
    }

    class Camera {
        -resolution: Resolution
        -frameRate: int
        -nightVision: bool
        -ptzControl: PTZControl
        +startLiveView() StreamSession
    }

    class SmartDevice {
        <<abstract>>
        -isControllable: bool
        -energyUsage: float
        +sendCommand(command: Command) void
    }

    class DoorWindowSensor {
        +isOpen: bool
        +openCount: int
    }

    class MotionSensor {
        +detectionAngle: int
        +petImmune: bool
    }

    class EnvironmentalSensor {
        <<abstract>>
        +threshold: float
        +unit: String
    }

    class SoundSensor {
        +soundLevel: float
        +soundType: String
    }

    class IndoorCamera {
        +privacyMode: bool
    }

    class OutdoorCamera {
        +weatherResistant: bool
        +temperature: float
    }

    class SmartLight {
        +brightness: int
        +color: Color
        +isOn: bool
    }

    class SmartLock {
        +isLocked: bool
        +autoLock: bool
    }

    class SmartThermostat {
        +currentTemp: float
        +targetTemp: float
        +mode: ThermostatMode
    }

    class VentilationSystem {
        +fanSpeed: int
        +isRunning: bool
    }

    Device <|-- Sensor
    Device <|-- Camera
    Device <|-- SmartDevice

    Sensor <|-- DoorWindowSensor
    Sensor <|-- MotionSensor
    Sensor <|-- EnvironmentalSensor
    Sensor <|-- SoundSensor

    Camera <|-- IndoorCamera
    Camera <|-- OutdoorCamera

    SmartDevice <|-- SmartLight
    SmartDevice <|-- SmartLock
    SmartDevice <|-- SmartThermostat
    SmartDevice <|-- VentilationSystem

    note for Device "Base for all devices\n3 main branches"
    note for Sensor "Security and environmental\nmonitoring devices"
    note for Camera "Video surveillance\ndevices"
    note for SmartDevice "Home automation\ndevices"
```

---

## Entity Relationships

### Core Entity Relationships

```mermaid
graph TB
    subgraph "User Domain"
        U[User]
        S[Session]
        UP[UserProfile]
    end

    subgraph "Device Domain"
        D[Device]
        SEN[Sensor]
        CAM[Camera]
        PTZ[PTZControl]
    end

    subgraph "Event & Alarm Domain"
        SE[SensorEvent]
        A[Alarm]
        N[Notification]
    end

    subgraph "Media Domain"
        R[Recording]
        SL[SecureLink]
    end

    U -->|has| S
    U -->|has| UP
    U -->|receives| N

    D -->|is a| SEN
    D -->|is a| CAM

    SEN -->|generates| SE
    SE -->|triggers| A
    A -->|creates| N

    CAM -->|has| PTZ
    CAM -->|creates| R
    R -->|generates| SL

    style U fill:#4CAF50
    style D fill:#667eea
    style A fill:#F44336
    style R fill:#FF9800
```

### Data Flow Diagram

```mermaid
graph LR
    subgraph "Physical World"
        PW[Physical Events]
    end

    subgraph "Device Layer"
        SEN[Sensors]
        CAM[Cameras]
    end

    subgraph "Data Layer"
        SE[SensorEvent]
        A[Alarm]
        R[Recording]
        N[Notification]
    end

    subgraph "User Layer"
        U[User]
        S[Session]
    end

    PW -->|detected by| SEN
    PW -->|captured by| CAM

    SEN -->|creates| SE
    SE -->|triggers| A
    A -->|generates| N

    CAM -->|produces| R

    N -->|sent to| U
    U -->|authenticated via| S

    style PW fill:#E0E0E0
    style SE fill:#2196F3
    style A fill:#F44336
    style N fill:#FF9800
```

---

## Design Characteristics

### 1. Entity Relationships

**One-to-Many:**

- User → Session (one user can have multiple active sessions)
- User → Notification (one user receives many notifications)
- Camera → Recording (one camera creates many recordings)
- Sensor → SensorEvent (one sensor generates many events)

**One-to-One:**

- Camera → PTZControl (one camera has one PTZ control)
- Alarm → SensorEvent (one alarm is triggered by one event)

**Many-to-Many:**

- User → Permission (users can have multiple permissions)

### 2. Inheritance Hierarchy

```
Device (Abstract)
├── Sensor (Abstract)
│   ├── DoorWindowSensor
│   ├── MotionSensor
│   ├── EnvironmentalSensor (Abstract)
│   └── SoundSensor
├── Camera
│   ├── IndoorCamera
│   └── OutdoorCamera
└── SmartDevice (Abstract)
    ├── SmartLight
    ├── SmartLock
    ├── SmartThermostat
    └── VentilationSystem
```

### 3. Key Patterns

**Value Objects:**

- Timestamp
- Resolution
- PTZPosition
- DeviceInfo

**Entities:**

- User
- Device (and all subclasses)
- Alarm
- Recording
- Session

**Domain Events:**

- SensorEvent
- Notification

---

## Enumerations Summary

| Enumeration            | Values                                                                       | Usage                 |
| ---------------------- | ---------------------------------------------------------------------------- | --------------------- |
| **UserRole**           | HOMEOWNER, FAMILY_MEMBER, GUEST, ADMIN, SECURITY_MONITOR                     | User access control   |
| **DeviceType**         | SENSOR, CAMERA, SIREN, SMART_LOCK, SMART_LIGHT, THERMOSTAT, VENTILATION, HUB | Device categorization |
| **DeviceCategory**     | SECURITY, AUTOMATION, ENVIRONMENTAL, COMMUNICATION, LIFE_SAFETY              | Device grouping       |
| **DeviceStatus**       | ONLINE, OFFLINE, WARNING, ERROR, MAINTENANCE, DISABLED                       | Device state          |
| **EventType**          | MOTION_DETECTED, DOOR_OPENED, GLASS_BREAK, etc.                              | Event classification  |
| **AlarmType**          | INTRUSION, FIRE, MEDICAL, PANIC, ENVIRONMENTAL, TECHNICAL                    | Alarm categorization  |
| **AlarmStatus**        | PENDING, VERIFIED, ESCALATED, CANCELLED, RESOLVED                            | Alarm lifecycle       |
| **VerificationStatus** | UNVERIFIED, CONFIRMED, FALSE_ALARM, TIMEOUT                                  | Alarm verification    |
| **NotificationType**   | ALARM, WARNING, INFO, SYSTEM, DEVICE, USER_ACTION                            | Notification type     |
| **Priority**           | LOW, MEDIUM, HIGH, CRITICAL                                                  | Importance level      |
| **Resolution**         | HD_720P, FULL_HD_1080P, UHD_4K                                               | Video quality         |
| **AudioCapability**    | NONE, LISTEN_ONLY, TWO_WAY                                                   | Audio features        |
| **PTZCommand**         | PAN_LEFT, PAN_RIGHT, TILT_UP, etc.                                           | Camera control        |

---

## Statistics

| Category                    | Count  |
| --------------------------- | ------ |
| **Core Entities**           | 10     |
| **Abstract Classes**        | 4      |
| **Concrete Device Classes** | 12     |
| **Enumerations**            | 13     |
| **Value Objects**           | 8      |
| **Total Classes**           | **37** |

---

## Key Features

### ✅ Domain-Driven Design

- Clear entity boundaries
- Rich domain models
- Encapsulated business logic

### ✅ Type Safety

- Strong typing with enumerations
- Nullable types explicitly defined
- Value objects for complex types

### ✅ Extensibility

- Abstract base classes
- Well-defined inheritance hierarchy
- Open for extension

### ✅ Data Integrity

- Validation methods
- State management
- Timestamp tracking

### ✅ Persistence Ready

- Unique identifiers (UUID)
- Audit fields (createdAt, updatedAt)
- Relationship mappings

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11  
**Author:** SafeHome Development Team  
**Layer:** Data Layer (Domain Models)
