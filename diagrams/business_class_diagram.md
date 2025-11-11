# SafeHome Business Logic Layer - Class Diagrams

> Detailed UML Class Diagrams for Business Logic Components in the Backend Layer

## 📑 Table of Contents

- [Complete Business Logic Layer Integration Diagram](#complete-business-logic-layer-integration-diagram)
- [Security & Zone Management](#security--zone-management)
  - [1. SecurityModeManager](#1-securitymodemanager)
  - [2. SafetyZone](#2-safetyzone)
  - [3. AlarmManager](#3-alarmmanager)
- [Recording & Streaming Management](#recording--streaming-management)
  - [4. RecordingManager](#4-recordingmanager)
  - [5. StreamingService](#5-streamingservice)
  - [6. PTZControlService](#6-ptzcontrolservice)
- [Device Management](#device-management)
  - [7. DeviceRegistry](#7-deviceregistry)
  - [8. DeviceHealthMonitor](#8-devicehealthmonitor)
  - [9. DeviceConfigService](#9-deviceconfigservice)
- [Notification Management](#notification-management)
  - [10. NotificationManager](#10-notificationmanager)
- [User & Authentication Management](#user--authentication-management)
  - [11. SignUpService](#11-signupservice)
  - [12. LoginService](#12-loginservice)
  - [13. SessionManager](#13-sessionmanager)
  - [14. UserPermissionManager](#14-userpermissionmanager)
- [Logging & Monitoring](#logging--monitoring)
  - [15. ActivityLogger](#15-activitylogger)
- [Component Relationships](#component-relationships)

---

## Complete Business Logic Layer Integration Diagram

```mermaid
graph TB
    subgraph "Security Management"
        SMM[SecurityModeManager]
        SZ[SafetyZone]
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
        SUS[SignUpService]
        LS[LoginService]
        SM[SessionManager]
        UPM[UserPermissionManager]
    end

    subgraph "Logging"
        AL[ActivityLogger]
    end

    SMM --> SZ
    SMM --> AM
    AM --> NM

    SS --> RM
    PTZ --> SS

    DR --> DHM
    DR --> DCS

    LS --> SM
    SUS --> SM
    SM --> UPM

    AM --> AL
    DR --> AL
    LS --> AL

    style SMM fill:#667eea
    style AM fill:#F44336
    style RM fill:#4CAF50
    style NM fill:#FF9800
```

---

## Security & Zone Management

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
        -delayTimer: Timer
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
        -triggerAlarm(e: SensorEvent) void
        +getZones() Collection~SafetyZone~
        +addZone(zone: SafetyZone) void
        +removeZone(zoneId: int) void
        +updateZone(zoneId: int, zone: SafetyZone) void
    }

    class SecurityMode {
        <<enumeration>>
        DISARMED
        ARMED_HOME
        ARMED_AWAY
        ARMED_NIGHT
        CUSTOM
    }

    class SecurityArmingState {
        <<enumeration>>
        DISARMED
        ARMING
        ARMED
        ENTRY_DELAY
        EXIT_DELAY
        ALARMED
    }

    class Timer {
        +start(duration: int) void
        +stop() void
        +isRunning() bool
        +getRemainingTime() int
    }

    class SensorEvent {
        +sensorId: String
        +eventType: EventType
        +timestamp: DateTime
        +zoneIds: List~int~
        +severity: Severity
    }

    SecurityModeManager --> SecurityMode : manages
    SecurityModeManager --> SecurityArmingState : maintains
    SecurityModeManager --> Timer : uses
    SecurityModeManager --> SensorEvent : handles
    SecurityModeManager --> SafetyZone : contains

    note for SecurityModeManager "Core security management\nHandles all arming/disarming logic"
    note for SecurityArmingState "Represents current\nsystem arming state"
```

---

### 2. SafetyZone

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

    class Sensor {
        +sensorId: String
        +sensorType: SensorType
        +location: String
        +isOnline: bool
        +isActive: bool
    }

    class Timestamp {
        +time: DateTime
        +toString() String
        +isAfter(other: Timestamp) bool
        +isBefore(other: Timestamp) bool
    }

    SafetyZone --> Sensor : validates
    SafetyZone --> Timestamp : tracks

    note for SafetyZone "Represents a security zone\nGroups sensors logically"
    note for Sensor "Physical sensor device\nin the system"
```

---

### 3. AlarmManager

**Responsibility:** Alarm triggering, verification, and escalation logic

```mermaid
classDiagram
    direction TB

    class AlarmManager {
        -activeAlarms: List~Alarm~
        -alarmConditions: Map~SecurityMode, AlarmPolicy~
        -verificationQueue: Queue~AlarmVerification~
        -emergencyDispatcher: EmergencyDispatcher
        +triggerAlarm(event: SensorEvent) Alarm
        +verifyAlarm(alarmId: UUID, confirmed: bool) void
        +cancelAlarm(alarmId: UUID) void
        +escalateAlarm(alarmId: UUID) void
        +getActiveAlarms() List~Alarm~
        +configureAlarmPolicy(mode: SecurityMode, policy: AlarmPolicy) void
        +getAlarmPolicy(mode: SecurityMode) AlarmPolicy
        +dispatchEmergency(alarm: Alarm) void
        +startVerificationTimer(alarmId: UUID, timeout: int) void
        +activateSiren(alarmType: AlarmType) void
    }

    class Alarm {
        +alarmId: UUID
        +alarmType: AlarmType
        +triggeredBy: String
        +triggeredAt: DateTime
        +severity: Severity
        +isVerified: bool
        +isActive: bool
        +verificationDeadline: DateTime
    }

    class AlarmPolicy {
        +mode: SecurityMode
        +verificationTimeout: int
        +autoEscalate: bool
        +notifyContacts: bool
        +activateSiren: bool
        +recordVideo: bool
    }

    class AlarmVerification {
        +alarmId: UUID
        +verifiedBy: UUID
        +verifiedAt: DateTime
        +confirmed: bool
        +notes: String
    }

    class EmergencyDispatcher {
        +dispatchPolice(alarm: Alarm) void
        +dispatchFire(alarm: Alarm) void
        +dispatchAmbulance(alarm: Alarm) void
        +notifySecurityCompany(alarm: Alarm) void
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

    AlarmManager *-- Alarm : manages
    AlarmManager --> AlarmPolicy : uses
    AlarmManager --> AlarmVerification : creates
    AlarmManager --> EmergencyDispatcher : uses
    Alarm --> AlarmType : categorizes

    note for AlarmManager "Central alarm management\nHandles verification and escalation"
    note for EmergencyDispatcher "External emergency\nservice integration"
```

---

## Recording & Streaming Management

### 4. RecordingManager

**Responsibility:** Recording management, storage, search, and export

```mermaid
classDiagram
    direction TB

    class RecordingManager {
        -recordings: Repository~Recording~
        -recordingSettings: Map~String, RecordingSetting~
        -storageProvider: StorageProvider
        -activeRecordings: Map~String, RecordingSession~
        +startRecording(cameraId: String, trigger: RecordingTrigger) RecordingSession
        +stopRecording(cameraId: String) void
        +searchRecordings(filter: SearchFilter) List~Recording~
        +getRecording(recordingId: UUID) Recording
        +exportRecording(recordingId: UUID, format: ExportFormat) File
        +shareRecording(recordingId: UUID, expirationHours: int) SecureLink
        +deleteRecording(recordingId: UUID) void
        +configureRecording(cameraId: String, setting: RecordingSetting) void
        +getRecordingSetting(cameraId: String) RecordingSetting
        +getStorageUsage() StorageStats
    }

    class Recording {
        +recordingId: UUID
        +cameraId: String
        +startTime: DateTime
        +endTime: DateTime
        +duration: int
        +fileSize: long
        +filePath: String
        +thumbnail: String
        +trigger: RecordingTrigger
        +isLocked: bool
    }

    class RecordingSetting {
        +cameraId: String
        +quality: VideoQuality
        +fps: int
        +retention: int
        +preBuffer: int
        +postBuffer: int
        +continuousRecording: bool
        +motionRecording: bool
    }

    class RecordingSession {
        +sessionId: UUID
        +cameraId: String
        +startedAt: DateTime
        +isActive: bool
        +bytesRecorded: long
        +stop() void
        +pause() void
        +resume() void
    }

    class StorageProvider {
        <<interface>>
        +upload(file: File, path: String) void
        +download(path: String) File
        +delete(path: String) void
        +getAvailableSpace() long
    }

    class RecordingTrigger {
        <<enumeration>>
        MANUAL
        MOTION_DETECTED
        ALARM_TRIGGERED
        SCHEDULED
        CONTINUOUS
    }

    class SearchFilter {
        +cameraIds: List~String~
        +startDate: DateTime
        +endDate: DateTime
        +trigger: RecordingTrigger
        +minDuration: int
        +maxDuration: int
    }

    class StorageStats {
        +totalSpace: long
        +usedSpace: long
        +freeSpace: long
        +recordingCount: int
    }

    RecordingManager *-- Recording : manages
    RecordingManager --> RecordingSetting : uses
    RecordingManager --> RecordingSession : creates
    RecordingManager --> StorageProvider : uses
    RecordingManager --> SearchFilter : uses
    Recording --> RecordingTrigger : has
    RecordingManager --> StorageStats : provides

    note for RecordingManager "Central recording management\nHandles all recording operations"
    note for StorageProvider "Abstraction for storage\nSupports local/cloud"
```

---

### 5. StreamingService

**Responsibility:** Camera streaming and session management (excluding PTZ)

```mermaid
classDiagram
    direction TB

    class StreamingService {
        -activeSessions: Map~String, StreamSession~
        -streamingProtocol: StreamingProtocol
        -maxConcurrentStreams: int
        +startLiveStream(cameraId: String, userId: UUID) StreamSession
        +stopLiveStream(sessionId: UUID) void
        +getActiveStreams(cameraId: String) List~StreamSession~
        +getStreamUrl(sessionId: UUID) String
        +enableTwoWayAudio(sessionId: UUID) AudioSession
        +disableTwoWayAudio(sessionId: UUID) void
        +getStreamQuality(sessionId: UUID) StreamQuality
        +adjustStreamQuality(sessionId: UUID, quality: StreamQuality) void
    }

    class StreamSession {
        +sessionId: UUID
        +cameraId: String
        +userId: UUID
        +startedAt: DateTime
        +protocol: StreamingProtocol
        +quality: StreamQuality
        +bandwidth: float
        +isActive: bool
        +close() void
        +reconnect() void
    }

    class AudioSession {
        +sessionId: UUID
        +streamSessionId: UUID
        +isSpeaking: bool
        +isListening: bool
        +volume: float
        +startSpeaking() void
        +stopSpeaking() void
        +mute() void
        +unmute() void
    }

    class StreamingProtocol {
        <<enumeration>>
        RTSP
        RTMP
        HLS
        WEBRTC
    }

    class StreamQuality {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        ULTRA
        AUTO
    }

    StreamingService *-- StreamSession : manages
    StreamingService --> AudioSession : creates
    StreamSession --> StreamingProtocol : uses
    StreamSession --> StreamQuality : has

    note for StreamingService "Manages video streaming\nHandles concurrent sessions"
    note for AudioSession "Two-way audio capability\nfor cameras"
```

---

### 6. PTZControlService

**Responsibility:** PTZ control and lock management

```mermaid
classDiagram
    direction TB

    class PTZControlService {
        -ptzLocks: Map~String, PTZLock~
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

    class PTZLock {
        +cameraId: String
        +ownerId: UUID
        +acquiredAt: DateTime
        +expiresAt: DateTime
        +isActive: bool
        +extend(duration: int) void
        +release() void
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

    class PTZPosition {
        +pan: int
        +tilt: int
        +zoom: int
        +presetId: int
        +presetName: String
    }

    PTZControlService *-- PTZLock : manages
    PTZControlService --> PTZCommand : executes
    PTZControlService --> PTZPosition : controls

    note for PTZControlService "Prevents concurrent PTZ control\nManages exclusive access"
    note for PTZLock "Ensures only one user\ncontrols PTZ at a time"
```

---

## Device Management

### 7. DeviceRegistry

**Responsibility:** Device registration and discovery

```mermaid
classDiagram
    direction TB

    class DeviceRegistry {
        -devices: Repository~Device~
        -discoveryService: DeviceDiscoveryService
        -registrationQueue: Queue~Device~
        +discoverDevices() List~Device~
        +registerDevice(device: Device) void
        +removeDevice(deviceId: UUID) void
        +getDevice(deviceId: UUID) Device
        +getAllDevices() List~Device~
        +getDevicesByType(type: DeviceType) List~Device~
        +getDevicesByCategory(category: DeviceCategory) List~Device~
    }

    class Device {
        +deviceId: UUID
        +deviceName: String
        +deviceType: DeviceType
        +manufacturer: String
        +model: String
        +firmwareVersion: String
        +macAddress: String
        +ipAddress: String
        +isOnline: bool
        +registeredAt: DateTime
    }

    class DeviceDiscoveryService {
        +scanNetwork() List~Device~
        +identifyDevice(ipAddress: String) Device
        +verifyDevice(device: Device) bool
    }

    class DeviceType {
        <<enumeration>>
        SENSOR
        CAMERA
        SIREN
        SMART_LOCK
        SMART_LIGHT
        THERMOSTAT
        HUB
    }

    class DeviceCategory {
        <<enumeration>>
        SECURITY
        AUTOMATION
        ENVIRONMENTAL
        COMMUNICATION
    }

    DeviceRegistry *-- Device : manages
    DeviceRegistry --> DeviceDiscoveryService : uses
    Device --> DeviceType : categorizes
    Device --> DeviceCategory : belongs to

    note for DeviceRegistry "Central device registry\nManages all connected devices"
    note for DeviceDiscoveryService "Automatic device discovery\non local network"
```

---

### 8. DeviceHealthMonitor

**Responsibility:** Device status monitoring and health checks

```mermaid
classDiagram
    direction TB

    class DeviceHealthMonitor {
        -healthReports: Map~UUID, DeviceHealthReport~
        -heartbeatInterval: int
        -offlineThreshold: int
        +checkDeviceHealth() List~DeviceHealthReport~
        +getDeviceStatus(deviceId: UUID) DeviceStatus
        +isDeviceOnline(deviceId: UUID) bool
        +recordHeartbeat(deviceId: UUID) void
        +detectOfflineDevices() List~Device~
        +sendHealthAlert(deviceId: UUID, issue: HealthIssue) void
    }

    class DeviceHealthReport {
        +deviceId: UUID
        +timestamp: DateTime
        +status: DeviceStatus
        +batteryLevel: int
        +signalStrength: int
        +lastHeartbeat: DateTime
        +uptime: long
        +issues: List~HealthIssue~
    }

    class DeviceStatus {
        <<enumeration>>
        ONLINE
        OFFLINE
        WARNING
        ERROR
        UNKNOWN
    }

    class HealthIssue {
        +issueType: IssueType
        +severity: Severity
        +description: String
        +detectedAt: DateTime
        +isResolved: bool
    }

    class IssueType {
        <<enumeration>>
        LOW_BATTERY
        WEAK_SIGNAL
        CONNECTIVITY_LOSS
        FIRMWARE_OUTDATED
        SENSOR_MALFUNCTION
        TAMPERING_DETECTED
    }

    DeviceHealthMonitor *-- DeviceHealthReport : creates
    DeviceHealthReport --> DeviceStatus : has
    DeviceHealthReport --> HealthIssue : contains
    HealthIssue --> IssueType : categorizes

    note for DeviceHealthMonitor "Monitors device health\nProactive issue detection"
    note for HealthIssue "Specific device problem\nwith severity level"
```

---

### 9. DeviceConfigService

**Responsibility:** Device configuration management

```mermaid
classDiagram
    direction TB

    class DeviceConfigService {
        -deviceSettings: Map~UUID, DeviceSettings~
        -configurationValidator: ConfigValidator
        +updateDeviceSettings(deviceId: UUID, settings: DeviceSettings) void
        +getDeviceSettings(deviceId: UUID) DeviceSettings
        +activateDevice(deviceId: UUID) void
        +deactivateDevice(deviceId: UUID) void
        +resetDeviceToDefault(deviceId: UUID) void
        +validateSettings(settings: DeviceSettings) bool
        +applyBulkSettings(deviceIds: List~UUID~, settings: DeviceSettings) void
    }

    class DeviceSettings {
        +deviceId: UUID
        +isActive: bool
        +pollingInterval: int
        +sensitivity: int
        +alertThreshold: int
        +customParameters: Map~String, Object~
        +lastModified: DateTime
        +modifiedBy: UUID
    }

    class ConfigValidator {
        +validate(settings: DeviceSettings) ValidationResult
        +checkCompatibility(deviceType: DeviceType, settings: DeviceSettings) bool
        +getDefaultSettings(deviceType: DeviceType) DeviceSettings
    }

    class ValidationResult {
        +isValid: bool
        +errors: List~String~
        +warnings: List~String~
    }

    DeviceConfigService *-- DeviceSettings : manages
    DeviceConfigService --> ConfigValidator : uses
    ConfigValidator --> ValidationResult : returns

    note for DeviceConfigService "Manages device configuration\nValidates settings"
    note for ConfigValidator "Ensures settings are\nvalid for device type"
```

---

## Notification Management

### 10. NotificationManager

**Responsibility:** Notification delivery, cooldown management, and policy enforcement

```mermaid
classDiagram
    direction TB

    class NotificationManager {
        -notificationQueue: Queue~Notification~
        -notificationPolicies: Map~String, NotificationPolicy~
        -cooldowns: Map~String, Cooldown~
        -pushService: PushNotificationService
        -smsGateway: SMSGateway
        -emailService: EmailService
        +sendNotification(recipient: User, notification: Notification) void
        +sendPushNotification(userId: UUID, message: String, data: Map) void
        +sendSMS(phoneNumber: String, message: String) void
        +sendEmail(email: String, subject: String, body: String) void
        +checkCooldown(deviceId: String, eventType: EventType) bool
        +updateCooldown(deviceId: String, eventType: EventType) void
        +configureCooldown(deviceId: String, duration: int) void
        +getNotificationPolicy(userId: UUID) NotificationPolicy
        +updateNotificationPolicy(userId: UUID, policy: NotificationPolicy) void
    }

    class Notification {
        +notificationId: UUID
        +title: String
        +message: String
        +priority: Priority
        +type: NotificationType
        +recipient: User
        +timestamp: DateTime
        +data: Map~String, Object~
    }

    class NotificationPolicy {
        +userId: UUID
        +enablePush: bool
        +enableSMS: bool
        +enableEmail: bool
        +quietHoursStart: Time
        +quietHoursEnd: Time
        +priorityThreshold: Priority
        +channels: List~NotificationChannel~
    }

    class Cooldown {
        +key: String
        +lastNotified: DateTime
        +cooldownDuration: int
        +canNotify() bool
        +reset() void
    }

    class PushNotificationService {
        <<interface>>
        +send(token: String, message: String, data: Map) void
        +sendBatch(tokens: List~String~, message: String) void
    }

    class SMSGateway {
        <<interface>>
        +sendSMS(phoneNumber: String, message: String) void
        +verifyNumber(phoneNumber: String) bool
    }

    class EmailService {
        <<interface>>
        +sendEmail(to: String, subject: String, body: String) void
        +sendTemplatedEmail(to: String, template: String, data: Map) void
    }

    class NotificationChannel {
        <<enumeration>>
        PUSH
        SMS
        EMAIL
        IN_APP
    }

    NotificationManager *-- Notification : manages
    NotificationManager --> NotificationPolicy : enforces
    NotificationManager --> Cooldown : uses
    NotificationManager --> PushNotificationService : uses
    NotificationManager --> SMSGateway : uses
    NotificationManager --> EmailService : uses
    NotificationPolicy --> NotificationChannel : specifies

    note for NotificationManager "Central notification hub\nManages all notification delivery"
    note for Cooldown "Prevents notification spam\nfor repeated events"
```

---

## User & Authentication Management

### 11. SignUpService

**Responsibility:** User registration and verification

```mermaid
classDiagram
    direction TB

    class SignUpService {
        -users: Repository~User~
        -emailService: EmailService
        -smsService: SMSService
        -passwordPolicy: PasswordPolicy
        +signUp(email: String, password: String, phone: String) User
        +validateEmail(email: String) bool
        +validatePassword(password: String) bool
        +validatePhone(phone: String) bool
        +sendVerificationEmail(userId: UUID) void
        +verifyEmail(token: String) bool
        +sendVerificationSMS(userId: UUID) void
        +verifyPhone(otp: String) bool
    }

    class User {
        +userId: UUID
        +email: String
        +passwordHash: String
        +phoneNumber: String
        +isEmailVerified: bool
        +isPhoneVerified: bool
        +createdAt: DateTime
        +lastLogin: DateTime
    }

    class PasswordPolicy {
        +minLength: int
        +requireUppercase: bool
        +requireLowercase: bool
        +requireNumbers: bool
        +requireSpecialChars: bool
        +maxAge: int
        +validate(password: String) ValidationResult
    }

    class VerificationToken {
        +token: String
        +userId: UUID
        +type: TokenType
        +expiresAt: DateTime
        +isUsed: bool
    }

    class TokenType {
        <<enumeration>>
        EMAIL_VERIFICATION
        PHONE_VERIFICATION
        PASSWORD_RESET
    }

    SignUpService --> User : creates
    SignUpService --> PasswordPolicy : enforces
    SignUpService --> VerificationToken : generates
    VerificationToken --> TokenType : has

    note for SignUpService "Handles user registration\nVerifies email and phone"
    note for PasswordPolicy "Enforces password\nsecurity requirements"
```

---

### 12. LoginService

**Responsibility:** Login and logout processing

```mermaid
classDiagram
    direction TB

    class LoginService {
        -users: Repository~User~
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

    class Session {
        +sessionId: UUID
        +userId: UUID
        +token: String
        +deviceInfo: DeviceInfo
        +createdAt: DateTime
        +expiresAt: DateTime
        +lastActivity: DateTime
        +isActive: bool
    }

    class DeviceInfo {
        +deviceId: String
        +platform: String
        +osVersion: String
        +appVersion: String
        +ipAddress: String
    }

    class AccountLockout {
        +email: String
        +lockedAt: DateTime
        +unlockAt: DateTime
        +reason: String
        +failedAttempts: int
    }

    LoginService --> Session : creates
    LoginService --> AccountLockout : manages
    Session --> DeviceInfo : contains

    note for LoginService "Handles authentication\nPrevents brute force attacks"
    note for AccountLockout "Temporary account lock\nafter failed attempts"
```

---

### 13. SessionManager

**Responsibility:** Session creation and management

```mermaid
classDiagram
    direction TB

    class SessionManager {
        -sessions: SessionStore
        -sessionTimeout: int
        -maxSessionsPerUser: int
        +createSession(userId: UUID, deviceInfo: DeviceInfo) Session
        +validateSession(sessionId: UUID) bool
        +refreshSession(sessionId: UUID) void
        +revokeSession(sessionId: UUID) void
        +revokeAllSessions(userId: UUID) void
        +getActiveSessions(userId: UUID) List~Session~
        +cleanupExpiredSessions() void
    }

    class SessionStore {
        <<interface>>
        +save(session: Session) void
        +get(sessionId: UUID) Session
        +delete(sessionId: UUID) void
        +findByUserId(userId: UUID) List~Session~
    }

    class Session {
        +sessionId: UUID
        +userId: UUID
        +token: String
        +createdAt: DateTime
        +expiresAt: DateTime
        +lastActivity: DateTime
        +isActive: bool
        +extend(duration: int) void
        +invalidate() void
    }

    class SessionToken {
        +token: String
        +algorithm: String
        +payload: Map~String, Object~
        +sign(secret: String) String
        +verify(secret: String) bool
    }

    SessionManager --> SessionStore : uses
    SessionManager *-- Session : manages
    Session --> SessionToken : uses

    note for SessionManager "Manages user sessions\nHandles session lifecycle"
    note for SessionStore "Persistent session storage\nCan be in-memory or database"
```

---

### 14. UserPermissionManager

**Responsibility:** User permission management and role-based access control

```mermaid
classDiagram
    direction TB

    class UserPermissionManager {
        -permissions: Repository~UserPermission~
        -roleTemplates: Map~UserRole, Set~Permission~~
        +assignRole(userId: UUID, role: UserRole) void
        +grantPermission(userId: UUID, permission: Permission) void
        +revokePermission(userId: UUID, permission: Permission) void
        +hasPermission(userId: UUID, permission: Permission) bool
        +getPermissions(userId: UUID) Set~Permission~
        +applyRoleTemplate(userId: UUID, role: UserRole) void
        +validatePermission(userId: UUID, action: Action, resource: Resource) bool
    }

    class UserPermission {
        +userId: UUID
        +permission: Permission
        +grantedAt: DateTime
        +grantedBy: UUID
        +expiresAt: DateTime
    }

    class Permission {
        +permissionId: String
        +resource: Resource
        +action: Action
        +scope: Scope
        +description: String
    }

    class UserRole {
        <<enumeration>>
        HOMEOWNER
        FAMILY_MEMBER
        GUEST
        ADMIN
        SECURITY_MONITOR
    }

    class Resource {
        <<enumeration>>
        DEVICE
        CAMERA
        RECORDING
        ZONE
        ALARM
        USER
        SYSTEM
    }

    class Action {
        <<enumeration>>
        CREATE
        READ
        UPDATE
        DELETE
        EXECUTE
        CONTROL
    }

    class Scope {
        <<enumeration>>
        OWN
        ASSIGNED
        ALL
    }

    UserPermissionManager *-- UserPermission : manages
    UserPermissionManager --> UserRole : uses
    UserPermission --> Permission : contains
    Permission --> Resource : targets
    Permission --> Action : allows
    Permission --> Scope : limits

    note for UserPermissionManager "Role-based access control\nGranular permission management"
    note for Permission "Defines specific access rights\nfor resources"
```

---

## Logging & Monitoring

### 15. ActivityLogger

**Responsibility:** System event logging, timeline generation, and audit trail

```mermaid
classDiagram
    direction TB

    class ActivityLogger {
        -eventStore: EventStore
        -auditLog: AuditLog
        +logEvent(event: Event) void
        +logUserAction(userId: UUID, action: Action) void
        +logSystemEvent(eventType: EventType, data: Map) void
        +getTimeline(filter: TimelineFilter) List~Event~
        +searchEvents(query: SearchQuery) List~Event~
        +exportLog(filter: LogFilter, format: ExportFormat) File
        +getAuditTrail(resourceId: UUID) List~AuditEntry~
    }

    class Event {
        +eventId: UUID
        +timestamp: DateTime
        +eventType: EventType
        +source: String
        +userId: UUID
        +severity: Severity
        +description: String
        +metadata: Map~String, Object~
    }

    class AuditEntry {
        +entryId: UUID
        +userId: UUID
        +action: Action
        +resource: Resource
        +resourceId: UUID
        +timestamp: DateTime
        +changes: Map~String, Object~
        +ipAddress: String
    }

    class EventStore {
        <<interface>>
        +save(event: Event) void
        +findByTimeRange(start: DateTime, end: DateTime) List~Event~
        +findByType(eventType: EventType) List~Event~
        +findByUser(userId: UUID) List~Event~
    }

    class AuditLog {
        <<interface>>
        +record(entry: AuditEntry) void
        +getHistory(resourceId: UUID) List~AuditEntry~
        +findByUser(userId: UUID) List~AuditEntry~
    }

    class TimelineFilter {
        +startDate: DateTime
        +endDate: DateTime
        +eventTypes: List~EventType~
        +userId: UUID
        +severity: Severity
    }

    class SearchQuery {
        +keyword: String
        +filters: Map~String, Object~
        +sortBy: String
        +sortOrder: SortOrder
    }

    ActivityLogger --> EventStore : uses
    ActivityLogger --> AuditLog : uses
    ActivityLogger *-- Event : creates
    ActivityLogger *-- AuditEntry : creates
    ActivityLogger --> TimelineFilter : uses
    ActivityLogger --> SearchQuery : uses

    note for ActivityLogger "Comprehensive logging system\nAudit trail for compliance"
    note for EventStore "Persistent event storage\nSupports time-range queries"
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
        SUS[SignUpService]
        LS[LoginService]
        SM[SessionManager]
        UPM[UserPermissionManager]
    end

    subgraph "Support Services"
        AL[ActivityLogger]
    end

    SMM -->|triggers| AM
    AM -->|sends| NM

    DR -->|monitors| DHM
    DR -->|configures| DCS

    SS -->|records| RM
    SS -->|controls| PTZ

    SUS -->|creates| SM
    LS -->|validates| SM
    SM -->|checks| UPM

    AM -->|logs| AL
    LS -->|logs| AL
    DR -->|logs| AL

    style SMM fill:#667eea
    style AM fill:#F44336
    style NM fill:#FF9800
    style AL fill:#2196F3
```

### Data Flow Between Layers

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[ViewControllers]
    end

    subgraph "Business Logic Layer"
        BL[Business Services]
    end

    subgraph "Data Layer"
        DB[(Database)]
        Storage[(Storage)]
    end

    UI -->|Commands| BL
    BL -->|Events| UI
    BL -->|Queries| DB
    BL -->|Saves| DB
    BL -->|Stores| Storage
    BL -->|Retrieves| Storage

    style UI fill:#667eea
    style BL fill:#4CAF50
    style DB fill:#FF9800
    style Storage fill:#2196F3
```

---

## Design Patterns

### 1. Repository Pattern

- `DeviceRegistry` - Device data access
- `RecordingManager` - Recording data access
- `UserPermissionManager` - Permission data access

### 2. Service Layer Pattern

- All business logic encapsulated in service classes
- Clear separation from presentation and data layers

### 3. Strategy Pattern

- `NotificationPolicy` - Different notification strategies
- `AlarmPolicy` - Different alarm handling strategies
- `RecordingSetting` - Different recording strategies

### 4. Observer Pattern

- `ActivityLogger` - Observes system events
- `DeviceHealthMonitor` - Observes device status

### 5. Singleton Pattern

- `SessionManager` - Single session management instance
- `DeviceRegistry` - Single device registry

### 6. Command Pattern

- `PTZCommand` - PTZ control commands
- Various action commands in the system

### 7. Factory Pattern

- Device creation in `DeviceRegistry`
- Session creation in `SessionManager`

---

## SOLID Principles

### Single Responsibility Principle (SRP)

Each service class has a single, well-defined responsibility

### Open/Closed Principle (OCP)

Services are open for extension through interfaces and inheritance

### Liskov Substitution Principle (LSP)

Interfaces can be substituted with implementations

### Interface Segregation Principle (ISP)

Focused interfaces (StorageProvider, EventStore, etc.)

### Dependency Inversion Principle (DIP)

Services depend on abstractions (interfaces) not concretions

---

## Statistics

| Category               | Count   |
| ---------------------- | ------- |
| **Core Services**      | 15      |
| **Supporting Classes** | 40+     |
| **Enumerations**       | 15+     |
| **Interfaces**         | 6       |
| **Total Classes**      | **60+** |

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
- Session management
- Audit logging

### ✅ Reliability

- Health monitoring
- Error handling
- Automatic recovery

### ✅ Performance

- Efficient caching
- Connection pooling
- Async operations

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11  
**Author:** SafeHome Development Team  
**Layer:** Business Logic Layer
