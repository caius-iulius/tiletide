import { Grid, generate_tileset } from "./tiles.js";
import { Wave } from "./wave.js";

//TESTING
const L_ARR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const B_ARR = "#.";

const CONCENTRIC = function(n, i, j) {
    return (i == 0 || i == n - 1 || j == 0 || j == n - 1) ? 0 : 1;
}

function male_print_grid(grid) {
    for (let i = 0; i < grid.rows; i++) {
        let s = "";
        for (let j = 0; j < grid.cols; j++) {
            s += (grid.grid[i][j] === null) ? '█' : grid.grid[i][j].toString();// TODO: GESTIONE DEGLI EDGE
        }
        console.log(s);
    }
}

function male_print_wave(wave) {
    for (let i = 0; i < wave.rows; i++) {
        let s = "";
        for (let j = 0; j < wave.cols; j++) {
            switch(wave.grid[i][j].length) {
                case 0: s += "X"; break;
                case 1:
                    const t = wave.grid[i][j][0];
                    s += (t === null) ? '█' : wave.tileset.tiles[t].center.toString();
                    break;
                default: s += "?";
            }
        }
        console.log(s);
    }
}

function male_print_wave_multi(wave) {
    for (let i = 0; i < wave.rows; i++) {
        let s = "";
        for (let j = 0; j < wave.cols; j++) {
            s += wave.grid[i][j].length.toString() + "\t";
        }
        console.log(s);
    }
}


function male_print_tileset(tileset) {
    const tiles = tileset.tiles;
    console.log("BORDERS", tileset.border);
    for (let i = 0; i < tiles.length; i++) {
        console.log("TILE", i, "weight", tiles[i].weight, "center", tiles[i].center);
        male_print_grid(tiles[i]);
        console.log("ADIACENZE", tiles[i].compatible);
        console.log();
    }
}

const grid = new Grid(6, 6, (i, j) => B_ARR[CONCENTRIC(6,i,j)]);
// const ARR = [
//     ['#','#','#','#'],
//     ['#','.','.','.'],
//     ['#','.','o','.'],
//     ['#','.','.','.']
// ];
// const grid = new Grid(4, 4, (i, j) => ARR[i][j]);
// console.dir(grid, { depth: null });

const tiles = generate_tileset(grid, 3, 3, false, false);
male_print_tileset(tiles);

let i = 0;
const wave = new Wave(5, 5, tiles, false, false);

male_print_wave_multi(wave);
male_print_wave(wave);

// while (true) { }

let choice = wave.choose();
while(choice) {
    i++;
    //console.log(choice, wave.grid);
    wave.observe(...choice);
    // male_print_wave(wave);
    //male_print_wave_multi(wave);
    // console.log();

    const success = wave.propagate([choice]);
    if (!success) {
        male_print_wave_multi(wave);
        console.log();

        break;
    }

    choice = wave.choose();

}
male_print_wave(wave);
// console.dir(wave.grid, { depth: null });

console.log("steps:", i);