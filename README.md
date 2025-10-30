# SafeHome Mobile App

A premium smart home control system with a modern, elegant UI inspired by Apple Home and Nest.

## 🎨 Design Philosophy

- **Dark Theme**: Sophisticated dark interface with premium aesthetics
- **Glassmorphic UI**: Translucent cards with backdrop blur effects
- **Blue Accent Theme**: Unified color scheme using iOS-style blue (#0A84FF)
- **Smooth Animations**: Delightful 300ms transitions and interactive states
- **Mobile-First**: Responsive design optimized for mobile devices

## ✨ Key Features

### **Dashboard**

- **Smart Control Hero Card**: Live camera preview with device toggles
- **Home Mode Selection**: Away, Home, and Sleep status settings
- **Quick Actions**: Fast access to ambient controls and lighting
- **Stats Overview**: Active devices, today's events, and alerts
- **Recent Activity Logs**: View recent events with video recording playback
- **All Conditions**: Room-by-room status monitoring with SVG icons

### **Emergency**

- **Emergency Mode**: One-tap emergency activation
- **Emergency Contacts**: Quick dial to Police, Fire Department, Hospital, and Security
- **Emergency Actions**: Sound alarm, emergency broadcast, lock all doors, turn on lights
- **Recent Alerts**: History of security events by severity

### **Devices**

- **Floor Plan View**: Visual representation of home layout
- **Room Details**: Device and sensor lists per room
- **Camera Thumbnails**: Live camera feeds for each room
- **Device Controls**: Individual device settings and on/off toggles
- **Sensor Monitoring**: Real-time sensor status and configuration

### **Settings (Preference)**

- **Theme Toggle**: Dark/Light mode switching
- **Notifications**: Alert preferences
- **Security & Privacy**: Password and access controls
- **System Info**: About, version, and help

## 🚀 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## 🛠️ Tech Stack

- **React 18.3.1**: Modern React with hooks
- **Vite 5.0**: Lightning-fast build tool
- **CSS3**: Custom properties with glassmorphic effects
- **Context API**: Theme management
- **SVG Icons**: Scalable vector graphics throughout

## 📂 Project Structure

```
ui_first/
├── src/
│   ├── components/
│   │   └── BottomNav.jsx          # Bottom navigation bar
│   ├── contexts/
│   │   └── ThemeContext.jsx       # Theme management
│   ├── pages/
│   │   ├── Dashboard.jsx          # Home dashboard
│   │   ├── Emergency.jsx          # Emergency controls
│   │   ├── Device.jsx             # Device management
│   │   ├── Preference.jsx         # User settings
│   │   ├── Cameras.jsx            # Camera views
│   │   ├── FloorPlan.jsx          # Floor plan navigation
│   │   ├── Recordings.jsx         # Video recordings
│   │   ├── Sensors.jsx            # Sensor details
│   │   └── Notifications.jsx      # Notification center
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # App-level styles
│   ├── index.css                  # Global styles & design system
│   └── main.jsx                   # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design System

### Color Palette

```css
--bg-base: #0F0F0F              /* Background */
--card-bg: rgba(28, 28, 30, 0.8) /* Glassmorphic cards */
--accent-blue: #0A84FF           /* Primary accent */
--success-green: #32D74B         /* Success states */
--warning-orange: #FF9F0A        /* Warning states */
--alert-red: #FF453A             /* Alert states */
--text-primary: #FFFFFF          /* Primary text */
--text-secondary: #8E8E93        /* Secondary text */
```

### Spacing System

- Base unit: 8px
- Card padding: 20px
- Section margins: 24px
- Screen edge padding: 20px

### Border Radius

- Small: 12px
- Medium: 16px
- Large: 20px
- XL: 24px

## 🌐 Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

## 📱 Responsive Design

- **Mobile**: 320px - 767px (최적화됨)
- **iPad/Tablet**: 768px - 1024px (전체 너비 활용, 3-4열 그리드)
- **Desktop**: 1025px+ (최대 600px 너비로 중앙 정렬)

### iPad 최적화 기능

- 3-4열 그리드 레이아웃으로 더 많은 콘텐츠 표시
- 전체 화면 너비 활용
- 더 큰 터치 타겟 및 간격
- 최적화된 네비게이션 바

## ⚡ Performance

- First Contentful Paint: < 1s
- Smooth 60fps animations
- Optimized SVG icons
- Lazy loading for components

## 🔐 Security Features

- Secure emergency contacts
- Device access controls
- Activity logging
- Alert severity levels

## 📄 License

This project is a prototype for educational purposes.

## 👥 Contributors

SafeHome Development Team

---

**Version**: 1.0.0  
**Last Updated**: 2024
