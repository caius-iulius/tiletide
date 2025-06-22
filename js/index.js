"use strict";

import { Grid, Tileset } from "./tiles.js";
import { createColor } from "./color.js";
import { ColorGrid } from "./colorGrid.js";
import { WaveView } from "./waveView.js";
import { GridView } from "./gridView.js";
import { UserView } from "./userView.js";
import { Save } from "./save.js";
import { ApiContext } from "./apiContext.js";

//TESTING
const CONCENTRIC = function(n, i, j) {
    return (i == 0 || i == n - 1 || j == 0 || j == n - 1) ? 0 : 1;
}

const grid1 = new Grid(6, 6, (i, j) => CONCENTRIC(6,i,j));
const tiles1 = new Tileset(grid1, 3, 3, true, true);

const ARR = [
    [0,0,0,0],
    [0,1,1,1],
    [0,1,2,1],
    [0,1,1,1]
];

const grid2 = new Grid(4, 4, (i, j) => ARR[i][j]);
const tiles2 = new Tileset(grid2, 2, 2, true, true);

const CURVES = [
    [5,5,5,5,5,5,5,5,5],
    [5,6,6,6,6,6,6,6,5],
    [5,6,6,5,5,5,6,6,5],
    [5,6,5,5,5,5,5,6,5],
    [5,6,5,5,5,5,5,6,5],
    [5,6,5,5,5,5,5,6,5],
    [5,6,6,5,5,5,6,6,5],
    [5,6,6,6,6,6,6,6,5],
    [5,5,5,5,5,5,5,5,5]
]
const grid5 = new Grid(9, 9, (i, j) => CURVES[i][j]);
const tiles5 = new Tileset(grid5, 3, 3, true, true);

const CROSSOVER2 = [
    [0,1,0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0],
    [1,1,1,1,1,1,1,0,1,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,1,1,1,1,1,1,1,1,1],
    [0,1,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,0,0]
];

const grid6 = new Grid(12, 12, (i, j) => CROSSOVER2[i][j]);
const tiles6 = new Tileset(grid6, 5, 5, true, true);

const palette = [
    createColor(0, 0, 0),         // Nero
    createColor(47, 50, 67),      // Grigio scuro
    createColor(123, 145, 153),   // Grigio bluastro
    createColor(195, 221, 218),   // Azzurro chiaro

    createColor(255, 255, 255),   // Bianco
    createColor(232, 24, 78),     // Fucsia intenso
    createColor(248, 156, 181),   // Rosa
    createColor(153, 51, 0),      // Marrone

    createColor(255, 153, 51),    // Arancione
    createColor(243, 210, 0),     // Giallo
    createColor(223, 255, 153),   // Verde chiaro
    createColor(0, 204, 0),       // Verde

    createColor(102, 255, 204),   // Turchese
    createColor(102, 153, 255),   // Azzurro
    createColor(76, 0, 255),      // Blu
    createColor(204, 0, 255),     // Viola
]

let save = new Save("Default Save", grid6, 5, true, true, palette);
export let waveView = undefined;
export let gridView = undefined;
export let userView = undefined;
export let apiContext = undefined;

document.addEventListener("DOMContentLoaded", init);
function init() {
    const canvas = document.getElementById("wave-canvas");
    const colorGrid = new ColorGrid(document.getElementById("color-grid"), palette);
    const toWaveButton = document.getElementById("to-wave-button");
    const gridCanvas = document.getElementById("grid-canvas");

    // Initialize WaveView
    waveView = new WaveView(
        save,
        canvas,
        document.getElementById("wave-controls"),
        document.getElementById("name-display"),
        gridCanvas,
        document.getElementById("play-button"),
        document.getElementById("pause-button"),
        document.getElementById("step-button"),
        document.getElementById("stop-button"),
        document.getElementById("speed-slider"),
        document.getElementById("num-cols"),
        document.getElementById("num-rows"),
        document.getElementById("entropy-display"),
        document.getElementById("entropy-progress")
    );

    // Initialize GridView
    gridView = new GridView(
        save,
        canvas,
        document.getElementById("grid-controls"),
        document.getElementById("save-name-input"),
        document.getElementById("save-button"),
        (save) => {
            console.log("saving", save);
            alert(`Save functionality not implemented for ${save.name}`);
        },
        colorGrid,
        document.getElementById("grid-num-rows"),
        document.getElementById("grid-num-cols"),
        document.getElementById("tile-length"),
        document.getElementById("wrap-rows"),
        document.getElementById("wrap-cols")
    );

    // Initialize API context
    apiContext = new ApiContext();

    // Initialize UserView
    userView = new UserView(
        apiContext,
        (id, newSave) => {
            save = newSave;
            gridView.loadSave(save);
            waveView.loadSave(save);
        },
        document.getElementById("signup-form"),
        document.getElementById("login-form"),
        document.getElementById("user-profile"),
        document.getElementById("show-login-button"),
        document.getElementById("show-signup-button")
    );

    gridCanvas.addEventListener("click", () => {
        if (waveView.started) return;

        waveView.hide();
        gridView.show();
    });

    toWaveButton.addEventListener("click", () => {
        save = gridView.getSave();
        waveView.loadSave(save);

        gridView.hide();
        waveView.show();
    });

    waveView.show();
}