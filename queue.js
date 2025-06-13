export class Queue {
    constructor() {
        this.buf = [];
    }

    enqueue(elem) {
        this.buf.push(elem);
    }

    dequeue() {
        return this.buf.shift();
    }

    get size() {
        return this.buf.length;
    }

    isEmpty() {
        return this.size === 0;
    }
}