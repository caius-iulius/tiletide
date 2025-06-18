"use strict";

import { Grid, Tileset } from "./tiles.js";
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
            s += (grid.grid[i][j] === null) ? '█' : grid.grid[i][j].toString();
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

const grid = new Grid(6, 6, (i, j) => CONCENTRIC(6,i,j));
const ARR = [
    [0,0,0,0],
    [0,1,1,1],
    [0,1,2,1],
    [0,1,1,1]
];
// const grid = new Grid(4, 4, (i, j) => ARR[i][j]);
// console.dir(grid, { depth: null });

const tiles = new Tileset(grid, 3, 3, true, true);
male_print_tileset(tiles);

const grid2 = new Grid(4, 4, (i, j) => ARR[i][j]);
const tiles2 = new Tileset(grid2, 2, 2, true, true);

const CROSSOVER = [
    [1,1,0,1,1],
    [1,1,1,1,1],
    [0,0,0,0,0],
    [1,1,1,1,1],
    [1,1,0,1,1],
    [1,1,0,1,1],
    [0,1,0,1,0],
    [1,1,0,1,1],
    [1,1,0,1,1]
]
const grid3 = new Grid(9, 5, (i, j) => CROSSOVER[i][j]);
const tiles3 = new Tileset(grid3, 3, 3, true, true);

const KNOT = [
    [0,0,0,0,0,0,0],
    [0,0,0,1,1,1,0],
    [0,0,0,1,0,1,0],
    [0,1,1,1,1,1,0],
    [0,1,0,1,0,0,0],
    [0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0]
]
const grid4 = new Grid(7, 7, (i, j) => KNOT[i][j]);
const tiles4 = new Tileset(grid4, 3, 3, true, true);
/*
let i = 0;
const wave = new Wave(5, 5, tiles);

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

console.log("steps:", i);*/

// WEB
import { Color, WaveCanvas } from "./color.js";
const palette = [
    new Color(0, 0, 0), // black
    new Color(255, 0, 0), // red
    new Color(0, 255, 0), // green
    new Color(0, 0, 255), // blue
    new Color(255, 255, 0), // yellow
    new Color(255, 165, 0), // orange
    new Color(128, 0, 128), // purple
    new Color(0, 255, 255), // cyan
    new Color(255, 192, 203), // pink
]

const canvas = document.getElementById("wave-canvas");
const wave = new WaveCanvas(50, 50, tiles4, canvas, palette);
wave.render();

function render_step() {
    let choice = wave.choose();
    if (!choice) return;

    wave.observe(...choice);

    const success = wave.propagate([choice]);
    if (!success) {
        male_print_wave_multi(wave);
        console.log();

        return;
    }

    console.log("rendering");
    wave.render();

    setTimeout(render_step, 10);
}

render_step();