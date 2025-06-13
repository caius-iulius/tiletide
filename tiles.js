"use strict";

export class Grid {
    constructor(rows, cols, gen) {
        if(!gen) {
            gen = (_i, _j) => null
        }

        this.rows = rows;
        this.cols = cols;
        this.grid = [];

        for (let i = 0; i < rows; i++) {
            let row = [];

            for (let j = 0; j < cols; j++) {
                row.push(gen(i, j));
            }

            this.grid.push(row);
        }
    }

    get_tile(base_row, base_col, rows, cols) {
        //TODO: unpacking
        const wrapping_idx = (i, n) => (i + n) % n;

        const grid = new Tile(rows, cols, (i, j) => {
            return this.grid[wrapping_idx(base_row + i, this.rows)][wrapping_idx(base_col + j, this.cols)];
        })

        return grid;
    }

    get_tiles(rows, cols, wrap_rows, wrap_cols) {
        const row_bias = wrap_rows ? Math.floor(rows / 2) : 0;
        const col_bias = wrap_cols ? Math.floor(cols / 2) : 0;
        const tile_rows = this.rows - (wrap_rows ? 0 : rows - 1);
        const tile_cols = this.cols - (wrap_cols ? 0 : cols - 1);

        return new Grid(tile_rows, tile_cols, (i, j) => {
            return this.get_tile(i - row_bias, j - col_bias, rows, cols);
        });
    }
}

export const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
export const UP = 0;
export const DOWN = 1;
export const LEFT = 2;
export const RIGHT = 3;

class Tile extends Grid {
    constructor(rows, cols, gen) {
        super(rows, cols, gen);

        this.weight = 1;
        this.compatible = [[], [], [], []];
    }

    get center() {
        return this.grid[Math.floor(this.rows / 2)][Math.floor(this.cols / 2)];
    }
}

function compare_tiles(tile_a, tile_b, row_offset, col_offset) {
    for (let i = 0; i < tile_a.rows - row_offset; i++) {
        for (let j = 0; j < tile_a.cols - col_offset; j++) {
            if (tile_a.grid[i + row_offset][j + col_offset] !== tile_b.grid[i][j])
                return false;
        }
    }

    return true;
}

export function deduplicate_tiles(tiles) {
    const dedup = [];

    tiles.forEach((tile) => {
        const t = dedup.find((t) => compare_tiles(t, tile, 0, 0));

        if(t) {
            t.weight++;
        } else {
            dedup.push(tile);
        }
    })

    return dedup;
}

function build_adjacency_lists(tiles) {
    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles.length; j++) {
            if(compare_tiles(tiles[i], tiles[j], 0, 1)) {
                tiles[i].compatible[RIGHT].push(j);
                tiles[j].compatible[LEFT].push(i);
            }

            if(compare_tiles(tiles[i], tiles[j], 1, 0)) {
                tiles[i].compatible[DOWN].push(j);
                tiles[j].compatible[UP].push(i);
            }
        }
    }

    //TODO non necessario perché muta
    return tiles;
}

export function generate_tileset(grid, rows, cols, wrap_rows, wrap_cols) {
    const tile_grid = grid.get_tiles(rows, cols, wrap_rows, wrap_cols);
    const tiles = tile_grid.grid.flat();
    const dedup = deduplicate_tiles(tiles);
    build_adjacency_lists(dedup);

    return dedup;
}