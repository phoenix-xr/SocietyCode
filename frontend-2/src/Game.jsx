import { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import './Game.css';
import { MarioSVGString, GoombaSVGString, CastleSVGString, PrincessSVGString, JSSUniversitySVGString, BlockSVGString } from './components/SpriteStrings';
import { useInput } from './components/useInput';

// Level Designer Config
const LevelConfig = {
  worldWidth: 7900,
  princessX: 7200,
  castleX: 7500,
  groundHeight: 64,
  ceilingHeight: 100,
  items: [
    { type: "ground", x: 0, y: 0, width: 2944, height: 64 },
    { type: "ground", x: 3072, y: 0, width: 1920, height: 64 },
    { type: "ground", x: 5120, y: 0, width: 1408, height: 64 },
    { type: "ground", x: 6592, y: 0, width: 832, height: 64 },
    { type: "enemy", x: 768, y: 64, width: 40, height: 40, vx: -3, minX: 640, maxX: 896 },
    { type: "enemy", x: 1088, y: 64, width: 40, height: 40, vx: -3, minX: 960, maxX: 1216 },
    { type: "enemy", x: 1472, y: 64, width: 40, height: 40, vx: -3, minX: 1344, maxX: 1600 },
    { type: "enemy", x: 1536, y: 64, width: 40, height: 40, vx: -3, minX: 1408, maxX: 1664 },
    { type: "pillar", x: 1792, y: 64, width: 64, height: 128 },
    { type: "enemy", x: 1984, y: 64, width: 40, height: 40, vx: -3, minX: 1856, maxX: 2112 },
    { type: "pillar", x: 2112, y: 64, width: 64, height: 192 },
    { type: "enemy", x: 2304, y: 64, width: 40, height: 40, vx: -3, minX: 2176, maxX: 2432 },
    { type: "pillar", x: 2432, y: 64, width: 64, height: 256 },
    { type: "enemy", x: 2688, y: 64, width: 40, height: 40, vx: -3, minX: 2560, maxX: 2816 },
    { type: "enemy", x: 2752, y: 64, width: 40, height: 40, vx: -3, minX: 2624, maxX: 2880 },
    { type: "enemy", x: 3264, y: 64, width: 40, height: 40, vx: -3, minX: 3136, maxX: 3392 },
    { type: "enemy", x: 3328, y: 64, width: 40, height: 40, vx: -3, minX: 3200, maxX: 3456 },
    { type: "enemy", x: 3840, y: 64, width: 40, height: 40, vx: -3, minX: 3712, maxX: 3968 },
    { type: "hardblock", x: 4160, y: 64, width: 64, height: 64 },
    { type: "hardblock", x: 4224, y: 64, width: 64, height: 128 },
    { type: "hardblock", x: 4288, y: 64, width: 64, height: 192 },
    { type: "hardblock", x: 4352, y: 64, width: 64, height: 256 },
    { type: "hardblock", x: 4480, y: 64, width: 64, height: 256 },
    { type: "hardblock", x: 4544, y: 64, width: 64, height: 192 },
    { type: "hardblock", x: 4608, y: 64, width: 64, height: 128 },
    { type: "hardblock", x: 4672, y: 64, width: 64, height: 64 },
    { type: "hardblock", x: 4736, y: 64, width: 64, height: 64 },
    { type: "hardblock", x: 4800, y: 64, width: 64, height: 128 },
    { type: "hardblock", x: 4864, y: 64, width: 64, height: 192 },
    { type: "hardblock", x: 4928, y: 64, width: 64, height: 256 },
    { type: "hardblock", x: 5120, y: 64, width: 64, height: 256 },
    { type: "hardblock", x: 5184, y: 64, width: 64, height: 192 },
    { type: "hardblock", x: 5248, y: 64, width: 64, height: 128 },
    { type: "hardblock", x: 5312, y: 64, width: 64, height: 64 },
    { type: "pillar", x: 5504, y: 64, width: 64, height: 256 },
    { type: "enemy", x: 5632, y: 64, width: 40, height: 40, vx: -3, minX: 5504, maxX: 5760 },
    { type: "enemy", x: 5696, y: 64, width: 40, height: 40, vx: -3, minX: 5568, maxX: 5824 },
    { type: "hardblock", x: 6016, y: 64, width: 64, height: 64 },
    { type: "hardblock", x: 6080, y: 64, width: 64, height: 128 },
    { type: "hardblock", x: 6144, y: 64, width: 64, height: 192 },
    { type: "hardblock", x: 6208, y: 64, width: 64, height: 256 },
    { type: "hardblock", x: 6272, y: 64, width: 64, height: 320 },
    { type: "hardblock", x: 6336, y: 64, width: 64, height: 384 },
    { type: "hardblock", x: 6400, y: 64, width: 64, height: 448 },
    { type: "hardblock", x: 6464, y: 64, width: 64, height: 512 },
    { type: "hardblock", x: 6592, y: 64, width: 64, height: 64 },
    { type: "ground", x: 6592, y: 0, width: 1308, height: 64 }
  ]
};

function Game() {
  const [showMessage, setShowMessage] = useState(false);
  const [hidePrompt, setHidePrompt] = useState(false);
  
  const pixiContainerRef = useRef(null);
  const worldDomRef = useRef(null);
  const appRef = useRef(null);
  const keys = useInput();
  
  const marioPosRef = useRef({ 
    x: 50, y: 64, vx: 0, vy: 0, width: 64, height: 64, 
    onGround: true, jumpHeld: false, inCutscene: false, messageTriggered: false
  });
  
  const keysRef = useRef(keys);
  const mobileKeysRef = useRef({ ArrowLeft: false, ArrowRight: false, Space: false });
  
  useEffect(() => {
    keysRef.current = keys;
    if (Object.values(keys).some(val => val === true)) {
      setHidePrompt(true);
    }
  }, [keys]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidePrompt(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!pixiContainerRef.current || appRef.current) return;

    let isCancelled = false;

    const initPixi = async () => {
      const app = new PIXI.Application();
      await app.init({ 
        resizeTo: window,
        backgroundAlpha: 0,
      });
      if (isCancelled) {
         app.destroy(true, { children: true });
         return;
      }
      appRef.current = app;
      pixiContainerRef.current.appendChild(app.canvas);

      app.canvas.style.position = 'absolute';
      app.canvas.style.top = '0';
      app.canvas.style.left = '0';
      app.canvas.style.zIndex = '5';

      const bgContainer = new PIXI.Container();
      const worldContainer = new PIXI.Container();
      app.stage.addChild(bgContainer);
      app.stage.addChild(worldContainer);

      const loadTexture = async (svgStr) => {
        return await PIXI.Assets.load(`data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`);
      };

      const marioTex = await loadTexture(MarioSVGString);
      const jssTex = await loadTexture(JSSUniversitySVGString);
      const goombaTex = await loadTexture(GoombaSVGString);
      const castleTex = await loadTexture(CastleSVGString);
      const princessTex = await loadTexture(PrincessSVGString);
      const blockTex = await loadTexture(BlockSVGString);

      const jssSprite = new PIXI.Sprite(jssTex);
      jssSprite.alpha = 0.4;
      jssSprite.x = 600;
      bgContainer.addChild(jssSprite);

      const jssText = new PIXI.Text({ text: 'JSS\nCLASS OF 2026', style: { fill: '#ffffff', fontSize: 60, align: 'center', fontFamily: "'Press Start 2P', monospace" } });
      jssText.x = 1200;
      jssText.alpha = 0.3;
      bgContainer.addChild(jssText);

      const obstacles = JSON.parse(JSON.stringify(LevelConfig.items));
      const enemySprites = [];

      obstacles.forEach(obs => {
        if (obs.type === 'ground' || obs.type === 'hardblock') {
          const groundBox = new PIXI.TilingSprite({
            texture: blockTex,
            width: obs.width,
            height: obs.height
          });
          groundBox.x = obs.x;
          worldContainer.addChild(groundBox);
          obs.sprite = groundBox;
        } else if (obs.type === 'pillar') {
          const pipe = new PIXI.Graphics();
          worldContainer.addChild(pipe);
          obs.graphics = pipe;
        } else if (obs.type === 'enemy') {
          const enemy = new PIXI.Sprite(goombaTex);
          enemy.width = obs.width;
          enemy.height = obs.height;
          worldContainer.addChild(enemy);
          enemySprites.push({ data: obs, sprite: enemy });
        }
      });

      const ceiling = new PIXI.TilingSprite({
        texture: blockTex,
        width: LevelConfig.worldWidth,
        height: LevelConfig.ceilingHeight
      });
      worldContainer.addChild(ceiling);

      const princess = new PIXI.Sprite(princessTex);
      princess.x = LevelConfig.princessX;
      princess.width = 64;
      princess.height = 64;
      worldContainer.addChild(princess);

      const castle = new PIXI.Sprite(castleTex);
      castle.x = LevelConfig.castleX;
      castle.width = 256;
      castle.height = 256;
      worldContainer.addChild(castle);

      const mario = new PIXI.Sprite(marioTex);
      mario.width = 64;
      mario.height = 64;
      worldContainer.addChild(mario);

      app.ticker.add(() => {
        const currentKeys = keysRef.current;
        const marioState = marioPosRef.current;
        const sh = app.screen.height;

        if (marioState.x >= LevelConfig.princessX - 200 && !marioState.inCutscene) {
          marioState.inCutscene = true;
        }

        if (marioState.inCutscene) {
           if (marioState.x < LevelConfig.princessX - 50) {
              marioState.vx = 4;
           } else {
              marioState.vx = 0;
              if (!marioState.messageTriggered) {
                 marioState.messageTriggered = true;
                 setShowMessage(true);
              }
           }
        } else {
           if (currentKeys["ArrowRight"] || currentKeys["KeyD"] || mobileKeysRef.current.ArrowRight) {
              marioState.vx = 7;
           } else if (currentKeys["ArrowLeft"] || currentKeys["KeyA"] || mobileKeysRef.current.ArrowLeft) {
              marioState.vx = -7;
           } else {
              marioState.vx = 0;
           }
        }
        
        marioState.x += marioState.vx;
        if (marioState.x < 0) marioState.x = 0;

        for (let obs of obstacles) {
          if (obs.type === 'pillar' || obs.type === 'ground' || obs.type === 'hardblock') {
            if (marioState.x < obs.x + obs.width &&
                marioState.x + marioState.width > obs.x &&
                marioState.y + 16 < obs.y + obs.height &&
                marioState.y + marioState.height > obs.y) {
               
               if (marioState.vx > 0) marioState.x = obs.x - marioState.width;
               else if (marioState.vx < 0) marioState.x = obs.x + obs.width;
               marioState.vx = 0;
            }
          }
        }

        marioState.vy -= 0.8; 
        marioState.y += marioState.vy;
        marioState.onGround = false;

        if (marioState.y < -100) {
           marioState.x = 50;
           marioState.y = 150;
           marioState.vx = 0;
           marioState.vy = 0;
        }

        for (let obs of obstacles) {
          if (obs.type === 'pillar' || obs.type === 'ground' || obs.type === 'hardblock') {
            if (marioState.x < obs.x + obs.width &&
                marioState.x + marioState.width > obs.x &&
                marioState.y < obs.y + obs.height &&
                marioState.y + marioState.height > obs.y) {
               
               if (marioState.vy < 0) {
                  marioState.y = obs.y + obs.height;
                  marioState.vy = 0;
                  marioState.onGround = true;
               }
            }
          }
        }

        if (!marioState.inCutscene) {
          const jumpPressed = currentKeys["Space"] || currentKeys["ArrowUp"] || currentKeys["KeyW"] || mobileKeysRef.current.Space;
          if (jumpPressed && marioState.onGround && !marioState.jumpHeld) {
            marioState.vy = 18;
            marioState.onGround = false;
            marioState.jumpHeld = true;
          } else if (!jumpPressed) {
            marioState.jumpHeld = false;
          }
        }

        for (let obj of enemySprites) {
          let obs = obj.data;
          let sprite = obj.sprite;
          
          if (obs.dead) continue;

          obs.x += obs.vx;
          if (obs.x <= obs.minX) { obs.x = obs.minX; obs.vx *= -1; }
          else if (obs.x + obs.width >= obs.maxX) { obs.x = obs.maxX - obs.width; obs.vx *= -1; }

          if (marioState.x < obs.x + obs.width &&
              marioState.x + marioState.width > obs.x &&
              marioState.y < obs.y + obs.height &&
              marioState.y + marioState.height > obs.y) {
              
              if (marioState.vy < 0 && marioState.y > obs.y + 10) {
                 marioState.vy = 12;
                 obs.dead = true;
                 sprite.visible = false;
              } else {
                 marioState.x = 50;
                 marioState.y = 150;
                 marioState.vx = 0;
                 marioState.vy = 0;
              }
          }
          sprite.x = obs.x;
          sprite.y = sh - obs.y - obs.height;
        }
        
        const followThreshold = app.screen.width / 3;
        let cameraX = 0;
        if (marioState.x > followThreshold) {
           cameraX = marioState.x - followThreshold;
        }

        mario.y = sh - marioState.y - marioState.height;

        if (marioState.vx < 0) {
          mario.scale.x = -1;
          mario.x = marioState.x + 64;
        } else if (marioState.vx > 0) {
          mario.scale.x = 1;
          mario.x = marioState.x;
        } else {
          // preserve direction if not moving, just ensure x matches scale
          mario.x = mario.scale.x < 0 ? marioState.x + 64 : marioState.x;
        }
        
        if (marioState.vx !== 0 && marioState.onGround) {
           mario.y += Math.sin(Date.now() / 50) * 4;
        }

        worldContainer.x = -cameraX;
        bgContainer.x = -cameraX * 0.7;
        
        if (worldDomRef.current) {
           worldDomRef.current.style.transform = `translateX(-${cameraX}px)`;
        }
        
        jssSprite.y = sh - 64 - 400;
        jssText.y = sh * 0.35;

        princess.y = sh - LevelConfig.groundHeight - 64;
        castle.y = sh - LevelConfig.groundHeight - 256;

        ceiling.y = 0;

        for (let obs of obstacles) {
           if (obs.type === 'ground' || obs.type === 'hardblock') {
              obs.sprite.y = sh - obs.y - obs.height;
           } else if (obs.type === 'pillar') {
              obs.graphics.clear();
              obs.graphics.rect(obs.x, sh - obs.y - obs.height, obs.width, 24);
              obs.graphics.fill(0x5c940d);
              obs.graphics.stroke({ color: 0x000000, width: 2 });
              obs.graphics.rect(obs.x + 4, sh - obs.y - obs.height, 8, 24);
              obs.graphics.fill(0xb5e61d);
              obs.graphics.rect(obs.x + obs.width - 12, sh - obs.y - obs.height, 8, 24);
              obs.graphics.fill(0x184f00);

              obs.graphics.rect(obs.x + 4, sh - obs.y - obs.height + 24, obs.width - 8, obs.height - 24);
              obs.graphics.fill(0x5c940d);
              obs.graphics.stroke({ color: 0x000000, width: 2 });
              obs.graphics.rect(obs.x + 8, sh - obs.y - obs.height + 24, 8, obs.height - 24);
              obs.graphics.fill(0xb5e61d);
              obs.graphics.rect(obs.x + obs.width - 16, sh - obs.y - obs.height + 24, 8, obs.height - 24);
              obs.graphics.fill(0x184f00);
           }
        }

      });
    };
    
    initPixi();

    return () => {
      isCancelled = true;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []);

  return (
    <div className="game-container" style={{ overflow: 'hidden', position: 'relative' }}>
      <div className="stars" style={{ zIndex: 0 }}></div>
      <div ref={pixiContainerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5 }} />
      
      <div ref={worldDomRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', willChange: 'transform', zIndex: 10, pointerEvents: 'none' }}>
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
            <div style={{
              position: 'absolute',
              left: '7232px',
              bottom: '150px',
              color: '#ff3366',
              fontSize: '24px',
              zIndex: 20,
              transform: 'translateX(-50%)',
              animation: 'fadeInButton 1s ease-in'
            }}>
              ❤️
            </div>

            <button style={{
              position: 'absolute',
              left: '7600px',
              bottom: '100px',
              backgroundColor: 'black',
              color: 'white',
              border: '4px solid white',
              padding: '20px 40px',
              fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace",
              fontWeight: 'bold',
              fontSize: '28px',
              cursor: 'pointer',
              zIndex: 20,
              pointerEvents: 'auto',
              transform: 'translateX(-50%)',
              boxShadow: 'inset -4px -4px 0px rgba(0,0,0,0.5), inset 4px 4px 0px rgba(255,255,255,0.3)',
              animation: 'fadeInButton 2s ease-in'
            }} onClick={() => alert("Farewell Dashboard!")}>
              FAREWELL DASHBOARD
            </button>

            <div className="ending-text-wrapper" style={{
              position: 'absolute',
              left: '7350px',
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
      </div>

      {!hidePrompt && (
        <>
          <div className="desktop-prompt" style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace",
            textAlign: 'center',
            textShadow: '4px 4px 0 #000',
            zIndex: 1000,
            pointerEvents: 'none',
            width: '90%'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '20px' }}>REACH THE END TO REVEAL YOUR INVITATION</div>
            <div style={{ fontSize: '18px', color: '#ffcc00' }}>MOVE MARIO USING WASD OR ARROW KEYS</div>
          </div>
        </>
      )}

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
            @media (max-width: 767px) {
              .desktop-prompt { display: none !important; }
            }
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
            onPointerDown={() => { setHidePrompt(true); mobileKeysRef.current.ArrowLeft = true; }}
            onPointerUp={() => mobileKeysRef.current.ArrowLeft = false}
            onPointerLeave={() => mobileKeysRef.current.ArrowLeft = false}
            onPointerCancel={() => mobileKeysRef.current.ArrowLeft = false}
          >◀</div>
          <div 
            className="mobile-btn"
            onPointerDown={() => { setHidePrompt(true); mobileKeysRef.current.ArrowRight = true; }}
            onPointerUp={() => mobileKeysRef.current.ArrowRight = false}
            onPointerLeave={() => mobileKeysRef.current.ArrowRight = false}
            onPointerCancel={() => mobileKeysRef.current.ArrowRight = false}
          >▶</div>
        </div>
        <div>
          <div 
            className="mobile-btn"
            style={{ borderRadius: '50%' }}
            onPointerDown={() => { setHidePrompt(true); mobileKeysRef.current.Space = true; }}
            onPointerUp={() => mobileKeysRef.current.Space = false}
            onPointerLeave={() => mobileKeysRef.current.Space = false}
            onPointerCancel={() => mobileKeysRef.current.Space = false}
          >A</div>
        </div>
      </div>
    </div>
  );
}

export default Game;