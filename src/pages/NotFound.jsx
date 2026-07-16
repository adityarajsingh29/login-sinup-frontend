import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import '../styles/Auth.css';

const NotFound = () => {
  return (
    <div className="auth-page-container">
      <div className="auth-card text-center p-8">
        <div className="auth-header flex flex-col items-center">
          <div className="auth-logo-bg mx-auto">
            <ShieldAlert size={28} className="auth-logo-icon" />
          </div>
          <h2 className="mt-4 text-4xl font-bold text-gradient">404</h2>
          <h3 className="mt-2 text-xl font-medium text-slate-800 dark:text-slate-100">
            Page Not Found
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            The resource you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="mt-8">
          <Link to="/" className="btn-primary-gradient inline-flex items-center justify-center gap-2 w-full">
            <ArrowLeft size={18} />
            <span>Go Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
