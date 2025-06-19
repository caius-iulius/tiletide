"use strict";

import { Wave } from "./wave.js";

export class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static weighed_sum(weights_cols) {
        let r = 0;
        let g = 0;
        let b = 0;
        let weights_sum = 0;
        for (const wc of weights_cols) {
            r += wc[0] * wc[1].r;
            g += wc[0] * wc[1].g;
            b += wc[0] * wc[1].b;
            weights_sum += wc[0];
        }

        return new Color(r/weights_sum, g/weights_sum, b/weights_sum);
    }

    get style() {
        return "rgb("
        + Math.floor(this.r).toString() + ","
        + Math.floor(this.g).toString() + ","
        + Math.floor(this.b).toString() + ")"
    }
}

export class WaveCanvas extends Wave {
    static CONTRADICTION_COLOR = new Color(255, 0, 255);

    constructor(rows, cols, tileset, canvas, palette) {
        super(rows, cols, tileset);
        this.palette = palette;
        this.canvas = canvas;
    }

    clear() {
        const ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        const ctx = this.canvas.getContext("2d");
        const rows = this.tileset.wrap_rows ? this.rows : this.rows - 1;
        const cols = this.tileset.wrap_cols ? this.cols : this.cols - 1;

        const tile_size = Math.min(
            this.canvas.width / cols,
            this.canvas.height / rows
        );

        const width_bias = (this.canvas.width - tile_size * cols) / 2;
        const height_bias = (this.canvas.height - tile_size * rows) / 2;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const tile = this.grid[i][j].possibilities;

                if (tile.length === 0) {
                    ctx.fillStyle = WaveCanvas.CONTRADICTION_COLOR.style;
                } else {
                    const wc = tile.map((t) => {
                        return [this.tileset.get_weight(t), this.palette[this.tileset.tiles[t].center]];
                    });

                    const color = Color.weighed_sum(wc);

                    ctx.fillStyle = color.style;
                }

                ctx.fillRect(width_bias + j * tile_size, height_bias + i * tile_size, tile_size, tile_size);
            }
        }
    }
}