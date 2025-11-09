# SafeHome 프론트엔드 클래스 구조 분석

> 현재 프로토타입의 전체 클래스 구조 및 향후 구현이 필요한 클래스 분석 문서

## 📑 목차

- [개요](#개요)
- [1. Service Classes (보이지 않는 로직)](#1-service-classes-보이지-않는-로직)
  - [1.1 API Service](#11-api-service)
  - [1.2 Encryption Service](#12-encryption-service)
  - [1.3 Authentication Service](#13-authentication-service)
  - [1.4 Device Service](#14-device-service)
  - [1.5 Sensor Service](#15-sensor-service)
  - [1.6 Camera Service](#16-camera-service)
  - [1.7 Notification Service](#17-notification-service)
  - [1.8 WebSocket Manager](#18-websocket-manager)
  - [1.9 Storage Service](#19-storage-service)
- [2. State Management Classes](#2-state-management-classes)
- [3. UI Component Classes (페이지)](#3-ui-component-classes-페이지)
- [4. UI Component Classes (레이아웃)](#4-ui-component-classes-레이아웃)
- [5. Utility Classes](#5-utility-classes)
- [6. Custom Hooks](#6-custom-hooks)
- [7. Constants & Enums](#7-constants--enums)
- [구현 현황 요약](#구현-현황-요약)

---

## 개요

이 문서는 SafeHome 프론트엔드 프로토타입의 전체 클래스 구조를 분석하고, 실제 제품화를 위해 필요한 클래스들을 정의합니다.

### ⚠️ 중요 사항

- 현재 프로토타입은 **모든 데이터가 하드코딩**되어 있습니다
- **실제 API 통신, 암호화, 인증 기능이 구현되어 있지 않습니다**
- 아래 명시된 Service Classes의 구현이 실제 제품화를 위해 필수적입니다

---

## 1. Service Classes (보이지 않는 로직)

> 🔴 **현재 미구현** - 실제 제품화를 위해 구현 필요

### 1.1 API Service

HTTP 요청을 처리하는 기본 API 서비스 클래스

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

class ApiService {
  // Private 속성
  private baseURL: string;
  private headers: Record<string, string>;
  private timeout: number;
  private authToken: string | null;

  // 생성자
  constructor(baseURL: string, timeout?: number);

  // Public 메서드
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>>;
  async post<T>(
    endpoint: string,
    data: Record<string, any>,
  ): Promise<ApiResponse<T>>;
  async put<T>(
    endpoint: string,
    data: Record<string, any>,
  ): Promise<ApiResponse<T>>;
  async delete<T>(endpoint: string): Promise<ApiResponse<T>>;

  // Private 메서드
  private async request<T>(
    method: string,
    endpoint: string,
    data?: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>>;
  private handleError(error: Error): ApiResponse<null>;
  private setAuthToken(token: string): void;
  private removeAuthToken(): void;
}
```

**주요 기능:**

- RESTful API 요청 처리 (GET, POST, PUT, DELETE)
- 에러 핸들링
- 인증 토큰 관리
- 타임아웃 처리

---

### 1.2 Encryption Service

데이터 암호화/복호화를 처리하는 서비스 클래스

```typescript
class EncryptionService {
  // Private 속성
  private algorithm: string;
  private key: CryptoKey | null;
  private iv: Uint8Array;

  // 생성자
  constructor();

  // Public 메서드
  async generateKey(): Promise<CryptoKey>;
  async encrypt(data: string): Promise<string>;
  async decrypt(encryptedData: string): Promise<string>;
  async hashPassword(password: string): Promise<string>;
  async verifyPassword(password: string, hash: string): Promise<boolean>;

  // Private 메서드
  private arrayBufferToBase64(buffer: ArrayBuffer): string;
  private base64ToArrayBuffer(base64: string): ArrayBuffer;
}
```

**주요 기능:**

- AES 암호화/복호화
- 비밀번호 해싱 (bcrypt/PBKDF2)
- 패킷 데이터 암호화
- 보안 키 생성 및 관리

---

### 1.3 Authentication Service

사용자 인증 및 세션 관리를 담당하는 서비스 클래스

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthenticationService {
  // Private 속성
  private apiService: ApiService;
  private token: string | null;
  private refreshToken: string | null;
  private user: User | null;

  // Public 속성
  isAuthenticated: boolean;

  // 생성자
  constructor(apiService: ApiService);

  // Public 메서드
  async login(email: string, password: string): Promise<AuthResponse>;
  async logout(): Promise<void>;
  async refreshAccessToken(): Promise<string>;
  async getCurrentUser(): Promise<User | null>;
  validateToken(token: string): boolean;

  // Private 메서드
  private saveTokens(token: string, refreshToken: string): void;
  private clearTokens(): void;
  private getStoredToken(): string | null;
}
```

**주요 기능:**

- 사용자 로그인/로그아웃
- JWT 토큰 관리
- 토큰 자동 갱신
- 인증 상태 관리

---

### 1.4 Device Service

IoT 디바이스 관리를 담당하는 서비스 클래스

```typescript
interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  active: boolean;
  settings: Record<string, any>;
}

class DeviceService {
  // Private 속성
  private apiService: ApiService;
  private cache: Map<number, Device>;
  private cacheExpiry: number;

  // Public 속성
  devices: Device[];
  isLoading: boolean;

  // 생성자
  constructor(apiService: ApiService);

  // Public 메서드
  async fetchDevices(): Promise<Device[]>;
  async getDeviceById(deviceId: number): Promise<Device>;
  async updateDevice(
    deviceId: number,
    updates: Partial<Device>,
  ): Promise<Device>;
  async toggleDevice(deviceId: number): Promise<Device>;
  async deleteDevice(deviceId: number): Promise<void>;

  // Private 메서드
  private cacheDevice(device: Device): void;
  private getCachedDevice(deviceId: number): Device | undefined;
  private invalidateCache(): void;
}
```

**주요 기능:**

- 디바이스 목록 조회
- 디바이스 상태 업데이트
- 디바이스 제어 (켜기/끄기)
- 캐싱을 통한 성능 최적화

---

### 1.5 Sensor Service

센서 데이터 실시간 모니터링을 담당하는 서비스 클래스

```typescript
interface Sensor {
  id: number;
  name: string;
  type: string;
  room: string;
  status: string;
  battery: number;
  lastUpdate: string;
}

class SensorService {
  // Private 속성
  private apiService: ApiService;
  private wsConnection: WebSocket | null;

  // Public 속성
  sensors: Sensor[];
  isConnected: boolean;

  // 생성자
  constructor(apiService: ApiService);

  // Public 메서드
  async fetchSensors(): Promise<Sensor[]>;
  async getSensorById(sensorId: number): Promise<Sensor>;
  async getSensorsByRoom(room: string): Promise<Sensor[]>;
  connectWebSocket(onMessage: (data: any) => void): void;
  disconnectWebSocket(): void;

  // Private 메서드
  private handleWebSocketMessage(event: MessageEvent): void;
  private handleWebSocketError(error: Event): void;
  private reconnectWebSocket(): void;
}
```

**주요 기능:**

- 센서 데이터 조회
- WebSocket을 통한 실시간 센서 데이터 수신
- 방별 센서 필터링
- 자동 재연결

---

### 1.6 Camera Service

CCTV 카메라 스트리밍 및 제어를 담당하는 서비스 클래스

```typescript
interface Camera {
  id: number;
  name: string;
  location: string;
  status: string;
  quality: string;
  active: boolean;
  settings: {
    motion: boolean;
    night: boolean;
    recording: boolean;
  };
}

class CameraService {
  // Private 속성
  private apiService: ApiService;
  private streamConnections: Map<number, MediaStream>;

  // Public 속성
  cameras: Camera[];

  // 생성자
  constructor(apiService: ApiService);

  // Public 메서드
  async fetchCameras(): Promise<Camera[]>;
  async getCameraById(cameraId: number): Promise<Camera>;
  async startStream(cameraId: number): Promise<MediaStream>;
  async stopStream(cameraId: number): Promise<void>;
  async captureSnapshot(cameraId: number): Promise<Blob>;
  async toggleRecording(cameraId: number): Promise<boolean>;

  // Private 메서드
  private getStreamUrl(cameraId: number): string;
  private cleanupStream(cameraId: number): void;
}
```

**주요 기능:**

- 카메라 목록 조회
- 실시간 비디오 스트리밍 (WebRTC/HLS)
- 스냅샷 캡처
- 녹화 제어
- 스트림 리소스 관리

---

### 1.7 Notification Service

푸시 알림 및 시스템 알림을 관리하는 서비스 클래스

```typescript
interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

class NotificationService {
  // Private 속성
  private apiService: ApiService;
  private permission: NotificationPermission;

  // Public 속성
  notifications: Notification[];
  unreadCount: number;

  // 생성자
  constructor(apiService: ApiService);

  // Public 메서드
  async fetchNotifications(): Promise<Notification[]>;
  async markAsRead(notificationId: number): Promise<void>;
  async markAllAsRead(): Promise<void>;
  async deleteNotification(notificationId: number): Promise<void>;
  async requestPermission(): Promise<NotificationPermission>;
  showNotification(title: string, body: string, icon?: string): void;

  // Private 메서드
  private updateUnreadCount(): void;
}
```

**주요 기능:**

- 알림 목록 조회
- 읽음/안 읽음 관리
- 브라우저 푸시 알림
- 알림 권한 요청

---

### 1.8 WebSocket Manager

WebSocket 연결 및 실시간 통신을 관리하는 클래스

```typescript
class WebSocketManager {
  // Private 속성
  private ws: WebSocket | null;
  private url: string;
  private reconnectAttempts: number;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;
  private listeners: Map<string, Function[]>;

  // Public 속성
  isConnected: boolean;

  // 생성자
  constructor(url: string, maxReconnectAttempts?: number);

  // Public 메서드
  connect(): Promise<void>;
  disconnect(): void;
  send(event: string, data: any): void;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;

  // Private 메서드
  private handleOpen(event: Event): void;
  private handleMessage(event: MessageEvent): void;
  private handleError(event: Event): void;
  private handleClose(event: CloseEvent): void;
  private reconnect(): void;
  private emit(event: string, data: any): void;
}
```

**주요 기능:**

- WebSocket 연결 관리
- 자동 재연결
- 이벤트 기반 메시지 처리
- 연결 상태 모니터링

---

### 1.9 Storage Service

로컬 스토리지 관리를 담당하는 유틸리티 클래스

```typescript
class StorageService {
  // Static 메서드
  static setItem<T>(key: string, value: T): void;
  static getItem<T>(key: string): T | null;
  static removeItem(key: string): void;
  static clear(): void;
  static hasItem(key: string): boolean;

  // Private static 메서드
  private static serialize<T>(value: T): string;
  private static deserialize<T>(value: string): T | null;
}
```

**주요 기능:**

- 타입 안전한 로컬 스토리지 접근
- JSON 직렬화/역직렬화
- 스토리지 예외 처리

---

## 2. State Management Classes

> 🟢 **현재 구현됨**

### ThemeProvider & useTheme

테마(다크/라이트 모드) 관리를 위한 Context Provider

```typescript
interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

class ThemeProvider {
  // Props
  children: React.ReactNode;

  // State
  private isDark: boolean;
  private setIsDark: React.Dispatch<React.SetStateAction<boolean>>;

  // 메서드
  toggleTheme(): void;

  render(): JSX.Element;
}

// Custom Hook
function useTheme(): ThemeContextValue;
```

**주요 기능:**

- 다크/라이트 모드 토글
- localStorage에 테마 저장
- 전역 테마 상태 관리

**파일 위치:** `src/contexts/ThemeContext.jsx`

---

## 3. UI Component Classes (페이지)

> 🟢 **현재 구현됨**

### 3.1 App Component

메인 애플리케이션 컴포넌트 - 라우팅 및 페이지 전환 관리

```typescript
interface AppState {
  currentPage: string;
}

class App {
  // State
  private currentPage: string;
  private setCurrentPage: React.Dispatch<React.SetStateAction<string>>;

  // Context
  private isDark: boolean;

  // 메서드
  renderPage(): JSX.Element;
  handleNavigate(page: string): void;

  render(): JSX.Element;
}
```

**파일 위치:** `src/App.jsx`

---

### 3.2 Dashboard Component

홈 대시보드 페이지 - 시스템 개요 및 빠른 제어

```typescript
interface DashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardState {
  homeMode: string; // "away" | "home" | "sleep"
  devicesState: {
    ceilingLights: boolean;
    smartLamp: boolean;
    number: boolean;
    tv: boolean;
  };
}

class Dashboard {
  // Props
  onNavigate?: (page: string) => void;

  // State
  private homeMode: string;
  private devicesState: DashboardState["devicesState"];

  // 데이터
  private modes: Mode[]; // 홈 모드 옵션
  private quickActions: QuickAction[]; // 빠른 작업
  private rooms: Room[]; // 방 목록
  private stats: Stat[]; // 통계 정보
  private recentLogs: ActivityLog[]; // 최근 활동 로그

  // 메서드
  toggleDevice(device: string): void;
  getLogIcon(type: string): JSX.Element | null;

  render(): JSX.Element;
}
```

**주요 기능:**

- 홈 모드 전환 (Away/Home/Sleep)
- 디바이스 빠른 제어
- 카메라 라이브 피드
- 최근 활동 로그
- 방별 상태 모니터링

**파일 위치:** `src/pages/Dashboard.jsx`

---

### 3.3 Emergency Component

비상 상황 관리 페이지

```typescript
interface EmergencyState {
  isEmergencyActive: boolean;
}

class Emergency {
  // State
  private isEmergencyActive: boolean;

  // 데이터
  private emergencyContacts: EmergencyContact[]; // 긴급 연락처
  private emergencyActions: EmergencyAction[]; // 긴급 조치
  private recentAlerts: Alert[]; // 최근 경보

  // 메서드
  getContactIcon(type: string): JSX.Element | null;
  getActionIcon(action: string): JSX.Element | null;
  handleEmergencyToggle(): void;

  render(): JSX.Element;
}
```

**주요 기능:**

- 긴급 모드 활성화/비활성화
- 긴급 연락처 (경찰, 소방서, 병원 등)
- 긴급 조치 (알람, 잠금, 조명 등)
- 최근 경보 내역

**파일 위치:** `src/pages/Emergency.jsx`

---

### 3.4 Device Component

디바이스 및 센서 관리 페이지

```typescript
interface DeviceState {
  selectedRoom: string | null;
  selectedDevice: Device | null;
  selectedCamera: Camera | null;
}

class Device {
  // State
  private selectedRoom: string | null;
  private selectedDevice: Device | null;
  private selectedCamera: Camera | null;

  // 데이터
  private rooms: RoomLayout[]; // 평면도 레이아웃
  private devicesByRoom: Record<string, Device[]>; // 방별 디바이스
  private camerasByRoom: Record<string, Camera[]>; // 방별 카메라

  // 메서드
  getStatusColor(room: RoomLayout): string;
  toggleDeviceActive(): void;
  toggleCameraActive(): void;

  render(): JSX.Element;
}
```

**주요 기능:**

- 평면도 기반 디바이스 관리
- 방별 디바이스/센서 목록
- 디바이스 상세 정보 및 설정
- 카메라 상태 확인

**파일 위치:** `src/pages/Device.jsx`

---

### 3.5 Preference Component

설정 및 사용자 프로필 페이지

```typescript
interface PreferenceState {
  notifications: boolean;
  autoLock: boolean;
  nightMode: boolean;
  soundAlerts: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
}

class Preference {
  // Context
  private isDark: boolean;
  private toggleTheme: () => void;

  // State
  private settings: PreferenceState;

  // 데이터
  private settingGroups: SettingGroup[]; // 설정 그룹
  private menuItems: MenuItem[]; // 메뉴 항목

  // 메서드
  toggleSetting(key: string): void;

  render(): JSX.Element;
}
```

**주요 기능:**

- 사용자 프로필 관리
- 알림 설정
- 보안 설정
- 다크 모드 토글
- 추가 메뉴 (계정, 로그, 통계 등)

**파일 위치:** `src/pages/Preference.jsx`

---

### 3.6 Cameras Component

CCTV 카메라 라이브 뷰 페이지

```typescript
interface CamerasState {
  selectedCamera: number | null;
  isRecording: Record<number, boolean>;
}

class Cameras {
  // State
  private selectedCamera: number | null;
  private isRecording: Record<number, boolean>;

  // 데이터
  private cameras: Camera[]; // 카메라 목록

  // 메서드
  toggleRecording(id: number): void;

  render(): JSX.Element;
}
```

**주요 기능:**

- 카메라 그리드 뷰
- 전체화면 라이브 스트리밍
- 카메라 제어 (스냅샷, 녹화, 음성)
- PTZ 제어 (팬/틸트/줌)

**파일 위치:** `src/pages/Cameras.jsx`

---

### 3.7 FloorPlan Component

평면도 기반 센서 모니터링 페이지

```typescript
interface FloorPlanState {
  selectedRoom: string | null;
}

class FloorPlan {
  // State
  private selectedRoom: string | null;

  // 데이터
  private rooms: FloorPlanRoom[]; // 방 레이아웃
  private sensors: FloorPlanSensor[]; // 센서 위치

  // 메서드
  getStatusColor(status: string): string;
  getSensorIcon(type: string): JSX.Element;

  render(): JSX.Element;
}
```

**주요 기능:**

- SVG 기반 평면도
- 실시간 센서 위치 표시
- 방별 필터링
- 센서 상태 색상 코딩

**파일 위치:** `src/pages/FloorPlan.jsx`

---

### 3.8 Notifications Component

알림 센터 페이지

```typescript
interface NotificationsState {
  filter: string; // "all" | "unread" | "alert" | "info"
}

class Notifications {
  // State
  private filter: string;

  // 데이터
  private notifications: Notification[];

  // 메서드
  getIcon(type: string): JSX.Element | null;

  // Computed
  get filteredNotifications(): Notification[];
  get unreadCount(): number;

  render(): JSX.Element;
}
```

**주요 기능:**

- 알림 목록 표시
- 필터링 (전체/안읽음/경고/정보)
- 읽음/안읽음 표시
- 알림 타입별 아이콘

**파일 위치:** `src/pages/Notifications.jsx`

---

### 3.9 Sensors Component

센서 모니터링 페이지

```typescript
interface SensorsState {
  selectedType: string;
}

class Sensors {
  // State
  private selectedType: string;

  // 데이터
  private sensors: Sensor[];
  private sensorTypes: SensorType[];

  // 메서드
  getSensorStatus(sensor: Sensor): string;
  getStatusColor(status: string): string;

  // Computed
  get filteredSensors(): Sensor[];
  get stats(): SensorStats;

  render(): JSX.Element;
}
```

**주요 기능:**

- 센서 통계 대시보드
- 타입별 필터링
- 배터리 상태 표시
- 센서 상태 모니터링

**파일 위치:** `src/pages/Sensors.jsx`

---

### 3.10 Recordings Component

녹화 영상 관리 페이지

```typescript
interface RecordingsState {
  selectedVideo: Recording | null;
  isPlaying: boolean;
}

class Recordings {
  // State
  private selectedVideo: Recording | null;
  private isPlaying: boolean;

  // 데이터
  private recordings: Recording[];

  // 메서드
  handleShare(): void;
  handleDownload(): void;

  render(): JSX.Element;
}
```

**주요 기능:**

- 녹화 영상 목록
- 비디오 재생
- 공유 및 다운로드
- 메타데이터 표시

**파일 위치:** `src/pages/Recordings.jsx`

---

## 4. UI Component Classes (레이아웃)

> 🟢 **현재 구현됨**

### BottomNav Component

하단 네비게이션 바

```typescript
interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

class BottomNav {
  // Props
  currentPage: string;
  onNavigate: (page: string) => void;

  // 데이터
  private navItems: NavItem[]; // 네비게이션 항목

  // 메서드
  getIcon(id: string): JSX.Element;

  render(): JSX.Element;
}
```

**주요 기능:**

- 4개 주요 페이지 네비게이션
- 활성 페이지 표시
- 아이콘 + 레이블

**파일 위치:** `src/components/BottomNav.jsx`

---

## 5. Utility Classes

> 🔴 **현재 미구현** - 향후 구현 필요

### 5.1 DateFormatter

날짜 및 시간 포맷팅 유틸리티

```typescript
class DateFormatter {
  static formatDate(date: Date, format: string): string;
  static formatTime(date: Date): string;
  static formatDateTime(date: Date): string;
  static toISO(date: Date): string;
  static parseISO(dateString: string): Date;
  static getRelativeTime(date: Date): string; // "5 min ago"
  static isToday(date: Date): boolean;
  static isYesterday(date: Date): boolean;
}
```

---

### 5.2 Validator

입력 값 유효성 검사 유틸리티

```typescript
class Validator {
  static isValidEmail(email: string): boolean;
  static isValidPassword(password: string): boolean;
  static isValidPhoneNumber(phone: string): boolean;
  static isValidUrl(url: string): boolean;
  static isEmpty(value: string): boolean;
  static isNumeric(value: string): boolean;
}
```

---

### 5.3 ColorUtils

색상 변환 및 조작 유틸리티

```typescript
class ColorUtils {
  static hexToRgb(hex: string): { r: number; g: number; b: number };
  static rgbToHex(r: number, g: number, b: number): string;
  static lighten(color: string, amount: number): string;
  static darken(color: string, amount: number): string;
  static getContrastColor(bgColor: string): string;
}
```

---

### 5.4 FunctionUtils

함수 제어 유틸리티

```typescript
class FunctionUtils {
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): (...args: Parameters<T>) => void;

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number,
  ): (...args: Parameters<T>) => void;

  static once<T extends (...args: any[]) => any>(
    func: T,
  ): (...args: Parameters<T>) => ReturnType<T>;
}
```

---

## 6. Custom Hooks

> 🔴 **현재 미구현** - 향후 구현 필요

### 6.1 useLocalStorage

로컬 스토리지 상태 관리 훅

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void];
```

---

### 6.2 useApi

API 호출 관리 훅

```typescript
interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

function useApi<T>(
  apiFunc: () => Promise<T>,
  options?: UseApiOptions<T>,
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};
```

---

### 6.3 useWebSocket

WebSocket 연결 관리 훅

```typescript
interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
}

function useWebSocket(
  url: string,
  options?: UseWebSocketOptions,
): {
  isConnected: boolean;
  send: (data: any) => void;
  disconnect: () => void;
};
```

---

### 6.4 useMediaQuery

반응형 디자인 훅

```typescript
function useMediaQuery(query: string): boolean;

// 사용 예시
const isMobile = useMediaQuery("(max-width: 768px)");
```

---

### 6.5 useDebounce

디바운스 값 관리 훅

```typescript
function useDebounce<T>(value: T, delay: number): T;
```

---

## 7. Constants & Enums

> 🔴 **현재 미구현** - 향후 구현 필요

### 7.1 Device Type Enum

```typescript
enum DeviceType {
  LOCK = "lock",
  MOTION = "motion",
  LIGHT = "light",
  TEMPERATURE = "temperature",
  CLIMATE = "climate",
  ENTERTAINMENT = "entertainment",
  GAS = "gas",
  SMOKE = "smoke",
  WINDOW = "window",
  DOOR = "door",
  HUMIDITY = "humidity",
  WATER = "water",
}
```

---

### 7.2 Notification Type Enum

```typescript
enum NotificationType {
  ALERT = "alert",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success",
}
```

---

### 7.3 Home Mode Enum

```typescript
enum HomeMode {
  AWAY = "away",
  HOME = "home",
  SLEEP = "sleep",
}
```

---

### 7.4 Camera Quality Enum

```typescript
enum CameraQuality {
  HD_1080P = "1080p",
  HD_720P = "720p",
  SD_480P = "480p",
}
```

---

### 7.5 API Endpoints

```typescript
class ApiEndpoints {
  static readonly BASE_URL = "/api/v1";

  static readonly AUTH = {
    LOGIN: `${ApiEndpoints.BASE_URL}/auth/login`,
    LOGOUT: `${ApiEndpoints.BASE_URL}/auth/logout`,
    REFRESH: `${ApiEndpoints.BASE_URL}/auth/refresh`,
    ME: `${ApiEndpoints.BASE_URL}/auth/me`,
  };

  static readonly DEVICES = {
    LIST: `${ApiEndpoints.BASE_URL}/devices`,
    DETAIL: (id: number) => `${ApiEndpoints.BASE_URL}/devices/${id}`,
    UPDATE: (id: number) => `${ApiEndpoints.BASE_URL}/devices/${id}`,
    DELETE: (id: number) => `${ApiEndpoints.BASE_URL}/devices/${id}`,
  };

  static readonly SENSORS = {
    LIST: `${ApiEndpoints.BASE_URL}/sensors`,
    DETAIL: (id: number) => `${ApiEndpoints.BASE_URL}/sensors/${id}`,
    BY_ROOM: (room: string) => `${ApiEndpoints.BASE_URL}/sensors/room/${room}`,
  };

  static readonly CAMERAS = {
    LIST: `${ApiEndpoints.BASE_URL}/cameras`,
    DETAIL: (id: number) => `${ApiEndpoints.BASE_URL}/cameras/${id}`,
    STREAM: (id: number) => `${ApiEndpoints.BASE_URL}/cameras/${id}/stream`,
    SNAPSHOT: (id: number) => `${ApiEndpoints.BASE_URL}/cameras/${id}/snapshot`,
  };

  static readonly NOTIFICATIONS = {
    LIST: `${ApiEndpoints.BASE_URL}/notifications`,
    MARK_READ: (id: number) =>
      `${ApiEndpoints.BASE_URL}/notifications/${id}/read`,
  };

  static readonly RECORDINGS = {
    LIST: `${ApiEndpoints.BASE_URL}/recordings`,
    DETAIL: (id: number) => `${ApiEndpoints.BASE_URL}/recordings/${id}`,
    DOWNLOAD: (id: number) =>
      `${ApiEndpoints.BASE_URL}/recordings/${id}/download`,
  };
}
```

---

### 7.6 Storage Keys

```typescript
class StorageKeys {
  static readonly AUTH_TOKEN = "safehome-auth-token";
  static readonly REFRESH_TOKEN = "safehome-refresh-token";
  static readonly THEME = "safehome-theme";
  static readonly USER = "safehome-user";
  static readonly SETTINGS = "safehome-settings";
}
```

---

### 7.7 WebSocket Events

```typescript
class WebSocketEvents {
  static readonly SENSOR_UPDATE = "sensor:update";
  static readonly DEVICE_STATUS = "device:status";
  static readonly NOTIFICATION = "notification";
  static readonly CAMERA_STATUS = "camera:status";
  static readonly EMERGENCY = "emergency";
}
```

---

## 구현 현황 요약

### ✅ 현재 구현된 기능

| 카테고리              | 구현된 클래스/컴포넌트                                                                                | 파일 수 |
| --------------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| **State Management**  | ThemeProvider, useTheme                                                                               | 1       |
| **Page Components**   | App, Dashboard, Emergency, Device, Preference, Cameras, FloorPlan, Notifications, Sensors, Recordings | 10      |
| **Layout Components** | BottomNav                                                                                             | 1       |
| **총계**              |                                                                                                       | **12**  |

### ❌ 향후 구현 필요

| 카테고리            | 필요한 클래스                                                                                                                                            | 개수   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Service Classes** | ApiService, EncryptionService, AuthenticationService, DeviceService, SensorService, CameraService, NotificationService, WebSocketManager, StorageService | 9      |
| **Utility Classes** | DateFormatter, Validator, ColorUtils, FunctionUtils                                                                                                      | 4      |
| **Custom Hooks**    | useLocalStorage, useApi, useWebSocket, useMediaQuery, useDebounce                                                                                        | 5      |
| **Constants**       | Enums, ApiEndpoints, StorageKeys, WebSocketEvents                                                                                                        | 7      |
| **총계**            |                                                                                                                                                          | **25** |

---

## 우선순위별 구현 계획

### 🔴 Phase 1: 필수 기능 (High Priority)

1. **ApiService** - API 통신 기본 인프라
2. **AuthenticationService** - 사용자 인증
3. **StorageService** - 로컬 스토리지 관리
4. **useApi Hook** - API 호출 간소화
5. **Constants (ApiEndpoints, StorageKeys)** - 상수 정의

### 🟡 Phase 2: 핵심 기능 (Medium Priority)

6. **DeviceService** - 디바이스 제어
7. **SensorService** - 센서 데이터 수신
8. **CameraService** - 카메라 스트리밍
9. **NotificationService** - 알림 관리
10. **WebSocketManager** - 실시간 통신

### 🟢 Phase 3: 보안 및 최적화 (Low Priority)

11. **EncryptionService** - 데이터 암호화
12. **Utility Classes** - 유틸리티 함수들
13. **Additional Hooks** - 추가 커스텀 훅들

---

## 데이터 흐름 예시

### 현재 (프로토타입)

```
Component → Hardcoded Data → Render
```

### 향후 (실제 제품)

```
Component → useApi Hook → ApiService → Backend API
                ↓
          Real-time Data ← WebSocketManager ← Backend WebSocket
                ↓
          StorageService (Cache)
                ↓
          EncryptionService (Security)
```

---

## 참고 사항

- 모든 Service Classes는 싱글톤 패턴으로 구현할 것을 권장합니다
- API 호출은 반드시 에러 핸들링을 포함해야 합니다
- WebSocket 연결은 자동 재연결 로직을 포함해야 합니다
- 민감한 데이터는 반드시 암호화 후 저장해야 합니다
- TypeScript를 사용하여 타입 안정성을 확보하는 것을 권장합니다

---

**문서 버전:** 1.0.0  
**최종 업데이트:** 2025-11-09  
**작성자:** SafeHome Development Team
