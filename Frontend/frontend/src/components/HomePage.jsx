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

      <nav className="bg-white/80 dark:bg-dark/80 backdrop-blur-md shadow-md relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hover:from-indigo-500 hover:to-purple-500 transition-all duration-200">OJ</span>
              </div>
            </div>
            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <div className="relative group">
                <button className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center">
                  Problems
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <a href="#all" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">All Problems</a>
                  <a href="#easy" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Easy</a>
                  <a href="#medium" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Medium</a>
                  <a href="#hard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Hard</a>
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/signin" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200">Sign In</Link>
                <Link to="/signup" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">Sign Up</Link>
              </div>
                {/* Dark mode toggle */}
                <button
                  onClick={handleDarkModeToggle}
                  className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary/20 dark:hover:bg-primary/40 transition-colors duration-200"
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
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-700">
            <a href="#all" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:text-primary dark:hover:bg-gray-800 transition-colors duration-200">All Problems</a>
            <a href="#easy" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:text-primary dark:hover:bg-gray-800 transition-colors duration-200">Easy</a>
            <a href="#medium" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:text-primary dark:hover:bg-gray-800 transition-colors duration-200">Medium</a>
            <a href="#hard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:text-primary dark:hover:bg-gray-800 transition-colors duration-200">Hard</a>
            <div className="pt-4 space-y-1">
              <Link to="/signin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:text-primary dark:hover:bg-gray-800 transition-colors duration-200">Sign In</Link>
              <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white transition-colors duration-200">Sign Up</Link>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className="w-full flex items-center justify-center mt-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-primary/20 dark:hover:bg-primary/40 transition-colors duration-200"
            >
              {darkMode ? (
                <span className="flex items-center text-yellow-400"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.22a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.22 6.78a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-6.22-1.22a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm2.22-6.78a1 1 0 00-1.42-1.42l-.7.7a1 1 0 101.42 1.42l.7-.7zM10 6a4 4 0 100 8 4 4 0 000-8z" /></svg>Dark Mode</span>
              ) : (
                <span className="flex items-center text-gray-700 dark:text-gray-200"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>Light Mode</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary via-secondary to-purple-800 dark:from-dark dark:via-dark dark:to-gray-900 text-white overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center">
            <h1 className="text-5xl tracking-tight font-extrabold sm:text-6xl md:text-7xl">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 dark:from-gray-200 dark:to-primary">Solve Coding Challenges.</span>
              <span className="block text-indigo-200 dark:text-primary mt-2">Sharpen Your Skills.</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 dark:text-gray-200 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Join thousands of developers who are improving their coding skills through our platform.
            </p>
            <div className="mt-10">
              <Link 
                to="/problems" 
                className="group relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary dark:text-dark bg-white dark:bg-primary hover:bg-indigo-50 dark:hover:bg-primary/80 md:text-lg transition-all duration-300 hover:px-8 shadow-lg dark:shadow-primary/30"
              >
                Get Started
                <svg 
                  className="ml-2 h-5 w-5 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1" 
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
      <div className="bg-white dark:bg-dark py-16 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Key Features</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Multiple Languages */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-primary dark:text-secondary text-5xl mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-3">🌐</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-200">Multiple Languages</h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200 text-lg">Code in your preferred language. We support Python, Java, C++, and many more!</p>
              </div>
            </div>
            {/* Live Code Execution */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-primary dark:text-secondary text-5xl mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-3">⚡</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-200">Live Code Execution</h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200 text-lg">Execute your code in real-time and get instant feedback on your solution.</p>
              </div>
            </div>
            {/* Leaderboard */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-primary dark:text-secondary text-5xl mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-3">🏆</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-200">Leaderboard</h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200 text-lg">Compete with others and track your progress on our global leaderboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gradient-to-b from-white to-indigo-50/50 dark:from-dark dark:to-gray-900 py-24 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-primary dark:to-secondary">Join Our Community</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Connect with fellow programmers, share solutions, and grow together.
            </p>
          </div>
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl transform rotate-6"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 border border-gray-100 dark:border-gray-800">
              <svg className="absolute left-0 -mt-16 w-16 h-16 text-primary dark:text-secondary transform -translate-x-1/2" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <div className="relative">
                <p className="text-2xl leading-9 text-gray-700 dark:text-gray-200 italic">
                  "This platform has helped me improve my problem-solving skills significantly. The community is supportive and the problems are challenging!"
                </p>
                <div className="mt-8 flex items-center">
                  <div className="inline-flex rounded-full ring-4 ring-primary/20 dark:ring-secondary/20">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                      SC
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">Sarah Chen</p>
                    <p className="text-primary dark:text-secondary">Software Engineer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-dark mt-auto transition-colors duration-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="text-2xl font-bold text-white">OJ</span>
              <p className="mt-2 text-gray-300 text-sm">
                Empowering developers to become better programmers.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-300 hover:text-white">About</a></li>
                <li><a href="#problems" className="text-gray-300 hover:text-white">Problems</a></li>
                <li><a href="#leaderboard" className="text-gray-300 hover:text-white">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Online Judge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
