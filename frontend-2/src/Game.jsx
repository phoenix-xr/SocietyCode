import { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import './Game.css';
import { MarioSVGString, GoombaSVGString, CastleSVGString, PrincessSVGString, JSSUniversitySVGString, BlockSVGString, SpringSVGString, MarioDeadSVGString } from './components/SpriteStrings';
import { useInput } from './components/useInput';

// Level Designer Config
const LevelConfig = {
  "worldWidth": 16640,
  "princessX": 13376,
  "castleX": 13526,
  "groundHeight": 64,
  "ceilingHeight": 100,
  "items": [
    {
      "type": "ground",
      "x": 0,
      "y": 0,
      "width": 2944,
      "height": 64
    },
    {
      "type": "ground",
      "x": 3072,
      "y": 0,
      "width": 1920,
      "height": 64
    },
    {
      "type": "ground",
      "x": 5120,
      "y": 0,
      "width": 1408,
      "height": 64
    },
    {
      "type": "ground",
      "x": 6592,
      "y": 0,
      "width": 832,
      "height": 64
    },
    {
      "type": "ground",
      "x": 7616,
      "y": 0,
      "width": 128,
      "height": 64
    },
    {
      "type": "ground",
      "x": 7872,
      "y": 0,
      "width": 192,
      "height": 64
    },
    {
      "type": "ground",
      "x": 8192,
      "y": 0,
      "width": 576,
      "height": 64
    },
    {
      "type": "ground",
      "x": 9024,
      "y": 0,
      "width": 640,
      "height": 64
    },
    {
      "type": "ground",
      "x": 9920,
      "y": 0,
      "width": 704,
      "height": 64
    },
    {
      "type": "ground",
      "x": 10944,
      "y": 0,
      "width": 1984,
      "height": 64
    },
    {
      "type": "ground",
      "x": 13120,
      "y": 0,
      "width": 3520,
      "height": 64
    },
    {
      "type": "enemy",
      "x": 768,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 640,
      "maxX": 896
    },
    {
      "type": "enemy",
      "x": 1088,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 960,
      "maxX": 1216
    },
    {
      "type": "enemy",
      "x": 1472,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 1344,
      "maxX": 1600
    },
    {
      "type": "enemy",
      "x": 1536,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 1408,
      "maxX": 1664
    },
    {
      "type": "pillar",
      "x": 1792,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "enemy",
      "x": 1984,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 1856,
      "maxX": 2112
    },
    {
      "type": "pillar",
      "x": 2112,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "enemy",
      "x": 2304,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 2176,
      "maxX": 2432
    },
    {
      "type": "pillar",
      "x": 2432,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "enemy",
      "x": 2688,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 2560,
      "maxX": 2816
    },
    {
      "type": "enemy",
      "x": 2752,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 2624,
      "maxX": 2880
    },
    {
      "type": "enemy",
      "x": 3264,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 3136,
      "maxX": 3392
    },
    {
      "type": "enemy",
      "x": 3328,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 3200,
      "maxX": 3456
    },
    {
      "type": "enemy",
      "x": 3840,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 3712,
      "maxX": 3968
    },
    {
      "type": "hardblock",
      "x": 4160,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "hardblock",
      "x": 4224,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 4288,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 4352,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 4480,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 4544,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 4608,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 4672,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "hardblock",
      "x": 4736,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "hardblock",
      "x": 4800,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 4864,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 4928,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 5120,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 5184,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 5248,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 5312,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "pillar",
      "x": 5504,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "enemy",
      "x": 5632,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 5504,
      "maxX": 5760
    },
    {
      "type": "enemy",
      "x": 5696,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 5568,
      "maxX": 5824
    },
    {
      "type": "hardblock",
      "x": 6016,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "hardblock",
      "x": 6080,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 6144,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 6208,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 6272,
      "y": 64,
      "width": 64,
      "height": 320
    },
    {
      "type": "hardblock",
      "x": 6336,
      "y": 64,
      "width": 64,
      "height": 384
    },
    {
      "type": "hardblock",
      "x": 6400,
      "y": 64,
      "width": 64,
      "height": 448
    },
    {
      "type": "hardblock",
      "x": 6464,
      "y": 64,
      "width": 64,
      "height": 512
    },
    {
      "type": "hardblock",
      "x": 6592,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "spring",
      "x": 7936,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "pillar",
      "x": 8192,
      "y": 64,
      "width": 64,
      "height": 320
    },
    {
      "type": "pillar",
      "x": 8448,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "pillar",
      "x": 8704,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 9024,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 9088,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 9152,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 9216,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 9280,
      "y": 64,
      "width": 64,
      "height": 384
    },
    {
      "type": "hardblock",
      "x": 9344,
      "y": 64,
      "width": 64,
      "height": 384
    },
    {
      "type": "hardblock",
      "x": 9728,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 9792,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 9920,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "hardblock",
      "x": 9984,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 10048,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 10112,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 10240,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 10304,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 10368,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 10432,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "pillar",
      "x": 10560,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "enemy",
      "x": 11072,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 10944,
      "maxX": 11968
    },
    {
      "type": "enemy",
      "x": 11520,
      "y": 64,
      "width": 40,
      "height": 40,
      "vx": -3,
      "minX": 10944,
      "maxX": 11968
    },
    {
      "type": "pillar",
      "x": 12032,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 12224,
      "y": 64,
      "width": 64,
      "height": 64
    },
    {
      "type": "hardblock",
      "x": 12288,
      "y": 64,
      "width": 64,
      "height": 128
    },
    {
      "type": "hardblock",
      "x": 12352,
      "y": 64,
      "width": 64,
      "height": 192
    },
    {
      "type": "hardblock",
      "x": 12416,
      "y": 64,
      "width": 64,
      "height": 256
    },
    {
      "type": "hardblock",
      "x": 12480,
      "y": 64,
      "width": 64,
      "height": 320
    },
    {
      "type": "hardblock",
      "x": 12544,
      "y": 64,
      "width": 64,
      "height": 384
    },
    {
      "type": "hardblock",
      "x": 12608,
      "y": 64,
      "width": 64,
      "height": 448
    },
    {
      "type": "hardblock",
      "x": 12672,
      "y": 64,
      "width": 64,
      "height": 512
    },
    {
      "type": "hardblock",
      "x": 12736,
      "y": 64,
      "width": 64,
      "height": 576
    },
    {
      "type": "hardblock",
      "x": 12800,
      "y": 64,
      "width": 64,
      "height": 576
    },
    {
      "type": "hardblock",
      "x": 13120,
      "y": 64,
      "width": 64,
      "height": 128
    }
  ]
}
;
function Game({ onOpenDashboard }) {
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
      setTimeout(() => setHidePrompt(true), 0);
    }
  }, [keys]);

  // Called when user clicks FAREWELL DASHBOARD button
  const handleFarewellClick = async () => {
    const username = localStorage.getItem('fw_username');
    if (username) {
      try {
        await fetch('https://society-backend-ashy.vercel.app/api/update_game_status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
      } catch (err) {
        console.error('update_game_status failed:', err);
        // still open dashboard even if this call fails
      }
    }
    onOpenDashboard?.();
  };


  useEffect(() => {
    if (!pixiContainerRef.current || appRef.current) return;

    let isCancelled = false;

    const initPixi = async () => {
      const app = new PIXI.Application();
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        antialias: false,              // big win on low-end GPUs
        powerPreference: 'high-performance',
        autoDensity: true,             // handles devicePixelRatio automatically
        resolution: Math.min(window.devicePixelRatio || 1, 2), // cap at 2x
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
      // fwContainer between bg and world — fireworks appear in sky, behind all game sprites
      const fwContainer = new PIXI.Container();
      const worldContainer = new PIXI.Container();
      app.stage.addChild(bgContainer);
      app.stage.addChild(fwContainer);
      app.stage.addChild(worldContainer);

      const loadTexture = async (svgStr) => {
        return await PIXI.Assets.load(`data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`);
      };

      const marioTex    = await loadTexture(MarioSVGString);
      const marioDeadTex = await loadTexture(MarioDeadSVGString);
      const jssTex      = await loadTexture(JSSUniversitySVGString);
      const goombaTex   = await loadTexture(GoombaSVGString);
      const castleTex   = await loadTexture(CastleSVGString);
      const princessTex = await loadTexture(PrincessSVGString);
      const blockTex    = await loadTexture(BlockSVGString);
      const springTex   = await loadTexture(SpringSVGString);

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
        } else if (obs.type === 'spring') {
          const springSprite = new PIXI.Sprite(springTex);
          springSprite.width = obs.width;
          springSprite.height = obs.height;
          springSprite.x = obs.x;
          worldContainer.addChild(springSprite);
          obs.sprite = springSprite;
        } else if (obs.type === 'enemy') {
          const enemy = new PIXI.Sprite(goombaTex);
          enemy.width = obs.width;
          enemy.height = obs.height;
          worldContainer.addChild(enemy);
          enemySprites.push({ data: obs, sprite: enemy });
        }
      });

      // Viewport-sized ceiling: much cheaper than a 16640px-wide TilingSprite.
      // We reposition tilePosition.x each frame to simulate world scrolling.
      const ceiling = new PIXI.TilingSprite({
        texture: blockTex,
        width: app.screen.width + 64,   // viewport width + 1 tile margin
        height: LevelConfig.ceilingHeight
      });
      // ceiling lives in SCREEN space (stage, not worldContainer)
      app.stage.addChild(ceiling);

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

      // Dead Mario sprite — hidden until death animation triggers
      const marioDead = new PIXI.Sprite(marioDeadTex);
      marioDead.width = 64;
      marioDead.height = 64;
      marioDead.visible = false;
      worldContainer.addChild(marioDead);

      // Death animation state (separate from marioState to avoid reset confusion)
      const deathAnim = { active: false, x: 0, y: 0, vy: 0, timer: 0 };

      const triggerDeath = (ms) => {
         if (deathAnim.active) return; // ignore double-kills during anim
         deathAnim.active = true;
         deathAnim.x = ms.x;
         deathAnim.y = ms.y;
         deathAnim.vy = 12;  // classic pop-up impulse
         deathAnim.timer = 0;
         mario.visible = false;
         marioDead.visible = true;
         // Freeze Mario's physics inputs
         ms.vx = 0;
         ms.vy = 0;
      };

      // --- Pre-split obstacle arrays by type for O(1) access, sorted by x ---
      const solidObstacles = obstacles
        .filter(o => o.type === 'pillar' || o.type === 'ground' || o.type === 'hardblock' || o.type === 'spring')
        .sort((a, b) => a.x - b.x);
      const groundHardblocks = obstacles
        .filter(o => o.type === 'ground' || o.type === 'hardblock')
        .sort((a, b) => a.x - b.x);
      const springsOnly = obstacles
        .filter(o => o.type === 'spring')
        .sort((a, b) => a.x - b.x);
      const pillarsOnly = obstacles
        .filter(o => o.type === 'pillar')
        .sort((a, b) => a.x - b.x);

      // Binary search: returns first index where obs.x + obs.width >= lo
      const findViewStart = (arr, lo) => {
        let left = 0, right = arr.length;
        while (left < right) {
          const mid = (left + right) >>> 1;
          if (arr[mid].x + (arr[mid].width || 0) < lo) left = mid + 1;
          else right = mid;
        }
        return left;
      };

      // Set ground/hardblock sprite y-positions ONCE here (they never move)
      const initSpritePositions = (sh) => {
         ceiling.y = 0;
         ceiling.width = app.screen.width + 64;
         princess.y = sh - LevelConfig.groundHeight - 64;
         castle.y   = sh - LevelConfig.groundHeight - 256;
         jssSprite.y = sh - 64 - 400;
         jssText.y   = sh * 0.35;
         for (const obs of groundHardblocks) obs.sprite.y = sh - obs.y - obs.height;
         for (const obs of springsOnly)      obs.sprite.y = sh - obs.y - obs.height;
         for (const obs of pillarsOnly) {
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
         for (const d of decorations) d.y = sh - LevelConfig.groundHeight - 256 + d.offsetY;
      };

      // Single Graphics object for ALL castle decorations — 1 draw call total
      const decorationGraphics = new PIXI.Graphics();
      const decorations = [];
      for (let i = 0; i < 30; i++) {
         decorations.push({
           x: LevelConfig.castleX + 20 + Math.random() * 216,
           offsetY: 30 + Math.random() * 200,
           r: 2 + Math.random() * 2,
           phase: Math.random() * Math.PI * 2,
           y: 0, // set by initSpritePositions
         });
      }
      worldContainer.addChild(decorationGraphics);

      // Fireworks object pool — retro NES pixel style, behind world sprites
      const FW_POOL_SIZE = 120;
      const fwPool = [];
      for (let i = 0; i < FW_POOL_SIZE; i++) {
        const p = new PIXI.Graphics();
        p.rect(-2, -2, 4, 4); // 4x4 square pixel dot
        p.fill(0xFFFFFF);
        p.visible = false;
        p._alive = false;
        fwContainer.addChild(p);
        fwPool.push(p);
      }
      let fwPoolHead = 0;
      const fireworks = [];
      // NES retro palette
      const fwColors = [0xFF2020, 0xFFFFFF, 0xFFD700, 0x20FFFF, 0xFF60FF, 0x60FF60, 0xFF8C00];

      const createFirework = (screenX, screenY) => {
          if (fireworks.length >= 90) return;
          const numParticles = 12; // retro — fewer, cleaner bursts
          for (let i = 0; i < numParticles; i++) {
              let p = null;
              for (let j = 0; j < FW_POOL_SIZE; j++) {
                const idx = (fwPoolHead + j) % FW_POOL_SIZE;
                if (!fwPool[idx]._alive) { p = fwPool[idx]; fwPoolHead = (idx + 1) % FW_POOL_SIZE; break; }
              }
              if (!p) return;
              const color = fwColors[Math.floor(Math.random() * fwColors.length)];
              p.clear();
              p.rect(-2, -2, 4, 4); // crisp pixel square
              p.fill(color);
              const angle = (i / numParticles) * Math.PI * 2; // even spread = star burst
              const speed = 2 + Math.random() * 4; // slower, more controlled
              p.vx = Math.cos(angle) * speed;
              p.vy = Math.sin(angle) * speed;
              p.x = screenX;
              p.y = screenY;
              p.alpha = 1;
              p.life = 1.0;
              p.decay = 0.018 + Math.random() * 0.012;
              p.visible = true;
              p._alive = true;
              fireworks.push(p);
          }
      };


      // DOM camera update via rAF — keeps DOM writes out of the PixiJS ticker
      let latestCameraX = 0;
      const domCameraLoop = () => {
         if (worldDomRef.current) {
            worldDomRef.current.style.transform = `translateX(-${latestCameraX}px)`;
         }
         app._domRafId = requestAnimationFrame(domCameraLoop);
      };
      app._domRafId = requestAnimationFrame(domCameraLoop);

      let fwTimer = 0;
      const CULL_RADIUS = 700;
      let lastCameraX = -1;   // detect no-movement frames
      let frameCount = 0;     // for throttling decorations
      let lastScreenHeight = 0;

      app.ticker.add((ticker) => {
        // Fixed-timestep delta: clamp to max 2x frame to avoid spiral-of-death on lag
        const dt = Math.min(ticker.deltaTime, 2.0);
        frameCount++;

        const currentKeys = keysRef.current;
        const marioState = marioPosRef.current;
        const sh = app.screen.height;

        // ---- DEATH ANIMATION ---- takes full control while active
        if (deathAnim.active) {
          deathAnim.timer++;
          deathAnim.vy -= 0.6 * dt;
          deathAnim.y += deathAnim.vy * dt;
          marioDead.x = deathAnim.x;
          marioDead.y = sh - deathAnim.y - 64;

          // After ~120 frames (~2s) respawn
          if (deathAnim.timer > 120 || deathAnim.y < -200) {
            deathAnim.active = false;
            marioDead.visible = false;
            mario.visible = true;
            // Reset Mario to spawn
            marioState.x   = 50;
            marioState.y   = 150;
            marioState.vx  = 0;
            marioState.vy  = 0;
            marioState.onGround = false;
            marioState.jumpHeld = false;
            marioState.springTimer = 0;
            marioState.currentSpring = null;
          }
          return; // skip all other physics while dying
        }


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
        
        marioState.x += marioState.vx * dt;
        if (marioState.x < 0) marioState.x = 0;

        // Spatial culling — only test obstacles near Mario
        const mLeft = marioState.x;
        const mRight = marioState.x + marioState.width;
        for (let obs of solidObstacles) {
          if (obs.x > mRight + CULL_RADIUS || obs.x + obs.width < mLeft - CULL_RADIUS) continue;
          if (mLeft  < obs.x + obs.width &&
              mRight > obs.x &&
              marioState.y + 16 < obs.y + obs.height &&
              marioState.y + marioState.height > obs.y) {
             if (marioState.vx > 0) marioState.x = obs.x - marioState.width;
             else if (marioState.vx < 0) marioState.x = obs.x + obs.width;
             marioState.vx = 0;
          }
        }

        let vyBeforePhysics = marioState.vy;
        let yBeforePhysics = marioState.y;

        if (marioState.springTimer > 0) {
            marioState.springTimer--;
            const jumpPressed = currentKeys["Space"] || currentKeys["ArrowUp"] || currentKeys["KeyW"] || mobileKeysRef.current.Space;
            if (jumpPressed) marioState.springJumpQueued = true;
            marioState.y = marioState.currentSpring.y + marioState.currentSpring.height;
            marioState.vy = 0;
            marioState.onGround = true;
            if (marioState.springTimer === 0) {
               marioState.vy = marioState.springJumpQueued ? 26 : 10;
               marioState.onGround = false;
               marioState.currentSpring = null;
               marioState.jumpHeld = true;
               marioState.y += marioState.vy;
            }
        } else {
            marioState.vy -= 0.8 * dt;
            vyBeforePhysics = marioState.vy; // capture after gravity, before y update
            marioState.y += marioState.vy * dt;
            yBeforePhysics = marioState.y - marioState.vy * dt; // y was here last frame
            marioState.onGround = false;
        }

        if (marioState.y < -200) {
           triggerDeath(marioState);
        }

        // Vertical collision — culled
        for (let obs of solidObstacles) {
          if (obs.x > marioState.x + marioState.width + CULL_RADIUS || obs.x + obs.width < marioState.x - CULL_RADIUS) continue;
          if (marioState.x < obs.x + obs.width &&
              marioState.x + marioState.width > obs.x &&
              marioState.y < obs.y + obs.height &&
              marioState.y + marioState.height > obs.y) {
             if (marioState.vy < 0) {
                marioState.y = obs.y + obs.height;
                if (obs.type === 'spring') {
                  if (!marioState.springTimer || marioState.springTimer <= 0) {
                     marioState.springTimer = 15;
                     marioState.springJumpQueued = false;
                     marioState.currentSpring = obs;
                     obs.compressTimer = 15;
                  }
                }
                marioState.vy = 0;
                marioState.onGround = true;
             }
          }
        }

        if (!marioState.inCutscene) {
          const jumpPressed = currentKeys["Space"] || currentKeys["ArrowUp"] || currentKeys["KeyW"] || mobileKeysRef.current.Space;
          if (jumpPressed && marioState.onGround && !marioState.jumpHeld && !(marioState.springTimer > 0)) {
            marioState.vy = 18;
            marioState.y += marioState.vy;
            marioState.onGround = false;
            marioState.jumpHeld = true;
          } else if (!jumpPressed) {
            marioState.jumpHeld = false;
          }
        }

        // Compute camera BEFORE enemy loop so vLeft/vRight are available for culling
        const followThreshold = app.screen.width / 3;
        let cameraX = 0;
        if (marioState.x > followThreshold) {
           cameraX = marioState.x - followThreshold;
        }
        latestCameraX = cameraX;
        app._latestCameraX = cameraX;

        const sw = app.screen.width;
        const VBUF = Math.round(sw * 1.5) + 400; // extra buffer so blocks never pop at screen edges
        const vLeft  = cameraX - VBUF;
        const vRight = cameraX + sw + VBUF;

        for (let obj of enemySprites) {
          let obs = obj.data;
          let sprite = obj.sprite;

          if (obs.dead) { sprite.visible = false; continue; }

          // Skip physics entirely for far-away enemies (can't interact with Mario)
          const inExtendedView = obs.x + obs.width >= vLeft - VBUF && obs.x <= vRight + VBUF;
          if (!inExtendedView) { sprite.visible = false; continue; }

          obs.x += obs.vx;
          if (obs.x <= obs.minX) { obs.x = obs.minX; obs.vx *= -1; }
          else if (obs.x + obs.width >= obs.maxX) { obs.x = obs.maxX - obs.width; obs.vx *= -1; }

          const padX = 12;
          const padTop = 10;
          if (marioState.x < obs.x + obs.width - padX &&
              marioState.x + marioState.width > obs.x + padX &&
              marioState.y < obs.y + obs.height - padTop &&
              marioState.y + marioState.height > obs.y) {
              
              // Use yBeforePhysics and vyBeforePhysics — the values BEFORE
              // the solid-collision resolver may have zeroed vy.
              // Stomp = Mario was FALLING this frame AND his bottom was above
              // the enemy's upper 40% zone before the frame's position update.
              const enemyStompLine = obs.y + obs.height * 0.6;
              const wasFalling = vyBeforePhysics < 0;
              const wasAboveStompZone = yBeforePhysics >= enemyStompLine;
              const isAboveStompZone  = marioState.y  >= enemyStompLine;

              if (wasFalling && (wasAboveStompZone || isAboveStompZone)) {
                 marioState.vy = 12; // bounce
                 obs.dead = true;
                 sprite.visible = false;
              } else {
                 // Hit from the side or bottom
                 triggerDeath(marioState);
              }
          }
          sprite.x = obs.x;
          sprite.y = sh - obs.y - obs.height;
          sprite.visible = true; // in-view, alive enemies are visible
        }
        
        // camera already computed above
        const now = Date.now();
        mario.y = sh - marioState.y - marioState.height;

        if (marioState.vx < 0) {
          mario.scale.x = -1;
          mario.x = marioState.x + 64;
        } else if (marioState.vx > 0) {
          mario.scale.x = 1;
          mario.x = marioState.x;
        } else {
          mario.x = mario.scale.x < 0 ? marioState.x + 64 : marioState.x;
        }

        if (marioState.vx !== 0 && marioState.onGround) {
           mario.y += Math.sin(now / 50) * 4;
        }

        worldContainer.x = -cameraX;
        // Only update parallax if camera actually moved (saves bgContainer matrix recalc)
        if (cameraX !== lastCameraX) {
          bgContainer.x = -cameraX * 0.7;
          lastCameraX = cameraX;
        }

        // --- VIEWPORT CULLING ---
        // vLeft/vRight already computed above; sw/VBUF already set.

        // Ceiling: reposition tilePosition instead of scrolling a huge sprite
        ceiling.tilePosition.x = -cameraX % 32; // 32 = tile size
        ceiling.width = sw + 64;

        // Ground + hardblocks: show only the visible window (binary search)
        const ghStart = findViewStart(groundHardblocks, vLeft);
        for (let i = 0; i < groundHardblocks.length; i++) {
          const obs = groundHardblocks[i];
          obs.sprite.visible = (i >= ghStart && obs.x < vRight);
        }

        // Pillars: show only visible window
        const pStart = findViewStart(pillarsOnly, vLeft);
        for (let i = 0; i < pillarsOnly.length; i++) {
          const obs = pillarsOnly[i];
          obs.graphics.visible = (i >= pStart && obs.x < vRight);
        }

        // Springs: always few, just range-check
        for (const obs of springsOnly) {
          obs.sprite.visible = (obs.x + obs.width >= vLeft && obs.x <= vRight);
        }

        // Princess and castle: only show when close
        princess.visible = (LevelConfig.princessX >= vLeft && LevelConfig.princessX <= vRight + 64);
        castle.visible   = (LevelConfig.castleX   >= vLeft && LevelConfig.castleX   <= vRight + 256);
        // Decorations only rendered near castle
        decorationGraphics.visible = castle.visible;

        // Resize detection
        const screenResized = sh !== lastScreenHeight;
        if (screenResized) {
           lastScreenHeight = sh;
           initSpritePositions(sh);
        }

        // Decoration twinkle: redraw single Graphics every 3rd frame to halve CPU
        if (frameCount % 3 === 0 && castle.visible) {
          const t = now / 200;
          decorationGraphics.clear();
          decorationGraphics.x = 0;
          decorationGraphics.y = 0;
          for (let i = 0; i < decorations.length; i++) {
            const d = decorations[i];
            const a = 0.3 + Math.sin(t + d.phase) * 0.7;
            decorationGraphics.circle(d.x, d.y, d.r);
            decorationGraphics.fill({ color: 0xFFFFAA, alpha: a });
          }
        }

        // Fireworks: retro pixel bursts, only during cutscene (Mario reached the end)
        if (marioState.inCutscene) {
            fwTimer++;
            const fwSW = app.screen.width;
            // Staggered bursts across the sky — slower, cleaner retro pacing
            if (fwTimer % 40 === 0) {
                createFirework(
                   fwSW * 0.1 + Math.random() * fwSW * 0.8,
                   sh * 0.08 + Math.random() * sh * 0.55
                );
            }
            if (fwTimer % 55 === 15) {
                createFirework(
                   fwSW * 0.1 + Math.random() * fwSW * 0.8,
                   sh * 0.08 + Math.random() * sh * 0.55
                );
            }
            if (fwTimer % 80 === 30) {
                // double burst for occasional grandeur
                createFirework(fwSW * 0.2 + Math.random() * fwSW * 0.3, sh * 0.1 + Math.random() * sh * 0.4);
                createFirework(fwSW * 0.5 + Math.random() * fwSW * 0.3, sh * 0.1 + Math.random() * sh * 0.4);
            }
        }

        // Fireworks update — pool-aware cleanup
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const p = fireworks[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 0.1 * dt;
            p.life -= p.decay * dt;
            p.alpha = p.life;
            if (p.life <= 0) {
                p.visible = false;
                p._alive = false;  // return to pool
                fireworks.splice(i, 1);
            }
        }

        // Springs only — handle compression animation
        for (const obs of springsOnly) {
           if (obs.compressTimer && obs.compressTimer > 0) {
              obs.compressTimer--;
              obs.sprite.scale.y = 0.5;
              obs.sprite.y = sh - obs.y - obs.height + 32;
           } else if (obs.sprite.scale.y !== 1) {
              obs.sprite.scale.y = 1;
              obs.sprite.y = sh - obs.y - obs.height;
           }
        }

      });

      // Clean up DOM rAF on destroy
      app.renderer.on('destroy', () => cancelAnimationFrame(app._domRafId));
    };
    
    initPixi();

    // Page Visibility API: pause everything when tab is hidden
    const starsEl = document.querySelector('.stars');
    const handleVisibilityChange = () => {
      if (!appRef.current) return;
      if (document.hidden) {
        appRef.current.ticker.stop();
        cancelAnimationFrame(appRef.current._domRafId);
        if (starsEl) starsEl.style.animationPlayState = 'paused';
      } else {
        appRef.current.ticker.start();
        if (starsEl) starsEl.style.animationPlayState = 'running';
        // restart DOM rAF loop
        const domLoop = () => {
          if (worldDomRef.current && appRef.current) {
            worldDomRef.current.style.transform = `translateX(-${appRef.current._latestCameraX || 0}px)`;
          }
          if (appRef.current) appRef.current._domRafId = requestAnimationFrame(domLoop);
        };
        appRef.current._domRafId = requestAnimationFrame(domLoop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      isCancelled = true;
      if (appRef.current) {
        cancelAnimationFrame(appRef.current._domRafId);
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
              left: `${LevelConfig.princessX + 32}px`,
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
              left: `${LevelConfig.castleX + 280}px`,
              bottom: '380px',
              backgroundColor: '#000',
              color: '#FFD700',
              border: '6px solid #FFD700',
              padding: '20px 36px',
              fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace",
              fontWeight: 'bold',
              fontSize: '20px',
              lineHeight: '1.6',
              cursor: 'pointer',
              zIndex: 20,
              pointerEvents: 'auto',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 30px #FFD700, 0 0 60px rgba(255,215,0,0.4), inset -4px -4px 0px rgba(0,0,0,0.6)',
              textShadow: '0 0 10px #FFD700',
              animation: 'farewell-pulse 2s ease-in-out infinite',
            }} onClick={handleFarewellClick}>
              FAREWELL DASHBOARD
            </button>
            <style>{`
              @keyframes farewell-pulse {
                0%, 100% { box-shadow: 0 0 30px #FFD700, 0 0 60px rgba(255,215,0,0.4), inset -4px -4px 0px rgba(0,0,0,0.6); }
                50% { box-shadow: 0 0 55px #FFD700, 0 0 110px rgba(255,215,0,0.7), inset -4px -4px 0px rgba(0,0,0,0.6); border-color: #fff; }
              }
            `}</style>

            <div className="ending-text-wrapper" style={{
              position: 'absolute',
              left: `${LevelConfig.castleX - 150}px`,
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

      {/* FAREWELL DASHBOARD button — lives outside worldDomRef so position:fixed works correctly.
           Inside a willChange:transform parent, fixed positioning is relative to that parent. */}

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