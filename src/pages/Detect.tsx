import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Upload, Link as LinkIcon, Scan, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Detect = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Navigate to results when progress hits 100 — moved OUT of setProgress to avoid side-effects in state updater
  useEffect(() => {
    if (progress >= 100 && isAnalyzing) {
      const timer = setTimeout(() => {
        navigate("/results", { state: { url, file: selectedFile } });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, isAnalyzing]);

  const handleAnalyze = () => {
    if (!url && !selectedFile) {
      toast.error("Please provide a video URL or upload a file");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis progress — only updates state, no side effects here
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error("File size must be less than 100MB");
        return;
      }
      setSelectedFile(file);
      setUrl(""); // Clear URL when file is selected
      toast.success(`Selected: ${file.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Detect Deepfakes
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload your content or paste a link from social media
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Input Section */}
            <div className="space-y-6 animate-fade-in">
              {/* URL Input */}
              <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Paste Link</h2>
                </div>
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or any social media link"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (e.target.value) setSelectedFile(null); // Clear file when URL is typed
                  }}
                  className="bg-background/50 border-primary/30 focus:border-primary text-lg h-14"
                  disabled={isAnalyzing}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  Supports: YouTube, Facebook, Vimeo, Twitch, DailyMotion, or Direct Video Link (.mp4)
                </p>
              </div>

              {/* File Upload */}
              <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-secondary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Upload File</h2>
                </div>
                <label className="block">
                  <input
                    type="file"
                    accept="video/*,audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isAnalyzing}
                  />
                  <Button
                    variant="neon"
                    className="w-full h-14"
                    asChild
                    disabled={isAnalyzing}
                  >
                    <span className="cursor-pointer">
                      <Upload className="mr-2 h-5 w-5" />
                      {selectedFile ? selectedFile.name : "Choose Video or Audio File"}
                    </span>
                  </Button>
                </label>
                <p className="text-sm text-muted-foreground mt-3">
                  Supports: MP4, MOV, AVI, MP3, WAV (Max 100MB)
                </p>
              </div>

              {/* Analyze Button */}
              <Button
                variant="hero"
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!url && !selectedFile)}
                className="w-full h-16 text-xl"
              >
                <Scan className="mr-3 h-6 w-6" />
                {isAnalyzing ? "Analyzing..." : "Start Analysis"}
              </Button>
            </div>

            {/* Right Side - Preview/Analysis */}
            <div className="animate-fade-in delay-200">
              <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-accent/20 h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                {!isAnalyzing ? (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <Scan className="w-16 h-16 text-accent animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Ready to Scan</h3>
                    <p className="text-muted-foreground">
                      Provide a video link or upload a file to begin analysis
                    </p>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="text-center mb-8">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center relative">
                        <Scan className="w-16 h-16 text-primary animate-glow-pulse" />
                        <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
                      </div>
                      <h3 className="text-3xl font-bold mb-3 text-foreground">Analyzing Content</h3>
                      <p className="text-muted-foreground">
                        Scanning for deepfake patterns...
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-4">
                      <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 rounded-full shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                          {progress}%
                        </span>
                      </div>
                    </div>

                    {/* Scanning Lines Animation */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 animate-scan" />
                      <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-30 animate-scan" style={{ animationDelay: "1s" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detect;
