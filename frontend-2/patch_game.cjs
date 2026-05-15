const fs = require('fs');
let code = fs.readFileSync('src/Game.jsx', 'utf8');

// 1. Remove setTimeout for hidePrompt
code = code.replace(/  useEffect\(\(\) => \{\n    const timer = setTimeout\(\(\) => \{\n      setHidePrompt\(true\);\n    \}, 5000\);\n    return \(\) => clearTimeout\(timer\);\n  \}, \[\]\);\n/, '');

// 2. Castle position
code = code.replace(/"castleX": 14336/, '"castleX": 13526');

// 3. Decorations and FPS optimization variables
const beforeTicker = `      const mario = new PIXI.Sprite(marioTex);
      mario.width = 64;
      mario.height = 64;
      worldContainer.addChild(mario);

      let lastScreenHeight = 0;
      const decorations = [];
      for (let i = 0; i < 30; i++) {
         const dot = new PIXI.Graphics();
         dot.circle(0, 0, 3);
         dot.fill(0xFFFFAA);
         dot.x = LevelConfig.castleX + 20 + Math.random() * 216;
         dot.offsetY = 30 + Math.random() * 200;
         dot.alpha = Math.random();
         worldContainer.addChild(dot);
         decorations.push(dot);
      }
      
      app.ticker.add(() => {`;

code = code.replace(/      const mario = new PIXI\.Sprite\(marioTex\);\n      mario\.width = 64;\n      mario\.height = 64;\n      worldContainer\.addChild\(mario\);\n\n      app\.ticker\.add\(\(\) => \{/, beforeTicker);

// 4. Update the ticker drawing loop
const originalTickerStart = `        jssSprite.y = sh - 64 - 400;`;
const originalTickerEnd = `      });`;

const optimizedTickerEnd = `        const screenResized = sh !== lastScreenHeight;
        if (screenResized) lastScreenHeight = sh;

        if (screenResized) {
           jssSprite.y = sh - 64 - 400;
           jssText.y = sh * 0.35;

           princess.y = sh - LevelConfig.groundHeight - 64;
           castle.y = sh - LevelConfig.groundHeight - 256;

           ceiling.y = 0;
        }
        
        decorations.forEach((dot, i) => {
           dot.alpha = 0.3 + Math.sin(Date.now() / 200 + i) * 0.7;
           if (screenResized) dot.y = sh - LevelConfig.groundHeight - 256 + dot.offsetY;
        });

        for (let obs of obstacles) {
           if (obs.type === 'ground' || obs.type === 'hardblock') {
              if (screenResized) obs.sprite.y = sh - obs.y - obs.height;
           } else if (obs.type === 'spring') {
              if (obs.compressTimer && obs.compressTimer > 0) {
                 obs.compressTimer--;
                 obs.sprite.scale.y = 0.5;
                 obs.sprite.y = sh - obs.y - obs.height + 32;
              } else {
                 obs.sprite.scale.y = 1;
                 obs.sprite.y = sh - obs.y - obs.height;
              }
           } else if (obs.type === 'pillar') {
              if (screenResized) {
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
        }

      });`;

const indexStart = code.indexOf(originalTickerStart);
const indexEnd = code.indexOf(originalTickerEnd, indexStart) + originalTickerEnd.length;
if (indexStart !== -1 && indexEnd !== -1) {
    code = code.substring(0, indexStart) + optimizedTickerEnd + code.substring(indexEnd);
} else {
    console.log("Could not find ticker end to replace!");
}

// 5. Add Fireworks HTML
// I will place the fireworks inside the showMessage condition.
const fireworksCSS = `
            <style>
              { \`
                @keyframes explode {
                  0% { transform: scale(0.1); opacity: 1; }
                  100% { transform: scale(1.5); opacity: 0; }
                }
                .firework {
                  position: absolute;
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                  box-shadow: 
                    0 -30px 0 0 #ff0,
                    21px -21px 0 0 #f0f,
                    30px 0 0 0 #0ff,
                    21px 21px 0 0 #0f0,
                    0 30px 0 0 #f00,
                    -21px 21px 0 0 #ff0,
                    -30px 0 0 0 #f0f,
                    -21px -21px 0 0 #0ff;
                  animation: explode 1.5s ease-out infinite;
                  z-index: 10;
                }
                .fw1 { left: \${LevelConfig.castleX - 100}px; bottom: 400px; animation-delay: 0s; }
                .fw2 { left: \${LevelConfig.castleX + 150}px; bottom: 350px; animation-delay: 0.5s; box-shadow: 0 -40px 0 0 #0f0, 28px -28px 0 0 #0ff, 40px 0 0 0 #ff0, 28px 28px 0 0 #f00, 0 40px 0 0 #f0f, -28px 28px 0 0 #0f0, -40px 0 0 0 #0ff, -28px -28px 0 0 #ff0; }
                .fw3 { left: \${LevelConfig.castleX + 300}px; bottom: 450px; animation-delay: 1.0s; box-shadow: 0 -35px 0 0 #f00, 25px -25px 0 0 #0f0, 35px 0 0 0 #0ff, 25px 25px 0 0 #ff0, 0 35px 0 0 #f0f, -25px 25px 0 0 #f00, -35px 0 0 0 #0f0, -25px -25px 0 0 #0ff;}
                .fw4 { left: \${LevelConfig.castleX + 50}px; bottom: 500px; animation-delay: 1.2s; }
                .fw5 { left: \${LevelConfig.castleX + 250}px; bottom: 300px; animation-delay: 0.3s; }
              \` }
            </style>
            <div className="firework fw1"></div>
            <div className="firework fw2"></div>
            <div className="firework fw3"></div>
            <div className="firework fw4"></div>
            <div className="firework fw5"></div>
`;

const styleBlockStart = `<style>\n              {\`\n                @keyframes fadeInUpText {`;
const fireworksCombined = fireworksCSS + `\n            ` + styleBlockStart;
code = code.replace(styleBlockStart, fireworksCombined);

// 6. Fix Button Position 
// "Have a really big button beside castle with text FAREWELL DASHBOARD"
// Let's ensure the button is placed correctly.
code = code.replace(/left: \`\\\$\\{LevelConfig\.castleX \+ 100\\}px\`/, 'left: `\\$\\{LevelConfig.castleX + 400\\}px`');

fs.writeFileSync('src/Game.jsx', code);
console.log("Patched successfully!");
