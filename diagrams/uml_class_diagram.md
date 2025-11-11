# SafeHome UML Class Diagram

> 프론트엔드 클래스 구조를 시각화한 UML 다이어그램

## 📑 목차

- [1. 전체 시스템 아키텍처](#1-전체-시스템-아키텍처)
- [2. Service Layer (서비스 계층)](#2-service-layer-서비스-계층)
  - [2.1 Core Services](#21-core-services)
  - [2.2 Domain Services](#22-domain-services)
- [3. State Management Layer](#3-state-management-layer)
- [4. UI Component Layer](#4-ui-component-layer)
  - [4.1 Page Components](#41-page-components)
  - [4.2 Layout Components](#42-layout-components)
- [5. Utility Layer](#5-utility-layer)
- [6. Types & Interfaces](#6-types--interfaces)
- [7. 클래스 간 관계도](#7-클래스-간-관계도)

---

## 1. 전체 시스템 아키텍처

```mermaid
classDiagram
    class App {
        -currentPage: string
        -isDark: boolean
        +renderPage() JSX.Element
        +handleNavigate(page: string) void
    }
    
    class ThemeProvider {
        -isDark: boolean
        +toggleTheme() void
    }
    
    class ApiService {
        -baseURL: string
        -authToken: string
        +get() Promise~ApiResponse~
        +post() Promise~ApiResponse~
        +put() Promise~ApiResponse~
        +delete() Promise~ApiResponse~
    }
    
    class DeviceService {
        -apiService: ApiService
        -cache: Map
        +fetchDevices() Promise~Device[]~
        +toggleDevice() Promise~Device~
    }
    
    class SensorService {
        -apiService: ApiService
        -wsConnection: WebSocket
        +fetchSensors() Promise~Sensor[]~
        +connectWebSocket() void
    }
    
    class CameraService {
        -apiService: ApiService
        -streamConnections: Map
        +fetchCameras() Promise~Camera[]~
        +startStream() Promise~MediaStream~
    }
    
    class AuthenticationService {
        -apiService: ApiService
        -token: string
        +login() Promise~AuthResponse~
        +logout() Promise~void~
    }
    
    class Dashboard {
        -homeMode: string
        -devicesState: Object
        +toggleDevice() void
        +render() JSX.Element
    }
    
    class Device {
        -selectedRoom: string
        -selectedDevice: Device
        +toggleDeviceActive() void
        +render() JSX.Element
    }
    
    class Cameras {
        -selectedCamera: number
        -isRecording: Object
        +toggleRecording() void
        +render() JSX.Element
    }

    App --> ThemeProvider : uses
    App --> Dashboard : renders
    App --> Device : renders
    App --> Cameras : renders
    
    Dashboard --> DeviceService : uses
    Device --> DeviceService : uses
    Device --> CameraService : uses
    Cameras --> CameraService : uses
    
    DeviceService --> ApiService : depends on
    SensorService --> ApiService : depends on
    CameraService --> ApiService : depends on
    AuthenticationService --> ApiService : depends on
    
    note for ApiService "🔴 미구현\n향후 구현 필요"
    note for DeviceService "🔴 미구현\n향후 구현 필요"
    note for App "🟢 현재 구현됨"
    note for Dashboard "🟢 현재 구현됨"
```

---

## 2. Service Layer (서비스 계층)

### 2.1 Core Services

```mermaid
classDiagram
    class ApiService {
        -baseURL: string
        -headers: Record~string, string~
        -timeout: number
        -authToken: string | null
        +constructor(baseURL: string, timeout?: number)
        +get~T~(endpoint: string, params?: Object) Promise~ApiResponse~T~~
        +post~T~(endpoint: string, data: Object) Promise~ApiResponse~T~~
        +put~T~(endpoint: string, data: Object) Promise~ApiResponse~T~~
        +delete~T~(endpoint: string) Promise~ApiResponse~T~~
        -request~T~(method: string, endpoint: string, data?: Object) Promise~ApiResponse~T~~
        -handleError(error: Error) ApiResponse~null~
        -setAuthToken(token: string) void
        -removeAuthToken() void
    }
    
    class EncryptionService {
        -algorithm: string
        -key: CryptoKey | null
        -iv: Uint8Array
        +constructor()
        +generateKey() Promise~CryptoKey~
        +encrypt(data: string) Promise~string~
        +decrypt(encryptedData: string) Promise~string~
        +hashPassword(password: string) Promise~string~
        +verifyPassword(password: string, hash: string) Promise~boolean~
        -arrayBufferToBase64(buffer: ArrayBuffer) string
        -base64ToArrayBuffer(base64: string) ArrayBuffer
    }
    
    class AuthenticationService {
        -apiService: ApiService
        -token: string | null
        -refreshToken: string | null
        -user: User | null
        +isAuthenticated: boolean
        +constructor(apiService: ApiService)
        +login(email: string, password: string) Promise~AuthResponse~
        +logout() Promise~void~
        +refreshAccessToken() Promise~string~
        +getCurrentUser() Promise~User~
        +validateToken(token: string) boolean
        -saveTokens(token: string, refreshToken: string) void
        -clearTokens() void
        -getStoredToken() string | null
    }
    
    class StorageService {
        +setItem~T~(key: string, value: T)$ void
        +getItem~T~(key: string)$ T | null
        +removeItem(key: string)$ void
        +clear()$ void
        +hasItem(key: string)$ boolean
        -serialize~T~(value: T)$ string
        -deserialize~T~(value: string)$ T | null
    }
    
    class WebSocketManager {
        -ws: WebSocket | null
        -url: string
        -reconnectAttempts: number
        -maxReconnectAttempts: number
        -reconnectInterval: number
        -listeners: Map~string, Function[]~
        +isConnected: boolean
        +constructor(url: string, maxReconnectAttempts?: number)
        +connect() Promise~void~
        +disconnect() void
        +send(event: string, data: any) void
        +on(event: string, callback: Function) void
        +off(event: string, callback: Function) void
        -handleOpen(event: Event) void
        -handleMessage(event: MessageEvent) void
        -handleError(event: Event) void
        -handleClose(event: CloseEvent) void
        -reconnect() void
        -emit(event: string, data: any) void
    }

    AuthenticationService --> ApiService : depends on
    AuthenticationService --> StorageService : uses
    
    note for ApiService "🔴 미구현\nRESTful API 통신"
    note for EncryptionService "🔴 미구현\n데이터 암호화"
    note for AuthenticationService "🔴 미구현\n사용자 인증"
    note for WebSocketManager "🔴 미구현\n실시간 통신"
```

### 2.2 Domain Services

```mermaid
classDiagram
    class DeviceService {
        -apiService: ApiService
        -cache: Map~number, Device~
        -cacheExpiry: number
        +devices: Device[]
        +isLoading: boolean
        +constructor(apiService: ApiService)
        +fetchDevices() Promise~Device[]~
        +getDeviceById(deviceId: number) Promise~Device~
        +updateDevice(deviceId: number, updates: Partial~Device~) Promise~Device~
        +toggleDevice(deviceId: number) Promise~Device~
        +deleteDevice(deviceId: number) Promise~void~
        -cacheDevice(device: Device) void
        -getCachedDevice(deviceId: number) Device | undefined
        -invalidateCache() void
    }
    
    class SensorService {
        -apiService: ApiService
        -wsConnection: WebSocket | null
        +sensors: Sensor[]
        +isConnected: boolean
        +constructor(apiService: ApiService)
        +fetchSensors() Promise~Sensor[]~
        +getSensorById(sensorId: number) Promise~Sensor~
        +getSensorsByRoom(room: string) Promise~Sensor[]~
        +connectWebSocket(onMessage: Function) void
        +disconnectWebSocket() void
        -handleWebSocketMessage(event: MessageEvent) void
        -handleWebSocketError(error: Event) void
        -reconnectWebSocket() void
    }
    
    class CameraService {
        -apiService: ApiService
        -streamConnections: Map~number, MediaStream~
        +cameras: Camera[]
        +constructor(apiService: ApiService)
        +fetchCameras() Promise~Camera[]~
        +getCameraById(cameraId: number) Promise~Camera~
        +startStream(cameraId: number) Promise~MediaStream~
        +stopStream(cameraId: number) Promise~void~
        +captureSnapshot(cameraId: number) Promise~Blob~
        +toggleRecording(cameraId: number) Promise~boolean~
        -getStreamUrl(cameraId: number) string
        -cleanupStream(cameraId: number) void
    }
    
    class NotificationService {
        -apiService: ApiService
        -permission: NotificationPermission
        +notifications: Notification[]
        +unreadCount: number
        +constructor(apiService: ApiService)
        +fetchNotifications() Promise~Notification[]~
        +markAsRead(notificationId: number) Promise~void~
        +markAllAsRead() Promise~void~
        +deleteNotification(notificationId: number) Promise~void~
        +requestPermission() Promise~NotificationPermission~
        +showNotification(title: string, body: string, icon?: string) void
        -updateUnreadCount() void
    }
    
    class ApiService {
        <<interface>>
    }

    DeviceService --> ApiService : depends on
    SensorService --> ApiService : depends on
    CameraService --> ApiService : depends on
    NotificationService --> ApiService : depends on
    
    note for DeviceService "🔴 미구현\nIoT 디바이스 관리"
    note for SensorService "🔴 미구현\n센서 실시간 모니터링"
    note for CameraService "🔴 미구현\n카메라 스트리밍"
    note for NotificationService "🔴 미구현\n알림 관리"
```

---

## 3. State Management Layer

```mermaid
classDiagram
    class ThemeProvider {
        +children: ReactNode
        -isDark: boolean
        -setIsDark: Dispatch~SetStateAction~boolean~~
        +toggleTheme() void
        +render() JSX.Element
    }
    
    class ThemeContext {
        +isDark: boolean
        +toggleTheme: Function
    }
    
    class useTheme {
        <<hook>>
        +returns ThemeContextValue
    }
    
    ThemeProvider --> ThemeContext : provides
    useTheme --> ThemeContext : consumes
    
    note for ThemeProvider "🟢 현재 구현됨\nsrc/contexts/ThemeContext.jsx"
    note for useTheme "🟢 현재 구현됨\nCustom Hook"
```

---

## 4. UI Component Layer

### 4.1 Page Components

```mermaid
classDiagram
    class App {
        -currentPage: string
        -setCurrentPage: Dispatch~string~
        -isDark: boolean
        +renderPage() JSX.Element
        +handleNavigate(page: string) void
        +render() JSX.Element
    }
    
    class Dashboard {
        +onNavigate?: Function
        -homeMode: string
        -devicesState: Object
        -modes: Mode[]
        -quickActions: QuickAction[]
        -rooms: Room[]
        -stats: Stat[]
        -recentLogs: ActivityLog[]
        +toggleDevice(device: string) void
        +getLogIcon(type: string) JSX.Element | null
        +render() JSX.Element
    }
    
    class Emergency {
        -isEmergencyActive: boolean
        -emergencyContacts: EmergencyContact[]
        -emergencyActions: EmergencyAction[]
        -recentAlerts: Alert[]
        +getContactIcon(type: string) JSX.Element | null
        +getActionIcon(action: string) JSX.Element | null
        +handleEmergencyToggle() void
        +render() JSX.Element
    }
    
    class Device {
        -selectedRoom: string | null
        -selectedDevice: Device | null
        -selectedCamera: Camera | null
        -rooms: RoomLayout[]
        -devicesByRoom: Record~string, Device[]~
        -camerasByRoom: Record~string, Camera[]~
        +getStatusColor(room: RoomLayout) string
        +toggleDeviceActive() void
        +toggleCameraActive() void
        +render() JSX.Element
    }
    
    class Preference {
        -isDark: boolean
        -toggleTheme: Function
        -settings: PreferenceState
        -settingGroups: SettingGroup[]
        -menuItems: MenuItem[]
        +toggleSetting(key: string) void
        +render() JSX.Element
    }
    
    class Cameras {
        -selectedCamera: number | null
        -isRecording: Record~number, boolean~
        -cameras: Camera[]
        +toggleRecording(id: number) void
        +render() JSX.Element
    }
    
    class FloorPlan {
        -selectedRoom: string | null
        -rooms: FloorPlanRoom[]
        -sensors: FloorPlanSensor[]
        +getStatusColor(status: string) string
        +getSensorIcon(type: string) JSX.Element
        +render() JSX.Element
    }
    
    class Notifications {
        -filter: string
        -notifications: Notification[]
        +getIcon(type: string) JSX.Element | null
        +filteredNotifications() Notification[]
        +unreadCount() number
        +render() JSX.Element
    }
    
    class Sensors {
        -selectedType: string
        -sensors: Sensor[]
        -sensorTypes: SensorType[]
        +getSensorStatus(sensor: Sensor) string
        +getStatusColor(status: string) string
        +filteredSensors() Sensor[]
        +stats() SensorStats
        +render() JSX.Element
    }
    
    class Recordings {
        -selectedVideo: Recording | null
        -isPlaying: boolean
        -recordings: Recording[]
        +handleShare() void
        +handleDownload() void
        +render() JSX.Element
    }

    App --> Dashboard : renders
    App --> Emergency : renders
    App --> Device : renders
    App --> Preference : renders
    App --> Cameras : renders
    App --> FloorPlan : renders
    App --> Notifications : renders
    App --> Sensors : renders
    App --> Recordings : renders
    
    note for App "🟢 현재 구현됨"
    note for Dashboard "🟢 현재 구현됨"
    note for Emergency "🟢 현재 구현됨"
    note for Device "🟢 현재 구현됨"
    note for Preference "🟢 현재 구현됨"
    note for Cameras "🟢 현재 구현됨"
```

### 4.2 Layout Components

```mermaid
classDiagram
    class BottomNav {
        +currentPage: string
        +onNavigate: Function
        -navItems: NavItem[]
        +getIcon(id: string) JSX.Element
        +render() JSX.Element
    }
    
    class App {
        <<parent>>
    }
    
    App --> BottomNav : uses
    
    note for BottomNav "🟢 현재 구현됨\nsrc/components/BottomNav.jsx"
```

---

## 5. Utility Layer

```mermaid
classDiagram
    class DateFormatter {
        <<utility>>
        +formatDate(date: Date, format: string)$ string
        +formatTime(date: Date)$ string
        +formatDateTime(date: Date)$ string
        +toISO(date: Date)$ string
        +parseISO(dateString: string)$ Date
        +getRelativeTime(date: Date)$ string
        +isToday(date: Date)$ boolean
        +isYesterday(date: Date)$ boolean
    }
    
    class Validator {
        <<utility>>
        +isValidEmail(email: string)$ boolean
        +isValidPassword(password: string)$ boolean
        +isValidPhoneNumber(phone: string)$ boolean
        +isValidUrl(url: string)$ boolean
        +isEmpty(value: string)$ boolean
        +isNumeric(value: string)$ boolean
    }
    
    class ColorUtils {
        <<utility>>
        +hexToRgb(hex: string)$ Object
        +rgbToHex(r: number, g: number, b: number)$ string
        +lighten(color: string, amount: number)$ string
        +darken(color: string, amount: number)$ string
        +getContrastColor(bgColor: string)$ string
    }
    
    class FunctionUtils {
        <<utility>>
        +debounce(func: Function, delay: number)$ Function
        +throttle(func: Function, limit: number)$ Function
        +once(func: Function)$ Function
    }
    
    class useLocalStorage {
        <<hook>>
        +useLocalStorage(key: string, initialValue: any) Array
    }
    
    class useApi {
        <<hook>>
        +useApi(apiFunc: Function, options?: Object) Object
    }
    
    class useWebSocket {
        <<hook>>
        +useWebSocket(url: string, options?: Object) Object
    }
    
    class useMediaQuery {
        <<hook>>
        +useMediaQuery(query: string) boolean
    }
    
    class useDebounce {
        <<hook>>
        +useDebounce(value: any, delay: number) any
    }
    
    note for DateFormatter "🔴 미구현\n날짜 포맷팅"
    note for Validator "🔴 미구현\n유효성 검사"
    note for ColorUtils "🔴 미구현\n색상 유틸리티"
    note for FunctionUtils "🔴 미구현\n함수 유틸리티"
    note for useLocalStorage "🔴 미구현\n로컬스토리지 훅"
    note for useApi "🔴 미구현\nAPI 호출 훅"
    note for useWebSocket "🔴 미구현\nWebSocket 훅"
```

---

## 6. Types & Interfaces

```mermaid
classDiagram
    class ApiResponse~T~ {
        <<interface>>
        +data: T | null
        +error: string | null
        +status: number
    }
    
    class User {
        <<interface>>
        +id: string
        +name: string
        +email: string
        +role: string
    }
    
    class AuthResponse {
        <<interface>>
        +user: User
        +token: string
        +refreshToken: string
    }
    
    class Device {
        <<interface>>
        +id: number
        +name: string
        +type: string
        +status: string
        +active: boolean
        +settings: Record~string, any~
    }
    
    class Sensor {
        <<interface>>
        +id: number
        +name: string
        +type: string
        +room: string
        +status: string
        +battery: number
        +lastUpdate: string
    }
    
    class Camera {
        <<interface>>
        +id: number
        +name: string
        +location: string
        +status: string
        +quality: string
        +active: boolean
        +settings: CameraSettings
    }
    
    class CameraSettings {
        <<interface>>
        +motion: boolean
        +night: boolean
        +recording: boolean
    }
    
    class Notification {
        <<interface>>
        +id: number
        +type: string
        +title: string
        +message: string
        +time: string
        +read: boolean
    }
    
    class Recording {
        <<interface>>
        +id: number
        +title: string
        +camera: string
        +date: string
        +time: string
        +duration: string
        +thumbnail: string
    }
    
    class DeviceType {
        <<enumeration>>
        LOCK
        MOTION
        LIGHT
        TEMPERATURE
        CLIMATE
        ENTERTAINMENT
        GAS
        SMOKE
        WINDOW
        DOOR
        HUMIDITY
        WATER
    }
    
    class NotificationType {
        <<enumeration>>
        ALERT
        WARNING
        INFO
        SUCCESS
    }
    
    class HomeMode {
        <<enumeration>>
        AWAY
        HOME
        SLEEP
    }
    
    class CameraQuality {
        <<enumeration>>
        HD_1080P
        HD_720P
        SD_480P
    }

    Camera --> CameraSettings : contains
    AuthResponse --> User : contains
    
    note for ApiResponse "제네릭 타입"
    note for DeviceType "디바이스 타입 열거형"
    note for NotificationType "알림 타입 열거형"
```

---

## 7. 클래스 간 관계도

### 7.1 의존성 관계 (Dependency)

```mermaid
graph TB
    subgraph "UI Layer"
        Dashboard[Dashboard Component]
        Device[Device Component]
        Cameras[Cameras Component]
        Sensors[Sensors Component]
        Emergency[Emergency Component]
        Notifications[Notifications Component]
    end
    
    subgraph "Service Layer"
        DeviceService[DeviceService]
        SensorService[SensorService]
        CameraService[CameraService]
        NotificationService[NotificationService]
        AuthService[AuthenticationService]
    end
    
    subgraph "Core Layer"
        ApiService[ApiService]
        WebSocketManager[WebSocketManager]
        EncryptionService[EncryptionService]
        StorageService[StorageService]
    end
    
    Dashboard --> DeviceService
    Dashboard --> SensorService
    Device --> DeviceService
    Device --> CameraService
    Cameras --> CameraService
    Sensors --> SensorService
    Emergency --> NotificationService
    Notifications --> NotificationService
    
    DeviceService --> ApiService
    SensorService --> ApiService
    SensorService --> WebSocketManager
    CameraService --> ApiService
    NotificationService --> ApiService
    AuthService --> ApiService
    AuthService --> StorageService
    AuthService --> EncryptionService
    
    style Dashboard fill:#4CAF50
    style Device fill:#4CAF50
    style Cameras fill:#4CAF50
    style Sensors fill:#4CAF50
    
    style DeviceService fill:#FF9800
    style SensorService fill:#FF9800
    style CameraService fill:#FF9800
    
    style ApiService fill:#F44336
    style WebSocketManager fill:#F44336
```

### 7.2 컴포넌트 계층 구조

```mermaid
graph TD
    App[App Root]
    ThemeProvider[ThemeProvider Context]
    
    App --> ThemeProvider
    
    ThemeProvider --> Dashboard[Dashboard Page]
    ThemeProvider --> Emergency[Emergency Page]
    ThemeProvider --> Device[Device Page]
    ThemeProvider --> Preference[Preference Page]
    ThemeProvider --> Cameras[Cameras Page]
    ThemeProvider --> FloorPlan[FloorPlan Page]
    ThemeProvider --> Notifications[Notifications Page]
    ThemeProvider --> Sensors[Sensors Page]
    ThemeProvider --> Recordings[Recordings Page]
    
    App --> BottomNav[BottomNav Component]
    
    Dashboard --> QuickActionCard[Quick Action Cards]
    Dashboard --> StatCard[Stat Cards]
    Dashboard --> LogItem[Log Items]
    
    Device --> RoomView[Room View]
    Device --> DeviceList[Device List]
    Device --> CameraList[Camera List]
    
    Cameras --> CameraGrid[Camera Grid]
    Cameras --> CameraFullscreen[Camera Fullscreen]
    
    style App fill:#4CAF50
    style ThemeProvider fill:#4CAF50
    style Dashboard fill:#4CAF50
    style BottomNav fill:#4CAF50
```

### 7.3 데이터 흐름

```mermaid
sequenceDiagram
    participant UI as UI Component
    participant Hook as useApi Hook
    participant Service as Domain Service
    participant API as ApiService
    participant WS as WebSocket Manager
    participant Backend as Backend Server
    
    Note over UI,Backend: 현재 구현 (하드코딩)
    UI->>UI: Use Hardcoded Data
    UI->>UI: Render
    
    Note over UI,Backend: 향후 구현 (실제 제품)
    UI->>Hook: Call API via Hook
    Hook->>Service: Request Data
    Service->>API: HTTP Request
    API->>Backend: REST API Call
    Backend-->>API: Response
    API-->>Service: Parsed Data
    Service-->>Hook: Domain Object
    Hook-->>UI: State Update
    UI->>UI: Re-render
    
    Note over UI,Backend: 실시간 데이터 (WebSocket)
    Backend->>WS: Push Event
    WS->>Service: Event Handler
    Service->>Hook: Update State
    Hook->>UI: State Update
    UI->>UI: Re-render
```

---

## 구현 상태 범례

- 🟢 **현재 구현됨**: 프로토타입에서 작동 중
- 🔴 **미구현**: 향후 구현 필요
- 🟡 **부분 구현**: 기본 구조만 존재

---

## 추가 다이어그램

### 인증 흐름

```mermaid
sequenceDiagram
    participant User
    participant UI as Login Component
    participant Auth as AuthenticationService
    participant API as ApiService
    participant Storage as StorageService
    participant Encrypt as EncryptionService
    participant Backend
    
    User->>UI: Enter Credentials
    UI->>Auth: login(email, password)
    Auth->>Encrypt: hashPassword(password)
    Encrypt-->>Auth: hashedPassword
    Auth->>API: post('/auth/login', data)
    API->>Backend: POST Request
    Backend-->>API: {user, token, refreshToken}
    API-->>Auth: AuthResponse
    Auth->>Storage: saveTokens(token, refreshToken)
    Auth->>Storage: setItem('user', user)
    Auth-->>UI: Success
    UI->>User: Navigate to Dashboard
```

### 센서 실시간 모니터링 흐름

```mermaid
sequenceDiagram
    participant Sensor as Sensor Component
    participant Service as SensorService
    participant WS as WebSocketManager
    participant Backend
    
    Sensor->>Service: connectWebSocket()
    Service->>WS: connect()
    WS->>Backend: WebSocket Handshake
    Backend-->>WS: Connected
    WS-->>Service: onOpen
    Service-->>Sensor: isConnected = true
    
    loop Real-time Updates
        Backend->>WS: sensor:update event
        WS->>Service: handleWebSocketMessage()
        Service->>Service: Update sensors[]
        Service->>Sensor: State Update
        Sensor->>Sensor: Re-render
    end
    
    alt Connection Lost
        WS->>Service: handleWebSocketError()
        Service->>WS: reconnect()
        WS->>Backend: Reconnect
    end
```

---

## 파일 구조 매핑

```
src/
├── contexts/
│   └── ThemeContext.jsx          # 🟢 ThemeProvider
│
├── components/
│   └── BottomNav.jsx              # 🟢 BottomNav
│
├── pages/
│   ├── Dashboard.jsx              # 🟢 Dashboard
│   ├── Emergency.jsx              # 🟢 Emergency
│   ├── Device.jsx                 # 🟢 Device
│   ├── Preference.jsx             # 🟢 Preference
│   ├── Cameras.jsx                # 🟢 Cameras
│   ├── FloorPlan.jsx              # 🟢 FloorPlan
│   ├── Notifications.jsx          # 🟢 Notifications
│   ├── Sensors.jsx                # 🟢 Sensors
│   └── Recordings.jsx             # 🟢 Recordings
│
└── (향후 추가 필요)
    ├── services/                  # 🔴 Service Layer
    │   ├── api/
    │   │   ├── ApiService.ts
    │   │   └── EncryptionService.ts
    │   ├── auth/
    │   │   └── AuthenticationService.ts
    │   ├── domain/
    │   │   ├── DeviceService.ts
    │   │   ├── SensorService.ts
    │   │   ├── CameraService.ts
    │   │   └── NotificationService.ts
    │   ├── realtime/
    │   │   └── WebSocketManager.ts
    │   └── storage/
    │       └── StorageService.ts
    │
    ├── utils/                     # 🔴 Utility Classes
    │   ├── DateFormatter.ts
    │   ├── Validator.ts
    │   ├── ColorUtils.ts
    │   └── FunctionUtils.ts
    │
    ├── hooks/                     # 🔴 Custom Hooks
    │   ├── useLocalStorage.ts
    │   ├── useApi.ts
    │   ├── useWebSocket.ts
    │   ├── useMediaQuery.ts
    │   └── useDebounce.ts
    │
    ├── types/                     # 🔴 TypeScript Types
    │   ├── api.types.ts
    │   ├── device.types.ts
    │   ├── sensor.types.ts
    │   ├── camera.types.ts
    │   └── notification.types.ts
    │
    └── constants/                 # 🔴 Constants & Enums
        ├── ApiEndpoints.ts
        ├── StorageKeys.ts
        ├── WebSocketEvents.ts
        └── enums.ts
```

---

## 참고 자료

- 📄 [클래스 구조 분석 문서](./class_analysis.md)
- 📘 [Mermaid 문서](https://mermaid.js.org/)
- 🎨 [UML 클래스 다이어그램 가이드](https://www.uml-diagrams.org/class-diagrams-overview.html)

---

**문서 버전:** 1.0.0  
**최종 업데이트:** 2025-11-09  
**작성자:** SafeHome Development Team

