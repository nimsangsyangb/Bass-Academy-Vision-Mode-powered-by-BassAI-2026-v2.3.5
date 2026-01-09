# 🎸 Bass Academy

<div align="center">

![Version](https://img.shields.io/badge/Version-2.3.3-C9A554?style=for-the-badge)
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

## 💼 Executive Summary

### Value Proposition

Bass Academy addresses a critical gap in the music education technology market: **interactive, structured bass guitar training with artist-specific techniques**. Unlike generic tab readers or passive video tutorials, this platform provides:

- **Active Learning** — Real-time feedback with synchronized audio/visual playback
- **Curriculum Structure** — Exercises curated from world-class bassists' signature techniques
- **Progressive Difficulty** — Patterns range from beginner (★★☆) to expert (★★★★★)
- **User-Generated Content** — Custom Exercise Builder enables infinite scalability

### Target Audience

| Segment | Use Case | Value Driver |
|---------|----------|--------------|
| **Students** | Structured practice routines | Artist-specific curriculum |
| **Teachers** | Lesson material creation | Custom builder + JSON export |
| **Hobbyists** | Self-paced skill development | Mobile-first PWA, offline support |
| **Professionals** | Technique refinement | High-difficulty patterns |

### Technical Differentiators

| Capability | Competitive Advantage |
|------------|----------------------|
| **PWA Architecture** | Offline-first, installable on any device |
| **Web Audio API** | Low-latency audio synthesis, no server dependency |
| **Custom Exercise Builder** | User-generated content ecosystem potential |
| **Open JSON Format** | Exercises shareable, not locked to platform |
| **React 19 + Vite 6** | Modern stack, excellent DX and performance |

### Metrics & Scalability

- **Bundle Size:** 318 KB main JS (gzip: 87 KB) — optimized for mobile networks
- **Build Time:** ~42s production build — fast CI/CD cycles
- **Zero Backend Dependency:** All features work client-side with LocalStorage
- **PWA Ready:** Service worker with cache management for offline reliability

### Growth Opportunities

1. **Community Features** — Exercise sharing, ratings, user profiles
2. **Subscription Model** — Premium artist packs, advanced analytics
3. **Partnership Potential** — Licensing with music schools, YouTube creators
4. **Mobile Apps** — Capacitor/React Native wrapper for App Store presence

## 🆕 What's New in v2.3.3

- ⚡ **Performance Optimizations** - Faster HomeScreen loading with throttled mouse tracking
- 🎯 **Memoized Components** - ArtistCard, Magnetic, and MusicParticles now use React.memo
- 🖼️ **Lazy Image Loading** - Artist images load on-demand for faster initial render
- 🎨 **Reduced GPU Load** - Blur effects optimized (64px → 40px), fewer particles (15 → 8)
- 📦 **Optimized CSS** - 200+ lines moved from inline JSX to external CSS for caching
- ♿ **Accessibility** - Added `prefers-reduced-motion` support for users who need it

### Previous (v2.3.2)

- 🎙️ **Audio Recording System** - Record your practice sessions for self-review
- 🥁 **Recording Metronome** - Built-in hi-hat metronome with pre-roll countdown
- 📝 **Editable Recording Metadata** - Customize name, BPM, key, and notes before saving
- 🌊 **Real Waveform Visualization** - See actual audio waveforms from your recordings
- 🎚️ **Live Mic Level Indicator** - Visual feedback showing microphone input levels
- 📚 **Recording Library** - Save, rate, and manage multiple recordings with IndexedDB storage
- 🔊 **Recording Playback** - Full-featured player with seek, volume, and waveform display

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 **Artist Home Screen** | Select from legendary bassists to access their specific exercises |
| 🎨 **Custom Exercise Builder** | Create your own exercises with visual fretboard editor |
| 📚 **Exercise Library** | 10+ patterns: Linear 11ths, Double Thumb, Slap, Ghost Notes, and more |
| 🔍 **Fullscreen Practice Mode** | Immersive view with integrated Play/Stop, Tempo, and Volume controls |
| 🎹 **Root Transposition** | Practice any pattern in all 12 chromatic keys |
| 🎯 **Interactive Tablature** | Real-time visual feedback highlighting notes as they play |
| 🎸 **Fretboard View** | Alternative visualization showing the bass neck |
| 🔊 **Web Audio Engine** | Custom synthesizer built with Web Audio API |
| 🥁 **Metronome** | Beat indicator with triplet subdivisions |
| ⏱️ **Tempo Control** | Adjustable BPM from 40-160 |
| 🔄 **Loop Mode** | Continuous practice without interruption |
| 🎙️ **Recording Studio** | Record, playback, and review your practice sessions |
| 🌓 **Dark/Light Theme** | Toggle between themes with persistence |
| 📱 **Responsive Design** | Mobile-first design optimized for all screen sizes |
| 📲 **PWA Support** | Install on any device for offline practice |

## 🎨 Custom Exercise Builder

Create personalized bass exercises with the new visual builder:

| Feature | Description |
|---------|-------------|
| 🎸 **Visual Fretboard** | Interactive 4-string × 13-fret grid (E, A, D, G strings) |
| 👆 **Tap to Add** | Simply tap any fret position to add notes to your sequence |
| 🎵 **Technique Selector** | Choose technique per note: Normal, Slap, Pop, Hammer, Mute |
| ⚙️ **Metadata Editor** | Set name, description, difficulty, and suggested tempo |
| 💾 **Auto-Save** | Drafts saved automatically every 30 seconds |
| 📤 **Export/Import** | Share exercises as `.bass.json` files |
| ▶️ **Preview Mode** | Test your exercise in BassTrainer before saving |

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
│   ├── builder/          # Custom Exercise Builder components
│   │   ├── CustomBuilderHub.jsx       # Exercise list & management
│   │   ├── VisualFretboardEditor.jsx  # Interactive fretboard editor
│   │   └── CustomBuilderRouter.jsx    # Builder navigation
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
│   ├── AudioService.js           # Pure JS audio synthesis
│   └── CustomExerciseManager.js  # Custom exercise CRUD & storage
├── config/
│   ├── audioConfig.js        # Audio constants & settings
│   └── uiConfig.js           # UI constants & settings
├── data/
│   ├── exerciseLibrary.js        # Patterns, categories & generation
│   └── customExerciseLibrary.js  # Custom exercise helpers
├── App.jsx                   # Router between Home, Builder & Trainer
└── BassTrainer.jsx           # Exercise trainer component
```

### Design Patterns

| Pattern | Implementation |
|---------|----------------|
| **Finite State Machine** | Player states (IDLE → COUNTDOWN → PLAYING ↔ PAUSED) |
| **Reducer Pattern** | Centralized state management via `useReducer` |
| **Service Pattern** | `AudioService` & `CustomExerciseManager` - pure JS, testable |
| **Composition** | Granular components (TabNote → TabString → TablatureView) |
| **Config Centralization** | All constants in `/config` |

## 🌐 Try It Now

**Live Demo:** [bass-academy-interactive-bass-train.vercel.app](https://bass-academy-interactive-bass-train.vercel.app/)

No installation required — works directly in your browser!

### 📲 Install as PWA (Recommended)

Bass Academy works offline as a Progressive Web App. Install it on any device:

| Platform | How to Install |
|----------|----------------|
| **Chrome (Desktop)** | Click the install icon (⊕) in the address bar → "Install" |
| **Chrome (Android)** | Menu (⋮) → "Add to Home screen" or "Install app" |
| **Safari (iOS)** | Share button (↑) → "Add to Home Screen" |
| **Edge** | Click (⊕) in address bar → "Install" |
| **Firefox** | Not supported natively, use as web app |

**Benefits of PWA installation:**
- ✅ Works offline — practice without internet
- ✅ Launches like a native app
- ✅ No app store needed
- ✅ Always up-to-date

---

## 🚀 Local Development

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
- **Storage:** LocalStorage for exercises & preferences
- **PWA:** Service Worker with Cache Management

## 🗺️ Roadmap

### ✅ Completed (v2.3.3)
- [x] **Performance Optimizations** with RAF-throttled mouse tracking
- [x] **Memoized React Components** for reduced re-renders
- [x] **Lazy Image Loading** with `loading="lazy"` attribute
- [x] **GPU-optimized CSS** with will-change hints
- [x] **Accessibility** with prefers-reduced-motion support

### ✅ Completed (v2.3.2)
- [x] **Audio Recording System** with waveform visualization
- [x] **Recording Metronome** with hi-hat sound and pre-roll countdown
- [x] **Editable Recording Metadata** (name, BPM, key, notes)
- [x] **Recording Library** with IndexedDB storage
- [x] **Custom Exercise Builder** with visual fretboard editor
- [x] **Exercise import/export** as JSON files
- [x] **Technique selection** per note (Slap, Pop, Hammer, etc.)
- [x] **Fullscreen practice mode** with integrated controls
- [x] **Keyboard shortcuts** (Space: play/pause, ESC: exit)
- [x] **Mobile landscape optimization** for practice sessions
- [x] **Multi-artist exercise library** (Patitucci, Wooten, Flea, Jaco)

### 🔜 Upcoming (v2.4.0)
- [ ] Scale patterns (Major, Minor, Modes)
- [ ] Audio mixing (mic + exercise audio)
- [ ] Community exercise sharing
- [ ] Exercise collections/folders

## 💬 Feedback & Contact

We'd love to hear from you! Help us improve Bass Academy:

| Channel | Link |
|---------|------|
| 📝 **Feedback Form** | [Submit Feedback](https://forms.gle/zGTSzwywuzvfadHf7) |
| 📧 **Email** | [bassacademy.contact@gmail.com](mailto:bassacademy.contact@gmail.com) |
| 📱 **WhatsApp** | [+54 9 11 3066-6369](https://wa.me/5491130666369) |
| 🐛 **Report Bug** | [GitHub Issues](https://github.com/juliandeveloper05/Bass-Academy-Interactive-Bass-Training/issues) |
| 💡 **Feature Request** | [GitHub Discussions](https://github.com/juliandeveloper05/Bass-Academy-Interactive-Bass-Training/discussions) |

## 🎓 Resources

- [John Patitucci Official](https://johnpatitucci.com/)
- [Victor Wooten Official](https://victorwooten.com/)
- [Web Audio API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## �‍💻 Author

<div align="center">

**Julian Javier Soto** — Senior Software Engineer

[![GitHub](https://img.shields.io/badge/GitHub-juliandeveloper05-181717?style=for-the-badge&logo=github)](https://github.com/juliandeveloper05)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Julian_Soto-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/full-stack-julian-soto/)
[![Portfolio](https://img.shields.io/badge/Portfolio-juliansoto-C9A554?style=for-the-badge&logo=vercel)](https://juliansoto-portfolio.vercel.app/es)

</div>

## �📄 License

MIT © 2026 Julian Javier Soto

---

<div align="center">

**Made with ❤️ for bass players by [Julian Soto](https://github.com/juliandeveloper05)**

**Bass Academy · 2026 · v2.3.3**

</div>