import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Subscriptions from "./pages/Subscriptions";
import VideoPlayer from "./pages/VideoPlayer";
import UploadVideo from "./pages/UploadVideo";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

function App() {
  return (
    <TooltipProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background text-text-primary">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="animate-fade-in">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/video/:id" element={<VideoPlayer />} />
                  <Route path="/upload" element={<UploadVideo />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
        <Toaster />
        <Sonner />
      </Router>
    </TooltipProvider>
  );
}

export default App;