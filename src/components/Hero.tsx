import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gray-900 text-white h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 z-0">
        {/* Placeholder for background animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-20"></div>
      </div>
      <div className="relative z-10 text-center p-8">
        <div className="mb-8">
          {/* Placeholder for hero animation */}
          <div className="w-64 h-64 mx-auto bg-gray-800 rounded-full"></div>
        </div>
        <h1 className="text-5xl font-bold mb-4">DeepScan AI</h1>
        <p className="text-xl mb-8">Expose the Fake. Trust What’s Real.</p>
        <p className="text-lg mb-8">
          Upload or link any video to detect deepfake AI manipulation in
          seconds.
        </p>
        <Link to="/detect">
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Start Detecting
          </Button>
        </Link>
      </div>
    </section>
  );
}
