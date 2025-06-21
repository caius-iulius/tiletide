export class ColorGrid {
    constructor(gridId, colors) {
        this.gridElement = document.getElementById(gridId);
        this.colors = colors;
        this.size = colors.length;
        this.selectedColor = null;
        this.cells = [];

        this.gridElement.innerHTML = '';
        for (let i = 0; i < this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'color-cell';
            cell.style.backgroundColor = this.colors[i].style;
            cell.addEventListener('click', () => this.selectColor(i));

            this.gridElement.appendChild(cell);
            this.cells.push(cell);
        }
    }

    selectColor(index) {
        console.log("selecting", index);

        if (this.selectedColor !== null) {
            this.cells[this.selectedColor].classList.remove('color-selected');
        }

        this.selectedColor = index;
        this.cells[index].classList.add('color-selected');
    }

    hide() {
        this.gridElement.style.display = 'none';
    }

    show() {
        this.gridElement.style.display = 'grid';
    }
}