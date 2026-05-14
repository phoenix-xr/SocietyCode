import React, { useState, useEffect } from 'react';
import './App.css';
import ncsLogo from './assets/ncs.png';
import bgSvg from './assets/bg.svg';
import gotLatentLogo from './assets/ncs_got_latent.svg';
import lockSvg from './assets/lock.svg';

// Preload critical images as early as possible
const preloadImages = [ncsLogo, bgSvg, gotLatentLogo, lockSvg];
preloadImages.forEach((src) => {
  const img = new Image();
  img.src = src;
});

const GoldenUserIcon = () => (
  <svg className="gold-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="url(#goldGradient)"/>
    <defs>
      <linearGradient id="goldGradient" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDF092"/>
        <stop offset="1" stopColor="#DCA93C"/>
      </linearGradient>
    </defs>
  </svg>
);

const GoldenCheckIcon = ({ isSelected }) => (
  <svg className="gold-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="url(#goldGradient2)" strokeWidth="2"/>
    {isSelected && <path d="M8 12L11 15L16 9" stroke="url(#goldGradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
    <defs>
      <linearGradient id="goldGradient2" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDF092"/>
        <stop offset="1" stopColor="#DCA93C"/>
      </linearGradient>
    </defs>
  </svg>
);

const ShieldHelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F8DA5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A0AAB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const GoldenLockIcon = () => (
  <svg className="gold-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17Z" fill="url(#goldGradient)"/>
  </svg>
);

const GoldenLockIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8Z" fill="#000"/>
  </svg>
);

function App() {
  const [screen, setScreen] = useState(1);
  const [curtainPhase, setCurtainPhase] = useState('idle');
  const [names, setNames] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [juniors, setJuniors] = useState([
    // Mock data based on the provided design
    { name: "PIYUSH GAUTAM", phone: "+91 9555580183" },
    { name: "BHASKAR SHAH", phone: "+91 6307946728" },
    { name: "DARSHITA JAIN", phone: "+91 8700049486" }
  ]);

  const triggerTransition = (targetScreen) => {
    setCurtainPhase('closing');
    setTimeout(() => {
      setScreen(targetScreen);
      setCurtainPhase('opening');
      setTimeout(() => {
        setCurtainPhase('idle');
      }, 1500);
    }, 1500);
  };

  useEffect(() => {
    // Prefetch names as soon as the app loads
    fetch('https://society-backend-ashy.vercel.app/api/get_names')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.names) {
          setNames(data.names);
        }
      })
      .catch(err => console.error("Failed to fetch names:", err));
  }, []);

  // Fetch assigned juniors when moving to screen 4
  const fetchAssignedJuniors = (user) => {
    fetch('https://society-backend-ashy.vercel.app/api/get_assigned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    })
      .then(res => res.json())
      .then(data => {
        // Handle both possible spellings from the backend
        const juniorsList = data.Asigned_to || data.Assigned_to;
        if (data.success !== false && juniorsList) {
          setJuniors(juniorsList);
        }
      })
      .catch(err => console.error("Failed to fetch juniors:", err));
  };

  return (
    <div className="app-container">
      <img src={bgSvg} alt="Background" className="background-svg" />

      <div className={`curtain left-curtain ${curtainPhase}`} />
      <div className={`curtain right-curtain ${curtainPhase}`} />

      <div className="content-layer">
        {screen === 1 && (
          <div className="screen-1">
            <div className="logo-container">
              <img src={ncsLogo} alt="NCS Logo" />
            </div>
            
            <h1 className="welcome-text">
              WELCOME SENIORS<span role="img" aria-label="graduation cap">🎓</span>
            </h1>
            
            <h2 className="subtitle-text">
              YOUR FAREWELL JOURNEY BEGINS HERE — CLICK START NOW
            </h2>
            
            <button className="start-btn" onClick={() => triggerTransition(2)}>
              START NOW
            </button>
          </div>
        )}

        {screen === 2 && (
          <div className={`screen-2 ${isDropdownOpen ? 'dropdown-open' : ''}`}>
            <div className="welcome-to-text">
              <span className="star">✧</span> WELCOME TO <span className="star">✧</span>
            </div>
            <div className={`latent-logo-container ${isDropdownOpen ? 'dropdown-open' : ''}`}>
              <img src={gotLatentLogo} alt="NCS's Got Latent" className="latent-logo" />
            </div>
            
            <div className="custom-dropdown-container">
              <div 
                className="dropdown-header" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="dropdown-header-left">
                  <GoldenUserIcon />
                  <span className="selected-text">{selectedName || "Select Your Name"}</span>
                </div>
                <svg className="chevron-icon" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F8DA5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              
              {isDropdownOpen && (
                <ul className="dropdown-list">
                  {names.length === 0 ? (
                    <li className="dropdown-item empty">Loading...</li>
                  ) : (
                    names.map((name, idx) => (
                      <li 
                        key={idx} 
                        className="dropdown-item" 
                        onClick={() => {
                          setSelectedName(name);
                          setIsDropdownOpen(false);
                          triggerTransition(3);
                        }}
                      >
                        <GoldenUserIcon />
                        <span className="item-text">{name}</span>
                        <GoldenCheckIcon isSelected={selectedName === name} />
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        {screen === 3 && (
          <div className="screen-3">
            <div className="latent-logo-container dropdown-open">
              <img src={gotLatentLogo} alt="NCS's Got Latent" className="latent-logo" />
            </div>
            <div className="glass-box">
              <div className="box-header">
                <span className="star">✧</span> SECRET ACCESS <span className="star">✧</span>
              </div>
              <div className="box-subtitle">Enter your credentials to reveal the final surprise</div>
              
              <div className="input-group">
                <div className="input-wrapper">
                  <img src={lockSvg} alt="Lock" className="input-lock-icon" />
                  <input type="password" placeholder="Enter Password" />
                  <EyeIcon />
                </div>
              </div>
              
              <button className="unlock-btn">
                Unlock Now <GoldenLockIconSmall />
              </button>
              
              <div className="divider">
                <div className="line"></div>
                <span className="star">✧</span>
                <div className="line"></div>
              </div>
              
              <div className="help-text">
                <ShieldHelpIcon /> Need help? Contact your 
                <span 
                  className="assigned-juniors-btn" 
                  onClick={() => {
                    fetchAssignedJuniors(selectedName);
                    triggerTransition(4);
                  }}
                >
                  assigned juniors
                </span>
              </div>
            </div>
          </div>
        )}

        {screen === 4 && (
          <div className="screen-4">
            <div className="latent-logo-container dropdown-open">
              <img src={gotLatentLogo} alt="NCS's Got Latent" className="latent-logo" />
            </div>
            <div className="glass-box juniors-box">
              <h2 className="hey-senior">Hey, <span className="senior-name">{selectedName || "Senior name"}</span></h2>
              <div className="ribbon-banner">YOUR JUNIORS</div>
              
              <div className="juniors-list">
                {juniors.map((junior, idx) => (
                  <div className="junior-item" key={idx}>
                    <GoldenUserIcon />
                    <span className="junior-name">{junior.name}</span>
                    <span className="junior-phone">{junior.phone ? `+91 ${junior.phone}` : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
