"use strict";

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