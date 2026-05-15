const map_sequence = [
    { "x_start": 0, "x_end": 15, "type": "G", "description": "Starting flat ground" },
    { "x": 12, "spawn": "goomba", "y": 12 },
    { "x_start": 16, "x_end": 20, "type": "G" },
    { "x": 17, "spawn": "goomba", "y": 12 },
    { "x_start": 21, "x_end": 27, "type": "G" },
    { "x": 23, "spawn": "goomba", "y": 12 },
    { "x": 24, "spawn": "goomba", "y": 12 },
    { "x": 28, "type": "P", "height": 2, "description": "Pipe 1" },
    { "x_start": 29, "x_end": 32, "type": "G" },
    { "x": 31, "spawn": "goomba", "y": 12 },
    { "x": 33, "type": "P", "height": 3, "description": "Pipe 2" },
    { "x_start": 34, "x_end": 37, "type": "G" },
    { "x": 36, "spawn": "goomba", "y": 12 },
    { "x": 38, "type": "P", "height": 4, "description": "Pipe 3" },
    { "x_start": 39, "x_end": 45, "type": "G" },
    { "x": 42, "spawn": "goomba", "y": 12 },
    { "x": 43, "spawn": "goomba", "y": 12 },
    { "x_start": 46, "x_end": 47, "type": "void", "description": "Pit 1" },
    { "x_start": 48, "x_end": 55, "type": "G" },
    { "x": 51, "spawn": "goomba", "y": 12 },
    { "x": 52, "spawn": "goomba", "y": 12 },
    { "x_start": 56, "x_end": 64, "type": "G" },
    { "x": 60, "spawn": "koopa", "y": 12 },
    {
      "x_start": 65,
      "x_end": 73,
      "type": "G",
      "structure": {
        "type": "pyramid_flat_top",
        "material": "H",
        "height": 4,
        "note": "Ascends 1 to 4, 1 flat tile gap at peak, descends 4 to 1"
      }
    },
    {
      "x_start": 74,
      "x_end": 83,
      "structure": {
        "type": "pyramid_split_pit",
        "material": "H",
        "left_ascent_height": 4,
        "pit_width_tiles": 2,
        "right_descent_height": 4,
        "note": "Ascends 1 to 4, drops into a 2-tile void pit, resumes at 4-high and descends to 1"
      }
    },
    { "x_start": 84, "x_end": 90, "type": "G" },
    { "x": 86, "type": "P", "height": 4, "description": "Pipe 4" },
    { "x": 88, "spawn": "goomba", "y": 12 },
    { "x": 89, "spawn": "goomba", "y": 12 },
    { "x_start": 91, "x_end": 105, "type": "G" },
    {
      "x_start": 94,
      "x_end": 101,
      "structure": {
        "type": "end_staircase",
        "material": "H",
        "height": 8,
        "note": "Steps up linearly from 1 to 8 tiles high"
      }
    },
    { "x": 102, "type": "void", "width": 1, "note": "1-tile safety gap after staircase" },
    { "x": 103, "type": "H", "height": 1, "note": "Single block flat pillar on ground" },
    
    // START OF NEW SEQUENCE
    { "x_start": 106, "x_end": 125, "type": "G", "description": "Transition platform from previous section" },
    { "x_start": 126, "x_end": 128, "type": "void", "description": "Pit 1: 3-tile gap requiring a running jump" },
    { "x_start": 129, "x_end": 130, "type": "G", "description": "Island 1: Tiny landing zone" },
    { "x": 129, "spawn": "goomba", "y": 12 },
    { "x_start": 131, "x_end": 132, "type": "void", "description": "Pit 2: Precise mid-stage gap" },
    { "x_start": 133, "x_end": 135, "type": "G", "description": "Island 2: Extended landing zone for spring placement" },
    { 
      "x": 134, 
      "type": "spring", 
      "y": 12, 
      "physics": {
        "launch_velocity_y": -15.0,
        "requires_jump_input": true
      },
      "description": "Spring mechanism placed perfectly to clear the upcoming 3rd pit and massive pillar" 
    },
    { "x_start": 136, "x_end": 137, "type": "void", "description": "Pit 3: The final void before the wall" },
    { "x_start": 138, "x_end": 150, "type": "G", "description": "The Pipe Squeeze Zone resumes" },
    { "x": 138, "type": "P", "height": 5, "description": "The massive pillar pipe. Completely fair now thanks to the spring launch at x:134." },
    { "x": 142, "type": "P", "height": 2, "description": "Low pipe creating a tight choke point" },
    { "x": 143, "spawn": "goomba", "y": 12 },
    { "x": 144, "spawn": "goomba", "y": 12 },
    { "x": 145, "type": "P", "height": 6, "description": "Massive pipe obstacle" },
    { "x_start": 151, "x_end": 154, "type": "void", "description": "4-tile maximum distance pit" },
    { 
      "x_start": 155, 
      "x_end": 170, 
      "type": "G",
      "structure": {
        "type": "jagged_pyramid",
        "material": "H",
        "note": "Ascends jaggedly: 2 high, 4 high, 6 high, drops straight down to ground level on the right"
      }
    },
    { "x": 166, "spawn": "koopa", "y": 12, "note": "Spawns exactly where the player drops blindly from the 6-high peak" },
    { "x": 168, "spawn": "goomba", "y": 12 },
    { "x_start": 171, "x_end": 174, "type": "void", "description": "Pit containing an isolated platform" },
    { "x_start": 172, "x_end": 173, "type": "H", "height": 3, "description": "Elevated stone pillar inside the pit" },
    { "x": 172, "spawn": "goomba", "y": 10, "note": "Enemy patrolling the narrow platform inside the void" },
    { "x_start": 175, "x_end": 190, "type": "G" },
    {
      "x_start": 178,
      "x_end": 188,
      "structure": {
        "type": "double_staircase_corridor",
        "material": "H",
        "note": "Two separate 4-high staircases facing each other, leaving only a 1-tile wide, 4-tile deep corridor between them"
      }
    },
    { "x": 183, "spawn": "koopa", "y": 12, "note": "Trapped inside the narrow 1-tile corridor at the bottom" },
    { "x_start": 191, "x_end": 195, "type": "void", "description": "Extremely wide 5-tile pit, requires using a high pipe as a launchpad" },
    { "x": 190, "type": "P", "height": 4, "description": "Launchpad pipe positioned on the absolute edge of the cliff" },
    { "x_start": 196, "x_end": 215, "type": "G", "description": "The Final Gauntlet Flatline" },
    { "x": 199, "spawn": "goomba", "y": 12 },
    { "x": 200, "spawn": "goomba", "y": 12 },
    { "x": 202, "spawn": "koopa", "y": 12 },
    { "x": 205, "spawn": "goomba", "y": 12 },
    { "x": 206, "spawn": "koopa", "y": 12 },
    { "x": 210, "type": "P", "height": 5, "description": "Final defensive wall pipe" },
    { "x_start": 216, "x_end": 230, "type": "G" },
    {
      "x_start": 218,
      "x_end": 227,
      "structure": {
        "type": "inverse_end_staircase",
        "material": "H",
        "height": 9,
        "note": "Ascends from 1 to 9 tiles high, making the ceiling viewport incredibly tight"
      }
    },
    { "x_start": 228, "x_end": 230, "type": "void", "description": "Cruel drop-away pit right after the peak of the 9-high stairs" },
    { "x_start": 231, "x_end": 245, "type": "G" },
    { "x": 232, "type": "H", "height": 2, "note": "Precision landing pillar" },
    { "x": 235, "type": "F", "height": 12, "description": "Elevated Flagpole Goal" },
    { "x_start": 246, "x_end": 255, "type": "G" },
    { "x": 250, "type": "C", "description": "Final Fortress Safety Zone" }
];

