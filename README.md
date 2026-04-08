# 🔍 Veritas AI Detect

> **An AI-powered deepfake & AI-generated content detection platform**

Veritas AI Detect is a modern web application that analyzes videos — both uploaded files and YouTube/social media links — to detect signs of AI generation, deepfaking, face manipulation, voice synthesis, and other digital manipulation techniques.

---

## 🌐 Live Demo

🔗 [GitHub Repository](https://github.com/MOHDUBES/Veritas-ai-detect-main)

### 📸 App Screenshots

![Home Page](docs/screenshot-home.png)
*Home Page Landing*

![Detect Page](docs/screenshot-detect.png)
*Input Selection (Link/Upload)*

![Analyzing](docs/screenshot-analyzing.png)
*AI Scan In Progress*

![Results Page](docs/screenshot-results.png)
*Detailed Results & Timeline*


---

## ✨ Features

- 🎥 **YouTube Link Detection** — Paste any YouTube URL and get instant AI analysis
- 📁 **File Upload Support** — Upload MP4, MOV, AVI, MP3, WAV (up to 100MB)
- 🔴 **Deepfake Detection** — Identifies AI-generated or manipulated content
- 📊 **Authenticity Score** — Visual percentage score showing content reliability
- 🗺️ **Interactive Timeline** — Clickable timeline showing exactly where manipulation was detected
- 🎬 **Real Video Playback** — Embedded YouTube player with real duration tracking via IFrame API
- ⚡ **Instant Results** — Fast analysis with animated progress feedback

---

## 👥 Project Team

- **Mohd Ubes** — [mohdubes.official@gmail.com](mailto:mohdubes.official@gmail.com)
- **Alfez** — [alfez.dev@gmail.com](mailto:alfez.dev@gmail.com)
- **Abhinav Gupta** — [abhinav.gupta@gmail.com](mailto:abhinav.gupta@gmail.com)

---

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Frontend UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **React Router** | Client-side routing |
| **ReactPlayer** | Video playback for direct URLs |
| **YouTube IFrame API** | Real YouTube duration & playback tracking |
| **Lucide React** | Icon library |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MOHDUBES/Veritas-ai-detect-main.git

# 2. Navigate into the project folder
cd Veritas-ai-detect-main

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📖 How to Use

1. **Go to the Detect page** from the homepage
2. **Option A — Paste a URL:**
   - Paste a YouTube link (e.g. `https://youtu.be/...`)
   - Click **Start Analysis**
3. **Option B — Upload a file:**
   - Click **Choose Video or Audio File**
   - Select your video (MP4, MOV, AVI, etc.)
   - Click **Start Analysis**
4. **View Results:**
   - See the **verdict** (AI Detected / Authentic)
   - Check the **Authenticity Score**
   - Explore the **Interactive Timeline** for specific manipulation timestamps
   - Click any timeline segment to **jump to that moment** in the video

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── Index.tsx        # Homepage / Landing page
│   ├── Detect.tsx       # Video input & analysis trigger
│   ├── Results.tsx      # Detection results & video player
│   └── NotFound.tsx     # 404 page
├── components/
│   └── ui/              # shadcn/ui components
└── main.tsx             # App entry point
```

---

## ⚠️ Disclaimer

> This project is a **demonstration / portfolio project**. The deepfake detection in its current form uses simulated analysis results for UI/UX purposes. Real deepfake detection would require a trained machine learning model served via a backend API (e.g. Python + TensorFlow/PyTorch).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
