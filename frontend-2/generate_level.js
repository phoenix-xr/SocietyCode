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
    { "x": 105, "type": "F", "height": 10, "description": "Flagpole Goal" },
    
    { "x_start": 106, "x_end": 115, "type": "G" },
    { "x": 110, "type": "C", "description": "End Castle Fortress" }
  ];

const TILE_SIZE = 64;
const items = [];
let princessX = 3600;
let castleX = 3700;

for (const e of map_sequence) {
    if (e.type === 'G') {
        const w = (e.x_end - e.x_start + 1) * TILE_SIZE;
        // Check if there is a structure
        if (e.structure) {
            // we'll handle structure below, but we still place ground under it unless it's a split pit
            if (e.structure.type !== 'pyramid_split_pit') {
                items.push({ type: 'ground', x: e.x_start * TILE_SIZE, y: 0, width: w, height: TILE_SIZE });
            }
        } else {
            items.push({ type: 'ground', x: e.x_start * TILE_SIZE, y: 0, width: w, height: TILE_SIZE });
        }
    }
    
    if (e.type === 'P') {
        items.push({ type: 'pillar', x: e.x * TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: e.height * TILE_SIZE });
    }
    
    if (e.type === 'H') {
        items.push({ type: 'pillar', x: e.x * TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: e.height * TILE_SIZE });
    }

    if (e.spawn === 'goomba' || e.spawn === 'koopa') {
        // give them a patrol range of a few tiles
        const spawnX = e.x * TILE_SIZE;
        items.push({ type: 'enemy', x: spawnX, y: TILE_SIZE, width: 40, height: 40, vx: -3, minX: spawnX - 2*TILE_SIZE, maxX: spawnX + 2*TILE_SIZE });
    }

    if (e.structure) {
        if (e.structure.type === 'pyramid_flat_top') {
            const startX = e.x_start;
            const h = e.structure.height;
            for (let i=0; i<h; i++) {
                items.push({ type: 'pillar', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (i+1)*TILE_SIZE });
            }
            // 1 flat gap (the peak is empty, or the peak is height 4? "1 flat tile gap at peak")
            // Ascends 1 to 4 (4 tiles wide), 1 gap, descends 4 to 1 (4 tiles wide)
            // Total width = 4 + 1 + 4 = 9 tiles. x_start to x_end = 65 to 73 = 9 tiles.
            for (let i=0; i<h; i++) {
                items.push({ type: 'pillar', x: (startX + h + 1 + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (h-i)*TILE_SIZE });
            }
        } else if (e.structure.type === 'pyramid_split_pit') {
            // Ascends 1 to 4, drops into 2-tile void, resumes at 4-high, descends to 1
            // Total width = 4 + 2 + 4 = 10 tiles. x_start to x_end = 74 to 83 = 10 tiles.
            const startX = e.x_start;
            const h = e.structure.left_ascent_height;
            
            // Ground under left and right
            items.push({ type: 'ground', x: startX * TILE_SIZE, y: 0, width: h * TILE_SIZE, height: TILE_SIZE });
            items.push({ type: 'ground', x: (startX + h + 2) * TILE_SIZE, y: 0, width: h * TILE_SIZE, height: TILE_SIZE });

            // Pillars
            for (let i=0; i<h; i++) {
                items.push({ type: 'pillar', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (i+1)*TILE_SIZE });
            }
            for (let i=0; i<h; i++) {
                items.push({ type: 'pillar', x: (startX + h + 2 + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (h-i)*TILE_SIZE });
            }
        } else if (e.structure.type === 'end_staircase') {
            // 94 to 101 = 8 tiles
            const startX = e.x_start;
            const h = e.structure.height;
            for (let i=0; i<h; i++) {
                items.push({ type: 'pillar', x: (startX + i)*TILE_SIZE, y: TILE_SIZE, width: TILE_SIZE, height: (i+1)*TILE_SIZE });
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
  worldWidth: 116 * TILE_SIZE,
  princessX,
  castleX,
  groundHeight: TILE_SIZE,
  ceilingHeight: 100,
  items
};

console.log(JSON.stringify(out, null, 2));
