import { Grid } from "./tiles.js";
import { EditableGridCanvas } from "./gridCanvas.js";
import { Save } from "./save.js";

export class GridView {
    constructor(save, canvas, gridControls, saveNameInput, saveButton, saveCallback, colorGrid, gridNumRowsInput, gridNumColsInput, tileLengthInput, wrapRowsCheckbox, wrapColsCheckbox
    ) {
        this.canvas = canvas;
        this.saveNameInput = saveNameInput;
        this.saveButton = saveButton;
        this.saveCallback = saveCallback;
        this.gridControls = gridControls;
        this.colorGrid = colorGrid;
        this.gridNumRowsInput = gridNumRowsInput;
        this.gridNumColsInput = gridNumColsInput;
        this.tileLengthInput = tileLengthInput;
        this.wrapRowsCheckbox = wrapRowsCheckbox;
        this.wrapColsCheckbox = wrapColsCheckbox;

        this.grid = undefined;
        this.loadSave(save);

        canvas.addEventListener('mousedown', (e) => {
            if(this.hidden) return;

            this.dragging = true;
            this.gridCanvas.handleClickEvent(e);
        });
        canvas.addEventListener('mousemove', (e) => {
            if(this.hidden) return;
            if (!this.dragging) return;

            this.gridCanvas.handleClickEvent(e);
        });
        canvas.addEventListener('mouseup', () => {
            if (this.hidden) return;

            this.dragging = false;
        });
        canvas.addEventListener("mouseleave", () => {
            if (this.hidden) return;

            this.dragging = false;
        })

        this.gridNumRowsInput.addEventListener("change", () => { this.resizeEvent() });
        this.gridNumColsInput.addEventListener("change", () => { this.resizeEvent() });

        this.saveButton.addEventListener("click", () => {
            const save = this.getSave();
            if (save.name.length < 1) {
                alert("Please enter a name for the save.");
                return;
            }
            this.saveCallback(save);
        });

        this.hidden = true;
    }

    resizeEvent() {
        this.grid = new Grid(
            parseInt(this.gridNumRowsInput.value),
            parseInt(this.gridNumColsInput.value),
            (i, j) => 0
        );
        this.gridCanvas = new EditableGridCanvas(
            this.grid,
            this.canvas,
            this.colorGrid
        );
        this.gridCanvas.render();
    }

    show() {
        this.hidden = false;
        this.gridControls.hidden = false;
        this.gridCanvas.render();
    }

    hide() {
        this.hidden = true;
        this.gridControls.hidden = true;
    }

    loadSave(save) {
        this.saveNameInput.value = save.name;
        this.grid = save.grid;
        this.gridNumRowsInput.value = this.grid.rows;
        this.gridNumColsInput.value = this.grid.cols;
        this.tileLengthInput.value = save.tileLength;
        this.wrapRowsCheckbox.checked = save.wrapRows;
        this.wrapColsCheckbox.checked = save.wrapCols;

        this.gridCanvas = new EditableGridCanvas(
            this.grid,
            this.canvas,
            this.colorGrid
        );
        // this.colorGrid.setColors(save.palette);
    }

    getSave() {
        return new Save(
            this.saveNameInput.value,
            this.grid, //attenzione alla grid, problemi di mutabilità
            parseInt(this.tileLengthInput.value),
            this.wrapRowsCheckbox.checked,
            this.wrapColsCheckbox.checked,
            this.colorGrid.colors
        )
    }
}