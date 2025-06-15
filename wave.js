"use strict";

import { Queue } from "./queue.js";
import { Grid, DIRECTIONS } from "./tiles.js";

export class Wave extends Grid {
    constructor(rows, cols, tileset) {
        super(tileset.wrap_rows ? rows : rows + 1, tileset.wrap_cols ? cols : cols + 1, (i, j) => {
            if (i === rows || j === cols) return [null];

            const arr = [];
            for (let i = 0; i < tileset.size; i++) {
                arr.push(i);
            }
            return arr;
        });

        this.tileset = tileset;

        const borders = [];
        if(!tileset.wrap_rows) {
            for (let i = 0; i < cols; i++) {
                borders.push([rows, i]);
            }
        }
        if(!tileset.wrap_cols) {
            for (let i = 0; i < rows; i++) {
                borders.push([i, cols]);
            }
        }
        this.propagate(borders);

    }

    // Calcola la Shannon entropy della tile
    tile_entropy(row, col) {
        const tile = this.grid[row][col];
        const weights_sum = tile.map(t => this.tileset.get_weight(t)).reduce((a, e) => a+e);

        const entropy = -tile.map(t => {
            const p = this.tileset.get_weight(t) / weights_sum;
            return p * Math.log2(p);
        }).reduce((a, e) => a + e);

        return entropy;
    }

    // Sceglie una tile in base alla Shannon entropy
    choose() {
        let arr = [];
        let ent = +Infinity;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const thisent = this.tile_entropy(i, j);
                if (thisent === 0) continue;

                if(thisent < ent) {
                    ent = thisent;
                    arr = [[i, j]];
                } else if(thisent === ent) {
                    arr.push([i, j]);
                }
            }
        }

        if (arr.length === 0) return null;

        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Osserva (e collassa) una tile
    observe(row, col) {
        const tile = this.grid[row][col];

        const weights_sum = tile.map(t => this.tileset.get_weight(t)).reduce((a, e) => a+e);
        const choice = Math.floor(Math.random() * weights_sum);

        let acc = 0;
        let i = 0;
        for (; i < tile.length; i++) {
            acc += this.tileset.get_weight(tile[i]);
            if (acc > choice) break;
        }

        this.grid[row][col] = [tile[i]];
    }

    // Funzione di propagazione. Parte da una prima queue di tiles da aggiornare ed esegue un BFS sui vicini escludendone le incompatibilità
    propagate(rowcols) {
        // Coda necessaria per il BFS
        const queue = new Queue(rowcols);

        while(!queue.isEmpty()) {
            const tile_coords = queue.dequeue();
            const tile = this.grid[tile_coords[0]][tile_coords[1]];

            // Per i 4 vicini
            for (let i = 0; i < 4; i++) {
                const neigh_row = this.wrap_row(tile_coords[0] + DIRECTIONS[i][0]);
                const neigh_col = this.wrap_col(tile_coords[1] + DIRECTIONS[i][1]);

                let changed = false;

                // Filtra le possibilità del vicino
                this.grid[neigh_row][neigh_col] = this.grid[neigh_row][neigh_col].filter((t) => {

                    // Cerca almeno una possibilità della propria tile compatibile con quella del vicino attualmente in esame
                    for (let j = 0; j < tile.length; j++) {
                        if(this.tileset.get_compatibles(tile[j], i).includes(t)) {
                            return true;
                        }
                    }

                    // Se arrivo qui la possibilità del vicino esaminata non è compatibile
                    changed = true;
                    return false;
                })

                // Se ho escluso qualcosa controllo una possibile contradizione, poi richiedo la propagazione del cambiamento
                if(changed) {
                    if(this.grid[neigh_row][neigh_col].length === 0) {
                        console.log("contradiction with", [neigh_row, neigh_col]);
                        return false;
                    }
                    queue.enqueue([neigh_row, neigh_col]);
                }
            }
        }

        return true;
    }
}