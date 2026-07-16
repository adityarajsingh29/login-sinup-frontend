import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';
import {
  User as UserIcon,
  Mail,
  Calendar,
  LogOut,
  ShieldCheck,
  Settings,
  Menu,
  ChevronRight,
  Clock
} from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { logout, user: contextUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/profile');
        setProfile(response.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="dashboard-wrapper">
      {/* Mobile Sidebar Toggle */}
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={20} />
        <span>Menu</span>
      </button>

      {/* Responsive Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <ShieldCheck size={24} className="text-primary" />
          <span>User Console</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setSidebarOpen(false);
            }}
          >
            <UserIcon size={18} />
            <span>Profile Overview</span>
            <ChevronRight size={16} className="arrow-icon" />
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('security');
              setSidebarOpen(false);
            }}
          >
            <Settings size={18} />
            <span>Security Configurations</span>
            <ChevronRight size={16} className="arrow-icon" />
          </button>
        </nav>

        <button onClick={logout} className="sidebar-logout">
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-main">
        {loading ? (
          <div className="glass-panel p-8">
            <Loader skeleton />
          </div>
        ) : (
          <div className="dashboard-content-panel">
            {activeTab === 'overview' && (
              <div className="glass-panel animate-fade-in">
                <div className="panel-header">
                  <h2 className="panel-title">Welcome back, {profile?.name || contextUser?.name}!</h2>
                  <p className="panel-subtitle">Here is a secure summary of your credential attributes.</p>
                </div>

                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-card-icon-wrapper purple">
                      <UserIcon size={20} />
                    </div>
                    <div className="info-card-details">
                      <span className="info-label">Full Name</span>
                      <span className="info-value">{profile?.name}</span>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-card-icon-wrapper blue">
                      <Mail size={20} />
                    </div>
                    <div className="info-card-details">
                      <span className="info-label">Email Address</span>
                      <span className="info-value">{profile?.email}</span>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-card-icon-wrapper green">
                      <Calendar size={20} />
                    </div>
                    <div className="info-card-details">
                      <span className="info-label">Registration Date</span>
                      <span className="info-value">{formatDate(profile?.createdAt)}</span>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-card-icon-wrapper orange">
                      <Clock size={20} />
                    </div>
                    <div className="info-card-details">
                      <span className="info-label">Last Session Refresh</span>
                      <span className="info-value">{formatDate(profile?.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="security-notice-box">
                  <ShieldCheck size={20} className="notice-icon" />
                  <div>
                    <h4>Your Session is Secure</h4>
                    <p>
                      Your user parameters are authenticated via standard JSON Web Tokens (JWT) stored locally. 
                      Requests to backend routes auto-inject authorizations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass-panel animate-fade-in">
                <div className="panel-header">
                  <h2 className="panel-title">Security & Session</h2>
                  <p className="panel-subtitle">Configure credentials and view active encryption stats.</p>
                </div>

                <div className="security-details-list">
                  <div className="security-detail-item">
                    <div className="detail-meta">
                      <h5>Password Protection Status</h5>
                      <p>Hashed using bcrypt dynamic salt generation.</p>
                    </div>
                    <span className="badge-success">Encrypted</span>
                  </div>

                  <div className="security-detail-item">
                    <div className="detail-meta">
                      <h5>Session Expiration Length</h5>
                      <p>Active tokens carry an expiration limit set to 7 days.</p>
                    </div>
                    <span className="badge-info">7 Days Expire</span>
                  </div>

                  <div className="security-detail-item">
                    <div className="detail-meta">
                      <h5>Cross-Origin Request Sharing (CORS)</h5>
                      <p>Restricted strictly to registered origin clients.</p>
                    </div>
                    <span className="badge-success">Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
