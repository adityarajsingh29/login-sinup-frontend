import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Eye, CheckCircle2 } from 'lucide-react';
import '../styles/Auth.css'; // sharing global auth / aesthetic styles

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">
          Modern Secure <span className="text-gradient">Authentication</span>
        </h1>
        <p className="hero-subtitle">
          An interview-quality, production-ready full-stack authentication system built with MERN. 
          Enjoy industrial-grade session security and a gorgeous responsive interface.
        </p>

        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary-gradient">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-primary-gradient">
                Sign In
              </Link>
              <Link to="/signup" className="btn-secondary-outline">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper purple">
            <Shield size={24} />
          </div>
          <h3>JWT Session Management</h3>
          <p>Secure token validation, automated client-side request interceptors, and background automatic session expiration logs.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper blue">
            <Key size={24} />
          </div>
          <h3>bcrypt Password Hashing</h3>
          <p>Uncompromising security with salt-hashed passwords. Plain passwords never touch the database or API responses.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper green">
            <Eye size={24} />
          </div>
          <h3>Aesthetic UI & Styling</h3>
          <p>Vibrant gradients, glassmorphism cards, theme toggles, and responsive drawers tailored for all desktop and mobile formats.</p>
        </div>
      </div>

      <div className="specs-section">
        <h2>System Capabilities</h2>
        <div className="specs-list">
          <div className="spec-item">
            <CheckCircle2 className="spec-check" size={18} />
            <span>Interactive Password Strength Meter</span>
          </div>
          <div className="spec-item">
            <CheckCircle2 className="spec-check" size={18} />
            <span>Show/Hide Password Fields</span>
          </div>
          <div className="spec-item">
            <CheckCircle2 className="spec-check" size={18} />
            <span>Remember Me Credentials Cache</span>
          </div>
          <div className="spec-item">
            <CheckCircle2 className="spec-check" size={18} />
            <span>Token-based Auto Logout & Cleanup</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
