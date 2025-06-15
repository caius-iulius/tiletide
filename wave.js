// TODO: GESTIONE DEGLI EDGE

"use strict";

import { Queue } from "./queue.js";
import { Grid, DIRECTIONS } from "./tiles.js";

export class Wave extends Grid {
    constructor(rows, cols, tileset) {
        super(rows, cols, (_i, _j) => {
            const arr = [];
            for (let i = 0; i < tileset.length; i++) {
                arr.push(i);
            }
            return arr;
        });

        this.tileset = tileset;
    }

    // Calcola la Shannon entropy della tile
    tile_entropy(row, col) {
        const tile = this.grid[row][col];
        const weights_sum = tile.map(t => this.tileset[t].weight).reduce((a, e) => a+e);

        const entropy = -tile.map(t => {
            const p = this.tileset[t].weight / weights_sum;
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

        const coord = arr[Math.floor(Math.random() * arr.length)];
        //console.log("choosing with entropy", ent, coord, this.grid[coord[0]][coord[1]]);
        return coord;
    }

    // Osserva (e collassa) una tile
    observe(row, col) {
        const tile = this.grid[row][col];

        const weights_sum = tile.map(t => this.tileset[t].weight).reduce((a, e) => a+e);
        const choice = Math.floor(Math.random() * weights_sum);

        let acc = 0;
        let i = 0;
        for (; i < tile.length; i++) {
            acc += this.tileset[tile[i]].weight;
            if (acc > choice) break;
        }

        //console.log(tile.map(t => this.tileset[t].weight), weights_sum, choice, i);
        //console.log(acc, i, choice, weights_sum);
        this.grid[row][col] = [tile[i]];

        //console.log("observed", tile[i]);
    }

    // Funzione di propagazione. Parte dalla prima tile modificata ed esegue un BFS sui vicini escludendone le incompatibilità
    propagate(row, col) {
        // Coda necessaria per il BFS
        const queue = new Queue();
        queue.enqueue([row, col]);

        while(!queue.isEmpty()) {
            const tile_coords = queue.dequeue();
            //console.log("propagating", tile_coords);
            const tile = this.grid[tile_coords[0]][tile_coords[1]];

            // Per i 4 vicini
            for (let i = 0; i < 4; i++) {
                const neigh_row = this.wrapping_row(tile_coords[0] + DIRECTIONS[i][0]);
                const neigh_col = this.wrapping_col(tile_coords[1] + DIRECTIONS[i][1]);

                let changed = false;

                // Filtra le possibilità del vicino
                this.grid[neigh_row][neigh_col] = this.grid[neigh_row][neigh_col].filter((t) => {

                    // Cerca almeno una possibilità della propria tile compatibile con quella del vicino attualmente in esame
                    for (let j = 0; j < tile.length; j++) {
                        const compatibilities = this.tileset[tile[j]].compatible[i];
                        if(compatibilities.includes(t)) {
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