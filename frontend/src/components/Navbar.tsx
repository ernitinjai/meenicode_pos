// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import LoginRegisterModal from "./LoginRegisterModal"; // Adjust the path as needed

interface NavbarProps {
    isAuthenticated: boolean; // New prop to determine rendered buttons
    onAuthSuccess: () => void;
    onSignOut: () => void; // New prop for sign out
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onAuthSuccess, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState<'login' | 'register'>('login');
  
  const location = useLocation();

  // NOTE: Assuming Tailwind colors saas-orange, saas-black, saas-darkGray are defined
  const links = [
    { name: "Home", path: "/" },
    { name: "Roadmap", path: "/roadmap" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Function to handle opening the modal and setting the correct tab
  const handleAuthClick = (tab: 'login' | 'register') => {
    setInitialModalTab(tab);
    setIsModalOpen(true);
    setIsOpen(false); // Close the mobile menu if open
  };

  const renderLinks = (mobile = false) =>
    links.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        className={`${
          mobile ? "block px-3 py-2 text-base text-center" : "px-3 py-2 text-sm"
        } font-medium transition-colors ${
          isActive(link.path)
            ? "text-saas-orange"
            : "text-white hover:text-saas-orange"
        }`}
        onClick={() => mobile && setIsOpen(false)}
      >
        {link.name}
      </Link>
    ));

    const AuthButtons = (mobile: boolean) => (
        <>
            {isAuthenticated ? (
                // --- Authenticated Buttons ---
                <>
                    <Link
                        to="/dashboard"
                        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${
                            mobile ? 'justify-center border border-gray-500 text-gray-200' : 'border border-saas-orange text-saas-orange'
                        } rounded hover:opacity-80 transition`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    <button
                        onClick={onSignOut}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </>
            ) : (
                // --- Unauthenticated Buttons ---
                <>
                    <button
                        onClick={() => handleAuthClick('login')}
                        className="px-4 py-2 border border-saas-orange text-saas-orange rounded hover:bg-saas-orange hover:text-white transition"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => handleAuthClick('register')}
                        className="px-4 py-2 bg-saas-orange text-white rounded hover:bg-amber-500 transition"
                    >
                        Sign Up
                    </button>
                </>
            )}
        </>
    );

  return (
    <>
      <nav className="bg-saas-black bg-opacity-90 backdrop-blur-sm sticky top-0 z-50 border-b border-saas-darkGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-saas-orange to-amber-500 bg-clip-text text-transparent"
          >
            Meenicode
          </Link>

          {/* Centered links */}
          <div className="hidden md:flex space-x-6 mx-auto">{renderLinks()}</div>

          {/* Right buttons (Desktop) */}
          <div className="hidden md:flex space-x-2">
            {AuthButtons(false)}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded text-white"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-saas-darkGray px-3 pt-2 pb-3 space-y-3 text-center">
            {renderLinks(true)}
            <div className="flex flex-col space-y-3 mt-4 px-4">
                {AuthButtons(true)}
            </div>
          </div>
        )}
      </nav>

      {/* Render the Modal */}
      <LoginRegisterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialTab={initialModalTab}
        onAuthSuccess={onAuthSuccess} // 💡 PASSING THE SUCCESS HANDLER
      />
    </>
  );
};

export default Navbar;