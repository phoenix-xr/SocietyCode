const fs = require('fs');
let content = fs.readFileSync('src/Game.jsx', 'utf8');
const match = content.match(/const LevelConfig = (\{[\s\S]*?\n\})/);
if (match) {
  let config = JSON.parse(match[1]);
  
  let initialCount = config.items.length;
  
  // filter confined enemies
  config.items = config.items.filter(i => {
    if (i.type === 'enemy') {
      let diff = i.maxX - i.minX;
      // if confined (diff <= 192), remove. 192 is 3 tiles.
      if (diff <= 192) return false;
      // also the island one at 7616
      if (i.x === 7616) return false;
    }
    return true;
  });

  // remove some from the crowded area (11072 to 11520)
  // There are 5 enemies: 11072, 11136, 11264, 11392, 11520
  // Let's remove 11136, 11264, 11392
  const toRemove = [11136, 11264, 11392];
  config.items = config.items.filter(i => !(i.type === 'enemy' && toRemove.includes(i.x)));

  let finalCount = config.items.length;
  console.log(`Removed ${initialCount - finalCount} enemies.`);

  let newConfigStr = JSON.stringify(config, null, 2);
  // Add semi-colon at the end just in case the original had it. In Game.jsx it's `};` 
  // Wait, the regex captures up to `\n}`. Let's see original `Game.jsx`.
  // The regex is `/const LevelConfig = (\{[\s\S]*?\n\});/`
  // so `match[0]` includes the `;`.
  
  // To avoid formatting diffs making it look completely different, we'll just replace the whole block.
  let newContent = content.replace(match[0], `const LevelConfig = ${newConfigStr}`);
  fs.writeFileSync('src/Game.jsx', newContent);
  console.log("Done");
} else {
  console.log("Regex not matched");
}
