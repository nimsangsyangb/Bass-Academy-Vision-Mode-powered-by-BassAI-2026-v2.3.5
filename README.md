# 🎸 Bass Academy

<div align="center">

![Version](https://img.shields.io/badge/Version-2.3.0-C9A554?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Interactive Bass Training Platform**

[Demo](#-demo) • [Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation)

</div>

---

## 📖 About

A comprehensive bass practice platform featuring a **selectable exercise library** with techniques from legendary artists like **John Patitucci**, **Victor Wooten**, **Flea**, and **Jaco Pastorius**.

Practice arpeggios, scales, and patterns with real-time tablature, fretboard visualization, and Web Audio synthesis - all transposable to any key.

## 🆕 What's New in v2.3.0

- 🔍 **Fullscreen Practice Mode** - Immersive tablature view with integrated controls
- 🎚️ **In-Fullscreen Controls** - Play/Stop, Tempo, and Volume sliders in fullscreen
- ⌨️ **Keyboard Shortcuts** - Space for Play/Pause, ESC to exit fullscreen
- 📱 **Mobile Landscape Optimized** - Perfect for horizontal phone/tablet practice
- 🌐 **Cross-Browser Fullscreen API** - Works on Chrome, Firefox, Safari, Edge

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 **Artist Home Screen** | Select from legendary bassists to access their specific exercises |
| 📚 **Exercise Library** | 10+ patterns: Linear 11ths, Double Thumb, Slap, Ghost Notes, and more |
| 🔍 **Fullscreen Practice Mode** | Immersive view with integrated Play/Stop, Tempo, and Volume controls |
| 🎹 **Root Transposition** | Practice any pattern in all 12 chromatic keys |
| 🎯 **Interactive Tablature** | Real-time visual feedback highlighting notes as they play |
| 🎸 **Fretboard View** | Alternative visualization showing the bass neck |
| 🔊 **Web Audio Engine** | Custom synthesizer built with Web Audio API |
| 🥁 **Metronome** | Beat indicator with triplet subdivisions |
| ⏱️ **Tempo Control** | Adjustable BPM from 40-160 |
| 🔄 **Loop Mode** | Continuous practice without interruption |
| 🌓 **Dark/Light Theme** | Toggle between themes with persistence |
| 📱 **Responsive Design** | Mobile-first design optimized for all screen sizes |
| 📲 **PWA Support** | Install on any device for offline practice |

## 🎸 Artist Techniques

### John Patitucci
| Pattern | Style | Difficulty |
|---------|-------|------------|
| Linear 11ths (Major) | Modern Jazz | ★★★★☆ |
| Linear 11ths (Minor) | Modern Jazz | ★★★★☆ |

### Victor Wooten
| Pattern | Style | Difficulty |
|---------|-------|------------|
| Double Thumb Maj7 | Slap & Pop | ★★★★★ |
| Open-Hammer Pluck | Groove | ★★★★☆ |

### Flea (RHCP)
| Pattern | Style | Difficulty |
|---------|-------|------------|
| Higher Ground Octaves | Funk-Rock | ★★★☆☆ |
| Give It Away Groove | Punk-Funk | ★★★☆☆ |

### Jaco Pastorius
| Pattern | Style | Difficulty |
|---------|-------|------------|
| The Chicken (16ths) | Jazz-Funk | ★★★★☆ |
| Chromatic Approach | Fretless | ★★★★★ |

### Basic 7th Arpeggios
| Pattern | Intervals | Difficulty |
|---------|-----------|------------|
| Major 7th | 1, 3, 5, 7 | ★★☆☆☆ |
| Minor 7th | 1, b3, 5, b7 | ★★☆☆☆ |
| Dominant 7th | 1, 3, 5, b7 | ★★☆☆☆ |
| Half Diminished | 1, b3, b5, b7 | ★★★☆☆ |
| Diminished 7th | 1, b3, b5, bb7 | ★★★☆☆ |

## 🏗️ Architecture

This project follows modern React architecture patterns for maintainability and scalability.

### Project Structure

```
src/
├── components/
│   ├── layout/           # Header, CountdownOverlay, Footer
│   ├── player/           # ControlPanel, BeatIndicator, PlaybackControls
│   ├── tablature/        # TabNote, TabString, MeasureGuide, Desktop/Mobile
│   ├── exercise/         # ExerciseSelector, EducationalInfoPanel
│   └── HomeScreen.jsx    # Artist selection landing page
├── hooks/
│   ├── useBassAudio.js       # Audio engine wrapper
│   ├── useAudioScheduler.js  # Note scheduling with lookahead
│   ├── usePlayerState.js     # State management with FSM
│   ├── useFullscreen.js      # Cross-browser Fullscreen API
│   └── usePWA.js             # PWA installation & updates
├── services/
│   └── AudioService.js       # Pure JS audio synthesis
├── config/
│   ├── audioConfig.js        # Audio constants & settings
│   └── uiConfig.js           # UI constants & settings
├── data/
│   └── exerciseLibrary.js    # Patterns, categories & generation
├── App.jsx                   # Router between Home & Trainer
└── BassTrainer.jsx           # Exercise trainer component
```

### Design Patterns

| Pattern | Implementation |
|---------|----------------|
| **Finite State Machine** | Player states (IDLE → COUNTDOWN → PLAYING ↔ PAUSED) |
| **Reducer Pattern** | Centralized state management via `useReducer` |
| **Service Pattern** | `AudioService` class - pure JS, testable |
| **Composition** | Granular components (TabNote → TabString → TablatureView) |
| **Config Centralization** | All constants in `/config` |

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/juliandeveloper05/Bass-Academy-Interactive-Bass-Training.git

# Navigate to project
cd Bass-Academy-Interactive-Bass-Training

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- **Framework:** React 19.2 with React Compiler
- **Build Tool:** Vite 6.3
- **Styling:** Tailwind CSS 4.1
- **Icons:** Lucide React
- **Audio:** Web Audio API
- **State:** useReducer + Finite State Machine
- **PWA:** Service Worker with Cache Management

## 🗺️ Roadmap

### ✅ Completed (v2.3.0)
- [x] **Fullscreen practice mode** with integrated controls
- [x] **Keyboard shortcuts** (Space: play/pause, ESC: exit)
- [x] **Mobile landscape optimization** for practice sessions
- [x] **Cross-browser Fullscreen API** support
- [x] **Artist selection home screen**
- [x] **Multi-artist exercise library** (Patitucci, Wooten, Flea, Jaco)
- [x] **Improved responsive design** for mobile
- [x] Exercise library with selectable patterns
- [x] Root note transposition (12 keys)
- [x] Metronome with triplet subdivisions
- [x] Fretboard visualization mode
- [x] Light/Dark theme toggle
- [x] PWA support with offline use

### 🔜 Upcoming (v2.4.0)
- [ ] Scale patterns (Major, Minor, Modes)
- [ ] Practice session statistics
- [ ] Progress tracking with LocalStorage
- [ ] Custom exercise builder
- [ ] Audio recording for self-review

## 🎓 Resources

- [John Patitucci Official](https://johnpatitucci.com/)
- [Victor Wooten Official](https://victorwooten.com/)
- [Web Audio API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 📄 License

MIT © 2026

---

<div align="center">

**Made with ❤️ for bass players**

**Bass Academy · 2026 · v2.3.0**

</div>