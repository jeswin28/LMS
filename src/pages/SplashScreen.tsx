import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="xl" />
        </div>

        {/* Tagline */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
            Learn What Matters.
            <br />
            <span className="text-emerald-600">Build What Lasts.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your learning journey with Nexfern Academy's comprehensive courses, 
            expert instruction, and hands-on projects.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          <span>Get Started</span>
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-gray-800">Expert Courses</h3>
            <p className="text-gray-600 text-sm">Learn from industry professionals</p>
          </div>
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="font-semibold text-gray-800">Certifications</h3>
            <p className="text-gray-600 text-sm">Earn recognized certificates</p>
          </div>
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-semibold text-gray-800">Community</h3>
            <p className="text-gray-600 text-sm">Connect with fellow learners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;