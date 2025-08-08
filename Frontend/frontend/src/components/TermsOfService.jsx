import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-white transition-colors duration-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-8 gradient-text">Terms of Service</h1>
          <div className="card-modern p-8 animate-fade-in space-y-6">
            <p className="text-lg leading-relaxed">
              By accessing and using our Online Judge platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold gradient-text">1. Use License</h2>
            <p className="text-lg leading-relaxed">
              Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-bold gradient-text">2. User Conduct</h2>
            <p className="text-lg leading-relaxed">
              You agree not to use the platform for any unlawful purpose or to engage in any conduct that could damage, disable, or impair the platform. You are responsible for the code you submit and must not submit any malicious or harmful code.
            </p>

            <h2 className="text-2xl font-bold gradient-text">3. Disclaimer</h2>
            <p className="text-lg leading-relaxed">
              The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-bold gradient-text">4. Limitations</h2>
            <p className="text-lg leading-relaxed">
              In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
            </p>

            <h2 className="text-2xl font-bold gradient-text">5. Governing Law</h2>
            <p className="text-lg leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of our jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
