import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const handleDarkModeToggle = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  // Close mobile menu when clicking outside
  const handleBackdropClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark transition-colors duration-500">
      {/* Navigation Bar */}
      {/* Backdrop */}
      <div 
        onClick={handleBackdropClick}
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none -z-10'
        }`}
      />

      <nav className="nav-modern relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl font-bold text-shimmer">CodeGuru</span>
              </div>
            </div>
            {/* Desktop Menu */}
          
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
             
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/signin" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-300 hover-lift">Sign In</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </div>
                {/* Dark mode toggle */}
                <button
                  onClick={handleDarkModeToggle}
                  className="ml-4 p-3 rounded-full glass dark:glass-dark hover:shadow-glow transition-all duration-300 hover-lift"
                  title="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.22a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.22 6.78a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-6.22-1.22a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm2.22-6.78a1 1 0 00-1.42-1.42l-.7.7a1 1 0 101.42 1.42l.7-.7zM10 6a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-3 rounded-xl glass dark:glass-dark hover:shadow-glow text-gray-700 dark:text-gray-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-300"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6">
                  {/* Icon for menu */}
                  <svg
                    className={`absolute inset-0 transform transition-transform duration-300 ease-in-out ${
                      isMobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {/* Icon for close */}
                  <svg
                    className={`absolute inset-0 transform transition-transform duration-300 ease-in-out ${
                      isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        

        {/* Mobile menu */}
        <div 
          className={`sm:hidden transition-all duration-300 ease-in-out transform ${
            isMobileMenuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2 glass-dark border-t border-white/10">
            <a href="#all" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:text-primary hover:bg-white/10 transition-all duration-200">All Problems</a>
            <a href="#easy" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:text-green-400 hover:bg-white/10 transition-all duration-200">Easy</a>
            <a href="#medium" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200">Medium</a>
            <a href="#hard" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:text-red-400 hover:bg-white/10 transition-all duration-200">Hard</a>
            <div className="pt-4 space-y-2 border-t border-white/10">
              <Link to="/signin" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:text-primary hover:bg-white/10 transition-all duration-200">Sign In</Link>
              <Link to="/signup" className="block px-4 py-3 rounded-xl text-base font-medium btn-primary text-center">Sign Up</Link>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className="w-full flex items-center justify-center mt-4 p-3 rounded-xl glass hover:bg-white/10 transition-all duration-300"
            >
              {darkMode ? (
                <span className="flex items-center text-yellow-400"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.22a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.22 6.78a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-6.22-1.22a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm2.22-6.78a1 1 0 00-1.42-1.42l-.7.7a1 1 0 101.42 1.42l.7-.7zM10 6a4 4 0 100 8 4 4 0 000-8z" /></svg>Light Mode</span>
              ) : (
                <span className="flex items-center text-white"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>Dark Mode</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-hero-gradient dark:bg-dark-gradient text-white transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center animate-fade-in">
            <h1 className="text-responsive-xl tracking-tight font-extrabold">
              <span className="block text-violet-300 animate-slide-up">Solve Coding Challenges.</span>
              <span className="block text-white/90 mt-4 animate-slide-up" style={{animationDelay: '0.2s'}}>Sharpen Your Skills.</span>
            </h1>
            <p className="mt-8 max-w-2xl mx-auto text-responsive text-white/80 animate-slide-up" style={{animationDelay: '0.4s'}}>
              Join thousands of developers who are improving their coding skills through our platform.
            </p>
            <div className="mt-12 animate-slide-up" style={{animationDelay: '0.6s'}}>
              <Link 
                to="/problems" 
                className="group relative inline-flex items-center btn-secondary text-lg hover:scale-105 pulse-glow"
              >
                Get Started
                <svg 
                  className="ml-2 h-6 w-6 transform transition-transform duration-300 ease-in-out group-hover:translate-x-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-dark py-24 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h2 className="text-4xl font-extrabold gradient-text mb-4 pb-2">Key Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the power of modern coding practice with our advanced platform
            </p>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            {/* Multiple Languages */}
            <div className="card-modern p-8 hover-lift group cursor-pointer animate-slide-up max-w-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow">
                  🌐
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">Multiple Languages</h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 text-lg leading-relaxed">Code in your preferred language. We support Python, Java, C++</p>
              </div>
            </div>
            
            {/* Live Code Execution */}
            <div className="card-modern p-8 hover-lift group cursor-pointer animate-slide-up max-w-sm" style={{animationDelay: '0.1s'}}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-secondary to-tertiary text-white text-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-secondary transition-colors duration-300">Live Code Execution</h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 text-lg leading-relaxed">Execute your code in real-time and get instant feedback with detailed error messages and performance metrics.</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark-light to-dark opacity-90"></div>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-4xl font-bold gradient-text">CodeGuru</span>
                <span className="ml-2 text-sm bg-primary/20 px-2 py-1 rounded-full">BETA</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Empowering developers worldwide to enhance their coding skills through challenging problems and collaborative learning.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors duration-300 hover-lift">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors duration-300 hover-lift">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors duration-300 hover-lift">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6 gradient-text">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-300 hover:text-primary transition-colors duration-300 hover-lift inline-block">About Us</Link></li>
                <li><Link to="/problems" className="text-gray-300 hover:text-primary transition-colors duration-300 hover-lift inline-block">Browse Problems</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6 gradient-text">Legal & Support</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-gray-300 hover:text-primary transition-colors duration-300 hover-lift inline-block">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-primary transition-colors duration-300 hover-lift inline-block">Terms of Service</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors duration-300 hover-lift inline-block">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Online Judge Platform. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-4 md:mt-0">
                Made with ❤️ for the coding community
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
