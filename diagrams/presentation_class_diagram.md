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
- [Class Relationships and Interactions](#class-relationships-and-interactions)

---

## Complete Presentation Layer Integration Diagram

```mermaid
classDiagram
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

    %% Relationships
    DashboardViewController --> NotificationPanel : uses
    DashboardViewController --> SecurityZoneViewController : navigates to
    DashboardViewController --> CameraViewController : navigates to

    CameraViewController --> RecordingViewController : navigates to

    SecurityZoneViewController --> DeviceManagementViewController : uses

    EmergencyViewController --> NotificationPanel : triggers

    UserAccountViewController --> DashboardViewController : returns to

    note for DashboardViewController "Main dashboard screen controller\nComprehensive system status display"
    note for CameraViewController "Camera live view and\nPTZ control handler"
    note for SecurityZoneViewController "Security Zone configuration\n(HW2 New Feature)"
```

---

## 1. DashboardViewController

**Responsibility:** Main dashboard screen control and status management

```mermaid
classDiagram
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

    class SecurityModeDisplay {
        -currentMode: SecurityMode
        -armingCountdown: int
        +displayMode(mode: SecurityMode) void
        +showCountdown(seconds: int) void
        +highlightMode(mode: SecurityMode) void
    }

    class EventsPanel {
        -events: List~Event~
        -maxDisplayCount: int
        +addEvent(event: Event) void
        +clearEvents() void
        +filterByType(type: EventType) void
        +sortByTime() void
    }

    class DeviceStatusWidget {
        -onlineDevices: int
        -totalDevices: int
        -criticalAlerts: int
        +updateCounts(online: int, total: int) void
        +showCriticalAlert(alert: Alert) void
        +displayDeviceHealth() void
    }

    class QuickActionsPanel {
        -actions: List~Action~
        +registerAction(action: Action) void
        +executeAction(actionId: String) void
        +disableAction(actionId: String) void
    }

    class User {
        +userId: UUID
        +userName: String
        +role: UserRole
        +permissions: List~Permission~
    }

    class SecurityMode {
        <<enumeration>>
        DISARMED
        ARMED_HOME
        ARMED_AWAY
        ARMED_NIGHT
    }

    class Event {
        +eventId: UUID
        +timestamp: DateTime
        +eventType: EventType
        +severity: Severity
        +description: String
    }

    DashboardViewController *-- SecurityModeDisplay : contains
    DashboardViewController *-- EventsPanel : contains
    DashboardViewController *-- DeviceStatusWidget : contains
    DashboardViewController *-- QuickActionsPanel : contains
    DashboardViewController --> User : uses
    DashboardViewController ..> SecurityMode : depends on
    EventsPanel --> Event : manages

    note for DashboardViewController "Central controller for main screen\nManages all widgets and panels"
    note for SecurityModeDisplay "Security mode visualization\nArming/disarming status display"
```

---

## 2. CameraViewController

**Responsibility:** Camera live view, recording playback, PTZ control UI

```mermaid
classDiagram
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

    class VideoPlayer {
        -currentStream: VideoStream
        -playbackState: PlaybackState
        -bufferSize: int
        +play() void
        +pause() void
        +stop() void
        +seek(timestamp: DateTime) void
        +setQuality(quality: VideoQuality) void
        +enableFullscreen() void
    }

    class PTZControlPanel {
        -panSpeed: float
        -tiltSpeed: float
        -zoomLevel: float
        -presetPositions: List~Position~
        +pan(direction: Direction, speed: float) void
        +tilt(direction: Direction, speed: float) void
        +zoom(level: float) void
        +moveToPreset(presetId: int) void
        +savePreset(position: Position) void
    }

    class AudioControl {
        -isEnabled: bool
        -volume: float
        -isMuted: bool
        +enable() void
        +disable() void
        +setVolume(level: float) void
        +mute() void
        +unmute() void
        +startSpeaking() void
        +stopSpeaking() void
    }

    class Camera {
        +cameraId: UUID
        +cameraName: String
        +location: String
        +isOnline: bool
        +supportsPTZ: bool
        +supportsAudio: bool
        +resolution: Resolution
    }

    class StreamSession {
        +sessionId: UUID
        +startTime: DateTime
        +bandwidth: float
        +latency: int
        +isActive: bool
        +reconnect() void
        +close() void
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

    class VideoStream {
        +streamId: UUID
        +codec: String
        +bitrate: int
        +fps: int
    }

    CameraViewController *-- VideoPlayer : contains
    CameraViewController *-- PTZControlPanel : contains
    CameraViewController *-- AudioControl : contains
    CameraViewController --> Camera : manages
    CameraViewController --> StreamSession : uses
    VideoPlayer --> VideoStream : plays
    PTZControlPanel ..> PTZCommand : uses

    note for CameraViewController "Central controller for\nall camera functions"
    note for PTZControlPanel "Pan-Tilt-Zoom control\nPreset position management"
```

---

## 3. SecurityZoneViewController

**Responsibility:** Security Zone configuration and management UI (HW2 New Feature)

```mermaid
classDiagram
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

    class FloorPlanView {
        -floorPlanImage: Image
        -zones: List~ZoneOverlay~
        -devices: List~DeviceMarker~
        -scale: float
        +renderFloorPlan() void
        +drawZone(zone: SafetyZone) void
        +drawDeviceMarker(device: Device) void
        +highlightZone(zoneId: int) void
        +enableEditMode() void
        +disableEditMode() void
        +onZoneClick(zoneId: int) void
    }

    class ZoneListPanel {
        -zones: List~SafetyZone~
        -selectedZoneId: int
        -sortOrder: SortOrder
        +displayZones(zones: List~SafetyZone~) void
        +selectZone(zoneId: int) void
        +addZone(zone: SafetyZone) void
        +removeZone(zoneId: int) void
        +sortZones(order: SortOrder) void
        +filterZones(filter: ZoneFilter) void
    }

    class DeviceSelectionPanel {
        -availableDevices: List~Device~
        -selectedDevices: List~Device~
        -deviceFilter: DeviceFilter
        +displayAvailableDevices() void
        +selectDevice(deviceId: UUID) void
        +deselectDevice(deviceId: UUID) void
        +filterByType(type: DeviceType) void
        +searchDevice(query: String) void
    }

    class SafetyZone {
        +zoneId: int
        +zoneName: String
        +devices: List~Device~
        +area: Polygon
        +isArmed: bool
        +armingDelay: int
        +addDevice(device: Device) void
        +removeDevice(deviceId: UUID) void
        +arm() void
        +disarm() void
    }

    class Device {
        +deviceId: UUID
        +deviceName: String
        +deviceType: DeviceType
        +location: String
        +isOnline: bool
        +zoneId: int
    }

    class ZoneOverlay {
        +zoneId: int
        +coordinates: List~Point~
        +color: Color
        +opacity: float
        +isActive: bool
    }

    class DeviceMarker {
        +deviceId: UUID
        +position: Point
        +icon: Icon
        +label: String
    }

    SecurityZoneViewController *-- FloorPlanView : contains
    SecurityZoneViewController *-- ZoneListPanel : contains
    SecurityZoneViewController *-- DeviceSelectionPanel : contains
    SecurityZoneViewController --> SafetyZone : manages
    FloorPlanView --> ZoneOverlay : renders
    FloorPlanView --> DeviceMarker : renders
    ZoneListPanel --> SafetyZone : displays
    DeviceSelectionPanel --> Device : manages
    SafetyZone --> Device : contains

    note for SecurityZoneViewController "HW2 New Feature\nZone-based security management"
    note for FloorPlanView "Visualize zones and\ndevice locations on floor plan"
```

---

## 4. DeviceManagementViewController

**Responsibility:** Device addition, configuration, and status monitoring UI

```mermaid
classDiagram
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

    class DeviceListView {
        -devices: List~Device~
        -selectedDevice: Device
        -viewMode: ViewMode
        +renderList() void
        +renderGrid() void
        +selectDevice(deviceId: UUID) void
        +updateDevice(device: Device) void
        +showStatusIndicator(status: DeviceStatus) void
    }

    class DeviceDetailView {
        -device: Device
        -settingsPanel: SettingsPanel
        -statusPanel: StatusPanel
        -historyPanel: HistoryPanel
        +displayDevice(device: Device) void
        +showSettings() void
        +showStatus() void
        +showHistory() void
        +editDevice() void
    }

    class AddDeviceWizard {
        -currentStep: int
        -totalSteps: int
        -deviceType: DeviceType
        -pairingCode: String
        +start() void
        +nextStep() void
        +previousStep() void
        +selectDeviceType(type: DeviceType) void
        +enterPairingCode(code: String) void
        +configureName(name: String) void
        +configureLocation(location: String) void
        +complete() void
        +cancel() void
    }

    class Device {
        +deviceId: UUID
        +deviceName: String
        +deviceType: DeviceType
        +manufacturer: String
        +model: String
        +firmwareVersion: String
        +location: String
        +isOnline: bool
        +batteryLevel: int
        +lastSeen: DateTime
    }

    class DeviceSettings {
        +deviceId: UUID
        +settings: Map~String, Object~
        +update(key: String, value: Object) void
        +reset() void
        +validate() bool
    }

    class DeviceFilter {
        +deviceType: DeviceType
        +status: DeviceStatus
        +location: String
        +batteryLevel: BatteryLevel
        +apply(devices: List~Device~) List~Device~
    }

    class SortCriteria {
        <<enumeration>>
        BY_NAME
        BY_TYPE
        BY_STATUS
        BY_LOCATION
        BY_BATTERY
        BY_LAST_SEEN
    }

    class ViewMode {
        <<enumeration>>
        LIST
        GRID
        DETAILED
    }

    DeviceManagementViewController *-- DeviceListView : contains
    DeviceManagementViewController *-- DeviceDetailView : contains
    DeviceManagementViewController *-- AddDeviceWizard : contains
    DeviceManagementViewController --> Device : manages
    DeviceListView --> Device : displays
    DeviceDetailView --> Device : displays
    AddDeviceWizard --> Device : creates
    DeviceManagementViewController ..> DeviceSettings : uses
    DeviceManagementViewController ..> DeviceFilter : uses
    DeviceManagementViewController ..> SortCriteria : uses

    note for DeviceManagementViewController "Central management controller\nfor all devices"
    note for AddDeviceWizard "Step-by-step device addition\nwizard UI"
```

---

## 5. EmergencyViewController

**Responsibility:** Emergency response UI (Panic Button, Alarm Verification)

```mermaid
classDiagram
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

    class PanicButton {
        -isPressed: bool
        -pressStartTime: DateTime
        -pressThreshold: int
        -buttonSize: Size
        -buttonColor: Color
        +render() void
        +onPressStart() void
        +onPressEnd() void
        +onLongPress(duration: int) void
        +showConfirmation() void
        +animate() void
    }

    class AlarmVerificationPanel {
        -alarm: Alarm
        -verificationTimeout: int
        -cameraSnapshot: Image
        -audioClip: AudioClip
        +displayAlarm(alarm: Alarm) void
        +showSnapshot(cameraId: UUID) void
        +playAudioClip() void
        +startCountdown(seconds: int) void
        +onConfirm() void
        +onDismiss() void
        +onTimeout() void
    }

    class EmergencyContactsPanel {
        -contacts: List~EmergencyContact~
        -selectedContact: EmergencyContact
        +displayContacts() void
        +selectContact(contactId: UUID) void
        +callContact(contactId: UUID) void
        +editContact(contact: EmergencyContact) void
        +addContact(contact: EmergencyContact) void
        +removeContact(contactId: UUID) void
        +showCallHistory() void
    }

    class Alarm {
        +alarmId: UUID
        +alarmType: AlarmType
        +triggeredBy: String
        +triggeredAt: DateTime
        +severity: Severity
        +isVerified: bool
        +isActive: bool
        +location: String
        +relatedDeviceId: UUID
    }

    class EmergencyContact {
        +contactId: UUID
        +name: String
        +phoneNumber: String
        +relationship: String
        +priority: int
        +isAvailable: bool
    }

    class EmergencyServiceType {
        <<enumeration>>
        POLICE
        FIRE_DEPARTMENT
        AMBULANCE
        SECURITY_COMPANY
        PERSONAL_CONTACT
    }

    class AlarmType {
        <<enumeration>>
        INTRUSION
        FIRE
        MEDICAL
        PANIC
        ENVIRONMENTAL
    }

    class Severity {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        CRITICAL
    }

    EmergencyViewController *-- PanicButton : contains
    EmergencyViewController *-- AlarmVerificationPanel : contains
    EmergencyViewController *-- EmergencyContactsPanel : contains
    EmergencyViewController --> Alarm : manages
    AlarmVerificationPanel --> Alarm : displays
    EmergencyContactsPanel --> EmergencyContact : manages
    Alarm ..> AlarmType : uses
    Alarm ..> Severity : uses
    EmergencyViewController ..> EmergencyServiceType : uses

    note for EmergencyViewController "Dedicated emergency response\nRapid response support"
    note for PanicButton "Emergency call button\n(Hold for 3 seconds)"
```

---

## 6. UserAccountViewController

**Responsibility:** User account management and settings UI

```mermaid
classDiagram
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

    class ProfileView {
        -user: User
        -avatarImage: Image
        -editMode: bool
        +displayProfile() void
        +enableEdit() void
        +saveChanges() void
        +cancelEdit() void
        +uploadAvatar(image: Image) void
        +validateEmail(email: String) bool
        +validatePhone(phone: String) bool
    }

    class SecuritySettingsView {
        -twoFactorEnabled: bool
        -trustedDevices: List~Device~
        -loginHistory: List~LoginRecord~
        +displaySettings() void
        +enableTwoFactor() void
        +disableTwoFactor() void
        +manageTrustedDevices() void
        +viewLoginHistory() void
        +changePin(oldPin: String, newPin: String) void
        +setupBiometric() void
    }

    class UserPermissionsView {
        -user: User
        -assignedRoles: List~Role~
        -permissions: List~Permission~
        +displayPermissions() void
        +assignRole(role: Role) void
        +revokeRole(roleId: UUID) void
        +grantPermission(permission: Permission) void
        +revokePermission(permissionId: UUID) void
        +viewAccessLog() void
    }

    class User {
        +userId: UUID
        +userName: String
        +email: String
        +phoneNumber: String
        +role: UserRole
        +createdAt: DateTime
        +lastLogin: DateTime
        +isActive: bool
    }

    class UserProfile {
        +userId: UUID
        +firstName: String
        +lastName: String
        +displayName: String
        +email: String
        +phoneNumber: String
        +address: String
        +avatarUrl: String
        +preferences: UserPreferences
    }

    class UserRole {
        <<enumeration>>
        HOMEOWNER
        FAMILY_MEMBER
        GUEST
        ADMIN
        SECURITY_MONITOR
    }

    class Role {
        +roleId: UUID
        +roleName: String
        +description: String
        +permissions: List~Permission~
        +isSystemRole: bool
    }

    class Permission {
        +permissionId: UUID
        +resource: String
        +action: Action
        +scope: Scope
    }

    class LoginRecord {
        +recordId: UUID
        +userId: UUID
        +loginTime: DateTime
        +ipAddress: String
        +deviceInfo: String
        +isSuccessful: bool
    }

    UserAccountViewController *-- ProfileView : contains
    UserAccountViewController *-- SecuritySettingsView : contains
    UserAccountViewController *-- UserPermissionsView : contains
    UserAccountViewController --> User : manages
    ProfileView --> UserProfile : edits
    SecuritySettingsView --> LoginRecord : displays
    UserPermissionsView --> Role : manages
    UserPermissionsView --> Permission : manages
    User ..> UserRole : has
    Role --> Permission : contains

    note for UserAccountViewController "Manages all user account\nsettings and preferences"
    note for SecuritySettingsView "Manages 2FA, biometric\nauthentication settings"
```

---

## 7. RecordingViewController

**Responsibility:** Recording search, playback, and export UI

```mermaid
classDiagram
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

    class RecordingGrid {
        -recordings: List~Recording~
        -viewMode: GridViewMode
        -selectedRecording: Recording
        -thumbnailSize: Size
        +renderGrid() void
        +renderList() void
        +renderTimeline() void
        +selectRecording(recordingId: UUID) void
        +loadThumbnails() void
        +sortRecordings(sortBy: SortCriteria) void
    }

    class SearchFilterPanel {
        -dateRange: DateRange
        -cameraFilter: List~UUID~
        -eventTypeFilter: List~EventType~
        -durationRange: DurationRange
        -tags: List~String~
        +applyFilters() void
        +clearFilters() void
        +setDateRange(start: DateTime, end: DateTime) void
        +selectCamera(cameraId: UUID) void
        +selectEventType(type: EventType) void
        +addTag(tag: String) void
    }

    class VideoPlayer {
        -recording: Recording
        -currentTime: float
        -playbackSpeed: float
        -volume: float
        -isPlaying: bool
        +play() void
        +pause() void
        +stop() void
        +seek(timestamp: float) void
        +setSpeed(speed: float) void
        +setVolume(level: float) void
        +takeSnapshot() Image
        +enableFullscreen() void
    }

    class ExportPanel {
        -selectedRecording: Recording
        -exportFormat: ExportFormat
        -exportQuality: ExportQuality
        -includeAudio: bool
        -watermark: bool
        +selectFormat(format: ExportFormat) void
        +selectQuality(quality: ExportQuality) void
        +startExport() void
        +cancelExport() void
        +getExportProgress() float
        +downloadFile() void
    }

    class Recording {
        +recordingId: UUID
        +cameraId: UUID
        +cameraName: String
        +startTime: DateTime
        +endTime: DateTime
        +duration: int
        +fileSize: long
        +resolution: Resolution
        +thumbnailUrl: String
        +tags: List~String~
        +isLocked: bool
    }

    class SearchFilter {
        +dateRange: DateRange
        +cameras: List~UUID~
        +eventTypes: List~EventType~
        +duration: DurationRange
        +tags: List~String~
        +minResolution: Resolution
    }

    class ExportFormat {
        <<enumeration>>
        MP4
        AVI
        MOV
        MKV
    }

    class ExportQuality {
        <<enumeration>>
        ORIGINAL
        HIGH
        MEDIUM
        LOW
    }

    class GridViewMode {
        <<enumeration>>
        GRID
        LIST
        TIMELINE
    }

    class SecureLink {
        +linkId: UUID
        +url: String
        +expiresAt: DateTime
        +accessCount: int
        +maxAccessCount: int
        +isActive: bool
    }

    RecordingViewController *-- RecordingGrid : contains
    RecordingViewController *-- SearchFilterPanel : contains
    RecordingViewController *-- VideoPlayer : contains
    RecordingViewController *-- ExportPanel : contains
    RecordingViewController --> Recording : manages
    RecordingGrid --> Recording : displays
    VideoPlayer --> Recording : plays
    ExportPanel --> Recording : exports
    SearchFilterPanel --> SearchFilter : creates
    ExportPanel ..> ExportFormat : uses
    ExportPanel ..> ExportQuality : uses
    RecordingViewController ..> SecureLink : generates

    note for RecordingViewController "Recording video management\nSearch/playback/share"
    note for ExportPanel "Export video in\nvarious formats"
```

---

## 8. NotificationPanel

**Responsibility:** Real-time notification display and management

```mermaid
classDiagram
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

    class Notification {
        +notificationId: UUID
        +title: String
        +message: String
        +timestamp: DateTime
        +priority: Priority
        +type: NotificationType
        +isRead: bool
        +actionUrl: String
        +relatedEntityId: UUID
    }

    class NotificationSettings {
        +enableSound: bool
        +enableVibration: bool
        +enablePopup: bool
        +quietHoursStart: Time
        +quietHoursEnd: Time
        +priorityFilter: List~Priority~
        +typeFilter: List~NotificationType~
        +validate() bool
    }

    class NotificationFilter {
        +priority: Priority
        +type: NotificationType
        +dateRange: DateRange
        +isRead: bool
        +apply(notifications: List~Notification~) List~Notification~
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

    class Queue~T~ {
        -items: List~T~
        -maxSize: int
        +enqueue(item: T) void
        +dequeue() T
        +peek() T
        +size() int
        +isEmpty() bool
        +clear() void
    }

    NotificationPanel *-- Queue~Notification~ : contains
    NotificationPanel --> Notification : manages
    NotificationPanel --> NotificationSettings : uses
    NotificationPanel ..> NotificationFilter : uses
    Notification ..> NotificationType : has
    Notification ..> Priority : has
    NotificationFilter ..> NotificationType : filters by
    NotificationFilter ..> Priority : filters by

    note for NotificationPanel "Real-time notification center\nIntegrated notification management"
    note for NotificationSettings "Notification behavior settings\nQuiet hours management"
```

---

## Class Relationships and Interactions

### Main Navigation Flow

```mermaid
graph LR
    A[DashboardViewController] -->|Select Camera| B[CameraViewController]
    A -->|Zone Management| C[SecurityZoneViewController]
    A -->|Device Management| D[DeviceManagementViewController]
    A -->|Emergency| E[EmergencyViewController]
    A -->|Settings| F[UserAccountViewController]
    B -->|View Recordings| G[RecordingViewController]
    C -->|Add Device| D

    style A fill:#667eea
    style E fill:#F44336
```

### Data Flow

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

    subgraph "Application Layer"
        AS[Application Service]
    end

    subgraph "Domain Layer"
        DM[Domain Model]
    end

    DVC --> AS
    CVC --> AS
    SZVC --> AS
    DMVC --> AS
    EVC --> AS
    UAVC --> AS
    RVC --> AS

    AS --> DM
    AS -.Notifications.-> NP

    style AS fill:#4CAF50
    style DM fill:#FF9800
```

### Component Dependencies

```mermaid
graph TD
    A[All ViewControllers] -->|uses| N[NotificationPanel]
    B[DashboardViewController] -->|navigates| C[CameraViewController]
    B -->|navigates| D[SecurityZoneViewController]
    B -->|navigates| E[DeviceManagementViewController]
    C -->|navigates| F[RecordingViewController]
    D -->|uses| E
    G[EmergencyViewController] -->|triggers| N
    H[UserAccountViewController] -->|returns to| B

    style N fill:#2196F3
    style B fill:#667eea
```

---

## Design Patterns and Principles

### 1. MVC (Model-View-Controller) Pattern

- **ViewController**: Handles user input and coordinates view updates
- **View Components**: UI rendering (Panel, Grid, Player, etc.)
- **Model**: Domain objects (User, Device, Recording, etc.)

### 2. Composite Pattern

- Each ViewController contains multiple child View components
- Forms hierarchical UI structure

### 3. Observer Pattern

- NotificationPanel observes system events
- Real-time notification display

### 4. Strategy Pattern

- Various filtering strategies (SearchFilter, DeviceFilter, etc.)
- Selectable ExportFormat and ExportQuality

### 5. Command Pattern

- Action execution in QuickActionsPanel
- PTZCommand processing

---

## Key Features

### ✅ Separation of Concerns

- Each ViewController follows Single Responsibility Principle (SRP)
- Separation of View and business logic

### ✅ Reusability

- Panel and View components are reused across multiple Controllers
- VideoPlayer is shared between CameraViewController and RecordingViewController

### ✅ Extensibility

- Easy to add new ViewControllers
- Extensible without modifying existing components

### ✅ Maintainability

- Clear interface and responsibility definitions
- Low coupling, high cohesion

---

## Statistics

| Item                | Count                 |
| ------------------- | --------------------- |
| **ViewController**  | 7                     |
| **Component**       | 1 (NotificationPanel) |
| **View Components** | 20+                   |
| **Domain Objects**  | 15+                   |
| **Enumerations**    | 10+                   |
| **Total Classes**   | **50+**               |

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11  
**Author:** SafeHome Development Team  
**Layer:** Presentation Layer
