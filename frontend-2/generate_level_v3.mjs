import fs from 'fs';
const raw = fs.readFileSync('level.json', 'utf8');
const data = JSON.parse(raw);
const TILE_SIZE = 64;
const items = [];
let princessX = 0;
let castleX = 0;

let currentStartX = -1;
for (let i = 0; i <= data.floor_grid.length; i++) {
    const isGround = data.floor_grid[i] === 'G';
    if (isGround && currentStartX === -1) {
        currentStartX = i;
    } else if (!isGround && currentStartX !== -1) {
        items.push({ type: 'ground', x: currentStartX * TILE_SIZE, y: 0, width: (i - currentStartX) * TILE_SIZE, height: TILE_SIZE });
        currentStartX = -1;
    }
}

for (const col of data.static_stone_columns) {
    let y = TILE_SIZE;
    if (col.absolute_y_top !== undefined) {
        const lowest_row = col.absolute_y_top + col.height - 1;
        y = (13 - lowest_row) * TILE_SIZE;
    }
    items.push({ type: 'hardblock', x: col.grid_x * TILE_SIZE, y: y, width: TILE_SIZE, height: col.height * TILE_SIZE });
}

for (const obj of data.interactive_objects) {
    if (obj.type === 'PIPE') {
        items.push({ type: 'pillar', x: obj.grid_x * TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: obj.height * TILE_SIZE });
    } else if (obj.type === 'SPRING') {
        items.push({ type: 'spring', x: obj.grid_x * TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE });
    } else if (obj.type === 'FLAGPOLE') {
        princessX = obj.grid_x * TILE_SIZE;
    } else if (obj.type === 'CASTLE') {
        castleX = obj.grid_x * TILE_SIZE;
    }
}

for (const e of data.enemies) {
    const spawnX = e.grid_x * TILE_SIZE;
    let spawnY = TILE_SIZE;
    if (e.grid_y !== undefined) {
        spawnY = (13 - e.grid_y) * TILE_SIZE;
    }
    items.push({ type: 'enemy', x: spawnX, y: spawnY, width: 40, height: 40, vx: -3, minX: spawnX - 2*TILE_SIZE, maxX: spawnX + 2*TILE_SIZE });
}

const out = {
  worldWidth: data.floor_grid.length * TILE_SIZE,
  princessX,
  castleX,
  groundHeight: TILE_SIZE,
  ceilingHeight: 100,
  items
};

console.log(JSON.stringify(out, null, 2));
