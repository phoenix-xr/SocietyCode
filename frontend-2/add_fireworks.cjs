const fs = require('fs');
let code = fs.readFileSync('src/Game.jsx', 'utf8');

// Remove CSS fireworks from Game.jsx
const fwStart = code.indexOf('<div className="firework fw1">');
if (fwStart !== -1) {
    const fwEnd = code.indexOf('</div>', code.lastIndexOf('fw5')) + 6;
    code = code.substring(0, fwStart) + code.substring(fwEnd);
}

// Remove the fireworks CSS block
const cssStart = code.indexOf('@keyframes explode {');
if (cssStart !== -1) {
    const cssEnd = code.indexOf('.fw5', cssStart) + 120; // roughly covers to end of fw5 line
    const trueEnd = code.indexOf('}', cssEnd) + 1;
    code = code.substring(0, code.lastIndexOf('<style>', cssStart)) + code.substring(trueEnd + 15); 
}

// Ensure the button is properly spaced
code = code.replace(/left: \`\\\$\\{LevelConfig\.castleX \+ \d+\\}px\`/, 'left: `\\$\\{LevelConfig.castleX + 350\\}px`');

// Now let's inject PIXI fireworks!
const pixiFwBlock = `
      // Fireworks Manager
      const fireworks = [];
      const createFirework = (x, y) => {
          const numParticles = 30;
          for(let i=0; i<numParticles; i++) {
              const p = new PIXI.Graphics();
              p.circle(0,0, 3 + Math.random()*2);
              const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF, 0xFFFFFF];
              p.fill(colors[Math.floor(Math.random()*colors.length)]);
              const angle = Math.random() * Math.PI * 2;
              const speed = 2 + Math.random() * 8;
              p.vx = Math.cos(angle) * speed;
              p.vy = Math.sin(angle) * speed;
              p.x = x;
              p.y = y;
              p.alpha = 1;
              p.life = 1.0;
              p.decay = 0.01 + Math.random() * 0.02;
              bgContainer.addChild(p);
              fireworks.push(p);
          }
      };

      let fwTimer = 0;
      app.ticker.add(() => {`;

code = code.replace(/      app\.ticker\.add\(\(\) => \{/, pixiFwBlock);

// Inside the ticker:
const fwTickerBlock = `
        if (marioState.inCutscene && marioState.x >= LevelConfig.princessX - 100) {
            fwTimer++;
            if (fwTimer % 30 === 0 && Math.random() > 0.3) {
                createFirework(LevelConfig.castleX - 100 + Math.random()*400, sh - LevelConfig.groundHeight - 200 - Math.random()*300);
            }
        }
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            let p = fireworks[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= p.decay;
            p.alpha = p.life;
            if (p.life <= 0) {
                bgContainer.removeChild(p);
                p.destroy();
                fireworks.splice(i, 1);
            }
        }
`;

// Insert fwTickerBlock right after decorations logic
const targetString = `           if (screenResized) dot.y = sh - LevelConfig.groundHeight - 256 + dot.offsetY;\n        });`;
if (code.indexOf(targetString) !== -1) {
    code = code.replace(targetString, targetString + "\n" + fwTickerBlock);
}

fs.writeFileSync('src/Game.jsx', code);
console.log("PIXI Fireworks added");
