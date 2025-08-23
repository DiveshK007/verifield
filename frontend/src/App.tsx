import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Datasets from "./pages/Datasets";
import Marketplace from "./pages/Marketplace";
import Earnings from "./pages/Earnings";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Insights from "./pages/Insights";
import Upload from "./pages/Upload";
import DatasetDetail from "./pages/DatasetDetail";
import AnimatedBackground from "./components/AnimatedBackground";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <AnimatedBackground />
        <BrowserRouter>
          <div className="flex min-h-screen relative z-10">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/datasets" element={<Datasets />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/earnings" element={<Earnings />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/dataset/:id" element={<DatasetDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
