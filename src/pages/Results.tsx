import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle2, RefreshCw, Play, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // Default 2 minutes
  const [videoUrl, setVideoUrl] = useState<string>("");
  
  // Mock results - in a real app, this would come from actual analysis
  const isDeepfake = Math.random() > 0.5;
  const authenticityScore = isDeepfake ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 30) + 70;
  
  const detectedIssues = isDeepfake ? [
    { time: "0:15-0:23", issue: "Face warping detected", severity: "high", startTime: 15, endTime: 23 },
    { time: "0:30-0:45", issue: "AI-generated voice segment", severity: "high", startTime: 30, endTime: 45 },
    { time: "1:02-1:15", issue: "Lip-sync mismatch", severity: "medium", startTime: 62, endTime: 75 },
    { time: "1:45-1:58", issue: "Unnatural facial expressions", severity: "medium", startTime: 105, endTime: 118 },
  ] : [
    { time: "0:05-0:08", issue: "Minor compression artifacts", severity: "low", startTime: 5, endTime: 8 },
  ];

  // Handle video source from navigation state
  useEffect(() => {
    const state = location.state as { url?: string; file?: File } | null;
    if (state?.file) {
      const url = URL.createObjectURL(state.file);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (state?.url) {
      // For demo purposes, use a sample video since we can't fetch from social media
      setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    } else {
      // Default sample video
      setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    }
  }, [location.state]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const jumpToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${
      isDeepfake ? "bg-[hsl(0_84%_10%)]" : "bg-[hsl(158_64%_8%)]"
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={`absolute w-full h-full ${
          isDeepfake 
            ? "bg-gradient-to-br from-neon-red/20 via-background to-destructive/20" 
            : "bg-gradient-to-br from-neon-green/20 via-background to-neon-cyan/20"
        }`} />
        <div className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isDeepfake ? "bg-neon-red/20" : "bg-neon-green/20"
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

        {/* Results Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDeepfake 
              ? "bg-neon-red/20 shadow-[0_0_50px_hsl(var(--neon-red)/0.5)]" 
              : "bg-neon-green/20 shadow-[0_0_50px_hsl(var(--neon-green)/0.5)]"
          }`}>
            {isDeepfake ? (
              <AlertTriangle className="w-16 h-16 text-neon-red" />
            ) : (
              <CheckCircle2 className="w-16 h-16 text-neon-green" />
            )}
          </div>
          
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${
            isDeepfake ? "text-neon-red" : "text-neon-green"
          }`}>
            {isDeepfake ? "Deepfake Detected" : "Content Authentic"}
          </h1>
          
          <p className="text-xl text-foreground/80">
            {isDeepfake 
              ? "AI manipulation has been identified in this content" 
              : "No significant manipulation detected"}
          </p>
        </div>

        {/* Authenticity Score */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in delay-200">
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Authenticity Score</h2>
              <span className={`text-4xl font-bold ${
                isDeepfake ? "text-neon-red" : "text-neon-green"
              }`}>
                {authenticityScore}%
              </span>
            </div>
            <Progress 
              value={authenticityScore} 
              className="h-4"
            />
            <p className="text-sm text-muted-foreground mt-4">
              {isDeepfake 
                ? "This content shows strong indicators of AI manipulation. Review the timeline below for specific segments."
                : "This content appears to be authentic with minimal signs of manipulation."}
            </p>
          </div>
        </div>

        {/* Video Player */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in delay-200">
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-accent/20">
            <h2 className="text-2xl font-bold text-foreground mb-6">Video Playback</h2>
            
            <div className="relative rounded-lg overflow-hidden bg-black mb-4">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full aspect-video"
                controls
              />
            </div>

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
                {formatTime(currentTime)} / {formatTime(duration)}
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
                        className={`absolute h-full transition-all duration-300 cursor-pointer ${
                          issue.severity === "high" 
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
                  className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-lg cursor-pointer text-left ${
                    issue.severity === "high"
                      ? "bg-neon-red/10 border-neon-red/30 hover:border-neon-red/50 hover:bg-neon-red/20"
                      : issue.severity === "medium"
                      ? "bg-secondary/10 border-secondary/30 hover:border-secondary/50 hover:bg-secondary/20"
                      : "bg-primary/10 border-primary/30 hover:border-primary/50 hover:bg-primary/20"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    issue.severity === "high"
                      ? "bg-neon-red shadow-[0_0_10px_hsl(var(--neon-red)/0.8)]"
                      : issue.severity === "medium"
                      ? "bg-secondary shadow-[0_0_10px_hsl(var(--secondary)/0.8)]"
                      : "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.8)]"
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm text-foreground">{issue.time}</span>
                      <span className={`text-xs font-semibold uppercase ${
                        issue.severity === "high"
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
