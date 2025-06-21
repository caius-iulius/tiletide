import { Grid, Tileset } from './tiles.js';

export class Save {
    constructor(grid, tileLength, wrapRows, wrapCols, palette) {
        this.grid = grid;
        this.tileLength = tileLength;
        this.wrapRows = wrapRows;
        this.wrapCols = wrapCols;
        this.palette = palette;
    }

    toJSON() {
        return {
            grid: this.grid.grid,
            tileLength: this.tileLength,
            wrapRows: this.wrapRows,
            wrapCols: this.wrapCols,
            palette: this.palette
        };
    }

    static fromJSON(json) {
        return new Save(
            new Grid(json.grid.length, json.grid[0].length, (i, j) => json.grid[i][j]),
            json.tileLength,
            json.wrapRows,
            json.wrapCols,
            json.palette
        );
    }

    getTileset() {
        return new Tileset(
            this.grid,
            this.tileLength,
            this.tileLength,
            this.wrapRows,
            this.wrapCols
        );
    }
}