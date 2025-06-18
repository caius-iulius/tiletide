"use strict";

import { Wave } from "./wave.js";

export class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    add(col) {
        return new Color(this.r + col.r, this.g + col.g, this.b + col.b);
    }

    mul(factor) {
        return new Color(factor*this.r, factor*this.g, factor*this.b)
    }

    static weighed_sum(weights_cols) {
        const weights_sum = weights_cols.reduce((acc, wc) => [
            acc[0] + wc[0],
            acc[1].add(wc[1].mul(wc[0]))
        ], [0, new Color(0,0,0)]);

        return weights_sum[1].mul(1 / weights_sum[0]);
    }

    get style() {
        return "rgb("
        + Math.floor(this.r).toString() + ","
        + Math.floor(this.g).toString() + ","
        + Math.floor(this.b).toString() + ")"
    }
}

export class WaveCanvas extends Wave {
    constructor(rows, cols, tileset, canvas, palette) {
        super(rows, cols, tileset);
        this.palette = palette;
        this.canvas = canvas;
    }

    render() {
        const ctx = this.canvas.getContext("2d");
        const tile_size = 10;
        const rows = this.tileset.wrap_rows ? this.rows : this.rows - 1;
        const cols = this.tileset.wrap_cols ? this.cols : this.cols - 1;

        this.canvas.width = cols * tile_size;
        this.canvas.height = rows * tile_size;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const tile = this.grid[i][j];
                if (tile.length === 0) continue;

                const wc = tile.map((t) => {
                    return [this.tileset.get_weight(t), this.palette[this.tileset.tiles[t].center]];
                });
                const color = Color.weighed_sum(wc);

                ctx.fillStyle = color.style;
                ctx.fillRect(j * tile_size, i * tile_size, tile_size, tile_size);
            }
        }
    }
}