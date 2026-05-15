import fs from 'fs';

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

    // Zone 1: The Transition Runway
    { x_start: 106, x_end: 115, type: "G" },

    // Zone 2: The Triple-Pit & Spring Gauntlet
    { x_start: 116, x_end: 118, type: "void" }, // Pit #1
    { x_start: 119, x_end: 120, type: "G" }, // Island #1
    { x_start: 121, x_end: 122, type: "void" }, // Pit #2
    { x_start: 123, x_end: 125, type: "G" }, // Island #2
    { x: 124, type: "spring" },
    { x_start: 126, x_end: 127, type: "void" }, // Pit #3

    // Zone 3: The Pipe Squeeze Zone
    { x_start: 128, x_end: 136, type: "G" }, // Ground for pipes
    { x: 128, type: "P", height: 5 }, // Pipe #1
    { x: 132, type: "P", height: 2 }, // Pipe #2
    { x: 136, type: "P", height: 4 }, // Pipe #3

    // Zone 4: The Maximum Leap
    { x_start: 137, x_end: 140, type: "void" }, // Pit #4

    // Zone 5: The Jagged Pyramid Drop
    { x_start: 141, x_end: 150, type: "G" },
    { x: 141, type: "H", height: 2 },
    { x: 142, type: "H", height: 2 },
    { x: 143, type: "H", height: 4 },
    { x: 144, type: "H", height: 4 },
    { x: 145, type: "H", height: 6 },
    { x: 146, type: "H", height: 6 },

    // Zone 6: The Pit Platform Chasm
    { x_start: 151, x_end: 154, type: "void" }, // Pit #5
    { x_start: 152, x_end: 153, type: "H", height: 3, baseY: 0 }, // Floating pillar (y: 0*TILE_SIZE)

    // Zone 7: The Double-Staircase Corridor
    { x_start: 155, x_end: 165, type: "G" },
    { x: 155, type: "H", height: 1 },
    { x: 156, type: "H", height: 2 },
    { x: 157, type: "H", height: 3 },
    { x: 158, type: "H", height: 4 },
    { x: 160, type: "H", height: 4 },
    { x: 161, type: "H", height: 3 },
    { x: 162, type: "H", height: 2 },
    { x: 163, type: "H", height: 1 },

    // Zone 8: The Cliff-Edge Launchpad
    { x: 165, type: "P", height: 3 }, // Pipe #4
    { x_start: 166, x_end: 170, type: "void" }, // Pit #6 (5 tiles wide)

    // Zone 9: The Final Flatline Gauntlet
    { x_start: 171, x_end: 190, type: "G" },
    { x: 174, spawn: "goomba", min_x: 171, max_x: 187 },
    { x: 180, spawn: "koopa", min_x: 171, max_x: 187 },
    { x: 188, type: "P", height: 3 }, // Pipe #5

    // Zone 10: The Inverse Mega-Staircase
    { x_start: 191, x_end: 201, type: "G" },
    { x: 191, type: "H", height: 1 },
    { x: 192, type: "H", height: 2 },
    { x: 193, type: "H", height: 3 },
    { x: 194, type: "H", height: 4 },
    { x: 195, type: "H", height: 5 },
    { x: 196, type: "H", height: 6 },
    { x: 197, type: "H", height: 7 },
    { x: 198, type: "H", height: 8 },
    { x: 199, type: "H", height: 9 },
    { x: 200, type: "H", height: 9 },

    // Zone 11: The Drop-Away Flagpole Finish
    { x_start: 202, x_end: 204, type: "void" }, // Pit #7
    { x_start: 205, x_end: 240, type: "G" }, // Final ground safety zone
    { x: 205, type: "H", height: 2 }, // Landing Pillar
    { x: 209, type: "F", height: 12 }, // Flagpole
    { x: 224, type: "C" } // Castle
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

let currentStartX = -1;
for (let i = 0; i <= MAX_X; i++) {
    if (hasGround[i] && currentStartX === -1) {
        currentStartX = i;
    } else if (!hasGround[i] && currentStartX !== -1) {
        items.push({ type: 'ground', x: currentStartX * TILE_SIZE, y: 0, width: (i - currentStartX) * TILE_SIZE, height: TILE_SIZE });
        currentStartX = -1;
    }
}
if (currentStartX !== -1) {
    items.push({ type: 'ground', x: currentStartX * TILE_SIZE, y: 0, width: (MAX_X - currentStartX) * TILE_SIZE, height: TILE_SIZE });
}

for (const e of map_sequence) {
    if (e.type === 'P') {
        items.push({ type: 'pillar', x: e.x * TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: e.height * TILE_SIZE });
    }
    if (e.type === 'H') {
        let h = e.height || 1;
        let start = e.x !== undefined ? e.x : e.x_start;
        let end = e.x_end !== undefined ? e.x_end : start;
        let yPos = e.baseY !== undefined ? e.baseY * TILE_SIZE + TILE_SIZE : TILE_SIZE;
        for (let i = start; i <= end; i++) {
           items.push({ type: 'hardblock', x: i * TILE_SIZE, y: yPos, width: TILE_SIZE, height: h * TILE_SIZE });
        }
    }
    if (e.type === 'spring') {
        items.push({ type: 'spring', x: e.x * TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE });
    }
    if (e.spawn === 'goomba' || e.spawn === 'koopa') {
        const spawnX = e.x * TILE_SIZE;
        let spawnY = e.offsetY !== undefined ? e.offsetY * TILE_SIZE + TILE_SIZE : (e.y === 10 ? 3*TILE_SIZE : TILE_SIZE);
        let minX = e.min_x !== undefined ? e.min_x * TILE_SIZE : spawnX - 2*TILE_SIZE;
        let maxX = e.max_x !== undefined ? e.max_x * TILE_SIZE : spawnX + 2*TILE_SIZE;
        items.push({ type: 'enemy', x: spawnX, y: spawnY, width: 40, height: 40, vx: -3, minX: minX, maxX: maxX });
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
