export function male_print_grid(grid) {
    for (let i = 0; i < grid.rows; i++) {
        let s = "";
        for (let j = 0; j < grid.cols; j++) {
            s += (grid.grid[i][j] === null) ? '█' : grid.grid[i][j].toString();
        }
        console.log(s);
    }
}

export function male_print_wave(wave) {
    for (let i = 0; i < wave.rows; i++) {
        let s = "";
        for (let j = 0; j < wave.cols; j++) {
            switch(wave.grid[i][j].length) {
                case 0: s += "X"; break;
                case 1:
                    const t = wave.grid[i][j].possibilities[0];
                    s += (t === null) ? '█' : wave.tileset.tiles[t].center.toString();
                    break;
                default: s += "?";
            }
        }
        console.log(s);
    }
}

export function male_print_wave_multi(wave) {
    for (let i = 0; i < wave.rows; i++) {
        let s = "";
        for (let j = 0; j < wave.cols; j++) {
            s += wave.grid[i][j].possibilities.length.toString() + "\t";
        }
        console.log(s);
    }
}

export function male_print_tileset(tileset) {
    const tiles = tileset.tiles;
    console.log("BORDERS", tileset.border);
    for (let i = 0; i < tiles.length; i++) {
        console.log("TILE", i, "weight", tiles[i].weight, "center", tiles[i].center);
        male_print_grid(tiles[i]);
        console.log("ADIACENZE", tiles[i].compatible);
        console.log();
    }
}