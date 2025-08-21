import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Pretest from "./pages/Pretest";
import AssessmentStage from "./pages/AssessmentStage";
import StageResult from "./pages/StageResult";
import FinalResult from "./pages/FinalResult";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AssessmentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/pretest"
                element={
                  <ProtectedRoute>
                    <Pretest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment/:stage"
                element={
                  <ProtectedRoute>
                    <AssessmentStage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results/:stage"
                element={
                  <ProtectedRoute>
                    <StageResult />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results/final"
                element={
                  <ProtectedRoute>
                    <FinalResult />
                  </ProtectedRoute>
                }
              />

              {/* Friendly aliases for next-stage navigation */}
              <Route path="/milestone-a" element={<Navigate to="/assessment/stage2" replace />} />
              <Route path="/milestone-b" element={<Navigate to="/assessment/stage3" replace />} />
              <Route path="/final-result" element={<Navigate to="/results/final" replace />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AssessmentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
