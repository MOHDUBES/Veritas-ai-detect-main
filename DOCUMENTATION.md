# 📘 Veritas AI Detect — Project Documentation

**Version:** 1.0.0
**Date:** February 2026
**Author:** MOHDUBES
**GitHub:** https://github.com/MOHDUBES/Veritas-ai-detect-main

---

## 📌 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Purpose & Objectives](#2-purpose--objectives)
3. [System Architecture](#3-system-architecture)
4. [Tech Stack & Dependencies](#4-tech-stack--dependencies)
5. [Project Structure](#5-project-structure)
6. [Pages & Features](#6-pages--features)
   - [Homepage (Index)](#61-homepage-index)
   - [Detect Page](#62-detect-page)
   - [Results Page](#63-results-page)
7. [Key Components](#7-key-components)
8. [Video Detection Logic](#8-video-detection-logic)
9. [YouTube Integration](#9-youtube-integration)
10. [User Flow](#10-user-flow)
11. [Installation & Setup](#11-installation--setup)
12. [Known Limitations](#12-known-limitations)
13. [Future Improvements](#13-future-improvements)

---

## 1. Project Overview

**Veritas AI Detect** is a web-based application designed to analyze video content and detect whether it has been artificially generated or manipulated using AI tools such as Deepfake technology, Midjourney, Seedance, Sora, RunwayML, and similar platforms.

The platform provides users with:
- A clean and modern UI to submit video content (via URL or file upload)
- An animated analysis simulation
- A detailed results page with authenticity scores, timeline analysis, and detected artifact breakdown

---

## 2. Purpose & Objectives

### Problem Statement
With the rise of AI-generated media (deepfakes, AI videos, synthetic voices), it has become increasingly difficult for the average person to distinguish real content from AI-generated content.

### Objectives
- ✅ Provide a simple interface for users to check any video for AI manipulation signs
- ✅ Support both **YouTube/URL-based** videos and **locally uploaded** video/audio files
- ✅ Display results in a clear, visually compelling format
- ✅ Show an **interactive timeline** of detected manipulation segments
- ✅ Embed real YouTube playback with actual video duration using the YouTube IFrame API

### Target Users
- Journalists verifying video authenticity
- General public wanting to verify social media content
- Students learning about deepfake detection
- Researchers and educators in the AI/media space

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (React + Vite)             │
│                                                      │
│  ┌──────────┐    ┌──────────────┐    ┌────────────┐ │
│  │  Index   │───▶│   Detect     │───▶│  Results   │ │
│  │  Page    │    │   Page       │    │  Page      │ │
│  └──────────┘    └──────────────┘    └────────────┘ │
│                         │                   │        │
│                  ┌──────▼──────┐    ┌───────▼─────┐ │
│                  │ URL Input   │    │ YouTube     │ │
│                  │ File Upload │    │ IFrame API  │ │
│                  └─────────────┘    │ ReactPlayer │ │
│                                     │ Native Video│ │
│                                     └─────────────┘ │
└─────────────────────────────────────────────────────┘

Note: No backend server — all processing is client-side (demo mode)
```

---

## 4. Tech Stack & Dependencies

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.x | Core UI framework |
| **TypeScript** | 5.x | Type safety across all components |
| **Vite** | 5.x | Build tool and development server |
| **Tailwind CSS** | 3.x | Utility-first CSS styling |
| **shadcn/ui** | Latest | Pre-built accessible UI components |
| **React Router DOM** | 6.x | Client-side page routing |
| **ReactPlayer** | 2.x | Plays direct video URLs (mp4, Vimeo, etc.) |
| **YouTube IFrame API** | Native | Real YouTube playback + duration tracking |
| **Lucide React** | Latest | Icon library |
| **Sonner** | Latest | Toast notification system |

---

## 5. Project Structure

```
veritas-ai-detect-main/
│
├── public/                     # Static public assets
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── progress.tsx
│   │
│   ├── pages/
│   │   ├── Index.tsx           # Landing / Home page
│   │   ├── Detect.tsx          # Video input & analysis trigger
│   │   ├── Results.tsx         # Detection results display
│   │   └── NotFound.tsx        # 404 error page
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── App.tsx                 # Root app with routes
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles & CSS variables
│
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── README.md                   # Project overview
└── DOCUMENTATION.md            # This file
```

---

## 6. Pages & Features

### 6.1 Homepage (Index)

**File:** `src/pages/Index.tsx`

The landing page introduces the platform to the user. It contains:
- A hero section with animated title and tagline
- Feature highlights (speed, accuracy, supported formats)
- A prominent **"Start Detection"** call-to-action button
- Animated background gradients for visual appeal

**Navigation:** Routes to `/detect` on button click.

---

### 6.2 Detect Page

**File:** `src/pages/Detect.tsx`

This is where the user submits content for analysis. It has two input methods:

#### A. URL Input (Paste Link)
- Accepts YouTube URLs, direct `.mp4` links, Vimeo, etc.
- When a URL is typed, any selected file is automatically cleared (prevents conflict)
- Placeholder guides users with example formats

#### B. File Upload
- Accepts: MP4, MOV, AVI, MP3, WAV
- Maximum file size: **100MB**
- When a file is selected, the URL field is automatically cleared
- Shows the selected filename on the button

#### Analysis Trigger
- **"Start Analysis"** button is disabled until either a URL or file is provided
- On click, a simulated progress bar animates from 0% to 100% over ~3 seconds
- On completion, navigates to `/results` passing the URL or File via React Router `location.state`

---

### 6.3 Results Page

**File:** `src/pages/Results.tsx`

The most feature-rich page. It displays the analysis outcome.

#### A. Main Verdict Banner
A large, color-coded banner at the top:
- 🔴 **Red theme** → "⚠️ AI / Deepfake Content Detected"
- 🟢 **Green theme** → "✅ Content Appears Authentic"

The entire page background color also changes accordingly.

#### B. Authenticity Score
- Large percentage number (0–100%)
- Animated progress bar
- Descriptive text based on score range:
  - `< 40%` → Very low authenticity
  - `40–65%` → Moderate
  - `> 65%` → High authenticity

#### C. Video Playback
Three rendering modes based on input type:
1. **YouTube URL** → YouTube IFrame Player API (real player, real controls)
2. **Direct URL / Vimeo** → ReactPlayer component
3. **Uploaded File** → Native HTML5 `<video>` element with blob URL

#### D. Interactive Timeline Analysis
- Visual timeline bar spanning the full video duration
- Colored segments showing where manipulation was detected:
  - 🔴 **Red** = High severity issues
  - 🟠 **Orange/Secondary** = Medium severity
  - 🔵 **Blue/Primary** = Low severity
- **Clicking** any segment jumps the video to that exact timestamp
- Issue cards below list each artifact with timestamp, description, and severity

---

## 7. Key Components

### Button (`src/components/ui/button.tsx`)
Extended shadcn button with custom variants:
- `variant="neon"` — glowing neon effect
- `variant="hero"` — large gradient button for CTAs
- `variant="ghost"` — transparent background

### Progress (`src/components/ui/progress.tsx`)
Standard progress bar used for:
- Analysis progress animation on Detect page
- Authenticity score display on Results page

### Input (`src/components/ui/input.tsx`)
Styled text input used for the URL paste field.

---

## 8. Video Detection Logic

> **Note:** The current implementation uses a simulated detection algorithm for demonstration purposes. A real implementation would send the video to a backend ML model.

### Detection Algorithm (Client-side Simulation)

**File:** `src/pages/Results.tsx` — `getAnalysisResult()` function

The mock detection uses a **deterministic hash-based approach** so the same input always produces the same result:

```
Input (URL or Filename)
        │
        ▼
┌─────────────────────────────┐
│  1. Keyword Check           │  ← Checks for AI tool names in URL
│  "seedance", "midjourney",  │     → Always flags as DEEPFAKE
│  "sora", "runway", etc.     │
└─────────────┬───────────────┘
              │ No keyword match
              ▼
┌─────────────────────────────┐
│  2. URL vs File Check       │
│  URL pasted?  →  DEEPFAKE   │  ← All URL pastes = AI detected
│  File upload? →  AUTHENTIC  │  ← Uploaded files = mostly clean
└─────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐
│  3. Score Generation        │
│  hashString(seed)           │  ← Consistent score per input
│  URL: 15–44% (low)          │
│  File: 78–97% (high)        │
└─────────────────────────────┘
```

### Keyword Detection List
The following AI tool keywords trigger automatic deepfake detection:
`seedance`, `midjourney`, `sora`, `runway`, `pika`, `stable diffusion`, `ai generated`, `ai-generated`, `ai film`, `ai short`, `ai man`, `deepfake`, `kling`, `gen-2`, `luma`, `hailuo`, `synthesia`, `heygen`, `d-id`

---

## 9. YouTube Integration

### YouTube IFrame Player API

When a YouTube URL is pasted, the app:

1. **Extracts the Video ID** using regex:
   ```
   Supports: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID
   ```

2. **Loads the YouTube IFrame API** script dynamically (only once):
   ```html
   <script src="https://www.youtube.com/iframe_api"></script>
   ```

3. **Creates a `YT.Player` instance** on a `<div id="yt-player-div">` element:
   - `onReady` → Gets the **real video duration** via `player.getDuration()`
   - `onStateChange` → Tracks play/pause state; starts a 500ms interval to update `currentTime`

4. **Seek support** — Timeline clicks call `player.seekTo(seconds, true)` for precise navigation

### Benefits over plain `<iframe>`
| Feature | Plain iframe | IFrame API |
|---|---|---|
| Real duration | ❌ Not accessible | ✅ `getDuration()` |
| Current time tracking | ❌ Not accessible | ✅ `getCurrentTime()` |
| Seek to timestamp | ❌ Not possible | ✅ `seekTo()` |
| Play/Pause detection | ❌ Not possible | ✅ `onStateChange` |

---

## 10. User Flow

```
User visits app
      │
      ▼
┌─────────────┐
│  Home Page  │ ──► Click "Start Detection"
└─────────────┘
      │
      ▼
┌─────────────┐
│ Detect Page │ ──► Paste YouTube URL  ─┐
│             │                         ├──► Click "Start Analysis"
│             │ ──► Upload video file  ─┘
└─────────────┘
      │
      │ (Progress bar animates 0% → 100%)
      │ (Navigates with video data in state)
      ▼
┌─────────────────────────────────────────┐
│              Results Page               │
│                                         │
│  [Main Verdict Banner — Red or Green]   │
│  [Authenticity Score + Progress Bar]    │
│  [Video Player — YouTube/Native]        │
│  [Interactive Timeline with segments]  │
│  [Detected Artifacts list]              │
│  [Analyze Another Video button]         │
└─────────────────────────────────────────┘
```

---

## 11. Installation & Setup

### Requirements
- Node.js v18 or higher
- npm v9 or higher
- Internet connection (for YouTube IFrame API and CDN assets)

### Steps

```bash
# Clone the repository
git clone https://github.com/MOHDUBES/Veritas-ai-detect-main.git

# Enter project directory
cd Veritas-ai-detect-main

# Install all dependencies
npm install

# Start local development server
npm run dev
```

App runs at: **http://localhost:5173**

### Build for Production
```bash
npm run build
```
Output goes to the `dist/` folder — ready to deploy on Netlify, Vercel, GitHub Pages, etc.

---

## 12. Known Limitations

| Limitation | Reason | Workaround |
|---|---|---|
| No real AI detection | No ML backend | Uses simulated scoring |
| YouTube duration shows "Loading..." | IFrame API loads asynchronously | Wait 1–2 seconds after page load |
| Instagram/TikTok links not supported | These platforms block embedding | Upload the file directly instead |
| Max file size 100MB | Browser memory limit | Compress video before uploading |
| Results are demo only | For UI/UX demonstration | Backend model integration needed for production |

---

## 13. Future Improvements

- [ ] **Real AI Detection Backend** — Integrate a Python/FastAPI backend with a trained deepfake detection model (e.g., FaceForensics++, XceptionNet)
- [ ] **Video Frame Analysis** — Extract and analyze individual video frames for manipulation
- [ ] **Audio Deepfake Detection** — Analyze voice synthesis patterns in audio tracks
- [ ] **Report Export** — Allow users to download a PDF report of the analysis
- [ ] **History/Dashboard** — Save and review past analyses
- [ ] **Browser Extension** — Detect deepfakes directly while browsing social media
- [ ] **Multi-language Support** — UI in Urdu, Hindi, Arabic, and other languages
- [ ] **Batch Processing** — Analyze multiple videos at once

---

*This documentation was written for the Veritas AI Detect project — February 2026.*
