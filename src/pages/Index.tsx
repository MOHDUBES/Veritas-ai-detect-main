import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Scan, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-deepfake.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-float" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            DeepScan AI
          </h1>
          <p className="text-2xl md:text-3xl text-foreground/80 font-semibold mb-4">
            Expose the Fake. Trust What's Real.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload or link any video to detect deepfake AI manipulation in seconds.
          </p>
        </header>

        {/* Hero Image */}
        <div className="max-w-5xl mx-auto mb-16 animate-fade-in delay-200">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_hsl(var(--primary)/0.3)] border-2 border-primary/30">
            <img 
              src={heroImage} 
              alt="AI Deepfake Detection Interface" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            
            {/* Scanning Animation Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-scan" />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-20 animate-fade-in delay-300">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => navigate("/detect")}
            className="text-xl px-12 py-8 h-auto"
          >
            <Scan className="mr-3 h-8 w-8" />
            Start Detecting
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in delay-500">
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Advanced Detection</h3>
            <p className="text-muted-foreground">
              Detect face swaps, GAN patterns, voice cloning, and lip-sync mismatches with cutting-edge AI.
            </p>
          </div>

          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-secondary/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--secondary)/0.3)]">
            <div className="w-16 h-16 mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Get results in seconds with real-time timeline analysis showing exactly where manipulation occurs.
            </p>
          </div>

          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]">
            <div className="w-16 h-16 mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <Scan className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Multi-Platform</h3>
            <p className="text-muted-foreground">
              Analyze content from YouTube, Instagram, TikTok, Facebook, Twitter, and more with a single click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
