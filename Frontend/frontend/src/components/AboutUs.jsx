import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-white transition-colors duration-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-8 gradient-text">About Us</h1>
          <div className="card-modern p-8 animate-fade-in">
            <p className="text-lg leading-relaxed mb-6">
              Welcome to our Online Judge platform! We are dedicated to providing a robust and user-friendly environment for competitive programmers, students, and anyone looking to sharpen their coding skills.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our mission is to empower developers by offering a diverse set of algorithmic challenges, from beginner-friendly problems to complex competitive programming tasks. We believe that practice is the key to mastery, and our platform is designed to make that practice as engaging and effective as possible.
            </p>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Our Features</h2>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li className="text-lg">A wide range of problems with varying difficulty levels.</li>
              <li className="text-lg">Support for multiple programming languages, including C++, Java, and Python.</li>
              <li className="text-lg">Real-time code compilation and execution with instant feedback.</li>
              <li className="text-lg">Detailed submission history and performance tracking.</li>
              <li className="text-lg">AI-powered code review to help you improve your solutions.</li>
            </ul>
            <p className="text-lg leading-relaxed">
              Whether you are preparing for a technical interview, participating in a coding competition, or simply love solving problems, our platform is here to support you on your journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
