import React, { useState, useEffect } from 'react';
import './App.css';
import ncsLogo from './assets/ncs.png';
import bgSvg from './assets/bg.svg';
import gotLatentLogo from './assets/ncs_got_latent.svg';
import lockSvg from './assets/lock.svg';
import Game from './Game';
import Dashboard from './Dashboard';

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
  const [username, setUsername] = useState(localStorage.getItem('fw_username') || "");
  const [password, setPassword] = useState(localStorage.getItem('fw_password') || "");
  const [juniors, setJuniors] = useState([
    { name: "PIYUSH GAUTAM", phone: "+91 9555580183" },
    { name: "BHASKAR SHAH", phone: "+91 6307946728" },
    { name: "DARSHITA JAIN", phone: "+91 8700049486" }
  ]);
  const [loginLoading, setLoginLoading] = useState(false);
  // Stores result of background session check: null = pending, false = invalid, 'game'|'dashboard' = valid
  const [savedSession, setSavedSession] = useState(null);

  const BACKEND = 'https://society-backend-ashy.vercel.app';

  // ── Background session check on mount (doesn’t skip welcome screen) ──
  useEffect(() => {
    const savedUser = localStorage.getItem('fw_username');
    const savedPass = localStorage.getItem('fw_password');
    if (!savedUser || !savedPass) { setSavedSession(false); return; }

    fetch(`${BACKEND}/api/check_pass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: savedUser, password: savedPass }),
    })
      .then((r) => r.json())
      .then(async (authData) => {
        if (!authData.success) {
          localStorage.removeItem('fw_username');
          localStorage.removeItem('fw_password');
          setUsername(''); setPassword('');
          setSavedSession(false);
          return;
        }
        const lvlRes = await fetch(`${BACKEND}/api/level_status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: savedUser }),
        });
        const lvlData = await lvlRes.json();
        setSavedSession(lvlData.success && lvlData.level_complete ? 'dashboard' : 'game');
      })
      .catch(() => setSavedSession(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
    setLoginLoading(true);
    try {
      // 1. Validate credentials
      const authRes = await fetch(`${BACKEND}/api/check_pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: username, password })
      });
      const authData = await authRes.json();

      if (!authData.success) {
        alert(authData.error || "Invalid credentials");
        return;
      }

      // 2. Persist session for Dashboard
      localStorage.setItem('fw_username', username);
      localStorage.setItem('fw_password', password);

      // 3. Check if level already complete → skip game, go straight to dashboard
      const lvlRes = await fetch(`${BACKEND}/api/level_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const lvlData = await lvlRes.json();

      if (lvlData.success && lvlData.level_complete) {
        triggerTransition('dashboard');
      } else {
        triggerTransition('game');
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error connecting to server. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };


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
      {screen !== 'game' && <img src={bgSvg} alt="Background" className="background-svg" />}

      {screen !== 'dashboard' && <img src={ncsLogo} alt="NCS Logo" className="global-ncs-logo" />}

      <div className={`curtain left-curtain ${curtainPhase}`} style={{ zIndex: 9999 }} />
      <div className={`curtain right-curtain ${curtainPhase}`} style={{ zIndex: 9999 }} />

      {/* Always render content; game/dashboard/login screens shown based on screen state */}
      {screen === 'game' ? (
        <Game onOpenDashboard={() => triggerTransition('dashboard')} />
      ) : screen === 'dashboard' ? (
        <Dashboard username={username} password={password} />
      ) : (
        <div className="content-layer">
        {screen === 1 && (
          <div className="screen-1">
            <div className="s1-backdrop">
              <p className="s1-welcome">WELCOME SENIORS</p>
              <p className="s1-subtitle">YOUR FAREWELL JOURNEY BEGINS HERE</p>
              <h1 className="s1-title">FAREWELL '26</h1>
              <div className="s1-date-pill">
                Date and Time : 23rd May, 2026 - 03:00pm onwards
              </div>
              <button className="start-btn" onClick={() => {
                if (savedSession) {
                  triggerTransition(savedSession);
                } else {
                  triggerTransition(2);
                }
              }}>
                START NOW
              </button>
            </div>
          </div>
        )}

        {screen === 2 && (
          <div className="screen-2">
            <div className="latent-logo-container">
              <img src={gotLatentLogo} alt="NCS's Got Latent" className="latent-logo" />
            </div>
            <div className="glass-box">
              <div className="box-header">
                <span className="star">✧</span> SECRET ACCESS <span className="star">✧</span>
              </div>
              <div className="box-subtitle">Enter your credentials to reveal the final surprise</div>
              
              <div className="inputs-container">
                <div className="input-group">
                  <div className="input-wrapper">
                    <GoldenUserIcon />
                    <input 
                      type="text" 
                      placeholder="Enter Username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <div className="input-wrapper">
                    <img src={lockSvg} alt="Lock" className="input-lock-icon" />
                    <input 
                      type="password" 
                      placeholder="Enter Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <EyeIcon />
                  </div>
                </div>
              </div>
              
              <button className="unlock-btn" onClick={handleLogin} disabled={loginLoading}>
                {loginLoading ? "Loading..." : "Unlock Now"} <GoldenLockIconSmall />
              </button>
              
            </div>
          </div>
        )}

        {screen === 3 && (
          <div className="screen-3">
            <div className="latent-logo-container">
              <img src={gotLatentLogo} alt="NCS's Got Latent" className="latent-logo" />
            </div>
            <div className="glass-box juniors-box">
              <h2 className="hey-senior">Hey, <span className="senior-name">{username || "Senior name"}</span></h2>
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
      )}
    </div>
  );
}

export default App;
