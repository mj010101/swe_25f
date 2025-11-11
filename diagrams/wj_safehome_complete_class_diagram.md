# SafeHome 완전한 클래스 다이어그램 (Production-Level MVP)

## 설계 원칙
- ✅ 표준 SW 아키텍처 준수 (Presentation-Business-Data Layer)
- ✅ MVC 패턴 적용
- ✅ Production-level 서비스의 실전 구현
- ✅ 2주 MVP: 핵심 기능만, 하지만 완전한 구조
- ✅ HW2 Zone 가이드라인 완전 구현

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Presentation Layer (Frontend)               │
│  - View Components (React)                              │
│  - ViewController / PageController                       │
│  - UI State Management                                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Business Logic Layer (Backend)              │
│  - SecurityModeManager, AlarmManager                    │
│  - RecordingManager, NotificationManager                │
│  - Device Management                                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Data Layer (Model & Storage)                │
│  - Domain Models (User, Device, Zone, Recording)        │
│  - Repository Pattern                                    │
│  - Cloud Storage & Database                              │
└─────────────────────────────────────────────────────────┘
```

---

## PRESENTATION LAYER (Frontend Classes)

### 1) DashboardViewController

**책임:** 메인 대시보드 화면 제어 및 상태 관리

#### Attributes
- `- securityModeDisplay: SecurityModeDisplay`
- `- recentEventsPanel: EventsPanel`
- `- deviceStatusWidget: DeviceStatusWidget`
- `- quickActionsPanel: QuickActionsPanel`
- `- currentUser: User`

#### Methods
- `+ initialize(): void`
- `+ refreshDashboard(): void`
- `+ handleModeChange(mode: SecurityMode): void`
- `+ displayRecentEvents(events: List<Event>): void`
- `+ updateDeviceStatus(devices: List<Device>): void`
- `+ showNotification(notification: Notification): void`

---

### 2) CameraViewController

**책임:** 카메라 라이브뷰, 녹화 재생, PTZ 제어 UI

#### Attributes
- `- videoPlayer: VideoPlayer`
- `- ptzControlPanel: PTZControlPanel`
- `- audioControl: AudioControl`
- `- selectedCamera: Camera`
- `- streamSession: StreamSession | null`

#### Methods
- `+ loadCamera(cameraId: UUID): void`
- `+ startLiveView(): void`
- `+ stopLiveView(): void`
- `+ handlePTZControl(command: PTZCommand): void`
- `+ toggleTwoWayAudio(): void`
- `+ showRecordings(cameraId: UUID): void`
- `+ verifyPassword(password: String): bool`

---

### 3) SecurityZoneViewController

**책임:** Security Zone 설정 및 관리 UI (HW2 신규 기능)

#### Attributes
- `- floorPlanView: FloorPlanView`
- `- zoneListPanel: ZoneListPanel`
- `- deviceSelectionPanel: DeviceSelectionPanel`
- `- selectedZone: SafetyZone | null`

#### Methods
- `+ loadZones(): void`
- `+ createZone(zoneName: String): void`
- `+ editZone(zoneId: int): void`
- `+ deleteZone(zoneId: int): void`
- `+ addDeviceToZone(zoneId: int, deviceId: UUID): void`
- `+ removeDeviceFromZone(zoneId: int, deviceId: UUID): void`
- `+ displayZoneDevices(zone: SafetyZone): void`
- `+ validateDeviceAddition(device: Device): bool`
---

### 4) DeviceManagementViewController

**책임:** 장치 추가, 설정, 상태 모니터링 UI

#### Attributes
- `- deviceListView: DeviceListView`
- `- deviceDetailView: DeviceDetailView`
- `- addDeviceWizard: AddDeviceWizard`
- `- devices: List<Device>`

#### Methods
- `+ displayDevices(devices: List<Device>): void`
- `+ showDeviceDetail(deviceId: UUID): void`
- `+ startAddDeviceFlow(): void`
- `+ updateDeviceSettings(deviceId: UUID, settings: DeviceSettings): void`
- `+ removeDevice(deviceId: UUID): void`
- `+ filterDevices(filter: DeviceFilter): void`
- `+ sortDevices(sortBy: SortCriteria): void`

---

### 5) EmergencyViewController

**책임:** 비상 상황 대응 UI (Panic Button, Alarm Verification)

#### Attributes
- `- panicButton: PanicButton`
- `- alarmVerificationPanel: AlarmVerificationPanel`
- `- emergencyContactsPanel: EmergencyContactsPanel`
- `- activeAlarms: List<Alarm>`

#### Methods
- `+ displayPanicButton(): void`
- `+ handlePanicPress(duration: int): void`
- `+ showAlarmVerification(alarm: Alarm): void`
- `+ confirmAlarm(alarmId: UUID): void`
- `+ dismissAlarm(alarmId: UUID): void`
- `+ displayActiveAlarms(): void`
- `+ callEmergencyService(serviceType: EmergencyServiceType): void`

---

### 6) UserAccountViewController

**책임:** 사용자 계정 관리 및 설정 UI

#### Attributes
- `- profileView: ProfileView`
- `- securitySettingsView: SecuritySettingsView`
- `- userPermissionsView: UserPermissionsView`
- `- currentUser: User`

#### Methods
- `+ loadUserProfile(): void`
- `+ updateProfile(profile: UserProfile): void`
- `+ changePassword(oldPw: String, newPw: String): void`
- `+ manageUserPermissions(userId: UUID): void`
- `+ logout(): void`

---

### 7) RecordingViewController

**책임:** 녹화 검색, 재생, 내보내기 UI

#### Attributes
- `- recordingGrid: RecordingGrid`
- `- searchFilters: SearchFilterPanel`
- `- videoPlayer: VideoPlayer`
- `- exportPanel: ExportPanel`

#### Methods
- `+ searchRecordings(filter: SearchFilter): void`
- `+ displayRecordings(recordings: List<Recording>): void`
- `+ playRecording(recordingId: UUID): void`
- `+ exportRecording(recordingId: UUID, format: ExportFormat): void`
- `+ shareRecording(recordingId: UUID): SecureLink`
- `+ deleteRecording(recordingId: UUID): void`

---

### 8) NotificationPanel (Component)

**책임:** 실시간 알림 표시 및 관리

#### Attributes
- `- notifications: Queue<Notification>`
- `- unreadCount: int`
- `- notificationSettings: NotificationSettings`

#### Methods
- `+ displayNotification(notification: Notification): void`
- `+ markAsRead(notificationId: UUID): void`
- `+ clearAll(): void`
- `+ updateNotificationSettings(settings: NotificationSettings): void`
- `+ filterNotifications(filter: NotificationFilter): void`


---

## BUSINESS LOGIC LAYER (Backend Classes)

### 9) SecurityModeManager

**책임:** 보안 모드 및 Zone 관리, Arming/Disarming 로직

#### Attributes
- `- currentMode: SecurityMode`
- `- armingState: SecurityArmingState`
- `- zones: Map<int, SafetyZone>`
- `- entryDelaySeconds: int`
- `- exitDelaySeconds: int`
- `- delayTimer: Timer`
- `- bypassedSensors: Set<String>`

#### Methods
- `+ setMode(mode: SecurityMode): void`
- `+ getMode(): SecurityMode`
- `+ armZone(zoneId: int): void`
- `+ disarmZone(zoneId: int): void`
- `+ armAllZones(): void`
- `+ disarmAllZones(): void`
- `+ findZonesBySensorId(sensorId: String): List<SafetyZone>`
- `+ isSensorActive(sensorId: String): bool`
- `+ startEntryCountdown(e: SensorEvent): void`
- `+ cancelEntryCountdown(): void`
- `+ bypassSensor(sensorId: String, duration: int): void`
- `+ clearBypass(sensorId: String): void`
- `- triggerAlarm(e: SensorEvent): void`
- `+ getZones(): Collection<SafetyZone>`
- `+ addZone(zone: SafetyZone): void`
- `+ removeZone(zoneId: int): void`
- `+ updateZone(zoneId: int, zone: SafetyZone): void`

---

### 10) SafetyZone

**책임:** Security Zone 정의 및 센서 멤버십 관리

#### Attributes
- `- id: int`
- `- name: String`
- `- sensorIds: Set<String>`
- `- armed: bool`
- `- entryExit: bool`
- `- createdAt: Timestamp`
- `- modifiedAt: Timestamp`

#### Methods
- `+ arm(): void`
- `+ disarm(): void`
- `+ isArmed(): bool`
- `+ getSensorIds(): Set<String>`
- `+ addSensor(sensorId: String): void`
- `+ removeSensor(sensorId: String): void`
- `+ containsSensor(sensorId: String): bool`
- `+ shouldTriggerDelay(): bool`
- `+ validateSensor(sensor: Sensor): bool`

---

### 11) AlarmManager

**책임:** 알람 트리거, 검증, 에스컬레이션 로직

#### Attributes
- `- activeAlarms: List<Alarm>`
- `- alarmConditions: Map<SecurityMode, AlarmPolicy>`
- `- verificationQueue: Queue<AlarmVerification>`
- `- emergencyDispatcher: EmergencyDispatcher`

#### Methods
- `+ triggerAlarm(event: SensorEvent): Alarm`
- `+ verifyAlarm(alarmId: UUID, confirmed: bool): void`
- `+ cancelAlarm(alarmId: UUID): void`
- `+ escalateAlarm(alarmId: UUID): void`
- `+ getActiveAlarms(): List<Alarm>`
- `+ configureAlarmPolicy(mode: SecurityMode, policy: AlarmPolicy): void`
- `+ getAlarmPolicy(mode: SecurityMode): AlarmPolicy`
- `+ dispatchEmergency(alarm: Alarm): void`
- `+ startVerificationTimer(alarmId: UUID, timeout: int): void`
- `+ activateSiren(alarmType: AlarmType): void`
---

### 12) RecordingManager

**책임:** 녹화 관리, 저장, 검색, 내보내기

#### Attributes
- `- recordings: Repository<Recording>`
- `- recordingSettings: Map<String, RecordingSetting>`
- `- storageProvider: StorageProvider`
- `- activeRecordings: Map<String, RecordingSession>`

#### Methods
- `+ startRecording(cameraId: String, trigger: RecordingTrigger): RecordingSession`
- `+ stopRecording(cameraId: String): void`
- `+ searchRecordings(filter: SearchFilter): List<Recording>`
- `+ getRecording(recordingId: UUID): Recording`
- `+ exportRecording(recordingId: UUID, format: ExportFormat): File`
- `+ shareRecording(recordingId: UUID, expirationHours: int): SecureLink`
- `+ deleteRecording(recordingId: UUID): void`
- `+ configureRecording(cameraId: String, setting: RecordingSetting): void`
- `+ getRecordingSetting(cameraId: String): RecordingSetting`
- `+ getStorageUsage(): StorageStats`

---

### 13) NotificationManager

**책임:** 알림 발송, 쿨다운 관리, 정책 적용

#### Attributes
- `- notificationQueue: Queue<Notification>`
- `- notificationPolicies: Map<String, NotificationPolicy>`
- `- cooldowns: Map<String, Cooldown>`
- `- pushService: PushNotificationService`
- `- smsGateway: SMSGateway`
- `- emailService: EmailService`

#### Methods
- `+ sendNotification(recipient: User, notification: Notification): void`
- `+ sendPushNotification(userId: UUID, message: String, data: Map): void`
- `+ sendSMS(phoneNumber: String, message: String): void`
- `+ sendEmail(email: String, subject: String, body: String): void`
- `+ checkCooldown(deviceId: String, eventType: EventType): bool`
- `+ updateCooldown(deviceId: String, eventType: EventType): void`
- `+ configureCooldown(deviceId: String, duration: int): void`
- `+ getNotificationPolicy(userId: UUID): NotificationPolicy`
- `+ updateNotificationPolicy(userId: UUID, policy: NotificationPolicy): void`

---

### 11) DeviceRegistry

**책임:** 장치 등록 및 발견

#### Attributes
- `- devices: Repository<Device>`
- `- discoveryService: DeviceDiscoveryService`
- `- registrationQueue: Queue<Device>`

#### Methods
- `+ discoverDevices(): List<Device>`
- `+ registerDevice(device: Device): void`
- `+ removeDevice(deviceId: UUID): void`
- `+ getDevice(deviceId: UUID): Device`
- `+ getAllDevices(): List<Device>`
- `+ getDevicesByType(type: DeviceType): List<Device>`
- `+ getDevicesByCategory(category: DeviceCategory): List<Device>`

---

### 12) DeviceHealthMonitor

**책임:** 장치 상태 모니터링 및 헬스 체크

#### Attributes
- `- healthReports: Map<UUID, DeviceHealthReport>`
- `- heartbeatInterval: int`
- `- offlineThreshold: int`

#### Methods
- `+ checkDeviceHealth(): List<DeviceHealthReport>`
- `+ getDeviceStatus(deviceId: UUID): DeviceStatus`
- `+ isDeviceOnline(deviceId: UUID): bool`
- `+ recordHeartbeat(deviceId: UUID): void`
- `+ detectOfflineDevices(): List<Device>`
- `+ sendHealthAlert(deviceId: UUID, issue: HealthIssue): void`

---

### 13) DeviceConfigService

**책임:** 장치 설정 관리

#### Attributes
- `- deviceSettings: Map<UUID, DeviceSettings>`
- `- configurationValidator: ConfigValidator`

#### Methods
- `+ updateDeviceSettings(deviceId: UUID, settings: DeviceSettings): void`
- `+ getDeviceSettings(deviceId: UUID): DeviceSettings`
- `+ activateDevice(deviceId: UUID): void`
- `+ deactivateDevice(deviceId: UUID): void`
- `+ resetDeviceToDefault(deviceId: UUID): void`
- `+ validateSettings(settings: DeviceSettings): bool`
- `+ applyBulkSettings(deviceIds: List<UUID>, settings: DeviceSettings): void`

---

### 6) StreamingService

**책임:** 카메라 스트리밍 및 세션 관리 (PTZ 제외)

#### Attributes
- `- activeSessions: Map<String, StreamSession>`
- `- streamingProtocol: StreamingProtocol`
- `- maxConcurrentStreams: int`

#### Methods
- `+ startLiveStream(cameraId: String, userId: UUID): StreamSession`
- `+ stopLiveStream(sessionId: UUID): void`
- `+ getActiveStreams(cameraId: String): List<StreamSession>`
- `+ getStreamUrl(sessionId: UUID): String`
- `+ enableTwoWayAudio(sessionId: UUID): AudioSession`
- `+ disableTwoWayAudio(sessionId: UUID): void`
- `+ getStreamQuality(sessionId: UUID): StreamQuality`
- `+ adjustStreamQuality(sessionId: UUID, quality: StreamQuality): void`

---

### 7) PTZControlService

**책임:** PTZ 제어 및 Lock 관리

#### Attributes
- `- ptzLocks: Map<String, PTZLock>`
- `- lockDuration: int`
- `- defaultTimeout: int`

#### Methods
- `+ controlPTZ(cameraId: String, command: PTZCommand, userId: UUID): void`
- `+ pan(cameraId: String, degrees: int, userId: UUID): void`
- `+ tilt(cameraId: String, degrees: int, userId: UUID): void`
- `+ zoom(cameraId: String, level: int, userId: UUID): void`
- `+ acquirePTZLock(cameraId: String, userId: UUID): bool`
- `+ releasePTZLock(cameraId: String, userId: UUID): void`
- `+ isPTZLocked(cameraId: String): bool`
- `+ getLockOwner(cameraId: String): UUID`


---

### 8) SignUpService

**책임:** 사용자 회원가입 및 검증

#### Attributes
- `- users: Repository<User>`
- `- emailService: EmailService`
- `- smsService: SMSService`
- `- passwordPolicy: PasswordPolicy`

#### Methods
- `+ signUp(email: String, password: String, phone: String): User`
- `+ validateEmail(email: String): bool`
- `+ validatePassword(password: String): bool`
- `+ validatePhone(phone: String): bool`
- `+ sendVerificationEmail(userId: UUID): void`
- `+ verifyEmail(token: String): bool`
- `+ sendVerificationSMS(userId: UUID): void`
- `+ verifyPhone(otp: String): bool`


---

### 9) LoginService

**책임:** 로그인 및 로그아웃 처리

#### Attributes
- `- users: Repository<User>`
- `- maxFailedAttempts: int`
- `- lockoutDuration: int`
- `- failedAttempts: Map<String, int>`

#### Methods
- `+ login(email: String, password: String): Session`
- `+ logout(sessionId: UUID): void`
- `+ validateCredentials(email: String, password: String): bool`
- `+ recordFailedAttempt(email: String): void`
- `+ isAccountLocked(email: String): bool`
- `+ unlockAccount(email: String): void`
- `+ resetPassword(email: String): void`
- `+ changePassword(userId: UUID, oldPw: String, newPw: String): void`


---

### 10) SessionManager

**책임:** 세션 생성 및 관리

#### Attributes
- `- sessions: SessionStore`
- `- sessionTimeout: int`
- `- maxSessionsPerUser: int`

#### Methods
- `+ createSession(userId: UUID, deviceInfo: DeviceInfo): Session`
- `+ validateSession(sessionId: UUID): bool`
- `+ refreshSession(sessionId: UUID): void`
- `+ revokeSession(sessionId: UUID): void`
- `+ revokeAllSessions(userId: UUID): void`
- `+ getActiveSessions(userId: UUID): List<Session>`
- `+ cleanupExpiredSessions(): void`

---

### 17) UserPermissionManager

**책임:** 사용자 권한 관리, 역할 기반 접근 제어

#### Attributes
- `- permissions: Repository<UserPermission>`
- `- roleTemplates: Map<UserRole, Set<Permission>>`

#### Methods
- `+ assignRole(userId: UUID, role: UserRole): void`
- `+ grantPermission(userId: UUID, permission: Permission): void`
- `+ revokePermission(userId: UUID, permission: Permission): void`
- `+ hasPermission(userId: UUID, permission: Permission): bool`
- `+ getPermissions(userId: UUID): Set<Permission>`
- `+ applyRoleTemplate(userId: UUID, role: UserRole): void`
- `+ validatePermission(userId: UUID, action: Action, resource: Resource): bool`

**관련 Use Cases:**
- UC 3.3.1 (User Role and Access Control)

---

### 18) ActivityLogger

**책임:** 시스템 이벤트 로깅, 타임라인 생성, 감사 추적

#### Attributes
- `- eventStore: EventStore`
- `- auditLog: AuditLog`

#### Methods
- `+ logEvent(event: Event): void`
- `+ logUserAction(userId: UUID, action: Action): void`
- `+ logSystemEvent(eventType: EventType, data: Map): void`
- `+ getTimeline(filter: TimelineFilter): List<Event>`
- `+ searchEvents(query: SearchQuery): List<Event>`
- `+ exportLog(filter: LogFilter, format: ExportFormat): File`
- `+ getAuditTrail(resourceId: UUID): List<AuditEntry>`

**관련 Use Cases:**
- UC 3.2.2 (Activity Logs and Timeline)

---

## DATA LAYER (Domain Models)

### 19) User

**책임:** 사용자 엔티티 및 프로필 정보

#### Attributes
- `- userId: UUID`
- `- email: String`
- `- phoneNumber: String`
- `- name: String`
- `- passwordHash: String`
- `- role: UserRole`
- `- permissions: Set<Permission>`
- `- activeSessions: List<Session>`
- `- createdAt: Timestamp`
- `- lastLoginAt: Timestamp`

#### Methods
- `+ authenticate(password: String): bool`
- `+ hasPermission(permission: Permission): bool`
- `+ updateProfile(profile: UserProfile): void`
- `+ changePassword(newPasswordHash: String): void`
- `+ generateBackupCodes(): List<String>`

---

### 20) Device (Abstract)

**책임:** 장치 기본 엔티티 및 공통 동작

#### Attributes
- `- deviceId: UUID`
- `- name: String`
- `- deviceType: DeviceType`
- `- deviceCategory: DeviceCategory`
- `- status: DeviceStatus`
- `- location: String`
- `- batteryLevel: int | null`
- `- signalStrength: int`
- `- lastHeartbeat: Timestamp`
- `- firmware: String`
- `- isEnabled: bool`

#### Methods
- `+ getStatus(): DeviceStatus`
- `+ updateStatus(status: DeviceStatus): void`
- `+ isOnline(): bool`
- `+ getBatteryLevel(): int`
- `+ getSignalStrength(): int`
- `+ isSecurityDevice(): bool`
- `+ isLifeSafetyDevice(): bool`
- `+ activate(): void`
- `+ deactivate(): void`
- `+ sendHeartbeat(): void`

**Subclasses:**
- Sensor (abstract)
  - DoorWindowSensor
  - MotionSensor
  - EnvironmentalSensor
  - SoundSensor
- Camera
  - IndoorCamera
  - OutdoorCamera
- SmartDevice
  - SmartLight
  - SmartLock
  - SmartThermostat
  - VentilationSystem

---

### 21) Sensor (extends Device)

**책임:** 센서 공통 기능 및 이벤트 감지

#### Attributes
- `- sensitivity: int`
- `- cooldownPeriod: int`
- `- bypassedUntil: Timestamp | null`
- `- lastTriggerTime: Timestamp`

#### Methods
- `+ trigger(): SensorEvent`
- `+ setSensitivity(level: int): void`
- `+ getCooldownPeriod(): int`
- `+ setCooldownPeriod(seconds: int): void`
- `+ bypass(duration: int): void`
- `+ clearBypass(): void`
- `+ isBypassed(): bool`
- `+ canTrigger(): bool`

---

### 22) Camera (extends Device)

**책임:** 카메라 기능 및 스트리밍 제어

#### Attributes
- `- resolution: Resolution`
- `- frameRate: int`
- `- nightVision: bool`
- `- ptzControl: PTZControl | null`
- `- audioCapability: AudioCapability`
- `- passwordProtected: bool`
- `- passwordHash: String | null`
- `- recordingEnabled: bool`
- `- motionDetectionEnabled: bool`

#### Methods
- `+ startLiveView(): StreamSession`
- `+ stopLiveView(): void`
- `+ captureSnapshot(): Image`
- `+ hasPTZ(): bool`
- `+ controlPTZ(command: PTZCommand): void`
- `+ enableTwoWayAudio(): AudioSession`
- `+ disableTwoWayAudio(): void`
- `+ setPassword(password: String): void`
- `+ removePassword(): void`
- `+ verifyPassword(input: String): bool`
- `+ enableRecording(): void`
- `+ disableRecording(): void`

---

### 23) PTZControl

**책임:** Pan-Tilt-Zoom 제어 및 제약 관리

#### Attributes
- `- panMin: int`
- `- panMax: int`
- `- tiltMin: int`
- `- tiltMax: int`
- `- zoomMin: int`
- `- zoomMax: int`
- `- currentPan: int`
- `- currentTilt: int`
- `- currentZoom: int`
- `- lockOwnerUserId: UUID | null`
- `- lockExpiration: Timestamp | null`

#### Methods
- `+ pan(degrees: int, userId: UUID): void`
- `+ tilt(degrees: int, userId: UUID): void`
- `+ zoom(level: int, userId: UUID): void`
- `+ acquireLock(userId: UUID, duration: int): bool`
- `+ releaseLock(userId: UUID): void`
- `+ isLocked(): bool`
- `+ validateCommand(cmd: PTZCommand): bool`
- `+ getCurrentPosition(): PTZPosition`

---

### 24) Recording

**책임:** 녹화 메타데이터 및 파일 정보

#### Attributes
- `- recordingId: UUID`
- `- cameraId: String`
- `- startTime: Timestamp`
- `- endTime: Timestamp`
- `- duration: int`
- `- fileSize: long`
- `- fileUrl: String`
- `- thumbnailUrl: String`
- `- eventType: EventType | null`
- `- metadata: Map<String, Any>`

#### Methods
- `+ getStreamUrl(): String`
- `+ getDownloadUrl(): String`
- `+ generateShareLink(expirationHours: int): SecureLink`
- `+ getMetadata(): Map<String, Any>`

---

### 25) Alarm

**책임:** 알람 상태 및 이력 관리

#### Attributes
- `- alarmId: UUID`
- `- alarmType: AlarmType`
- `- triggerEvent: SensorEvent`
- `- status: AlarmStatus`
- `- verificationStatus: VerificationStatus`
- `- createdAt: Timestamp`
- `- verifiedAt: Timestamp | null`
- `- resolvedAt: Timestamp | null`
- `- resolvedBy: UUID | null`

#### Methods
- `+ verify(confirmed: bool, userId: UUID): void`
- `+ escalate(): void`
- `+ cancel(userId: UUID): void`
- `+ resolve(): void`
- `+ getStatus(): AlarmStatus`

---

### 26) SensorEvent

**책임:** 센서 이벤트 데이터

#### Attributes
- `- eventId: UUID`
- `- sensorId: String`
- `- eventType: EventType`
- `- timestamp: Timestamp`
- `- value: Any`
- `- metadata: Map<String, Any>`

#### Methods
- `+ getSensorId(): String`
- `+ getEventType(): EventType`
- `+ getTimestamp(): Timestamp`

---

### 27) Session

**책임:** 사용자 세션 정보

#### Attributes
- `- sessionId: UUID`
- `- userId: UUID`
- `- deviceInfo: DeviceInfo`
- `- ipAddress: String`
- `- userAgent: String`
- `- createdAt: Timestamp`
- `- expiresAt: Timestamp`
- `- lastActivityAt: Timestamp`

#### Methods
- `+ isValid(): bool`
- `+ isExpired(): bool`
- `+ refresh(): void`
- `+ revoke(): void`

---

### 28) Notification

**책임:** 알림 메시지 정보

#### Attributes
- `- notificationId: UUID`
- `- userId: UUID`
- `- type: NotificationType`
- `- title: String`
- `- message: String`
- `- data: Map<String, Any>`
- `- createdAt: Timestamp`
- `- readAt: Timestamp | null`
- `- priority: Priority`

#### Methods
- `+ markAsRead(): void`
- `+ isRead(): bool`

---

## ENUMERATIONS & VALUE OBJECTS

### SecurityMode (Enum)
```
HOME, AWAY, SLEEP, OVERNIGHT_TRAVEL, EXTENDED_TRAVEL, DISARMED
```

### SecurityArmingState (Enum)
```
DISARMED, ARMING, ARMED, ENTRY_DELAY, ALARMING
```

### DeviceStatus (Enum)
```
ONLINE, OFFLINE, LOW_BATTERY, FAULT, MAINTENANCE
```

### DeviceCategory (Enum)
```
SECURITY, LIFE_SAFETY, ENVIRONMENT, AUTOMATION, MONITORING
```

### AlarmType (Enum)
```
INTRUSION, FIRE, CO, GAS_LEAK, WATER_LEAK, PANIC, ENVIRONMENTAL
```

### AlarmStatus (Enum)
```
PENDING, VERIFIED, ESCALATED, CANCELLED, RESOLVED
```

### UserRole (Enum)
```
ADMIN, STANDARD, GUEST
```

### EventType (Enum)
```
DOOR_OPEN, WINDOW_OPEN, MOTION_DETECTED, FIRE_DETECTED, 
CO_DETECTED, GLASS_BREAK, DOG_BARK, OUTDOOR_MOTION
```