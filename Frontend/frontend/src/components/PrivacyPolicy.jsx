import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-white transition-colors duration-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-8 gradient-text">Privacy Policy</h1>
          <div className="card-modern p-8 animate-fade-in space-y-6">
            <p className="text-lg leading-relaxed">
              Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.
            </p>
            
            <h2 className="text-2xl font-bold gradient-text">1. Information We Collect</h2>
            <p className="text-lg leading-relaxed">
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
            </p>
            <p className='text-lg leading-relaxed'>
              The types of information we collect include your name, email address, and any code submissions you make on our platform.
            </p>

            <h2 className="text-2xl font-bold gradient-text">2. How We Use Your Information</h2>
            <p className="text-lg leading-relaxed">
              We use the information we collect to operate and maintain our platform, to provide you with the services you request, to communicate with you, and to improve our services. Your code submissions are used to evaluate your solutions and provide you with feedback.
            </p>

            <h2 className="text-2xl font-bold gradient-text">3. Security</h2>
            <p className="text-lg leading-relaxed">
              We take the security of your data seriously and use appropriate technical and organizational measures to protect it against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
            </p>

            <h2 className="text-2xl font-bold gradient-text">4. Cookies</h2>
            <p className="text-lg leading-relaxed">
              We use cookies to store information, including your preferences, and to track your use of the platform. You can choose to disable cookies through your browser settings, but doing so may affect the functionality of our services.
            </p>

            <h2 className="text-2xl font-bold gradient-text">5. Changes to This Policy</h2>
            <p className="text-lg leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
