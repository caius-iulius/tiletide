"use strict";

import { Grid, Tileset } from "./tiles.js";
import { male_print_tileset, male_print_wave_multi } from "./debug.js";
import { Color } from "./color.js";
import { ColorGrid } from "./colorGrid.js";
import { WaveCanvas } from "./wave.js";

//TESTING
const CONCENTRIC = function(n, i, j) {
    return (i == 0 || i == n - 1 || j == 0 || j == n - 1) ? 0 : 1;
}

const grid = new Grid(6, 6, (i, j) => CONCENTRIC(6,i,j));
const tiles = new Tileset(grid, 3, 3, true, true);

const ARR = [
    [0,0,0,0],
    [0,1,1,1],
    [0,1,2,1],
    [0,1,1,1]
];

const grid2 = new Grid(4, 4, (i, j) => ARR[i][j]);
const tiles2 = new Tileset(grid2, 2, 2, true, true);

const CROSSOVER = [
    [1,1,0,1,1],
    [1,1,1,1,1],
    [0,0,0,0,0],
    [1,1,1,1,1],
    [1,1,0,1,1],
]

const grid3 = new Grid(5, 5, (i, j) => CROSSOVER[i][j]);
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

const palette = [
    new Color(0, 0, 0), // black
    new Color(255, 255, 255), // white
    new Color(255, 0, 0), // red
    new Color(0, 255, 0), // green
    new Color(0, 0, 255), // blue
    new Color(255, 255, 0), // yellow
    new Color(255, 165, 0), // orange
    new Color(128, 0, 128), // purple
    new Color(0, 255, 255), // cyan
    new Color(255, 192, 203), // pink
    new Color(128, 128, 128), // gray
    new Color(0, 128, 0), // dark green
    new Color(0, 0, 128), // dark blue
    new Color(128, 0, 0), // dark red
    new Color(255, 105, 180), // hot pink
    new Color(255, 215, 0) // gold
]

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
male_print_tileset(tiles6);

const canvas = document.getElementById("wave-canvas");

let started = false;
let playing = null;
let wave = undefined; //new WaveCanvas(50, 50, tiles2, canvas, palette);
let interval = 0;

let playButton = undefined;
let pauseButton = undefined;
let stepButton = undefined;
let stopButton = undefined;
let speedSlider = undefined;
let numRowsInput = undefined;
let numColsInput = undefined;
let entropyDisplay = undefined;
let entropyProgress = undefined;
let colorGrid = undefined;

function updateView() {
    let entropy = wave.total_entropy();
    entropyDisplay.textContent = `Entropy: ${entropy.toFixed(2)} / ${wave.initial_entropy.toFixed(2)} bits`;
    entropyProgress.value = 1 - (entropy / wave.initial_entropy);
}

function render_step() {
    let choice = wave.choose();
    if (!choice) return false;

    wave.observe(...choice);

    const success = wave.propagate([choice]);

    updateView();

    if (!success) {
        male_print_wave_multi(wave);
        console.log();

        return false;
    }

    return true;
}

function render() {
    if(!render_step()) {
        endGame();
    }
}

function playGame() {
    console.log("Starting game with interval:", interval);
    playing = setInterval(render, interval);

    numRowsInput.disabled = true;
    numColsInput.disabled = true;
    playButton.disabled = true;
    pauseButton.disabled = false;
    stepButton.disabled = true;
    stopButton.disabled = false;
}

function pauseGame() {
    clearInterval(playing);
    playing = null;

    playButton.disabled = false;
    pauseButton.disabled = true;
    stepButton.disabled = false;
}

function endGame() {
    pauseGame();
    started = false;

    numRowsInput.disabled = false;
    numColsInput.disabled = false;
    stepButton.disabled = true;
    stopButton.disabled = true;
}

function calculateDelay(sliderValue) {
    return Math.round(1000 * Math.exp(-sliderValue / 200));
}

document.addEventListener("DOMContentLoaded", init);
function init() {
    numRowsInput = document.getElementById("num-rows");
    numColsInput = document.getElementById("num-cols");
    playButton = document.getElementById("play-button");
    pauseButton = document.getElementById("pause-button");
    stepButton = document.getElementById("step-button");
    stopButton = document.getElementById("stop-button");
    speedSlider = document.getElementById("speed-slider");
    speedSlider.value = 500; // Default speed
    interval = calculateDelay(500); // Initialize interval with calculated delay
    entropyDisplay = document.getElementById("entropy-display");
    entropyProgress = document.getElementById("entropy-progress");
    colorGrid = new ColorGrid("color-grid", palette);
    colorGrid.hide();

    playButton.addEventListener("click", () => {
        if(playing) return;

        if(!started) {
            wave = new WaveCanvas(parseInt(numRowsInput.value), parseInt(numColsInput.value), tiles6, canvas, palette);
            wave.clear();
            started = true;
            wave.render();
            updateView();
        }

        playGame();
    });

    pauseButton.addEventListener("click", () => {
        if (!playing) return;

        pauseGame();
    });

    stepButton.addEventListener("click", () => {
        if (playing || !started) return;

        if(!render_step()) {
            endGame();
        }
    });

    stopButton.addEventListener("click", () => {
        if (!started) return;

        endGame();
    });

    speedSlider.addEventListener("input", (e) => {
        interval = calculateDelay(parseInt(e.target.value));
        if (playing) {
            clearInterval(playing);
            playing = setInterval(render, interval);
        }
    });
}