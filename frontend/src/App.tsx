import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index"; // Your home page
import Navbar from "./components/Navbar"; // Updated Navbar
import Dashboard from "./components/Dashboard"; // The new Dashboard component
import ProductInventory from './components/ProductInventory';

const queryClient = new QueryClient();

// Component to provide useNavigate access to AppContent
const AppRouterWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const shopInfo = localStorage.getItem("shopInfo");
    if (shopInfo) {
      setIsAuthenticated(true);
      console.log("Auto-login using saved shopInfo");
    }
  }, []);

  // Handler passed to LoginRegisterModal via Navbar
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    // 1. Close the modal (handled by the Navbar component's state, but often done here too)
    // 2. Navigate to the dashboard
    const shopInfo = JSON.parse(localStorage.getItem("shopInfo") || "{}");
    navigate('/dashboard',{ state: { shop: shopInfo } });
    console.log("Authentication successful, navigating to Dashboard.");
  };

  const handleSignOut = () => {
    localStorage.removeItem("shopInfo");
    setIsAuthenticated(false);
    navigate('/');
    console.log("Signed out, navigating to Home.");
  };

  return (
    <>
      {/* Navbar is outside Routes so it persists across pages */}
      <Navbar
        isAuthenticated={isAuthenticated}
        onAuthSuccess={handleAuthSuccess}
        onSignOut={handleSignOut}
      />
      <Routes>
        <Route path="/" element={<Index />} />

        {/* Dashboard Route - Only accessible if isAuthenticated is true */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Index />} // Redirects to Home if not authenticated
        />

        <Route
          path="/inventory"
          element={isAuthenticated ? <ProductInventory /> : <Index />}
        />

        {/* Example placeholder routes (You should implement components for these) */}
        <Route path="/roadmap" element={<div className='p-8'>Roadmap Page</div>} />
        <Route path="/pricing" element={<div className='p-8'>Pricing Page</div>} />
        <Route path="/contact" element={<div className='p-8'>Contact Page</div>} />
        <Route path="/blog" element={<div className='p-8'>Blog Page</div>} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/meenicode">
        <AppRouterWrapper />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;