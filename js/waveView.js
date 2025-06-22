import { WaveCanvas } from "./wave.js";
import { male_print_wave_multi } from "./debug.js";
import { GridCanvas } from "./gridCanvas.js";

function calculateDelay(sliderValue) {
    return Math.round(1000 * Math.exp(-sliderValue / 200));
}

export class WaveView {
    constructor(initialSave, canvas, waveControls, saveNameElement, gridCanvasElement, playButton, pauseButton, stepButton, stopButton, speedSlider, numColsInput, numRowsInput, entropyDisplay, entropyProgress) {
        this.canvas = canvas;
        this.waveControls = waveControls;
        this.saveNameElement = saveNameElement;
        this.gridCanvasElement = gridCanvasElement;
        this.playButton = playButton;
        this.pauseButton = pauseButton;
        this.stepButton = stepButton;
        this.stopButton = stopButton;
        this.speedSlider = speedSlider;
        this.speedSlider.value = 500; // Default speed
        this.interval = calculateDelay(500); // Initialize interval
        this.numColsInput = numColsInput;
        this.numRowsInput = numRowsInput;
        this.entropyDisplay = entropyDisplay;
        this.entropyProgress = entropyProgress;

        this.started = false;
        this.playing = null;

        this.wave = undefined;
        this.tileset = undefined;
        this.palette = undefined;
        this.loadSave(initialSave);
        this.initWave();

        //add event listeners
        this.playButton.addEventListener("click", () => {
            if (this.playing) return;

            if (!this.started) {
                this.initWave();
                this.started = true;
                this.wave.render();
                this.updateView();
            }

            this.playGame();
        });

        this.pauseButton.addEventListener("click", () => {
            if (!this.playing) return;

            this.pauseGame();
        });

        this.stepButton.addEventListener("click", () => {
            if (this.playing || !this.started) return;

            if (!this.renderStep()) {
                this.endGame();
            }
        });

        this.stopButton.addEventListener("click", () => {
            if (!this.started) return;

            this.endGame();
        });

        this.speedSlider.addEventListener("input", (e) => {
            this.interval = calculateDelay(parseInt(e.target.value));
            if (this.playing) {
                clearInterval(this.playing);
                this.playing = setInterval(() => { this.render() }, this.interval);
            }
        });
    }

    initWave() {
        this.wave = new WaveCanvas(
            parseInt(this.numRowsInput.value),
            parseInt(this.numColsInput.value),
            this.tileset,
            this.canvas,
            this.palette
        );
    }

    loadSave(save) {
        this.endGame();
        this.tileset = save.getTileset();
        this.palette = save.palette;
        this.saveNameElement.textContent = save.name;
        const gridCanvas = new GridCanvas(
            save.grid,
            this.gridCanvasElement,
            this.palette
        );
        gridCanvas.render();
        this.initWave();
    }

    setTileset(tileset, palette) {
        this.tileset = tileset;
        this.palette = palette;
    }

    updateView() {
        let entropy = this.wave.total_entropy();
        this.entropyDisplay.textContent = `Entropy: ${entropy.toFixed(2)} / ${this.wave.initial_entropy.toFixed(2)} bits`;
        this.entropyProgress.value = 1 - (entropy / this.wave.initial_entropy);
    }

    renderStep() {
        let choice = this.wave.choose();
        if (!choice) return false;

        this.wave.observe(...choice);

        const success = this.wave.propagate([choice]);

        this.updateView();

        if (!success) {
            male_print_wave_multi(this.wave);
            console.log();
            return false;
        }

        return true;
    }

    render() {
        if(!this.renderStep()) {
            this.endGame();
        }
    }

    playGame() {
        this.playing = setInterval(() => this.render(), this.interval);

        this.numRowsInput.disabled = true;
        this.numColsInput.disabled = true;
        this.playButton.disabled = true;
        this.pauseButton.disabled = false;
        this.stepButton.disabled = true;
        this.stopButton.disabled = false;
    }

    pauseGame() {
        clearInterval(this.playing);
        this.playing = null;

        this.playButton.disabled = false;
        this.pauseButton.disabled = true;
        this.stepButton.disabled = false;
    }

    endGame() {
        this.pauseGame();
        this.started = false;

        this.numRowsInput.disabled = false;
        this.numColsInput.disabled = false;
        this.stepButton.disabled = true;
        this.stopButton.disabled = true;
    }

    show() {
        this.waveControls.hidden = false;
        this.wave.render();
    }

    hide() {
        this.waveControls.hidden = true;
        this.endGame();
    }
}