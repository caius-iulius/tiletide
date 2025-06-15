"use strict";

function wrapping_idx(i, n) {
    return (i + n) % n;
}

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

    wrapping_row(row) {
        return wrapping_idx(row, this.rows);
    }

    wrapping_col(col) {
        return wrapping_idx(col, this.cols);
    }

    get_tile(base_row, base_col, rows, cols) {
        const grid = new Tile(rows, cols, (i, j) => {
            return this.grid[this.wrapping_row(base_row + i)][this.wrapping_col(base_col + j)];
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

export function extract_tiles_from_grid(tile_grid) {
    const tiles = [];
    const borders = [[], [], [], []];

    for (let i = 0; i < tile_grid.rows; i++) {
        for (let j = 0; j < tile_grid.cols; j++) {
            const tile = tile_grid.grid[i][j];

            let tile_id = tiles.findIndex((t) => compare_tiles(t, tile, 0, 0));
            if(tile_id < 0) {
                tile_id = tiles.length;
                tiles.push(tile);
            } else {
                tiles[tile_id].weight++;
            }

            if(i === 0 && !borders[UP].includes(tile_id)) borders[UP].push(tile_id);
            if (i + 1 === tile_grid.rows && !borders[DOWN].includes(tile_id)) borders[DOWN].push(tile_id);
            if(j === 0 && !borders[LEFT].includes(tile_id)) borders[LEFT].push(tile_id);
            if (j + 1 === tile_grid.cols && !borders[RIGHT].includes(tile_id)) borders[RIGHT].push(tile_id);
        }
    }

    return [tiles, borders];
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
    const tiles_borders = extract_tiles_from_grid(tile_grid);
    build_adjacency_lists(tiles_borders[0]);

    console.log(tiles_borders[1]);

    return tiles_borders[0];
}