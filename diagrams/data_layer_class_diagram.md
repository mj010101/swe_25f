# SafeHome Data Layer - Class Diagrams

> Detailed UML Class Diagrams for 11 Domain Models in the Data Layer

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
  - [11. SafetyZone](#11-safetyzone)
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
    end

    subgraph "Security & Events"
        A[Alarm]
        SE[SensorEvent]
        N[Notification]
        SZ[SafetyZone]
    end

    subgraph "Media"
        R[Recording]
        PTZ[PTZControl]
    end

    U --> S
    U --> N

    D --> SEN
    D --> CAM

    CAM --> PTZ
    CAM --> R

    SEN --> SE
    SE --> A
    A --> N

    SZ --> SEN

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
        +updateProfile(name: String, email: String, phone: String) void
        +changePassword(newPasswordHash: String) void
        +generateBackupCodes() List~String~
    }

    note for User "Core user entity\nHandles authentication and permissions"
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

    note for Device "Abstract base class\nfor all physical devices"
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
    }

    Device <|-- Sensor : extends

    note for Sensor "Base class for all sensors\nHandles triggering and cooldown"
```

---

### 4. Camera (extends Device)

**Responsibility:** Camera functionality and streaming control

```mermaid
classDiagram
    direction TB

    class Camera {
        <<extends Device>>
        -resolution: String
        -frameRate: int
        -nightVision: bool
        -ptzControl: PTZControl
        -audioCapability: String
        -passwordProtected: bool
        -passwordHash: String
        -recordingEnabled: bool
        -motionDetectionEnabled: bool
        +startLiveView() Map
        +stopLiveView() void
        +captureSnapshot() Buffer
        +hasPTZ() bool
        +controlPTZ(command: PTZCommand) void
        +enableTwoWayAudio() void
        +disableTwoWayAudio() void
        +setPassword(password: String) void
        +removePassword() void
        +verifyPassword(input: String) bool
        +enableRecording() void
        +disableRecording() void
    }

    class Device {
        <<abstract>>
    }

    Device <|-- Camera : extends

    note for Camera "Extends Device with\nstreaming and recording"
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
        +getCurrentPosition() Map~String, int~
    }

    note for PTZControl "Manages camera movement\nand exclusive access lock"
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
        +generateShareLink(expirationHours: int) String
        +getMetadata() Map~String, Any~
    }

    note for Recording "Stores recording metadata\nand file references"
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

    note for Alarm "Represents security alarm\nwith verification flow"
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

    note for SensorEvent "Immutable event record\nfrom sensor trigger"
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
        -deviceInfo: String
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

    note for Session "Active user session\nwith expiration tracking"
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

    note for Notification "User notification\nwith read tracking"
```

---

### 11. SafetyZone

**Responsibility:** Security zone definition and sensor membership management

```mermaid
classDiagram
    direction TB

    class SafetyZone {
        -id: int
        -name: String
        -sensorIds: Set~String~
        -armed: bool
        -entryExit: bool
        -createdAt: Timestamp
        -modifiedAt: Timestamp
        +arm() void
        +disarm() void
        +isArmed() bool
        +getSensorIds() Set~String~
        +addSensor(sensorId: String) void
        +removeSensor(sensorId: String) void
        +containsSensor(sensorId: String) bool
        +shouldTriggerDelay() bool
        +validateSensor(sensor: Sensor) bool
    }

    note for SafetyZone "Represents a security zone\nGroups sensors logically\nManages arming state"
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
        -resolution: String
        -frameRate: int
        -nightVision: bool
        -ptzControl: PTZControl
        +startLiveView() Map
    }

    class DoorWindowSensor {
        +isOpen: bool
    }

    class MotionSensor {
        +detectionAngle: int
    }

    class EnvironmentalSensor {
        +threshold: float
    }

    class SoundSensor {
        +soundLevel: float
    }

    Device <|-- Sensor
    Device <|-- Camera

    Sensor <|-- DoorWindowSensor
    Sensor <|-- MotionSensor
    Sensor <|-- EnvironmentalSensor
    Sensor <|-- SoundSensor

    note for Device "Base for all devices\n2 main branches"
    note for Sensor "Security and environmental\nmonitoring devices"
    note for Camera "Video surveillance\ndevices"
```

---

## Entity Relationships

### Core Entity Relationships

```mermaid
graph TB
    subgraph "User Domain"
        U[User]
        S[Session]
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
        SZ[SafetyZone]
    end

    subgraph "Media Domain"
        R[Recording]
    end

    U -->|has| S
    U -->|receives| N

    D -->|is a| SEN
    D -->|is a| CAM

    SEN -->|generates| SE
    SE -->|triggers| A
    A -->|creates| N

    SZ -->|contains| SEN

    CAM -->|has| PTZ
    CAM -->|creates| R

    style U fill:#4CAF50
    style D fill:#667eea
    style A fill:#F44336
    style R fill:#FF9800
```

---

## Design Characteristics

### 1. Entity Relationships

**One-to-Many:**

- User → Session (one user can have multiple active sessions)
- User → Notification (one user receives many notifications)
- Camera → Recording (one camera creates many recordings)
- Sensor → SensorEvent (one sensor generates many events)
- SafetyZone → Sensor (one zone contains many sensors)

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
│   ├── EnvironmentalSensor
│   └── SoundSensor
└── Camera
```

---

## Enumerations Summary

| Enumeration            | Values                                                     | Usage                 |
| ---------------------- | ---------------------------------------------------------- | --------------------- |
| **UserRole**           | ADMIN, STANDARD, GUEST                                     | User access control   |
| **DeviceType**         | SENSOR, CAMERA, etc.                                       | Device categorization |
| **DeviceCategory**     | SECURITY, LIFE_SAFETY, ENVIRONMENT, AUTOMATION, MONITORING | Device grouping       |
| **DeviceStatus**       | ONLINE, OFFLINE, LOW_BATTERY, FAULT, MAINTENANCE           | Device state          |
| **EventType**          | DOOR_OPEN, WINDOW_OPEN, MOTION_DETECTED, etc.              | Event classification  |
| **AlarmType**          | INTRUSION, FIRE, CO, GAS_LEAK, WATER_LEAK, PANIC           | Alarm categorization  |
| **AlarmStatus**        | PENDING, VERIFIED, ESCALATED, CANCELLED, RESOLVED          | Alarm lifecycle       |
| **VerificationStatus** | PENDING, CONFIRMED, FALSE_ALARM, TIMEOUT                   | Alarm verification    |
| **NotificationType**   | ALARM, DEVICE_STATUS, RECORDING_READY, SYSTEM_UPDATE       | Notification type     |
| **Priority**           | LOW, MEDIUM, HIGH, CRITICAL                                | Importance level      |
| **PTZCommand**         | PAN_LEFT, PAN_RIGHT, TILT_UP, TILT_DOWN, ZOOM_IN, ZOOM_OUT | Camera control        |

---

## Statistics

| Category                  | Count  |
| ------------------------- | ------ |
| **Core Entities**         | 11     |
| **Abstract Classes**      | 2      |
| **Concrete Device Types** | 4+     |
| **Total Classes**         | **11** |

---

## Key Features

### ✅ Domain-Driven Design

- Clear entity boundaries
- Rich domain models
- Encapsulated business logic

### ✅ Type Safety

- Strong typing with enumerations
- Nullable types explicitly defined
- Simple value types (String, int, etc.)

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
- Audit fields (createdAt, lastLoginAt)
- Simple relationship mappings

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11  
**Author:** SafeHome Development Team  
**Layer:** Data Layer (Domain Models)
