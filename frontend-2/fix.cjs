const fs = require('fs');
let c = fs.readFileSync('src/components/SpriteStrings.js', 'utf8');
c = c.replace(/\\\\\`/g, '\`');
fs.writeFileSync('src/components/SpriteStrings.js', c);
