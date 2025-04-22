import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 shadow-lg">
            <span className="text-4xl">🌱</span>
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
          Small Steps, <span className="text-emerald-600">Big Impact</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 mb-8">
          Track your eco-habits, visualize your environmental impact, and join a community making a difference—one green step at a time.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link 
            to="/signup" 
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            Start Your Journey
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-3 border-2 border-green-600 text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors duration-200"
          >
            Returning User
          </Link>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="People planting trees together" 
            className="rounded-xl shadow-xl border-4 border-white"
          />
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            How GreenSteps Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <div className="text-green-600 text-3xl mb-4">①</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Log Daily Habits</h3>
              <p className="text-gray-600">
                Track simple actions like using reusable bags or biking to work. Every small choice matters.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <div className="text-green-600 text-3xl mb-4">②</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">See Your Impact</h3>
              <p className="text-gray-600">
                Visual dashboards show your carbon savings and environmental contributions over time.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <div className="text-green-600 text-3xl mb-4">③</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Earn Rewards</h3>
              <p className="text-gray-600">
                Unlock badges, maintain streaks, and see how you contribute to our global sustainability goals.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial/CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-xl md:text-2xl font-light mb-8">
            "GreenSteps helped me realize how my daily choices add up. I've reduced my plastic waste by 60% in just 3 months!"
          </blockquote>
          <p className="font-medium">— Sarah K., GreenSteps User</p>
          
          <div className="mt-12">
            <Link 
              to="/signup" 
              className="inline-block px-8 py-3 bg-white text-green-700 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Join Our Community Today
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-green-800 text-green-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} GreenSteps. Making sustainability simple.</p>
        </div>
      </footer>
    </div>
  );
}