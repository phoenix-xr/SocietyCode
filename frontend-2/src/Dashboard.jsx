import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';
import ncsLogo from './assets/ncs.png';
import gotLatentLogo from './assets/ncs_got_latent.svg';
import bgSvg from './assets/bg.svg';

const BACKEND_URL = "https://society-backend-ashy.vercel.app";

// Converts API format "first_last" → display format "First Last"
const formatName = (raw = '') =>
  raw.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// ── tiny toast helper ────────────────────────────────────────
let _setToast = null;
const toast = (msg, type = 'info') => _setToast?.({ msg, type, id: Date.now() });

function Toast() {
  const [notification, setNotification] = useState(null);
  useEffect(() => { _setToast = setNotification; }, []);
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 3200);
    return () => clearTimeout(t);
  }, [notification]);
  if (!notification) return null;
  return (
    <div className={`db-toast db-toast--${notification.type}`}>
      {notification.msg}
    </div>
  );
}

// ── main component ───────────────────────────────────────────
const Dashboard = ({ username: propUser, password: propPass }) => {
  // Prefer props (from App.jsx login flow), fall back to localStorage (standalone dev)
  const username = propUser || localStorage.getItem('fw_username') || '';
  const password = propPass || localStorage.getItem('fw_password') || '';

  const [invitationImg, setInvitationImg]   = useState(null);
  const [showInvitation, setShowInvitation] = useState(false);
  const [loadingInvitation, setLoadingInvitation] = useState(false);
  const [profileImg, setProfileImg]         = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [allNames, setAllNames]             = useState([]);
  const [allNamesForGuess, setAllNamesForGuess] = useState([]); // all users, for guess dropdown
  const [levelComplete, setLevelComplete]   = useState(false);
  const [loadingNames, setLoadingNames]     = useState(true);
  const [loadingMsgs, setLoadingMsgs]       = useState(false);
  const [sendingIdx, setSendingIdx]         = useState(null);   // unused — kept for safety
  const [guessingId, setGuessingId]         = useState(null);   // which Guess button is in-flight
  const [mobilePanel, setMobilePanel]       = useState(null);   // 'send' | 'guess' | null

  // One text entry per recipient name, keyed by name
  const [messageTexts, setMessageTexts] = useState({});
  const [sendingName, setSendingName]   = useState(null); // name currently sending

  const [guesses, setGuesses] = useState({});

  // ── fetch profile image ────────────────────────────────
  useEffect(() => {
    if (!username) return;
    fetch(`${BACKEND_URL}/api/get_profile_img`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then((blob) => { if (blob.type.startsWith('image')) setProfileImg(URL.createObjectURL(blob)); })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [username]);

  // ── fetch all names for guess dropdown (GET, no auth) ──
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/get_all_names`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setAllNamesForGuess(data.names); })
      .catch(() => {}); // silent fail — dropdown just stays empty
  }, []);

  // ── fetch names (POST with credentials, excludes already-messaged) ──
  const fetchNames = useCallback(() => {
    if (!username || !password) return;
    setLoadingNames(true);
    fetch(`${BACKEND_URL}/api/get_names`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAllNames(data.names);
          // add empty slots for any new names (don’t wipe existing typed text)
          setMessageTexts((prev) => {
            const next = { ...prev };
            data.names.forEach((n) => { if (!(n in next)) next[n] = ''; });
            return next;
          });
        } else toast('Could not load names list', 'error');
      })
      .catch(() => toast('Network error loading names', 'error'))
      .finally(() => setLoadingNames(false));
  }, [username, password]);

  useEffect(() => { fetchNames(); }, [fetchNames]);

  // ── fetch level status → then fetch messages + invitation ──
  const fetchReceivedAndInvitation = useCallback(() => {
    if (!username || !password) return;
    setLoadingMsgs(true);

    fetch(`${BACKEND_URL}/api/get_recieved_messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setReceivedMessages(data.messages);
          const init = {};
          data.messages.forEach((m) => {
            init[m.id] = { guessName: '', status: null, guessLeft: m.guess_left };
          });
          setGuesses(init);
        }
        // 403 = level not complete — that's OK, just show empty panel
      })
      .catch(() => toast('Could not load received messages', 'error'))
      .finally(() => setLoadingMsgs(false));
    // invitation is fetched on-demand when the button is clicked
  }, [username, password]);

  useEffect(() => {
    if (!username) return;

    fetch(`${BACKEND_URL}/api/level_status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setLevelComplete(!!data.level_complete);
          if (data.level_complete) fetchReceivedAndInvitation();
        }
      })
      .catch(() => toast('Could not reach server', 'error'));
  }, [username, fetchReceivedAndInvitation]);

  // ── send message ───────────────────────────────────────────
  const handleSend = async (recipientName) => {
    const text = (messageTexts[recipientName] || '').trim();
    if (!text) return toast('Please write a message first!', 'error');
    if (!username || !password) return toast('Session expired — please log in again.', 'error');

    setSendingName(recipientName);
    try {
      const res = await fetch(`${BACKEND_URL}/api/send_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          username,
          password,
          to_send_username: recipientName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast('Message sent anonymously! 🎉', 'success');
        setMessageTexts((p) => ({ ...p, [recipientName]: '' }));
        // refresh names — sent recipient will be removed by backend
        fetchNames();
      } else {
        toast(data.error || 'Could not send message', 'error');
      }
    } catch {
      toast('Network error — message not sent', 'error');
    } finally {
      setSendingName(null);
    }
  };

  // ── guess sender ───────────────────────────────────────────
  const handleGuessChange = (id, val) =>
    setGuesses((p) => ({ ...p, [id]: { ...p[id], guessName: val } }));

  const handleGuess = async (id) => {
    const gs = guesses[id];
    if (!gs?.guessName) return toast('Select a name first!', 'error');
    if (gs.guessLeft === 0) return toast('No guesses left!', 'error');

    setGuessingId(id);
    try {
      const res = await fetch(`${BACKEND_URL}/api/check_guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, guess_name: gs.guessName, message_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.matched) {
          toast('🎉 Correct! You guessed right!', 'success');
          setGuesses((p) => ({ ...p, [id]: { ...p[id], status: 'RIGHT' } }));
        } else {
          const left = data.guess_left;
          toast(left > 0 ? `Wrong! ${left} tries left.` : 'No guesses remaining.', 'error');
          setGuesses((p) => ({ ...p, [id]: { ...p[id], status: 'WRONG', guessLeft: left } }));
        }
      } else {
        toast(data.error || 'Error checking guess', 'error');
      }
    } catch {
      toast('Network error', 'error');
    } finally {
      setGuessingId(null);
    }
  };

  // ── invitation ─────────────────────────────────────────────
  const openInvitation = async () => {
    if (!levelComplete) {
      toast('Complete the game level first to unlock your invitation!', 'error');
      return;
    }
    // Use cached blob URL if already fetched
    if (invitationImg) { setShowInvitation(true); return; }

    setLoadingInvitation(true);
    try {
      const r = await fetch(`${BACKEND_URL}/api/get_invitation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) throw new Error(r.status);
      const blob = await r.blob();
      if (blob.type.startsWith('image')) {
        setInvitationImg(URL.createObjectURL(blob));
        setShowInvitation(true);
      } else {
        toast('Invitation image not available yet.', 'error');
      }
    } catch {
      toast('Could not load invitation image.', 'error');
    } finally {
      setLoadingInvitation(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fw_username');
    localStorage.removeItem('fw_password');
    window.location.reload();
  };



  // ── panel content renderers (shared between desktop and mobile overlay) ──
  const renderSendContent = () => (
    <div className="db-scroll">
      {loadingNames ? (
        <div className="db-empty-state">Loading names…</div>
      ) : allNames.length === 0 ? (
        <div className="db-empty-state">No recipients found.</div>
      ) : (
        allNames.map((name) => (
          <div className="db-card" key={name}>
            <textarea
              className="db-textarea"
              placeholder="Type your message here"
              value={messageTexts[name] || ''}
              onChange={(e) =>
                setMessageTexts((p) => ({ ...p, [name]: e.target.value }))
              }
            />
            <div className="db-card-footer">
              <span className="db-footer-label">Send To :</span>
              <span className="db-recipient-name">{formatName(name)}</span>
              <button
                className={`db-btn ${sendingName === name ? 'db-btn--loading' : ''}`}
                onClick={() => handleSend(name)}
                disabled={sendingName === name}
              >
                {sendingName === name ? '…' : 'Send'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderGuessContent = () => (
    <div className="db-scroll">
      {loadingMsgs ? (
        <div className="db-empty-state">Loading messages…</div>
      ) : receivedMessages.length > 0 ? (
        receivedMessages.map((msg) => {
          const gs = guesses[msg.id] || { guessName: '', status: null, guessLeft: 3 };
          const isDisabled = gs.status === 'RIGHT' || gs.guessLeft === 0;
          return (
            <div className="db-card" key={msg.id}>
              <div className="db-message-text">{msg.message}</div>
              <div className="db-card-footer">
                <span className="db-footer-label">This message is sent by :</span>
                <select
                  className="db-select"
                  value={gs.guessName}
                  onChange={(e) => handleGuessChange(msg.id, e.target.value)}
                  disabled={isDisabled}
                >
                  <option value="">Select</option>
                  {allNamesForGuess.map((n) => (
                    <option key={n} value={n}>{formatName(n)}</option>
                  ))}
                </select>
                <button
                  className={`db-btn ${guessingId === msg.id ? 'db-btn--loading' : ''}`}
                  onClick={() => handleGuess(msg.id)}
                  disabled={isDisabled || guessingId === msg.id}
                >
                  {guessingId === msg.id ? '…' : 'Guess'}
                </button>
              </div>
              {gs.status === 'RIGHT' && <p className="db-tries right">Your guess is RIGHT !!!</p>}
              {gs.status === 'WRONG' && <p className="db-tries wrong">Your guess is WRONG !!!</p>}
              {gs.status !== 'RIGHT' && <p className="db-tries">{gs.guessLeft} tries left !!!</p>}
            </div>
          );
        })
      ) : (
        <div className="db-empty-state" style={{ marginTop: '60px', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
          You have received no messages as of now.
        </div>
      )}
    </div>
  );

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="db-root">
      <img src={bgSvg} alt="" className="db-bg" aria-hidden="true" />
      <Toast />

      {/* ── Header ─────────────────────────────────── */}
      <header className="db-header">
        <div className="db-ncs-wrap">
          <img src={ncsLogo} alt="NCS" />
        </div>
        <h1 className="db-title">FAREWELL '26</h1>
        <div className="db-latent-wrap">
          <img src={gotLatentLogo} alt="NCS's Got Latent" />
        </div>
      </header>

      {/* ── Profile ────────────────────────────────── */}
      <section className="db-profile">
        {loadingProfile ? (
          <div className="db-avatar-placeholder">Loading…</div>
        ) : profileImg ? (
          <img src={profileImg} alt="Profile" className="db-avatar" />
        ) : (
          <div className="db-avatar-placeholder">No Image</div>
        )}
        <div className="db-profile-info">
          <div className="db-name-pill">{formatName(username) || 'UTKARSH GUPTA'}</div>
          <button className="db-invite-btn" onClick={openInvitation} disabled={loadingInvitation}>
            {loadingInvitation ? 'Loading…' : invitationImg ? 'Your Invitation' : levelComplete ? 'Your Invitation' : 'Your Invitation 🔒'}
          </button>
        </div>
      </section>

      {/* ── Two Panels (desktop) ─────────────────── */}
      <div className="db-panels">

        {/* ── Left: Send Anonymous Messages ──────── */}
        <div className="db-panel">
          <h2 className="db-panel-title">Send Anonymous Messages</h2>
          {renderSendContent()}
        </div>

        {/* ── Right: Guess Anonymous Messages ──────── */}
        <div className="db-panel">
          <h2 className="db-panel-title">Guess Anonymous Messages</h2>
          {renderGuessContent()}
        </div>
      </div>

      {/* ── Mobile nav buttons (hidden on desktop) ─── */}
      <div className="db-mobile-nav">
        <button className="db-mobile-nav-btn" onClick={() => setMobilePanel('send')}>
          ✏️ Send Messages
        </button>
        <button className="db-mobile-nav-btn" onClick={() => setMobilePanel('guess')}>
          🔍 Guess Messages
        </button>
      </div>

      {/* ── Mobile panel full-screen overlay ─────── */}
      {mobilePanel && (
        <div className="db-mobile-overlay">
          <img src={bgSvg} alt="" className="db-invitation-bg" aria-hidden="true" />
          <div className="db-mobile-overlay-inner">
            <div className="db-mobile-overlay-header">
              <button className="db-mobile-back" onClick={() => setMobilePanel(null)}>← Back</button>
              <span className="db-mobile-overlay-title">
                {mobilePanel === 'send' ? 'Send Anonymous Messages' : 'Guess Anonymous Messages'}
              </span>
            </div>
            <div className="db-mobile-overlay-body">
              {mobilePanel === 'send' ? renderSendContent() : renderGuessContent()}
            </div>
          </div>
        </div>
      )}

      {/* ── Logout ─────────────────────────────────── */}
      <div className="db-logout-wrap">
        <button className="db-logout-btn" onClick={handleLogout}>
          ⏻ Logout
        </button>
      </div>

      {/* ── Invitation full-screen overlay ─────────────── */}
      {showInvitation && (
        <div className="db-invitation-overlay">
          <img src={bgSvg} alt="" className="db-invitation-bg" aria-hidden="true" />
          <button
            className="db-invitation-back"
            onClick={() => setShowInvitation(false)}
          >
            ← Back
          </button>
          <div className="db-invitation-frame">
            <img src={invitationImg} alt="Your Invitation" className="db-invitation-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

