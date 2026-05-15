import * as PIXI from 'pixi.js';

async function main() {
    try {
        const app = new PIXI.Application();
        await app.init({ width: 100, height: 100 });
        const str = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="64" height="64"><rect width="16" height="16" fill="red"/></svg>`;
        const url = `data:image/svg+xml;utf8,${encodeURIComponent(str)}`;
        const tex = await PIXI.Assets.load(url);
        console.log("Texture loaded", !!tex, tex.width, tex.height);
    } catch(e) {
        console.error("Error creating texture:", e.message);
    }
}
main();