const TILE_SIZE = 64;
const items = [];
let princessX = 3600;
let castleX = 3700;
const MAX_X = 260;

const hasGround = new Array(MAX_X).fill(true);
for (const e of map_sequence) {
    if (e.type === 'void') {
        let start = e.x !== undefined ? e.x : e.x_start;
        let end = e.x_end !== undefined ? e.x_end : (e.x + (e.width || 1) - 1);
        for(let i=start; i<=end; i++) hasGround[i] = false;
    }
    if (e.structure && e.structure.type === 'pyramid_split_pit') {
        const startX = e.x_start;
        const h = e.structure.left_ascent_height;
        for(let i=0; i<2; i++) hasGround[startX + h + i] = false;
    }
}

// Generate continuous ground blocks
let currentStartX = -1;
for (let i = 0; i <= MAX_X; i++) {
    if (hasGround[i] && currentStartX === -1) {
        currentStartX = i;
    } else if (!hasGround[i] && currentStartX !== -1) {
        items.push({ type: 'ground', x: currentStartX * TILE_SIZE, y: 0, width: (i - currentStartX) * TILE_SIZE, height: TILE_SIZE });
        currentStartX = -1;
    }
}

for (const e of map_sequence) {
    if (e.type === 'P') {
        items.push({ type: 'pillar', x: e.x * TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: e.height * TILE_SIZE });
    }
    if (e.type === 'H') {
        let h = e.height || 1;
        let start = e.x !== undefined ? e.x : e.x_start;
        let end = e.x_end !== undefined ? e.x_end : start;
        for (let i = start; i <= end; i++) {
           items.push({ type: 'hardblock', x: i * TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: h * TILE_SIZE });
        }
    }
    if (e.spawn === 'goomba' || e.spawn === 'koopa') {
        const spawnX = e.x * TILE_SIZE;
        let spawnY = e.y === 10 ? 3*TILE_SIZE : TILE_SIZE;
        items.push({ type: 'enemy', x: spawnX, y: spawnY, width: 40, height: 40, vx: -3, minX: spawnX - 2*TILE_SIZE, maxX: spawnX + 2*TILE_SIZE });
    }
    if (e.type === 'spring') {
        items.push({ type: 'spring', x: e.x * TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE });
    }
    if (e.structure) {
        if (e.structure.type === 'pyramid_flat_top') {
            const startX = e.x_start;
            const h = e.structure.height;
            for (let i=0; i<h; i++) {
                items.push({ type: 'hardblock', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (i+1)*TILE_SIZE });
            }
            for (let i=0; i<h; i++) {
                items.push({ type: 'hardblock', x: (startX + h + 1 + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (h-i)*TILE_SIZE });
            }
        } else if (e.structure.type === 'pyramid_split_pit') {
            const startX = e.x_start;
            const h = e.structure.left_ascent_height;
            for (let i=0; i<h; i++) {
                items.push({ type: 'hardblock', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (i+1)*TILE_SIZE });
            }
            for (let i=0; i<h; i++) {
                items.push({ type: 'hardblock', x: (startX + h + 2 + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (h-i)*TILE_SIZE });
            }
        } else if (e.structure.type === 'end_staircase') {
            const startX = e.x_start;
            const h = e.structure.height;
            for (let i=0; i<h; i++) {
                items.push({ type: 'hardblock', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (i+1)*TILE_SIZE });
            }
        } else if (e.structure.type === 'jagged_pyramid') {
            const startX = e.x_start;
            for (let i=0; i<4; i++) items.push({ type: 'hardblock', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: 2*TILE_SIZE });
            for (let i=4; i<8; i++) items.push({ type: 'hardblock', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: 4*TILE_SIZE });
            for (let i=8; i<12; i++) items.push({ type: 'hardblock', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: 6*TILE_SIZE });
        } else if (e.structure.type === 'double_staircase_corridor') {
            const startX = e.x_start; // 178
            for (let i=0; i<4; i++) items.push({ type: 'hardblock', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (i+1)*TILE_SIZE });
            items.push({ type: 'hardblock', x: (startX + 4)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: 4*TILE_SIZE });
            // GAP at startX + 5 (183)
            items.push({ type: 'hardblock', x: (startX + 6)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: 4*TILE_SIZE });
            for (let i=0; i<4; i++) items.push({ type: 'hardblock', x: (startX + 7 + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (4-i)*TILE_SIZE });
        } else if (e.structure.type === 'inverse_end_staircase') {
            const startX = e.x_start; // 218 to 227 (10 tiles)
            for (let i=0; i<9; i++) items.push({ type: 'hardblock', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (i+1)*TILE_SIZE });
            items.push({ type: 'hardblock', x: (startX + 9)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: 9*TILE_SIZE });
        }
    }
    if (e.type === 'F') {
        princessX = e.x * TILE_SIZE;
    }
    if (e.type === 'C') {
        castleX = e.x * TILE_SIZE;
    }
}

const out = {
  worldWidth: MAX_X * TILE_SIZE,
  princessX,
  castleX,
  groundHeight: TILE_SIZE,
  ceilingHeight: 100,
  items
};

console.log(JSON.stringify(out, null, 2));
