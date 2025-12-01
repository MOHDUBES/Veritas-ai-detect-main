import { Link } from "react-router-dom";
import { Scan } from "lucide-react";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Scan className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-white">DeepScan AI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/detect"
            className="text-white hover:text-primary transition-colors"
          >
            Detect
          </Link>
          <Link
            to="/results"
            className="text-white hover:text-primary transition-colors"
          >
            Results
          </Link>
        </nav>
      </div>
    </header>
  );
}
