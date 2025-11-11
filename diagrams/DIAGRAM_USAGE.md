# How to Use OverallClassDiagram.jsx

This document explains how to integrate and use the `OverallClassDiagram.jsx` React component in your project.

## 📦 Installation

### 1. Install Required Dependencies

```bash
npm install mermaid react react-dom
```

or with yarn:

```bash
yarn add mermaid react react-dom
```

### 2. Dependencies in package.json

Add these to your `package.json`:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "mermaid": "^10.6.1"
  }
}
```

## 🚀 Usage

### Basic Usage

Import and use the component in your React application:

```jsx
import React from "react";
import OverallClassDiagram from "./OverallClassDiagram";

function App() {
  return (
    <div className="App">
      <OverallClassDiagram />
    </div>
  );
}

export default App;
```

### Usage with Existing SafeHome App

If you want to add this to your existing SafeHome mobile app, you can integrate it as a new page:

#### 1. Add to `App.jsx`:

```jsx
import OverallClassDiagram from "./components/OverallClassDiagram";

// In your renderPage function:
case "diagram":
  return <OverallClassDiagram />;
```

#### 2. Add Navigation (Optional):

You can add a button in your settings or developer tools page:

```jsx
<button onClick={() => onNavigate("diagram")}>
  View System Architecture
</button>
```

## 📊 Component Features

### 1. **Interactive Tabs**
- Switch between 10 different diagram views
- Responsive tab navigation

### 2. **Diagram Categories**
- System Overview
- Base Classes
- Authentication
- Core Platform
- Security Modes
- Devices & Sensors
- Surveillance
- Notifications
- Incidents
- System Integration

### 3. **Responsive Design**
- Works on desktop and mobile devices
- Dark mode support (automatic based on system preference)
- Scrollable diagrams for large content

### 4. **Statistics Footer**
- Total classes: 82
- Total diagrams: 13
- Version information

## 🎨 Customization

### Theme Customization

You can customize the colors by modifying the CSS variables:

```jsx
<style jsx>{`
  .overall-class-diagram {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --text-primary: #1a1a1a;
  }
`}</style>
```

### Mermaid Theme

To change the Mermaid theme, modify the initialization:

```javascript
mermaid.initialize({
  startOnLoad: true,
  theme: "dark", // or "forest", "default", "neutral"
  securityLevel: "loose",
  fontFamily: "monospace",
});
```

Available themes:
- `default` - Standard theme
- `dark` - Dark theme
- `forest` - Green theme
- `neutral` - Minimal theme

## 🔧 Advanced Configuration

### Adding Custom Diagrams

To add a new diagram:

1. Create a new component:

```jsx
const MyCustomDiagram = () => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="diagram-container">
      <h2>My Custom Diagram</h2>
      <div className="mermaid" ref={diagramRef}>
        {`classDiagram
    class MyClass {
        +myMethod() void
    }`}
      </div>
    </div>
  );
};
```

2. Add to the diagrams array:

```jsx
const diagrams = [
  // ... existing diagrams
  { 
    id: "custom", 
    label: "Custom", 
    component: MyCustomDiagram 
  },
];
```

### Export Diagram as Image

To add export functionality, you can use html2canvas:

```bash
npm install html2canvas
```

```jsx
import html2canvas from "html2canvas";

const exportDiagram = async () => {
  const element = document.querySelector(".mermaid");
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png");
  
  const link = document.createElement("a");
  link.download = "diagram.png";
  link.href = image;
  link.click();
};
```

## 📱 Mobile Optimization

The component is already optimized for mobile, but you can enhance it:

### Pinch to Zoom

Add touch event handlers for better mobile experience:

```jsx
<div 
  className="mermaid" 
  ref={diagramRef}
  style={{
    touchAction: "pan-x pan-y pinch-zoom"
  }}
>
```

### Fullscreen Mode

Add a fullscreen button:

```jsx
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.querySelector('.diagram-content').requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
```

## 🐛 Troubleshooting

### Diagrams Not Rendering

If diagrams don't render:

1. Check if Mermaid is properly imported
2. Ensure `mermaid.contentLoaded()` is called after component mount
3. Check browser console for errors

### Styling Issues

If styles don't apply:

1. Make sure you're using a build system that supports CSS-in-JS (like Next.js)
2. Alternatively, extract styles to a separate CSS file

### Performance Issues

For better performance:

1. Use React.memo for diagram components
2. Implement lazy loading for tabs
3. Use virtual scrolling for long diagrams

## 📚 Resources

- [Mermaid Documentation](https://mermaid.js.org/)
- [React Documentation](https://react.dev/)
- [UML Class Diagram Guide](https://www.uml-diagrams.org/class-diagrams-overview.html)

## 🤝 Integration Examples

### With React Router

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagrams" element={<OverallClassDiagram />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### With Next.js

```jsx
// pages/diagrams.jsx
import dynamic from "next/dynamic";

const OverallClassDiagram = dynamic(
  () => import("../components/OverallClassDiagram"),
  { ssr: false }
);

export default function DiagramsPage() {
  return <OverallClassDiagram />;
}
```

### With TypeScript

If you're using TypeScript, add type definitions:

```typescript
// OverallClassDiagram.tsx
import React, { useEffect, useRef, FC } from "react";
import mermaid from "mermaid";

interface DiagramProps {
  className?: string;
}

const OverallClassDiagram: FC<DiagramProps> = ({ className }) => {
  // ... component code
};

export default OverallClassDiagram;
```

## 🎯 Best Practices

1. **Lazy Load**: Load diagrams only when needed
2. **Memoization**: Use React.memo to prevent unnecessary re-renders
3. **Code Splitting**: Split large diagrams into separate components
4. **Error Boundaries**: Wrap diagrams in error boundaries
5. **Loading States**: Show loading indicators while diagrams render

## 📄 License

This component is part of the SafeHome project.

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-09  
**Author:** SafeHome Development Team



