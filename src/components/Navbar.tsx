
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-focusflow-blue font-bold text-xl">
              FocusFlow
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md font-medium ${
                location.pathname === '/' 
                  ? 'text-focusflow-blue border-b-2 border-focusflow-blue' 
                  : 'text-focusflow-mediumgray hover:text-focusflow-blue'
              }`}
            >
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md font-medium ${
                    location.pathname === '/dashboard' 
                      ? 'text-focusflow-blue border-b-2 border-focusflow-blue' 
                      : 'text-focusflow-mediumgray hover:text-focusflow-blue'
                  }`}
                >
                  Dashboard
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-focusflow-blue text-focusflow-blue hover:bg-focusflow-blue hover:text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md font-medium ${
                    location.pathname === '/login' 
                      ? 'text-focusflow-blue border-b-2 border-focusflow-blue' 
                      : 'text-focusflow-mediumgray hover:text-focusflow-blue'
                  }`}
                >
                  Login
                </Link>
                <Link to="/signup">
                  <Button className="bg-focusflow-blue text-white hover:bg-focusflow-blue/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md text-focusflow-mediumgray hover:text-focusflow-blue"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md font-medium ${
                location.pathname === '/' 
                  ? 'text-focusflow-blue bg-focusflow-gray' 
                  : 'text-focusflow-mediumgray hover:text-focusflow-blue hover:bg-focusflow-gray'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md font-medium ${
                    location.pathname === '/dashboard' 
                      ? 'text-focusflow-blue bg-focusflow-gray' 
                      : 'text-focusflow-mediumgray hover:text-focusflow-blue hover:bg-focusflow-gray'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md font-medium text-focusflow-mediumgray hover:text-focusflow-blue hover:bg-focusflow-gray"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded-md font-medium ${
                    location.pathname === '/login' 
                      ? 'text-focusflow-blue bg-focusflow-gray' 
                      : 'text-focusflow-mediumgray hover:text-focusflow-blue hover:bg-focusflow-gray'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`block px-3 py-2 rounded-md font-medium ${
                    location.pathname === '/signup' 
                      ? 'text-focusflow-blue bg-focusflow-gray' 
                      : 'text-focusflow-mediumgray hover:text-focusflow-blue hover:bg-focusflow-gray'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
