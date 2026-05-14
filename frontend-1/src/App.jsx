import { useRef, useEffect, useState } from 'react';
import './App.css';
import { MarioSVG, JSSUniversitySVG, PrincessSVG, CastleSVG, GoombaSVG } from './components/Sprites';
import {useInput} from './components/useInput';

// 1. Hole first
// 2. Confined space (two pillars)
// 3. Moving enemy inside the confined space
const obstacles = [
  { id: 1, type: 'hole', x: 400, y: 0, width: 150, height: 64 }, 
  { id: 2, type: 'pillar', x: 800, y: 64, width: 64, height: 96 },
  { id: 3, type: 'enemy', x: 950, y: 64, width: 40, height: 40, vx: -3, minX: 864, maxX: 1200 }, // Enemy patrols between pillars
  { id: 4, type: 'pillar', x: 1200, y: 64, width: 64, height: 96 },
];

function App() {
  const [showMessage, setShowMessage] = useState(false);
  const [hideMobilePrompt, setHideMobilePrompt] = useState(false);
  const marioDomRef = useRef(null);
  const worldDomRef = useRef(null);
  const bgDomRef = useRef(null);
  const enemiesRef = useRef({});
  const keys = useInput();
  
  // Track abstract world coordinates and velocity
  const marioPosRef = useRef({ 
    x: 50, 
    y: 64, 
    vx: 0, 
    vy: 0, 
    width: 64, 
    height: 64, 
    onGround: true,
    jumpHeld: false,
    inCutscene: false,
    messageTriggered: false
  });
  
  const cameraXRef = useRef(0);
  const keysRef = useRef(keys);
  const mobileKeysRef = useRef({ ArrowLeft: false, ArrowRight: false, Space: false });
  
  useEffect(() => {
    keysRef.current = keys;
  }, [keys]);

  useEffect(() => {
    let animationFrameId;

    const update = () => {
      const currentKeys = keysRef.current;
      const mario = marioPosRef.current;

      // 1. Horizontal Movement & Cutscene Logic
      if (mario.x >= 3400 && !mario.inCutscene) {
        mario.inCutscene = true;
      }

      if (mario.inCutscene) {
         if (mario.x < 3550) {
            mario.vx = 4; // Auto-walk towards princess
         } else {
            mario.vx = 0; // Reached princess
            if (!mario.messageTriggered) {
               mario.messageTriggered = true;
               setShowMessage(true);
            }
         }
      } else {
         if (currentKeys["ArrowRight"] || currentKeys["KeyD"] || mobileKeysRef.current.ArrowRight) {
            mario.vx = 7;
         } else if (currentKeys["ArrowLeft"] || currentKeys["KeyA"] || mobileKeysRef.current.ArrowLeft) {
            mario.vx = -7;
         } else {
            mario.vx = 0;
         }
      }
      
      mario.x += mario.vx;
      
      // Left boundary
      if (mario.x < 0) mario.x = 0;

      // Horizontal Collision with pillars (AABB)
      for (let obs of obstacles) {
        if (obs.type === 'pillar') {
          // Add +16 offset to y to prevent getting snagged on corners when jumping over
          if (mario.x < obs.x + obs.width &&
              mario.x + mario.width > obs.x &&
              mario.y + 16 < obs.y + obs.height &&
              mario.y + mario.height > obs.y) {
             
             if (mario.vx > 0) { // Hit left side of pillar
                mario.x = obs.x - mario.width;
             } else if (mario.vx < 0) { // Hit right side of pillar
                mario.x = obs.x + obs.width;
             }
             mario.vx = 0;
          }
        }
      }

      // 2. Vertical Movement & Gravity
      // Always apply gravity to consistently check ground state, ensuring you can jump off pillars
      mario.vy -= 0.8; 
      mario.y += mario.vy;
      
      mario.onGround = false;

      // Check Hole Logic
      let inHole = false;
      for (let obs of obstacles) {
        if (obs.type === 'hole') {
           const marioCenter = mario.x + mario.width / 2;
           if (marioCenter > obs.x && marioCenter < obs.x + obs.width) {
              inHole = true;
           }
        }
      }

      // Floor Collision (Ground is at y=64)
      if (!inHole && mario.y <= 64) {
         mario.y = 64;
         mario.vy = 0;
         mario.onGround = true;
      } else if (inHole && mario.y < -100) {
         // Reset Mario if he falls down the hole
         mario.x = 50;
         mario.y = 150;
         mario.vx = 0;
         mario.vy = 0;
      }

      // Vertical Collision with pillars
      for (let obs of obstacles) {
        if (obs.type === 'pillar') {
          if (mario.x < obs.x + obs.width &&
              mario.x + mario.width > obs.x &&
              mario.y < obs.y + obs.height &&
              mario.y + mario.height > obs.y) {
             
             if (mario.vy < 0) { // Falling onto the pillar
                mario.y = obs.y + obs.height;
                mario.vy = 0;
                mario.onGround = true;
             }
             // Removed ceiling bump for pillars since they are rooted to the ground.
             // This completely fixes the corner teleport bug!
          }
        }
      }

      // 3. Jump Action (Single jump enforce)
      if (!mario.inCutscene) {
        const jumpPressed = currentKeys["Space"] || currentKeys["ArrowUp"] || currentKeys["KeyW"] || mobileKeysRef.current.Space;
        if (jumpPressed && mario.onGround && !mario.jumpHeld) {
          mario.vy = 18; // Increased jump power to easily clear pillars
          mario.onGround = false;
          mario.jumpHeld = true;
        } else if (!jumpPressed) {
          mario.jumpHeld = false;
        }
      }

      // 4. Enemy AI & Collision
      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        if (obs.type === 'enemy') {
          // Patrol logic
          obs.x += obs.vx;
          if (obs.x <= obs.minX) {
             obs.x = obs.minX;
             obs.vx *= -1; // bounce right
          } else if (obs.x + obs.width >= obs.maxX) {
             obs.x = obs.maxX - obs.width;
             obs.vx *= -1; // bounce left
          }

          // Enemy collision with Mario
          if (mario.x < obs.x + obs.width &&
              mario.x + mario.width > obs.x &&
              mario.y < obs.y + obs.height &&
              mario.y + mario.height > obs.y) {
              
              if (mario.vy < 0 && mario.y > obs.y + obs.height - 20) {
                 // Stomp enemy!
                 mario.vy = 12; // Bounce off
                 obs.x = -1000; // Remove enemy from screen
              } else {
                 // Mario takes damage (reset game for now)
                 mario.x = 50;
                 mario.y = 150;
                 mario.vx = 0;
                 mario.vy = 0;
              }
          }

          // Directly update Enemy DOM for performance
          if (enemiesRef.current[i]) {
            enemiesRef.current[i].style.left = `${obs.x}px`;
          }
        }
      }
      
      // 5. Calculate Camera
      const followThreshold = window.innerWidth / 3;
      if (mario.x > followThreshold) {
         cameraXRef.current = mario.x - followThreshold;
      } else {
         cameraXRef.current = 0;
      }

      // 6. Apply Mario DOM updates
      if (marioDomRef.current) {
        marioDomRef.current.style.left = `${mario.x}px`;
        marioDomRef.current.style.bottom = `${mario.y}px`;
        
        const svg = marioDomRef.current.querySelector('svg');
        if (svg) {
          if (mario.vx !== 0 && mario.onGround) svg.classList.add('running');
          else svg.classList.remove('running');
          
          if (mario.vx < 0) svg.style.transform = 'scaleX(-1)';
          else if (mario.vx > 0) svg.style.transform = 'scaleX(1)';
        }
      }
      
      // 7. Apply Camera DOM updates
      if (worldDomRef.current) {
        worldDomRef.current.style.transform = `translateX(-${cameraXRef.current}px)`;
      }

      if (bgDomRef.current) {
        bgDomRef.current.style.transform = `translateX(-${cameraXRef.current * 0.7}px)`;
      }
      
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="game-container" style={{ overflow: 'hidden', position: 'relative' }}>
      
      {/* Cutscene overlay moved inside world wrapper */}

      {/* 
        1. Background Layer (zIndex: 0) 
        The stars sit behind everything.
      */}
      <div className="stars" style={{ zIndex: 0 }}></div>
      
      {/* 
        2. Parallax Building Layer (zIndex: 1) 
        Using low z-index so it stays far BEHIND the ground, Mario, and obstacles!
      */}
      <div ref={bgDomRef} style={{ position: 'absolute', width: '5000px', height: '100%', willChange: 'transform', zIndex: 1, pointerEvents: 'none' }}>
         <div className="university-bg" style={{ position: 'absolute', opacity: 0.4, width: '800px', marginLeft: '600px', bottom: '64px' }}>
            <JSSUniversitySVG />
         </div>
         {/* JSS CLASS OF 2026 text scrolling at the same speed as the building */}
         <div className="text-slider" style={{ position: 'absolute', left: '1200px', top: '35%', textAlign: 'center', opacity: 0.3, width: '100vw' }}>
            <div className="jss-text">JSS</div>
            <div className="farewell-text">CLASS OF 2026</div>
         </div>
      </div>

      <div className="ceiling" style={{ width: '100vw', zIndex: 10 }}></div>

      {/* 
        3. Foreground World Container (zIndex: 10) 
        Everything here is placed physically in front of the building.
      */}
      <div ref={worldDomRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', willChange: 'transform', zIndex: 10 }}>
        
        {/* Solid Ground */}
        <div className="ground" style={{ width: '5000px', left: 0 }}></div>

        {/* Render Dynamic Obstacles */}
        {obstacles.map((obs, i) => {
          if (obs.type === 'hole') {
            return (
              <div 
                key={obs.id}
                style={{
                  position: 'absolute',
                  left: `${obs.x}px`,
                  bottom: `0px`,
                  width: `${obs.width}px`,
                  height: `64px`, // Equal to ground height
                  backgroundColor: '#0c0032', // Matches the night sky background perfectly
                  zIndex: 11 // Just above the ground to mask it
                }}
              />
            );
          } else if (obs.type === 'enemy') {
             return (
              <div 
                key={obs.id}
                ref={el => enemiesRef.current[i] = el}
                style={{
                  position: 'absolute',
                  left: `${obs.x}px`,
                  bottom: `${obs.y}px`,
                  width: `${obs.width}px`,
                  height: `${obs.height}px`,
                  zIndex: 15
                }}
              >
                 <GoombaSVG />
              </div>
            );
          } else { // Pillar styled as Detailed Mario Pipe
            return (
              <div 
                key={obs.id}
                style={{
                  position: 'absolute',
                  left: `${obs.x}px`,
                  bottom: `${obs.y}px`,
                  width: `${obs.width}px`,
                  height: `${obs.height}px`,
                  zIndex: 15
                }}
              >
                {/* Pipe Lip */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '24px',
                  backgroundColor: '#5c940d',
                  border: '2px solid #000',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ position: 'absolute', top: 0, left: '4px', width: '8px', height: '100%', backgroundColor: '#b5e61d' }} />
                  <div style={{ position: 'absolute', top: 0, right: '4px', width: '8px', height: '100%', backgroundColor: '#184f00' }} />
                </div>
                {/* Pipe Body */}
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  left: '4px',
                  width: 'calc(100% - 8px)',
                  height: 'calc(100% - 24px)',
                  backgroundColor: '#5c940d',
                  border: '2px solid #000',
                  borderTop: 'none',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ position: 'absolute', top: 0, left: '4px', width: '8px', height: '100%', backgroundColor: '#b5e61d' }} />
                  <div style={{ position: 'absolute', top: 0, right: '4px', width: '8px', height: '100%', backgroundColor: '#184f00' }} />
                </div>
              </div>
            );
          }
        })}

        {/* Princess and Castle End Sequence */}
        <div style={{ position: 'absolute', left: '3600px', bottom: '64px', width: '64px', height: '64px', zIndex: 10 }}>
          <PrincessSVG />
        </div>
        <div style={{ position: 'absolute', left: '3700px', bottom: '64px', width: '256px', height: '256px', zIndex: 5 }}>
          <CastleSVG />
        </div>

        {/* Dynamic Final Cutscene Elements */}
        {showMessage && (
          <>
            <style>
              {`
                @keyframes fadeInUpText {
                  0% { opacity: 0; transform: translateY(20px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInButton {
                  0% { opacity: 0; }
                  100% { opacity: 1; }
                }
              `}
            </style>
            {/* Heart above princess */}
            <div style={{
              position: 'absolute',
              left: '3632px',
              bottom: '150px',
              color: '#ff3366',
              fontSize: '24px',
              zIndex: 20,
              transform: 'translateX(-50%)',
              animation: 'fadeInButton 1s ease-in'
            }}>
              ❤️
            </div>

            {/* REVEAL button on Castle Door */}
            <button style={{
              position: 'absolute',
              left: '3828px',
              bottom: '80px',
              backgroundColor: 'black',
              color: 'white',
              border: '2px solid white',
              padding: '10px 20px',
              fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace",
              fontWeight: 'bold',
              fontSize: '18px',
              cursor: 'pointer',
              zIndex: 20,
              transform: 'translateX(-50%)',
              boxShadow: 'inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.3)',
              animation: 'fadeInButton 2s ease-in'
            }} onClick={() => alert("Reveal form!")}>
              REVEAL
            </button>

            {/* Floating Pixel Text in Sky */}
            <div className="ending-text-wrapper" style={{
              position: 'absolute',
              left: '3700px',
              bottom: '380px',
              transform: 'translateX(-50%)',
              zIndex: 20,
              width: '90vw',
              maxWidth: '1000px'
            }}>
              <style>
                {`
                  @media (max-width: 768px) {
                    .ending-text-wrapper {
                      bottom: 250px !important;
                    }
                    .ending-text-wrapper p {
                      font-size: 14px !important;
                      margin-bottom: 15px !important;
                    }
                  }
                `}
              </style>
              <div style={{
                color: 'white',
                textAlign: 'center',
                fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace",
                fontWeight: 'bold',
                textShadow: '3px 3px 0 #000',
                letterSpacing: '2px',
                animation: 'fadeInUpText 1.5s ease-out forwards'
              }}>
                <p style={{ fontSize: '24px', marginBottom: '30px' }}>THANK YOU SENIORS!</p>
                <p style={{ fontSize: '18px', marginBottom: '40px' }}>YOUR QUEST IS OVER.</p>
                <p style={{ fontSize: '20px' }}>UNLOCK THE GATES TO OUR FINAL REVEAL</p>
              </div>
            </div>
          </>
        )}

        {/* Mario */}
        <div 
          ref={marioDomRef}
          className="mario"
          style={{ 
            position: 'absolute',
            left: '50px',
            bottom: '64px',
            width: '64px',
            height: '64px',
            zIndex: 20
          }}
        >
          <MarioSVG />
        </div>
        
        
      </div>

      {/* Mobile Prompt Text */}
      {!hideMobilePrompt && (
        <div className="mobile-prompt" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace",
          fontSize: '12px',
          textAlign: 'center',
          textShadow: '2px 2px 0 #000',
          zIndex: 1000,
          pointerEvents: 'none',
          width: '90%'
        }}>
          MOVE MARIO USING BUTTONS BELOW
        </div>
      )}

      {/* Mobile Controls Overlay */}
      <div className="mobile-controls" style={{
        position: 'fixed',
        bottom: '20px',
        left: '0',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxSizing: 'border-box',
        zIndex: 1000,
        pointerEvents: 'none'
      }}>
        <style>
          {`
            @media (min-width: 768px) {
              .mobile-controls, .mobile-prompt { display: none !important; }
            }
            .mobile-btn {
              pointer-events: auto;
              width: 60px;
              height: 60px;
              background-color: rgba(255, 255, 255, 0.3);
              border: 2px solid rgba(255, 255, 255, 0.5);
              border-radius: 10px;
              color: white;
              font-size: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
              user-select: none;
              touch-action: none;
            }
            .mobile-btn:active {
              background-color: rgba(255, 255, 255, 0.6);
            }
          `}
        </style>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div 
            className="mobile-btn"
            onPointerDown={() => { setHideMobilePrompt(true); mobileKeysRef.current.ArrowLeft = true; }}
            onPointerUp={() => mobileKeysRef.current.ArrowLeft = false}
            onPointerLeave={() => mobileKeysRef.current.ArrowLeft = false}
            onPointerCancel={() => mobileKeysRef.current.ArrowLeft = false}
          >◀</div>
          <div 
            className="mobile-btn"
            onPointerDown={() => { setHideMobilePrompt(true); mobileKeysRef.current.ArrowRight = true; }}
            onPointerUp={() => mobileKeysRef.current.ArrowRight = false}
            onPointerLeave={() => mobileKeysRef.current.ArrowRight = false}
            onPointerCancel={() => mobileKeysRef.current.ArrowRight = false}
          >▶</div>
        </div>
        <div>
          <div 
            className="mobile-btn"
            style={{ borderRadius: '50%' }}
            onPointerDown={() => { setHideMobilePrompt(true); mobileKeysRef.current.Space = true; }}
            onPointerUp={() => mobileKeysRef.current.Space = false}
            onPointerLeave={() => mobileKeysRef.current.Space = false}
            onPointerCancel={() => mobileKeysRef.current.Space = false}
          >A</div>
        </div>
      </div>
    </div>
  );
}

export default App;