# SafeHome State Diagrams

> Comprehensive State Diagrams for Key Classes with State Transitions

## 📑 Table of Contents

- [Overview: Classes with State Transitions](#overview-classes-with-state-transitions)
- [1. SecurityModeManager State Diagram](#1-securitymodemanager-state-diagram)
- [2. Alarm State Diagram](#2-alarm-state-diagram)
- [3. Device State Diagram](#3-device-state-diagram)
- [4. Session State Diagram](#4-session-state-diagram)
- [5. SafetyZone State Diagram](#5-safetyzone-state-diagram)
- [6. Recording State Diagram](#6-recording-state-diagram)
- [Summary and Design Patterns](#summary-and-design-patterns)

---

## Overview: Classes with State Transitions

Based on the analysis of `wj_safehome_complete_class_diagram.md`, the following 6 classes have significant state transitions:

```mermaid
graph TB
    subgraph "Security Management"
        SMM[SecurityModeManager<br/>SecurityArmingState]
        SZ[SafetyZone<br/>armed/disarmed]
        A[Alarm<br/>AlarmStatus + VerificationStatus]
    end

    subgraph "Device Management"
        D[Device<br/>DeviceStatus]
    end

    subgraph "Media Management"
        R[Recording<br/>recording state]
    end

    subgraph "User Management"
        S[Session<br/>valid/expired]
    end

    SMM -->|triggers| A
    SZ -->|contains sensors| D
    D -->|triggers| A
    R -->|created by| D

    style SMM fill:#667eea
    style A fill:#F44336
    style D fill:#4CAF50
    style R fill:#FF9800
    style S fill:#2196F3
    style SZ fill:#9C27B0
```

### Selected Classes Summary

| Class                  | State Enum/Field        | States Count | Complexity |
| ---------------------- | ----------------------- | ------------ | ---------- |
| **SecurityModeManager**| SecurityArmingState     | 5            | High       |
| **Alarm**              | AlarmStatus + Verification | 5 + 4     | High       |
| **Device**             | DeviceStatus            | 5            | Medium     |
| **Session**            | valid/expired           | 3            | Low        |
| **SafetyZone**         | armed/disarmed          | 2            | Low        |
| **Recording**          | active/inactive         | 2            | Low        |

---

## 1. SecurityModeManager State Diagram

**State Enum:** `SecurityArmingState`

**States:** DISARMED, ARMING, ARMED, ENTRY_DELAY, ALARMING

```mermaid
stateDiagram-v2
    [*] --> DISARMED

    state DISARMED {
        [*] --> Idle
        Idle: Set currentMode = DISARMED
        Idle: Set armingState = DISARMED
        Idle: Clear bypassedSensors
        Idle: Stop all timers
    }

    state ARMING {
        [*] --> Countdown
        Countdown: Start exit delay timer
        Countdown: Display countdown to user
        Countdown: Allow sensor bypass
        Countdown: Notify pending arm
    }

    state ARMED {
        [*] --> Monitoring
        Monitoring: Monitor all armed zones
        Monitoring: Listen for sensor events
        Monitoring: Check sensor bypass status
        Monitoring: Validate zone membership
    }

    state ENTRY_DELAY {
        [*] --> Warning
        Warning: Start entry countdown timer
        Warning: Display warning to user
        Warning: Send notifications
        Warning: Allow disarm attempt
    }

    state ALARMING {
        [*] --> Alerting
        Alerting: Activate siren
        Alerting: Send emergency notifications
        Alerting: Trigger alarm verification
        Alerting: Log alarm event
    }

    DISARMED --> ARMING: [User calls armZone() or armAllZones()]
    ARMING --> ARMED: [exitDelaySeconds timer expires]
    ARMING --> DISARMED: [User calls disarmZone() or cancelArm()]

    ARMED --> ENTRY_DELAY: [Sensor triggered] AND [Zone has entryExit=true]
    ARMED --> ALARMING: [Sensor triggered] AND [Zone has entryExit=false]
    
    ENTRY_DELAY --> DISARMED: [Valid code entered] / cancelEntryCountdown()
    ENTRY_DELAY --> ALARMING: [entryDelaySeconds timer expires]

    ALARMING --> ARMED: [AlarmManager confirms false alarm]
    ALARMING --> DISARMED: [User calls disarmAllZones()]
    
    ARMED --> DISARMED: [User calls disarmZone() or disarmAllZones()]
```

### State Transition Details

| From State    | To State      | Trigger                          | Method Called             |
| ------------- | ------------- | -------------------------------- | ------------------------- |
| DISARMED      | ARMING        | User arms system                 | `armZone()`, `armAllZones()` |
| ARMING        | ARMED         | Exit delay timer expires         | Internal timer            |
| ARMING        | DISARMED      | User cancels arming              | `disarmZone()`            |
| ARMED         | ENTRY_DELAY   | Sensor triggered (entry zone)    | `startEntryCountdown()`   |
| ARMED         | ALARMING      | Sensor triggered (interior zone) | Internal `triggerAlarm()` |
| ENTRY_DELAY   | ARMED         | Valid code entered               | `cancelEntryCountdown()`  |
| ENTRY_DELAY   | ALARMING      | Entry delay timer expires        | Internal timer            |
| ENTRY_DELAY   | DISARMED      | User disarms                     | `disarmZone()`            |
| ALARMING      | ARMED         | False alarm verified             | AlarmManager interaction  |
| ALARMING      | DISARMED      | System disarmed                  | `disarmAllZones()`        |
| ARMED         | DISARMED      | User disarms                     | `disarmZone()`            |

---

## 2. Alarm State Diagram

**State Enums:** `AlarmStatus` + `VerificationStatus`

**AlarmStatus:** PENDING, VERIFIED, ESCALATED, CANCELLED, RESOLVED

**VerificationStatus:** PENDING, CONFIRMED, FALSE_ALARM, TIMEOUT

```mermaid
stateDiagram-v2
    [*] --> PENDING

    state PENDING {
        [*] --> Verifying
        Verifying: Set status = PENDING
        Verifying: Set verificationStatus = PENDING
        Verifying: Send push notification to user
        Verifying: Send SMS/Email alerts
        Verifying: Start verification timer
        Verifying: Activate siren (policy-based)
        Verifying: Log trigger event
    }

    state VERIFIED {
        [*] --> Confirmed
        Confirmed: Set status = VERIFIED
        Confirmed: Set verificationStatus = CONFIRMED
        Confirmed: Update verifiedAt timestamp
        Confirmed: Prepare emergency dispatch
        Confirmed: Notify monitoring center
        Confirmed: Log verification
    }

    state ESCALATED {
        [*] --> Dispatching
        Dispatching: Set status = ESCALATED
        Dispatching: Call emergency services
        Dispatching: Send critical notifications
        Dispatching: Activate all alarms
        Dispatching: Record dispatch details
        Dispatching: Stream camera feeds
    }

    state CANCELLED {
        [*] --> Dismissing
        Dismissing: Set status = CANCELLED
        Dismissing: Set verificationStatus = FALSE_ALARM
        Dismissing: Stop siren
        Dismissing: Cancel notifications
        Dismissing: Log false alarm
    }

    state RESOLVED {
        [*] --> Closing
        Closing: Set status = RESOLVED
        Closing: Update resolvedAt timestamp
        Closing: Record resolution details
        Closing: Archive alarm record
        Closing: Generate incident report
    }

    PENDING --> VERIFIED: [User confirms] / verifyAlarm(id, confirmed=true)
    PENDING --> CANCELLED: [User dismisses] / verifyAlarm(id, confirmed=false)
    PENDING --> CANCELLED: [System cancels] / cancelAlarm(id)
    PENDING --> ESCALATED: [Verification timeout] AND [No user response]

    VERIFIED --> ESCALATED: [Critical alarm] / escalateAlarm(id)
    VERIFIED --> RESOLVED: [Alarm handled locally] / resolve()
    
    ESCALATED --> RESOLVED: [Emergency services respond] / resolve()
    
    CANCELLED --> [*]
    RESOLVED --> [*]
```

### Verification Status Sub-State

```mermaid
stateDiagram-v2
    [*] --> PENDING

    state PENDING {
        [*] --> WaitingInput
        WaitingInput: Set verificationStatus = PENDING
        WaitingInput: Display verification UI
        WaitingInput: Start countdown timer
        WaitingInput: Send notifications
        WaitingInput: Wait for user action
    }

    state CONFIRMED {
        [*] --> Verified
        Verified: Set verificationStatus = CONFIRMED
        Verified: Update verification timestamp
        Verified: Trigger VERIFIED state
    }

    state FALSE_ALARM {
        [*] --> Dismissed
        Dismissed: Set verificationStatus = FALSE_ALARM
        Dismissed: Stop all alerts
        Dismissed: Trigger CANCELLED state
    }

    state TIMEOUT {
        [*] --> AutoEscalate
        AutoEscalate: Set verificationStatus = TIMEOUT
        AutoEscalate: Assume real emergency
        AutoEscalate: Trigger ESCALATED state
    }

    PENDING --> CONFIRMED: [User presses Confirm] / verify(true)
    PENDING --> FALSE_ALARM: [User presses Dismiss] / verify(false)
    PENDING --> TIMEOUT: [Timer expires] AND [No response]

    CONFIRMED --> [*]
    FALSE_ALARM --> [*]
    TIMEOUT --> [*]
```

### State Transition Details

| From State | To State   | Trigger                    | Method Called                  |
| ---------- | ---------- | -------------------------- | ------------------------------ |
| [Initial]  | PENDING    | Sensor event triggers      | `triggerAlarm(event)`          |
| PENDING    | VERIFIED   | User confirms alarm        | `verifyAlarm(id, true)`        |
| PENDING    | CANCELLED  | User dismisses alarm       | `verifyAlarm(id, false)`       |
| PENDING    | CANCELLED  | System cancels             | `cancelAlarm(id)`              |
| VERIFIED   | ESCALATED  | Emergency dispatch needed  | `escalateAlarm(id)`            |
| VERIFIED   | RESOLVED   | Alarm handled locally      | `resolve()`                    |
| ESCALATED  | RESOLVED   | Emergency services respond | External + `resolve()`         |
| CANCELLED  | [End]      | Alarm dismissed            | Cleanup                        |
| RESOLVED   | [End]      | Alarm handled              | Cleanup                        |

---

## 3. Device State Diagram

**State Enum:** `DeviceStatus`

**States:** ONLINE, OFFLINE, LOW_BATTERY, FAULT, MAINTENANCE

```mermaid
stateDiagram-v2
    [*] --> OFFLINE

    state OFFLINE {
        [*] --> Disconnected
        Disconnected: Set status = OFFLINE
        Disconnected: Clear lastHeartbeat
        Disconnected: Stop monitoring
        Disconnected: Generate offline alert
        Disconnected: Notify DeviceHealthMonitor
    }

    state ONLINE {
        [*] --> Operating
        Operating: Set status = ONLINE
        Operating: Update lastHeartbeat
        Operating: Monitor battery level
        Operating: Check signal strength
        Operating: Enable device functions
        Operating: Report telemetry data
    }

    state LOW_BATTERY {
        [*] --> Warning
        Warning: Set status = LOW_BATTERY
        Warning: Send battery warning notification
        Warning: Continue normal operation
        Warning: Increase heartbeat frequency
        Warning: Log battery level
    }

    state FAULT {
        [*] --> Malfunctioning
        Malfunctioning: Set status = FAULT
        Malfunctioning: Disable affected functions
        Malfunctioning: Send fault notification
        Malfunctioning: Log error details
        Malfunctioning: Attempt self-diagnosis
    }

    state MAINTENANCE {
        [*] --> Servicing
        Servicing: Set status = MAINTENANCE
        Servicing: Set isEnabled = false
        Servicing: Pause monitoring
        Servicing: Allow firmware update
        Servicing: Suppress alerts
    }

    OFFLINE --> ONLINE: [Device connects] / sendHeartbeat()
    ONLINE --> OFFLINE: [Heartbeat timeout] AND [Time > threshold]
    
    ONLINE --> LOW_BATTERY: [batteryLevel < threshold] / updateStatus(LOW_BATTERY)
    ONLINE --> FAULT: [Malfunction detected] / updateStatus(FAULT)
    ONLINE --> MAINTENANCE: [User initiates] / updateStatus(MAINTENANCE)
    
    LOW_BATTERY --> ONLINE: [Battery restored] / updateStatus(ONLINE)
    LOW_BATTERY --> OFFLINE: [Battery depleted] AND [Connection lost]
    
    FAULT --> MAINTENANCE: [User requests repair] / updateStatus(MAINTENANCE)
    FAULT --> OFFLINE: [Critical failure] / Connection lost
    FAULT --> ONLINE: [Issue resolved] / updateStatus(ONLINE)
    
    MAINTENANCE --> ONLINE: [Service complete] / activate()
    MAINTENANCE --> OFFLINE: [Device powered down] / deactivate()
    
    OFFLINE --> [*]: [Device removed] / removeDevice()
```

### State Transition Details

| From State    | To State      | Trigger                       | Method Called               |
| ------------- | ------------- | ----------------------------- | --------------------------- |
| [Initial]     | OFFLINE       | Device registered             | `registerDevice()`          |
| OFFLINE       | ONLINE        | Device connects               | `sendHeartbeat()`           |
| ONLINE        | OFFLINE       | Connection lost               | Heartbeat timeout           |
| ONLINE        | LOW_BATTERY   | Battery level drops           | `updateStatus(LOW_BATTERY)` |
| ONLINE        | FAULT         | Malfunction detected          | `updateStatus(FAULT)`       |
| ONLINE        | MAINTENANCE   | User sets maintenance         | `updateStatus(MAINTENANCE)` |
| LOW_BATTERY   | ONLINE        | Battery restored              | `updateStatus(ONLINE)`      |
| LOW_BATTERY   | OFFLINE       | Battery depleted              | Connection lost             |
| FAULT         | MAINTENANCE   | Repair initiated              | `updateStatus(MAINTENANCE)` |
| FAULT         | OFFLINE       | Critical failure              | Connection lost             |
| FAULT         | ONLINE        | Issue resolved                | `updateStatus(ONLINE)`      |
| MAINTENANCE   | ONLINE        | Maintenance done              | `activate()`                |
| MAINTENANCE   | OFFLINE       | Device powered down           | `deactivate()`              |
| OFFLINE       | [End]         | Device removed from system    | `removeDevice()`            |

---

## 4. Session State Diagram

**State:** Session validity (derived from timestamps)

**States:** CREATED, ACTIVE, EXPIRED, REVOKED

```mermaid
stateDiagram-v2
    [*] --> CREATED

    state CREATED {
        [*] --> Initializing
        Initializing: Generate sessionId (UUID)
        Initializing: Set userId
        Initializing: Record deviceInfo
        Initializing: Set createdAt timestamp
        Initializing: Calculate expiresAt
        Initializing: Initialize lastActivityAt
    }

    state ACTIVE {
        [*] --> Authenticated
        Authenticated: Validate session token
        Authenticated: Check expiresAt
        Authenticated: Monitor user activity
        Authenticated: Allow API access
        Authenticated: Track lastActivityAt
    }

    state EXPIRED {
        [*] --> TimedOut
        TimedOut: Mark session invalid
        TimedOut: Clear authentication
        TimedOut: Log expiration event
        TimedOut: Require re-authentication
    }

    state REVOKED {
        [*] --> Terminated
        Terminated: Invalidate session token
        Terminated: Clear user session data
        Terminated: Log logout event
        Terminated: Remove from active sessions
    }

    CREATED --> ACTIVE: [Session validated] / validateSession()
    
    ACTIVE --> ACTIVE: [User activity detected] / refresh()
    ACTIVE --> EXPIRED: [currentTime >= expiresAt] / System check
    ACTIVE --> REVOKED: [User logs out] / logout()
    
    EXPIRED --> [*]
    REVOKED --> [*]
```

### State Transition Details

| From State | To State | Trigger                 | Method Called         |
| ---------- | -------- | ----------------------- | --------------------- |
| [Initial]  | CREATED  | User logs in            | `createSession()`     |
| CREATED    | ACTIVE   | Session validated       | `validateSession()`   |
| ACTIVE     | ACTIVE   | User activity           | `refresh()`           |
| ACTIVE     | EXPIRED  | Timeout reached         | System checks         |
| ACTIVE     | REVOKED  | User logs out           | `logout()`, `revoke()`|
| EXPIRED    | [End]    | Session cleaned up      | Garbage collection    |
| REVOKED    | [End]    | Session cleaned up      | Garbage collection    |

---

## 5. SafetyZone State Diagram

**State:** `armed` (boolean)

**States:** DISARMED, ARMED

```mermaid
stateDiagram-v2
    [*] --> DISARMED

    state DISARMED {
        [*] --> Inactive
        Inactive: Set armed = false
        Inactive: Disable sensor monitoring
        Inactive: Clear alarm triggers
        Inactive: Allow sensor modifications
        Inactive: Update modifiedAt timestamp
    }

    state ARMED {
        [*] --> Active
        Active: Set armed = true
        Active: Enable sensor monitoring
        Active: Validate all sensors online
        Active: Apply entryExit delay settings
        Active: Monitor for triggers
        Active: Report to SecurityModeManager
    }

    DISARMED --> ARMED: [User arms zone] / arm()
    ARMED --> DISARMED: [User disarms zone] / disarm()
    
    DISARMED --> [*]: [Zone deleted] / removeZone()
    ARMED --> [*]: [Zone force deleted] / removeZone()
```

### State Transition Details

| From State | To State  | Trigger              | Method Called  |
| ---------- | --------- | -------------------- | -------------- |
| [Initial]  | DISARMED  | Zone created         | `createZone()` |
| DISARMED   | ARMED     | User arms zone       | `arm()`        |
| ARMED      | DISARMED  | User disarms zone    | `disarm()`     |
| DISARMED   | [End]     | Zone deleted         | `removeZone()` |
| ARMED      | [End]     | Zone deleted (forced)| `removeZone()` |

---

## 6. Recording State Diagram

**State:** Recording activity (derived from activeRecordings map)

**States:** IDLE, RECORDING, PAUSED, SAVED

```mermaid
stateDiagram-v2
    [*] --> IDLE

    state IDLE {
        [*] --> Ready
        Ready: Set activeRecordings[cameraId] = false
        Ready: Camera streaming only
        Ready: Monitor for recording triggers
        Ready: Check storage availability
        Ready: Wait for startRecording() call
    }

    state RECORDING {
        [*] --> Capturing
        Capturing: Set activeRecordings[cameraId] = true
        Capturing: Generate recordingId (UUID)
        Capturing: Set startTime timestamp
        Capturing: Capture video stream
        Capturing: Write to storage
        Capturing: Monitor storage space
        Capturing: Update recording metadata
    }

    state PAUSED {
        [*] --> Suspended
        Suspended: Pause video capture
        Suspended: Keep session active
        Suspended: Allow resume
        Suspended: (Not in MVP scope)
    }

    state SAVED {
        [*] --> Stored
        Stored: Set endTime timestamp
        Stored: Calculate duration
        Stored: Generate thumbnail
        Stored: Save metadata to database
        Stored: Make available for playback
        Stored: Generate fileUrl
    }

    IDLE --> RECORDING: [Trigger activated] / startRecording(cameraId, trigger)
    
    RECORDING --> PAUSED: [User pauses] / pauseRecording() (Not in MVP)
    RECORDING --> SAVED: [Recording stopped] / stopRecording(cameraId)
    RECORDING --> IDLE: [Recording error] OR [Storage full]
    
    PAUSED --> RECORDING: [User resumes] / resumeRecording() (Not in MVP)
    PAUSED --> SAVED: [User stops] / stopRecording(cameraId)
    
    SAVED --> IDLE: [Recording processed] / Cleanup
    SAVED --> [*]: [Recording deleted] / deleteRecording(recordingId)
```

### State Transition Details

| From State | To State   | Trigger                 | Method Called                     |
| ---------- | ---------- | ----------------------- | --------------------------------- |
| [Initial]  | IDLE       | Camera initialized      | Camera ready                      |
| IDLE       | RECORDING  | Recording starts        | `startRecording(cameraId, trigger)`|
| RECORDING  | SAVED      | Recording stops         | `stopRecording(cameraId)`         |
| RECORDING  | IDLE       | Recording error         | Error handler                     |
| SAVED      | IDLE       | Recording processed     | Background process                |
| SAVED      | [End]      | Recording deleted       | `deleteRecording(recordingId)`    |

---

## Summary and Design Patterns

### State Pattern Implementation

All state-based classes follow the **State Pattern**:

1. **Context**: The class managing state (e.g., SecurityModeManager)
2. **State**: Enum or boolean representing current state
3. **State Transitions**: Methods that change state with validation
4. **State-Dependent Behavior**: Different actions based on current state

### State Complexity Analysis

| Class                  | State Count | Transitions | Complexity | Pattern Used    |
| ---------------------- | ----------- | ----------- | ---------- | --------------- |
| **SecurityModeManager**| 5           | 11          | High       | State Machine   |
| **Alarm**              | 9 (5+4)     | 13          | Very High  | Composite State |
| **Device**             | 5           | 12          | High       | State Machine   |
| **Session**            | 4           | 6           | Medium     | Simple State    |
| **SafetyZone**         | 2           | 4           | Low        | Boolean State   |
| **Recording**          | 4           | 7           | Medium     | Simple State    |

### Design Principles Applied

**1. Single Responsibility Principle (SRP)**
- Each class manages its own state transitions
- State logic encapsulated within the class

**2. Open/Closed Principle (OCP)**
- State enums can be extended
- New transitions can be added without modifying existing code

**3. State Validation**
- All state transitions validate preconditions
- Invalid transitions prevented at runtime

**4. Event-Driven Architecture**
- State changes trigger events
- Other components can observe state changes
- Loose coupling maintained

### State Transition Patterns

**Pattern 1: Linear State Flow**
```
CREATED → ACTIVE → EXPIRED/REVOKED → END
```
Used by: Session

**Pattern 2: Cyclic State Flow**
```
DISARMED ⟷ ARMING ⟷ ARMED ⟷ ALARMING
```
Used by: SecurityModeManager

**Pattern 3: Tree State Flow**
```
PENDING → VERIFIED → ESCALATED → RESOLVED
       ↘ CANCELLED
```
Used by: Alarm

**Pattern 4: Star State Flow**
```
    ONLINE ↔ OFFLINE
      ↕        ↕
LOW_BATTERY ↔ FAULT ↔ MAINTENANCE
```
Used by: Device

---

## Statistics

| Metric                      | Count |
| --------------------------- | ----- |
| **Classes with States**     | 6     |
| **Total States**            | 28    |
| **Total State Transitions** | 53    |
| **Enums Used**              | 5     |
| **State Patterns Used**     | 4     |

---

## Key Features

### ✅ Comprehensive State Management

- All critical system components have defined states
- Clear state transition rules
- State validation and error handling

### ✅ Traceability

- Each transition linked to specific methods
- State history can be tracked
- Audit trail support

### ✅ Safety

- Invalid transitions prevented
- State consistency guaranteed
- Fail-safe mechanisms

### ✅ Extensibility

- New states can be added
- New transitions defined
- Backward compatible

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11  
**Author:** SafeHome Development Team  
**Purpose:** State Transition Specifications

