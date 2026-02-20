import { useState, useRef, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle2, RefreshCw, Play, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reactPlayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ytPlayerRef = useRef<any>(null);
  const ytTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // Will be set by actual video
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isUrlBased, setIsUrlBased] = useState(false);
  const [playError, setPlayError] = useState(false);

  // --- Seeded deterministic mock analysis ---
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return (hash % 1000) / 1000;
  };

  const AI_KEYWORDS = [
    "seedance", "midjourney", "sora", "runway", "pika", "stable diffusion",
    "ai generated", "ai-generated", "ai film", "ai short", "ai man",
    "deepfake", "deep fake", "kling", "gen-2", "gen2", "luma", "hailuo",
    "animate", "ai video", "synthesia", "heygen", "d-id"
  ];

  const getAnalysisResult = () => {
    const state = location.state as { url?: string; file?: File } | null;
    const seed = state?.url ?? state?.file?.name ?? "default-sample";
    const seedLower = seed.toLowerCase();
    const isUrlPaste = !!state?.url;

    // Keyword match → deepfake with very low score
    const keywordMatch = AI_KEYWORDS.some((kw) => seedLower.includes(kw));
    if (keywordMatch) {
      const score = Math.floor(hashString(seed + "score") * 20) + 5; // 5–24%
      return { isDeepfake: true, authenticityScore: score };
    }

    // ANY pasted URL → ALWAYS Deepfake Detected (red) — consistent demo behavior
    if (isUrlPaste) {
      const score = Math.floor(hashString(seed + "b") * 30) + 15; // 15–44%
      return { isDeepfake: true, authenticityScore: score };
    }

    // Uploaded files → mostly authentic (green)
    const h = hashString(seed);
    const isDeepfake = h < 0.25;
    const authenticityScore = isDeepfake
      ? Math.floor(hashString(seed + "c") * 30) + 10
      : Math.floor(hashString(seed + "c") * 20) + 78;
    return { isDeepfake, authenticityScore };
  };

  const [analysisResult] = useState(() => getAnalysisResult());
  const { isDeepfake, authenticityScore } = analysisResult;

  // Format time helper
  const fmt = (s: number) => {
    if (!s || s <= 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Detected issues calculated proportionally from ACTUAL video duration
  const detectedIssues = useMemo(() => {
    if (!duration || duration <= 0) return [];

    if (!isDeepfake) {
      const s = duration * 0.08;
      const e = duration * 0.18;
      return [{ time: `${fmt(s)}-${fmt(e)}`, issue: "Minor compression artifacts", severity: "low", startTime: s, endTime: e }];
    }

    return [
      { time: `${fmt(duration * 0.10)}-${fmt(duration * 0.20)}`, issue: "Face warping detected", severity: "high", startTime: duration * 0.10, endTime: duration * 0.20 },
      { time: `${fmt(duration * 0.25)}-${fmt(duration * 0.40)}`, issue: "AI-generated voice segment", severity: "high", startTime: duration * 0.25, endTime: duration * 0.40 },
      { time: `${fmt(duration * 0.50)}-${fmt(duration * 0.60)}`, issue: "Lip-sync mismatch", severity: "medium", startTime: duration * 0.50, endTime: duration * 0.60 },
      { time: `${fmt(duration * 0.75)}-${fmt(duration * 0.85)}`, issue: "Unnatural facial expressions", severity: "medium", startTime: duration * 0.75, endTime: duration * 0.85 },
    ];
  }, [isDeepfake, duration]);

  // Helper: extract YouTube video ID from any YouTube URL
  const getYouTubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const [isYouTube, setIsYouTube] = useState(false);
  const [youTubeId, setYouTubeId] = useState("");

  // Handle video source from navigation state
  useEffect(() => {
    setPlayError(false);
    setCurrentTime(0);
    setDuration(0);

    const state = location.state as { url?: string; file?: File } | null;
    let objectUrl: string | null = null;

    // Prioritize URL over file (URL takes precedence)
    if (state?.url) {
      const ytId = getYouTubeId(state.url);
      if (ytId) {
        // YouTube URL → use iframe embed directly (most reliable)
        setYouTubeId(ytId);
        setIsYouTube(true);
        setIsUrlBased(true);
        setVideoUrl(state.url);
      } else {
        // Other URLs (direct mp4, Vimeo, etc.) → use ReactPlayer
        setVideoUrl(state.url);
        setIsYouTube(false);
        setIsUrlBased(true);
      }
    } else if (state?.file) {
      // Uploaded file → use native video
      objectUrl = URL.createObjectURL(state.file);
      setVideoUrl(objectUrl);
      setIsYouTube(false);
      setIsUrlBased(false);
    } else {
      // Default sample video
      setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
      setIsYouTube(false);
      setIsUrlBased(true);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [location.state]);

  // YouTube IFrame Player API — loads real duration + tracks currentTime
  useEffect(() => {
    if (!isYouTube || !youTubeId) return;

    // Cleanup previous player & timer
    if (ytTimerRef.current) clearInterval(ytTimerRef.current);
    if (ytPlayerRef.current) {
      try { ytPlayerRef.current.destroy(); } catch { /* ignore */ }
      ytPlayerRef.current = null;
    }

    const initPlayer = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      ytPlayerRef.current = new YT.Player("yt-player-div", {
        videoId: youTubeId,
        playerVars: { autoplay: 0, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: any) => {
            const d = e.target.getDuration();
            if (d && d > 0) setDuration(d);
          },
          onStateChange: (e: any) => {
            const YTStates = (window as any).YT.PlayerState;
            if (e.data === YTStates.PLAYING) {
              setIsPlaying(true);
              ytTimerRef.current = setInterval(() => {
                const t = ytPlayerRef.current?.getCurrentTime?.() ?? 0;
                setCurrentTime(t);
                // Also refresh duration in case it wasn't ready on onReady
                const d = ytPlayerRef.current?.getDuration?.() ?? 0;
                if (d > 0) setDuration(d);
              }, 500);
            } else {
              setIsPlaying(false);
              if (ytTimerRef.current) { clearInterval(ytTimerRef.current); ytTimerRef.current = null; }
            }
          },
        },
      });
    };

    // Load YT API script if not already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById("yt-iframe-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (ytTimerRef.current) clearInterval(ytTimerRef.current);
    };
  }, [isYouTube, youTubeId]);

  // Native video handlers (for uploaded files)
  const handleNativeProgress = () => {
    if (playerRef.current) setCurrentTime(playerRef.current.currentTime);
  };
  const handleNativeDuration = () => {
    if (playerRef.current) setDuration(playerRef.current.duration);
  };

  // ReactPlayer handlers (for pasted URLs)
  const handleUrlProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };
  const handleUrlDuration = (d: number) => {
    setDuration(d);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const togglePlayPause = () => {
    if (!isUrlBased && playerRef.current) {
      isPlaying ? playerRef.current.pause() : playerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const jumpToTime = (time: number) => {
    if (isYouTube && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(time, true);
      ytPlayerRef.current.playVideo();
      setIsPlaying(true);
    } else if (isUrlBased && reactPlayerRef.current) {
      reactPlayerRef.current.seekTo(time, "seconds");
      setIsPlaying(true);
    } else if (playerRef.current) {
      playerRef.current.currentTime = time;
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${isDeepfake ? "bg-[hsl(0_84%_10%)]" : "bg-[hsl(158_64%_8%)]"
      }`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={`absolute w-full h-full ${isDeepfake
          ? "bg-gradient-to-br from-neon-red/20 via-background to-destructive/20"
          : "bg-gradient-to-br from-neon-green/20 via-background to-neon-cyan/20"
          }`} />
        <div className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDeepfake ? "bg-neon-red/20" : "bg-neon-green/20"
          }`} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/detect")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Detection
          </Button>
          <Button
            variant="neon"
            onClick={() => navigate("/detect")}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Another Video
          </Button>
        </div>

        {/* Results Header — Main Verdict */}
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
          <div className={`rounded-2xl p-8 border-2 text-center ${isDeepfake
            ? "bg-neon-red/10 border-neon-red/60 shadow-[0_0_60px_hsl(var(--neon-red)/0.25)]"
            : "bg-neon-green/10 border-neon-green/60 shadow-[0_0_60px_hsl(var(--neon-green)/0.25)]"
            }`}>
            <div className={`w-24 h-24 mx-auto mb-5 rounded-full flex items-center justify-center ${isDeepfake
              ? "bg-neon-red/20 shadow-[0_0_40px_hsl(var(--neon-red)/0.5)]"
              : "bg-neon-green/20 shadow-[0_0_40px_hsl(var(--neon-green)/0.5)]"
              }`}>
              {isDeepfake
                ? <AlertTriangle className="w-12 h-12 text-neon-red" />
                : <CheckCircle2 className="w-12 h-12 text-neon-green" />}
            </div>

            <h1 className={`text-4xl md:text-5xl font-black mb-3 tracking-tight ${isDeepfake ? "text-neon-red" : "text-neon-green"}`}>
              {isDeepfake ? "⚠️ AI / Deepfake Content Detected" : "✅ Content Appears Authentic"}
            </h1>

            <p className={`text-lg font-semibold mb-2 ${isDeepfake ? "text-red-300" : "text-green-300"}`}>
              {isDeepfake
                ? "This video shows strong signs of AI generation or digital manipulation."
                : "No significant AI manipulation was detected in this content."}
            </p>
            <p className="text-sm text-foreground/60">
              {isDeepfake
                ? "Possible use of tools like Midjourney, Seedance, Sora, RunwayML, or similar AI video generators."
                : "This content matches patterns of real, unaltered media."}
            </p>
          </div>
        </div>

        {/* Authenticity Score */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in delay-200">
          {/* Score card */}
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-6 border border-primary/20">
            <h2 className="text-xl font-bold text-foreground mb-4">Authenticity Score</h2>
            <div className="flex items-end gap-3 mb-4">
              <span className={`text-6xl font-black ${isDeepfake ? "text-neon-red" : "text-neon-green"}`}>
                {authenticityScore}%
              </span>
              <span className="text-muted-foreground mb-2 text-sm">confidence</span>
            </div>
            <Progress value={authenticityScore} className="h-3 mb-3" />
            <p className="text-xs text-muted-foreground">
              {authenticityScore < 40
                ? "Very low authenticity — high probability of AI generation."
                : authenticityScore < 65
                  ? "Moderate authenticity — some manipulation indicators found."
                  : "High authenticity — content appears largely genuine."}
            </p>
          </div>
        </div>

        {/* Video Player */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in delay-200">
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-accent/20">
            <h2 className="text-2xl font-bold text-foreground mb-6">Video Playback</h2>

            {/* Hybrid Video Player */}
            <div className="relative w-full bg-black rounded-lg overflow-hidden mb-4 shadow-lg">
              {videoUrl ? (
                isYouTube && youTubeId ? (
                  // YouTube → IFrame Player API div (API replaces this div with the real player)
                  <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
                    <div
                      id="yt-player-div"
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    />
                  </div>
                ) : isUrlBased ? (
                  // ReactPlayer for other URLs (Vimeo, direct mp4 links, etc.)
                  <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
                    <ReactPlayer
                      ref={reactPlayerRef}
                      url={videoUrl}
                      width="100%"
                      height="100%"
                      controls={true}
                      playing={isPlaying}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      onProgress={handleUrlProgress as (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void}
                      onDuration={handleUrlDuration}
                      onPlay={handlePlay}
                      onPause={handlePause}
                      onError={() => {
                        console.error("URL video playback error");
                        setPlayError(true);
                      }}
                    />
                  </div>
                ) : (
                  // Native video for uploaded files (blob URLs)
                  <video
                    ref={playerRef}
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg"
                    style={{ maxHeight: "480px", minHeight: "240px" }}
                    onTimeUpdate={handleNativeProgress}
                    onLoadedMetadata={handleNativeDuration}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onError={() => {
                      console.error("File video playback error");
                      setPlayError(true);
                    }}
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-60">
                  <p className="text-white/50 text-sm">Loading video...</p>
                </div>
              )}
            </div>

            {/* YouTube badge */}
            {isYouTube && (
              <div className="flex items-center gap-2 mb-4 px-1">
                <span className="inline-flex items-center gap-1.5 bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z" /></svg>
                  YouTube Video Detected
                </span>
                <span className="text-xs text-muted-foreground">Video is embedded directly from YouTube</span>
              </div>
            )}

            {playError && (
              <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-4 mb-6 text-center animate-fade-in">
                <p className="text-destructive font-semibold">
                  Unable to play this video.
                </p>
                <p className="text-sm text-foreground/80 mt-1">
                  The link might be invalid, private, or from an unsupported platform (like Instagram/TikTok).
                  Please try a YouTube link or upload a file directly.
                </p>
              </div>
            )}

            {/* Custom play button overlay (optional visual enhancement) */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="neon"
                size="lg"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Play
                  </>
                )}
              </Button>
              <span className="text-foreground font-mono text-lg">
                {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "Loading..."}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Analysis */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in delay-300">
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-secondary/20">
            <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Timeline Analysis</h2>
            <p className="text-muted-foreground mb-4">Click on any highlighted segment to jump to that timestamp</p>

            {/* Interactive Video Timeline */}
            <div className="bg-background/50 rounded-lg p-6 mb-6">
              <div className="relative h-24 bg-muted/30 rounded overflow-hidden cursor-pointer">
                {/* Progress indicator */}
                <div
                  className="absolute top-0 left-0 h-full w-1 bg-foreground shadow-[0_0_10px_hsl(var(--foreground)/0.8)] z-20 transition-all duration-100"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />

                {/* Timeline markers (clickable) */}
                <div className="absolute inset-0 flex">
                  {detectedIssues.map((issue, index) => {
                    const position = (issue.startTime / duration) * 100;
                    const width = ((issue.endTime - issue.startTime) / duration) * 100;

                    return (
                      <button
                        key={index}
                        onClick={() => jumpToTime(issue.startTime)}
                        className={`absolute h-full transition-all duration-300 cursor-pointer ${issue.severity === "high"
                          ? "bg-neon-red/50 hover:bg-neon-red/70 hover:shadow-[0_0_20px_hsl(var(--neon-red)/0.6)]"
                          : issue.severity === "medium"
                            ? "bg-secondary/50 hover:bg-secondary/70 hover:shadow-[0_0_20px_hsl(var(--secondary)/0.6)]"
                            : "bg-primary/50 hover:bg-primary/70 hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
                          }`}
                        style={{
                          left: `${position}%`,
                          width: `${width}%`,
                        }}
                        title={`Jump to ${issue.time} - ${issue.issue}`}
                      />
                    );
                  })}
                </div>

                {/* Time markers */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2 text-xs text-muted-foreground pointer-events-none">
                  {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
                    <span key={fraction}>{formatTime(duration * fraction)}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Detected Issues List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Detected Artifacts</h3>
              {detectedIssues.map((issue, index) => (
                <button
                  key={index}
                  onClick={() => jumpToTime(issue.startTime)}
                  className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-lg cursor-pointer text-left ${issue.severity === "high"
                    ? "bg-neon-red/10 border-neon-red/30 hover:border-neon-red/50 hover:bg-neon-red/20"
                    : issue.severity === "medium"
                      ? "bg-secondary/10 border-secondary/30 hover:border-secondary/50 hover:bg-secondary/20"
                      : "bg-primary/10 border-primary/30 hover:border-primary/50 hover:bg-primary/20"
                    }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${issue.severity === "high"
                    ? "bg-neon-red shadow-[0_0_10px_hsl(var(--neon-red)/0.8)]"
                    : issue.severity === "medium"
                      ? "bg-secondary shadow-[0_0_10px_hsl(var(--secondary)/0.8)]"
                      : "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.8)]"
                    }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm text-foreground">{issue.time}</span>
                      <span className={`text-xs font-semibold uppercase ${issue.severity === "high"
                        ? "text-neon-red"
                        : issue.severity === "medium"
                          ? "text-secondary"
                          : "text-primary"
                        }`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-foreground mb-1">{issue.issue}</p>
                    <p className="text-xs text-muted-foreground">Click to jump to this segment</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center animate-fade-in delay-500">
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate("/detect")}
            className="text-lg"
          >
            Analyze Another Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
