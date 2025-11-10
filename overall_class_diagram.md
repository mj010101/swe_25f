# SafeHome Overall System Class Diagram

> Comprehensive UML Class Diagrams for the Entire SafeHome Security System

## 📑 Table of Contents

- [System Architecture Overview](#system-architecture-overview)
- [1. Base Classes & Common Abstractions](#1-base-classes--common-abstractions)
- [2. Actors, Account & Authentication](#2-actors-account--authentication)
- [3. Core Platform (Hub/Cloud/Config/Log)](#3-core-platform-hubcloudconfiglog)
- [4. Security Modes & Zones](#4-security-modes--zones)
- [5. Devices & Sensors](#5-devices--sensors)
- [6. Surveillance, Media & Audio](#6-surveillance-media--audio)
- [7. Notifications & Automation](#7-notifications--automation)
- [8. Incidents, Verification & Emergency](#8-incidents-verification--emergency)
- [9. Device Onboarding](#9-device-onboarding)
- [10. Commands, DTOs & Reports](#10-commands-dtos--reports)
- [Complete System Integration](#complete-system-integration)

---

## System Architecture Overview

```mermaid
graph TB
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
    style Incident fill:#F44336
```

---

## 1. Base Classes & Common Abstractions

```mermaid
classDiagram
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
    
    note for Service "Base service interface\nfor all system services"
    note for Device "Abstract base class\nfor all physical devices"
    note for Sensor "Extends Device with\nsensor-specific capabilities"
```

---

## 2. Actors, Account & Authentication

```mermaid
classDiagram
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
    
    class TwoFactorAuthenticationService {
        <<Service>>
        +totpSecret: string
        +backupCodes: BackupCodes
        +generateTOTP() string
        +verifyTOTP(code: string) boolean
        +generateBackupCodes() BackupCodes
        +verifyBackupCode(code: string) boolean
        +sendSMS(phoneNumber: string, code: string) void
    }
    
    class VerificationToken {
        +tokenId: string
        +userId: string
        +token: string
        +type: TokenType
        +expiresAt: DateTime
        +isUsed: boolean
        +validate() boolean
        +markAsUsed() void
    }
    
    class BackupCodes {
        +codes: string[]
        +generatedAt: DateTime
        +usedCodes: Set~string~
        +generate() string[]
        +verify(code: string) boolean
    }
    
    class TrustedDevice {
        +deviceId: string
        +userId: string
        +deviceName: string
        +deviceFingerprint: string
        +lastUsed: DateTime
        +isActive: boolean
        +revoke() void
    }
    
    class PasswordPolicy {
        +minLength: number
        +requireUppercase: boolean
        +requireLowercase: boolean
        +requireNumbers: boolean
        +requireSpecialChars: boolean
        +maxAge: number
        +historyCount: number
        +validate(password: string) boolean
    }
    
    class RateLimitPolicy {
        +maxAttempts: number
        +timeWindow: number
        +lockoutDuration: number
        +checkLimit(userId: string) boolean
        +recordAttempt(userId: string) void
        +resetAttempts(userId: string) void
    }
    
    class AuthorizationService {
        <<Service>>
        -roleManager: RoleManager
        +checkPermission(userId: string, resource: string, action: string) boolean
        +assignRole(userId: string, role: Role) void
        +revokeRole(userId: string, roleId: string) void
        +getUserPermissions(userId: string) Permission[]
    }
    
    class Role {
        +roleId: string
        +roleName: string
        +description: string
        +permissions: Permission[]
        +isSystem: boolean
        +addPermission(permission: Permission) void
        +removePermission(permissionId: string) void
    }
    
    class Permission {
        +permissionId: string
        +resource: string
        +action: string
        +scope: Scope
        +description: string
    }
    
    class Session {
        +sessionId: string
        +userId: string
        +token: string
        +deviceInfo: DeviceInfo
        +ipAddress: string
        +createdAt: DateTime
        +expiresAt: DateTime
        +lastActivity: DateTime
        +invalidate() void
        +extend() void
    }

    Account <|-- Homeowner
    Account <|-- Guest
    
    Service <|-- AuthenticationService
    Service <|-- TwoFactorAuthenticationService
    Service <|-- AuthorizationService
    
    AuthenticationService --> Account : authenticates
    AuthenticationService --> Session : creates
    AuthenticationService --> VerificationToken : uses
    
    TwoFactorAuthenticationService --> BackupCodes : manages
    TwoFactorAuthenticationService --> TrustedDevice : manages
    
    AuthenticationService --> PasswordPolicy : enforces
    AuthenticationService --> RateLimitPolicy : applies
    
    AuthorizationService --> Role : manages
    AuthorizationService --> Permission : checks
    
    Role --> Permission : contains
    Account --> Session : has
    
    note for AuthenticationService "Handles user login,\nlogout, and token management"
    note for TwoFactorAuthenticationService "Provides additional\nsecurity layer"
```

---

## 3. Core Platform (Hub/Cloud/Config/Log)

```mermaid
classDiagram
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
    
    class WebClient {
        +sessionId: string
        +browser: string
        +userId: string
        +connect() void
        +navigate(route: string) void
    }
    
    class ControlPanelClient {
        +panelId: string
        +location: string
        +displaySettings: Object
        +armSystem() void
        +disarmSystem() void
        +triggerPanic() void
    }
    
    class ConfigurationManager {
        <<Service>>
        -configCache: Map~string, Object~
        +loadConfiguration() Configuration
        +saveConfiguration(config: Configuration) void
        +getParameter(key: string) any
        +setParameter(key: string, value: any) void
        +resetToDefault() void
        +validateConfiguration(config: Configuration) boolean
        +applyConfiguration(config: Configuration) void
        +exportConfiguration() string
    }
    
    class SystemSettings {
        +language: string
        +timezone: string
        +dateFormat: string
        +temperatureUnit: string
        +currency: string
        +notifications: NotificationSettings
        +privacy: PrivacySettings
    }
    
    class StorageManager {
        <<Service>>
        -localStorage: LocalStorage
        -cloudStorage: CloudStorage
        +store(key: string, value: any) void
        +retrieve(key: string) any
        +delete(key: string) void
        +clear() void
        +getStorageUsage() StorageStats
    }
    
    class ActivityLog {
        <<CloudService>>
        -logs: LogRecord[]
        -retention: number
        +logActivity(event: SystemEvent) void
        +queryLogs(filters: LogFilter) LogRecord[]
        +exportLogs(format: string) File
        +purgeLogs(olderThan: DateTime) void
    }
    
    class LogExportService {
        <<Service>>
        +exportToCSV(logs: LogRecord[]) File
        +exportToJSON(logs: LogRecord[]) File
        +exportToPDF(logs: LogRecord[]) File
        +scheduleExport(schedule: Schedule) void
    }
    
    class SystemStatusService {
        <<Service>>
        +getHubStatus() HubStatus
        +getDeviceStatuses() DeviceStatus[]
        +getCloudStatus() CloudStatus
        +getSystemHealth() HealthReport
    }
    
    class ConnectivityEvent {
        <<SystemEvent>>
        +connectionType: string
        +wasConnected: boolean
        +isConnected: boolean
        +reason: string
    }
    
    class HubConnectivityMonitor {
        <<Service>>
        -pingInterval: number
        +monitorConnection() void
        +handleDisconnect() void
        +handleReconnect() void
        +getConnectionQuality() Quality
    }
    
    class LogRecord {
        +logId: string
        +timestamp: DateTime
        +level: LogLevel
        +category: string
        +message: string
        +userId: string
        +deviceId: string
        +metadata: Object
    }
    
    class LogSyncBatch {
        +batchId: string
        +logs: LogRecord[]
        +timestamp: DateTime
        +syncStatus: SyncStatus
        +retryCount: number
        +upload() void
    }

    Service <|-- CloudService
    Service <|-- ConfigurationManager
    Service <|-- StorageManager
    Service <|-- LogExportService
    Service <|-- SystemStatusService
    Service <|-- HubConnectivityMonitor
    
    CloudService <|-- ActivityLog
    SystemEvent <|-- ConnectivityEvent
    
    SafeHomeHub --> CloudService : uses
    SafeHomeHub --> ConfigurationManager : uses
    SafeHomeHub --> StorageManager : uses
    
    MobileAppClient --> SafeHomeHub : connects
    WebClient --> CloudService : connects
    ControlPanelClient --> SafeHomeHub : controls
    
    ConfigurationManager --> SystemSettings : manages
    ActivityLog --> LogRecord : stores
    ActivityLog --> LogExportService : uses
    
    HubConnectivityMonitor --> ConnectivityEvent : generates
    ActivityLog --> LogSyncBatch : creates
    
    note for SafeHomeHub "Central hub that manages\nall devices and services"
    note for CloudService "Provides cloud connectivity\nand data synchronization"
```

---

## 4. Security Modes & Zones

```mermaid
classDiagram
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
    
    class SecurityModeProfile {
        +profileId: string
        +profileName: string
        +modes: SecurityMode[]
        +defaultMode: SecurityMode
        +createdBy: string
        +isActive: boolean
        +activate() void
        +deactivate() void
    }
    
    class SafetyZone {
        +zoneId: string
        +zoneName: string
        +sensors: Sensor[]
        +area: Area
        +isArmed: boolean
        +bypassEnabled: boolean
        +arm() void
        +disarm() void
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
        +addZone(zone: SafetyZone) void
        +removeZone(zoneId: string) void
    }
    
    class SensorBypassList {
        +bypassedSensors: Map~string, BypassRule~
        +addBypass(sensorId: string, rule: BypassRule) void
        +removeBypass(sensorId: string) void
        +clearAll() void
        +isActive(sensorId: string) boolean
    }
    
    class BypassRule {
        +ruleId: string
        +sensorId: string
        +reason: string
        +bypassedBy: string
        +startTime: DateTime
        +duration: number
        +autoRestore: boolean
    }

    SecurityModeManager --> SecurityMode : manages
    SecurityModeManager --> SecurityArmingState : maintains
    SecurityModeManager --> SafetyZone : controls
    SecurityModeManager --> SensorBypassList : uses
    
    SecurityModeProfile --> SecurityMode : contains
    SafetyZone --> Sensor : groups
    
    SensorBypassList --> BypassRule : contains
    BypassRule --> Sensor : references
    
    note for SecurityModeManager "Core component managing\nsecurity states and modes"
    note for SecurityArmingState "Represents current\nsystem arming state"
```

---

## 5. Devices & Sensors

```mermaid
classDiagram
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
    
    class COSensor {
        <<EnvironmentalSensor>>
        +coLevel: number
        +ppmThreshold: number
        +isAlarmActive: boolean
        +lastTest: DateTime
        +getCOLevel() number
    }
    
    class GasSensor {
        <<EnvironmentalSensor>>
        +gasType: string
        +gasLevel: number
        +explosionRisk: boolean
        +shutoffValve: boolean
        +triggerShutoff() void
    }
    
    class LeakSensor {
        <<EnvironmentalSensor>>
        +moistureLevel: number
        +isLeakDetected: boolean
        +leakLocation: string
        +alertThreshold: number
    }
    
    class AirQualitySensor {
        <<EnvironmentalSensor>>
        +pm25: number
        +pm10: number
        +humidity: number
        +temperature: number
        +co2Level: number
        +vocLevel: number
        +aqi: number
        +getAQI() number
    }
    
    class InternalSiren {
        <<Device>>
        +volume: number
        +tone: string
        +isActive: boolean
        +duration: number
        +activate() void
        +deactivate() void
        +test() void
        +setVolume(level: number) void
    }
    
    class SmartHomeDevice {
        <<Device>>
        +protocol: string
        +isControllable: boolean
        +energyUsage: number
        +lastCommand: Command
        +sendCommand(command: Command) void
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
    
    class LightGroup {
        +groupId: string
        +groupName: string
        +lights: SmartLight[]
        +turnAllOn() void
        +turnAllOff() void
        +setGroupBrightness(level: number) void
    }
    
    class VentilationSystem {
        <<Device>>
        +fanSpeed: number
        +mode: VentilationMode
        +isRunning: boolean
        +airFlowRate: number
        +start() void
        +stop() void
        +setSpeed(speed: number) void
        +setMode(mode: VentilationMode) void
    }
    
    class SmartMeter {
        <<Device>>
        +meterType: string
        +currentReading: number
        +unit: string
        +readings: PowerReading[]
        +getReading() PowerReading
        +getUsageHistory() PowerReading[]
        +resetMeter() void
    }
    
    class PowerReading {
        +timestamp: DateTime
        +value: number
        +unit: string
        +cost: number
    }

    Sensor <|-- MotionSensor
    Sensor <|-- WindowDoorSensor
    
    EnvironmentalSensor <|-- FireSmokeSensor
    EnvironmentalSensor <|-- COSensor
    EnvironmentalSensor <|-- GasSensor
    EnvironmentalSensor <|-- LeakSensor
    EnvironmentalSensor <|-- AirQualitySensor
    
    Device <|-- InternalSiren
    Device <|-- SmartHomeDevice
    Device <|-- VentilationSystem
    Device <|-- SmartMeter
    
    SmartHomeDevice <|-- SmartLight
    
    LightGroup --> SmartLight : controls
    SmartMeter --> PowerReading : produces
    
    note for MotionSensor "Detects movement\nwith pet immunity option"
    note for FireSmokeSensor "Critical life safety sensor"
    note for SmartLight "Controllable lighting\nwith color support"
```

---

## 6. Surveillance, Media & Audio

```mermaid
classDiagram
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
    
    class SoundClassifier {
        <<Service>>
        -model: MLModel
        -audioBuffer: AudioBuffer
        +classifySound(audio: AudioStream) SoundCategory
        +detectGlassBreak(audio: AudioStream) boolean
        +trainModel(samples: AudioSample[]) void
    }
    
    class BarkingDetector {
        <<Service>>
        -threshold: number
        +detectBarking(audio: AudioStream) boolean
        +countBarks(audio: AudioStream, duration: number) number
        +setThreshold(level: number) void
    }
    
    class TwoWayAudioService {
        <<Service>>
        -inputStream: AudioStream
        -outputStream: AudioStream
        +startAudio(cameraId: string) void
        +stopAudio() void
        +speak(audio: AudioData) void
        +listen() AudioStream
    }
    
    class AudioStream {
        +streamId: string
        +codec: string
        +bitrate: number
        +channels: number
        +sampleRate: number
        +isActive: boolean
        +start() void
        +stop() void
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
    
    class StorageRepository {
        +totalCapacity: number
        +usedSpace: number
        +freeSpace: number
        +retentionPolicy: RetentionPolicy
        +allocateSpace(size: number) boolean
        +cleanupOldMedia() void
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
        +getSegment(start: number, end: number) Blob
    }

    Device <|-- Camera
    
    Service <|-- SoundClassifier
    Service <|-- BarkingDetector
    Service <|-- TwoWayAudioService
    
    Media <|-- Snapshot
    Media <|-- Recording
    
    Camera --> Snapshot : captures
    Camera --> Recording : creates
    Camera --> TwoWayAudioService : uses
    
    SoundClassifier --> AudioStream : analyzes
    BarkingDetector --> AudioStream : monitors
    TwoWayAudioService --> AudioStream : manages
    
    MediaRepository --> Media : stores
    MediaRepository --> StorageRepository : uses
    
    note for Camera "Multi-functional camera\nwith PTZ and audio"
    note for MediaRepository "Central storage for\nall media files"
```

---

## 7. Notifications & Automation

```mermaid
classDiagram
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
    
    class NotificationPolicy {
        +policyId: string
        +userId: string
        +channels: Channel[]
        +quietHours: QuietHoursPolicy
        +severity: Severity
        +conditions: Condition[]
        +evaluate(event: SystemEvent) boolean
        +shouldSend(notification: Notification) boolean
        +getChannels() Channel[]
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
        +createdBy: string
        +lastExecuted: DateTime
        +evaluate() boolean
        +execute() void
    }
    
    class QuietHoursPolicy {
        <<AutomationRule>>
        +startTime: Time
        +endTime: Time
        +days: DayOfWeek[]
        +allowCritical: boolean
        +isActiveNow() boolean
    }

    Notification <|-- PushNotification
    Notification <|-- SMSMessage
    
    Service <|-- NotificationService
    CloudService <|-- AutomationRule
    AutomationRule <|-- QuietHoursPolicy
    
    NotificationService --> Notification : sends
    NotificationService --> NotificationPolicy : checks
    
    NotificationPolicy --> QuietHoursPolicy : contains
    NotificationPolicy --> SystemEvent : evaluates
    
    AutomationRule --> SystemEvent : triggers on
    
    note for NotificationService "Manages all notification\ndelivery channels"
    note for AutomationRule "User-defined automation\nrules and schedules"
```

---

## 8. Incidents, Verification & Emergency

```mermaid
classDiagram
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
    
    class LifeSafetyEvent {
        <<SystemEvent>>
        +eventType: LifeSafetyType
        +affectedArea: string
        +evacuationRequired: boolean
        +emergencyServicesCalled: boolean
        +casualties: number
    }
    
    class BarkingEvent {
        <<SystemEvent>>
        +duration: number
        +intensity: number
        +location: string
        +isExcessive: boolean
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
        +getStatus() ServiceStatus
    }
    
    class AutomatedCallService {
        <<Service>>
        -callQueue: Queue
        +makeCall(phoneNumber: string, message: string) void
        +playRecording(recording: AudioFile) void
        +getCallStatus(callId: string) CallStatus
    }
    
    class PanicButton {
        +buttonId: string
        +location: string
        +userId: string
        +lastPressed: DateTime
        +pressCount: number
        +press() void
        +triggerSilentAlarm() void
        +triggerAudibleAlarm() void
    }

    SystemEvent <|-- Alarm
    SystemEvent <|-- LifeSafetyEvent
    SystemEvent <|-- BarkingEvent
    
    Service <|-- IncidentManager
    Service <|-- ExternalSecurityService
    Service <|-- AutomatedCallService
    
    IncidentManager --> Alarm : manages
    IncidentManager --> ExternalSecurityService : notifies
    IncidentManager --> AutomatedCallService : uses
    
    PanicButton --> Alarm : triggers
    
    LifeSafetyEvent --> ExternalSecurityService : requires
    
    note for IncidentManager "Central incident management\nand response coordination"
    note for PanicButton "Emergency trigger for\nimmediate response"
```

---

## 9. Device Onboarding

```mermaid
classDiagram
    class DeviceOnboardingService {
        <<Service>>
        -pairingSessions: Map~string, PairingSession~
        +startPairing(deviceType: string) PairingSession
        +completePairing(sessionId: string, device: Device) boolean
        +cancelPairing(sessionId: string) void
        +getAvailableDevices() Device[]
        +validateDevice(device: Device) boolean
        +registerDevice(device: Device, hub: SafeHomeHub) void
    }
    
    class PairingSession {
        +sessionId: string
        +deviceType: string
        +initiatedBy: string
        +initiatedAt: DateTime
        +expiresAt: DateTime
        +status: PairingStatus
        +pin: string
        +qrCode: string
        +discoveredDevices: Device[]
        +selectDevice(device: Device) void
        +complete() void
        +cancel() void
    }

    Service <|-- DeviceOnboardingService
    
    DeviceOnboardingService --> PairingSession : creates
    DeviceOnboardingService --> Device : registers
    DeviceOnboardingService --> SafeHomeHub : registers with
    
    PairingSession --> Device : discovers
    
    note for DeviceOnboardingService "Manages device discovery\nand pairing process"
    note for PairingSession "Represents an active\npairing session"
```

---

## 10. Commands, DTOs & Reports

```mermaid
classDiagram
    class Command {
        +commandId: string
        +commandType: string
        +targetDeviceId: string
        +parameters: Object
        +issuedBy: string
        +issuedAt: DateTime
        +status: CommandStatus
        +result: Object
        +retryCount: number
        +execute() void
        +validate() boolean
        +retry() void
    }
    
    class Request {
        <<DTO>>
        +requestId: string
        +endpoint: string
        +method: string
        +headers: Object
        +body: Object
        +timestamp: DateTime
    }
    
    class Report {
        <<CloudService>>
        +reportId: string
        +reportType: string
        +generatedBy: string
        +generatedAt: DateTime
        +format: string
        +data: Object
        +parameters: ReportParameters
        +generate() void
        +export(format: string) File
        +schedule(schedule: Schedule) void
    }

    CloudService <|-- Report
    
    SafeHomeHub --> Command : executes
    Command --> Device : controls
    
    note for Command "Represents executable\ncommands for devices"
    note for Report "Generates various\nsystem reports"
```

---

## Complete System Integration

### Overall Architecture

```mermaid
classDiagram
    direction TB
    
    %% Core Abstractions
    class Service
    class Device
    class Sensor
    class SystemEvent
    
    %% Actors
    class Account
    class Homeowner
    class Guest
    
    %% Core Platform
    class SafeHomeHub {
        +registerDevice()
        +executeCommand()
        +syncWithCloud()
    }
    
    class CloudService {
        +syncData()
        +backupData()
    }
    
    %% Security
    class AuthenticationService
    class AuthorizationService
    class SecurityModeManager
    
    %% Devices
    class Camera
    class MotionSensor
    class FireSmokeSensor
    class SmartLight
    
    %% Services
    class NotificationService
    class IncidentManager
    class MediaRepository
    class DeviceOnboardingService
    
    %% Events
    class Alarm
    class LifeSafetyEvent
    
    %% Relationships
    Account <|-- Homeowner
    Account <|-- Guest
    
    Device <|-- Sensor
    Device <|-- Camera
    Device <|-- SmartLight
    
    Sensor <|-- MotionSensor
    Sensor <|-- FireSmokeSensor
    
    SystemEvent <|-- Alarm
    SystemEvent <|-- LifeSafetyEvent
    
    Service <|-- AuthenticationService
    Service <|-- CloudService
    Service <|-- NotificationService
    Service <|-- IncidentManager
    Service <|-- DeviceOnboardingService
    
    SafeHomeHub --> Device : manages
    SafeHomeHub --> CloudService : uses
    SafeHomeHub --> SecurityModeManager : contains
    
    SecurityModeManager --> Sensor : monitors
    
    Homeowner --> SafeHomeHub : owns
    Guest --> SafeHomeHub : accesses
    
    AuthenticationService --> Account : authenticates
    AuthorizationService --> Account : authorizes
    
    Camera --> MediaRepository : stores media
    
    Sensor --> Alarm : triggers
    IncidentManager --> Alarm : handles
    IncidentManager --> NotificationService : uses
    
    DeviceOnboardingService --> Device : registers
    DeviceOnboardingService --> SafeHomeHub : adds to
```

### Key Relationships Summary

```mermaid
graph LR
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
    style L fill:#FF9800
```

### System Layer Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI1[Mobile App]
        UI2[Web Client]
        UI3[Control Panel]
    end
    
    subgraph "Application Layer"
        SVC1[Authentication Service]
        SVC2[Notification Service]
        SVC3[Incident Manager]
        SVC4[Device Onboarding]
    end
    
    subgraph "Domain Layer"
        DOM1[Security Mode Manager]
        DOM2[Configuration Manager]
        DOM3[Media Repository]
        DOM4[Automation Rules]
    end
    
    subgraph "Infrastructure Layer"
        INF1[SafeHome Hub]
        INF2[Cloud Service]
        INF3[Storage Manager]
        INF4[WebSocket Manager]
    end
    
    subgraph "Device Layer"
        DEV1[Sensors]
        DEV2[Cameras]
        DEV3[Smart Devices]
        DEV4[Sirens]
    end
    
    UI1 --> SVC1
    UI2 --> SVC2
    UI3 --> SVC3
    
    SVC1 --> DOM1
    SVC2 --> DOM2
    SVC3 --> DOM3
    SVC4 --> DOM4
    
    DOM1 --> INF1
    DOM2 --> INF2
    DOM3 --> INF3
    DOM4 --> INF4
    
    INF1 --> DEV1
    INF1 --> DEV2
    INF1 --> DEV3
    INF1 --> DEV4
```

---

## Class Statistics

### Implementation Summary

| Category | Classes | Status |
|----------|---------|--------|
| **Base Classes** | 7 | Abstract |
| **Authentication & Authorization** | 13 | 🔴 Not Implemented |
| **Core Platform** | 14 | 🔴 Not Implemented |
| **Security Modes** | 7 | 🔴 Not Implemented |
| **Devices & Sensors** | 15 | 🔴 Not Implemented |
| **Surveillance & Media** | 9 | 🔴 Not Implemented |
| **Notifications & Automation** | 6 | 🔴 Not Implemented |
| **Incidents & Emergency** | 6 | 🔴 Not Implemented |
| **Device Onboarding** | 2 | 🔴 Not Implemented |
| **Commands & Reports** | 3 | 🔴 Not Implemented |
| **TOTAL** | **82** | — |

### Relationship Types

- **Inheritance (is-a)**: 30+ relationships
- **Composition (has-a)**: 40+ relationships
- **Dependency (uses)**: 50+ relationships
- **Association**: 20+ relationships

---

## Design Patterns Used

### 1. **Abstract Factory Pattern**
- `Device` and `Sensor` abstract classes
- Concrete implementations for specific device types

### 2. **Observer Pattern**
- `SystemEvent` and event listeners
- Notification distribution system

### 3. **Strategy Pattern**
- `SecurityMode` with different arming strategies
- `NotificationPolicy` with various delivery strategies

### 4. **Singleton Pattern**
- `SafeHomeHub` (single hub per home)
- `CloudService` (single cloud connection)

### 5. **Command Pattern**
- `Command` class for device control
- Command queue management

### 6. **Repository Pattern**
- `MediaRepository` for media storage
- `StorageRepository` for data persistence

### 7. **Service Layer Pattern**
- All `Service` classes
- Clear separation of business logic

### 8. **Factory Method Pattern**
- `DeviceOnboardingService` for device creation
- `NotificationService` for notification creation

---

## Key Design Principles

### SOLID Principles

- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Abstract base classes allow extension
- **Liskov Substitution**: All derived classes can replace base classes
- **Interface Segregation**: Focused interfaces for specific needs
- **Dependency Inversion**: Depend on abstractions, not concretions

### Additional Principles

- **DRY (Don't Repeat Yourself)**: Common functionality in base classes
- **KISS (Keep It Simple)**: Clear, focused class responsibilities
- **Separation of Concerns**: Layered architecture
- **Encapsulation**: Private attributes with public methods

---

## References

- [Class Structure Analysis](./class_analysis.md)
- [UML Frontend Diagram](./uml_class_diagram.md)
- [Mermaid Documentation](https://mermaid.js.org/)
- [UML Class Diagram Guide](https://www.uml-diagrams.org/class-diagrams-overview.html)

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-09  
**Author:** SafeHome Development Team  
**Total Classes:** 82  
**Total Diagrams:** 13

