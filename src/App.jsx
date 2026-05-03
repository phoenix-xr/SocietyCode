import { useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import './App.css';
import { MarioSVG, PrincessSVG, CastleSVG, JSSUniversitySVG } from './components/Sprites';

const Firework = ({ x, y, color, delay = 0 }) => {
  const particles = Array.from({ length: 24 });
  return (
    <div style={{ position: 'absolute', left: x, top: y, zIndex: 15, pointerEvents: 'none' }}>
      {particles.map((_, i) => {
        const angle = (i * 15) * (Math.PI / 180);
        const distance = 120 + Math.random() * 80;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: 0.5,
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance + 30
            }}
            transition={{ 
              duration: 1.5 + Math.random() * 0.5, 
              ease: 'easeOut', 
              repeat: Infinity, 
              repeatDelay: 1 + Math.random() * 1.5,
              delay: delay 
            }}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              backgroundColor: color,
              boxShadow: `0 0 0 ${color}`
            }}
          />
        );
      })}
    </div>
  );
};

function App() {

  const marioControls = useAnimation();
  const textControls = useAnimation();
  const endSceneControls = useAnimation();
  const heartControls = useAnimation();
  const endingTextControls = useAnimation();
  const uniControls = useAnimation();
  const username = useRef(null)
  const password = useRef(null)
  const isSkipped = useRef(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const startGame = async () => {
    isSkipped.current = false;
    setIsPlaying(true);
    setIsRunning(true);
    
    const isMobile = window.innerWidth <= 768;
    const textPassDuration = isMobile ? 4.5 : 4.0;
    const uniPassDuration = isMobile ? 8.5 : 6.5;
    const endSceneDuration = isMobile ? 1.0 : 0.8;
    const uniTarget = isMobile ? '-400vw' : '-100vw';
    
    // 1. Mario runs forward a bit on the map (to 20vw)
    await marioControls.start({
      x: ['-100px', '20vw'],
      transition: { duration: 0.8, ease: 'linear' }
    });
    if (isSkipped.current) return;
    
    // Mario keeps running in place, background starts scrolling
    setIsScrolling(true);
    
    // 2. JSS text comes from front and passes through the screen
    textControls.start({
      x: ['100vw', '-100vw'],
      transition: { duration: textPassDuration, ease: 'linear' }
    });
    
    // JSS University also comes from the front in the background
    // We await this so it completely passes through the screen before the Queen/Castle appear
    await uniControls.start({
      x: ['100vw', uniTarget],
      transition: { duration: uniPassDuration, ease: 'linear' }
    });
    if (isSkipped.current) return;
    
    // Short pause after the building has passed
    await new Promise(resolve => setTimeout(resolve, 200));
    if (isSkipped.current) return;
    
    // 3. Reveal the queen standing there (slide her and castle into view)
    await endSceneControls.start({
      x: ['100vw', '50vw'],
      transition: { duration: endSceneDuration, ease: 'linear' }
    });
    if (isSkipped.current) return;
    
    // Once Queen is in place, stop scrolling
    setIsScrolling(false);
    
    // 4. Mario finally reaches the queen
    await marioControls.start({
      x: ['20vw', '35vw'], // move Mario closer to Queen at 50vw
      transition: { duration: 0.8, ease: 'linear' }
    });
    if (isSkipped.current) return;
    
    setIsRunning(false); // Mario stops
    
    // 5. Heart appears
    heartControls.start({
      opacity: 1,
      y: [0, -20],
      scale: [0, 1.5, 1],
      transition: { duration: 0.5, type: 'spring' }
    });

    // 6. Show ending text
    await endingTextControls.start({
      opacity: 1,
      y: [20, 0],
      transition: { duration: 1, delay: 0.5 }
    });
  };

  const skipAnimation = () => {
    isSkipped.current = true;
    
    // Stop all ongoing animations
    marioControls.stop();
    textControls.stop();
    uniControls.stop();
    endSceneControls.stop();
    heartControls.stop();
    endingTextControls.stop();
    
    const isMobile = window.innerWidth <= 768;
    const uniTarget = isMobile ? '-400vw' : '-100vw';
    
    // Set to final states immediately
    marioControls.set({ x: '35vw' });
    textControls.set({ x: '-100vw' });
    uniControls.set({ x: uniTarget });
    endSceneControls.set({ x: '50vw' });
    heartControls.set({ opacity: 1, y: -20, scale: 1 });
    endingTextControls.set({ opacity: 1, y: 0 });
    
    setIsScrolling(false);
    setIsRunning(false);
    setIsPlaying(true);
  };

  const submitForm = () => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL || "";
    fetch(`${apiUrl}/api/check_key`,{
      method:"POST",
       headers: {
    'Content-Type': 'application/json',
  },
      body: JSON.stringify({
        username: username.current.value,
        password: password.current.value
      })
    }).then(res => res.json()).then(data => {
      console.log(data);
      if(data.success){
        setIsSuccess(true);
        setErrorMessage("");
      }else{
        setIsError(true);
        setErrorMessage(data.message);
        setTimeout(() => setIsError(false), 500);
      }
    })
  };
  return (
    <div className={`game-container ${isError ? 'error-shake' : ''}`}>
      <div className="stars"></div>
      
      {/* Huge University Background */}
      <motion.div 
        className="university-bg"
        initial={{ x: '100vw' }}
        animate={uniControls}
      >
        <JSSUniversitySVG />
      </motion.div>
      
      {/* HUD elements */}
      <div className="hud">
        <div className="score-section">
          <div>MARIO</div>
          <div>092850</div>
        </div>
        <div className="coins-section">
          <div className="coin-icon"></div>
          <div><span className="cross">x</span>37</div>
        </div>
        <div className="world-section">
          <div>WORLD</div>
          <div>8-4</div>
        </div>
        <div className="time-section">
          <div>TIME</div>
          <div>183</div>
        </div>
      </div>

      {/* Ceiling */}
      <div className={`ceiling ${isScrolling ? 'scrolling' : ''}`}></div>

      {!isPlaying && (
        <button className="start-button" onClick={startGame}>
          START LEVEL
        </button>
      )}

      {/* Scrolling Text Container */}
      <motion.div 
        className="text-slider"
        initial={{ x: '100vw' }}
        animate={textControls}
      >
        <div className="jss-text">JSS</div>
        <div className="farewell-text">CLASS OF 2026</div>
      </motion.div>

      {/* Ending Text */}
      <div className="ending-text-wrapper">
        <motion.div
          className="ending-text-container"
          initial={{ opacity: 0, y: 20 }}
          animate={endingTextControls}
        >
          {errorMessage && <div className="error-notification error-top">{errorMessage}</div>}
          <AnimatePresence mode="wait">
            {!showForm && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}>
                <p>THANK YOU SENIORS!</p>
                <br/>
                <p>YOUR QUEST IS OVER.</p>
                <p>WE PRESENT YOU A NEW QUEST.</p>
                <br/>
                <p>UNLOCK THE GATES TO OUR FINAL REVEAL</p>
              </motion.div>
            )}

            {showForm && !isSuccess && (
              <motion.div key="form" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }} className="reveal-form">
                <h3>OH NO! FIND THE KEY!</h3>
                <input type="text" placeholder="Username" ref={username} onChange={() => setErrorMessage("")}/>
                <input type="password" placeholder="Password" ref={password} onChange={() => setErrorMessage("")}/>
                <button onClick={submitForm}>REVEAL</button>
              </motion.div>
            )}

            {isSuccess && !envelopeOpened && (
              <motion.div key="envelope" className="envelope-container" initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.5 } }} transition={{ duration: 0.8, type: 'spring' }}>
                <div className="envelope">
                  <div className="envelope-flap"></div>
                  <div className="envelope-body">
                    <span className="envelope-seal">★</span>
                  </div>
                </div>
                <button className="envelope-open-btn" onClick={() => setEnvelopeOpened(true)}>OPEN</button>
              </motion.div>
            )}

            {isSuccess && envelopeOpened && (
              <motion.div key="invitation" className="invitation-letter" initial={{ opacity: 0, scale: 0.5, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}>
                <h2>🎉 FAREWELL SENIORS! 🎉</h2>
                <div className="invitation-content">
                  <p>You have successfully completed the JSS level.</p>
                  <br/>
                  <p>A new world awaits you all.</p>
                  <p>Join us for the ultimate celebration!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fireworks Celebration */}
      {isSuccess && envelopeOpened && (
        <>
          <Firework x="20vw" y="30vh" color="#ff0000" delay={0} />
          <Firework x="80vw" y="20vh" color="#00ff00" delay={0.5} />
          <Firework x="50vw" y="10vh" color="#0000ff" delay={1.2} />
          <Firework x="30vw" y="50vh" color="#ffff00" delay={0.8} />
          <Firework x="70vw" y="60vh" color="#ff00ff" delay={1.5} />
          <Firework x="10vw" y="70vh" color="#00ffff" delay={2.0} />
          <Firework x="90vw" y="40vh" color="#ff8800" delay={1.8} />
          <Firework x="40vw" y="25vh" color="#ffffff" delay={2.5} />
          <Firework x="60vw" y="40vh" color="#ff00ff" delay={0.3} />
        </>
      )}

      {/* Ground */}
      <div className={`ground ${isScrolling ? 'scrolling' : ''}`}></div>
      
      {/* Mario */}
      <motion.div 
        className="mario"
        initial={{ x: '-100px' }}
        animate={marioControls}
      >
        <MarioSVG className={isRunning ? 'running' : ''} />
      </motion.div>
      
      {/* End Scene (Queen + Castle) */}
      <motion.div
        className="end-scene"
        initial={{ x: '100vw' }}
        animate={endSceneControls}
      >
        <div className="peach">
          <PrincessSVG />
          <motion.div 
            className="heart"
            initial={{ opacity: 0, scale: 0 }}
            animate={heartControls}
          >
            ❤️
          </motion.div>
        </div>
        
        <div className="castle-wrapper">
          <CastleSVG />
          <button className="reveal-button" onClick={() => setShowForm(true)}>
            REVEAL
          </button>
        </div>
      </motion.div>

      {/* Skip Button */}
      {!showForm && (
        <button className="skip-button" onClick={skipAnimation}>
          SKIP
        </button>
      )}
    </div>
  );
}

export default App;
