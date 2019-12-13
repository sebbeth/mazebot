module.exports = class Maze {

    constructor(name, startingPostion, endingPostition, mazePath, width, height, map) {
        this.name = name;
        this.startingPostion = { x: startingPostion[0], y: startingPostion[1] };
        this.endingPostition = { x: endingPostition[0], y: endingPostition[1] };
        this.mazePath = mazePath;
        this.width = width;
        this.height = height;
        this.map = map;
    }

    recordPosition(position) {
        this.map[position.y][position.x] = "🤖";
    }

    pad() {
        this.map.forEach((row) => {
            row.splice(0, 0, "🎹");
            row.splice(row.length, 0, "🎹");
        });
        const newRow = this.map[0].map(() => { return "🎹" });
        this.map.splice(0, 0, [...newRow]); // Add a top row
        this.map.push([...newRow]); // Add a bottom row
        this.startingPostion.x++;
        this.startingPostion.y++;

    }

    getAdjacentCells(position) {
        // Returns an array of four adjacent cells, ordered clockwise N,E,S,W, 
        const output = [];
        output.push(this.map[position.y - 1][position.x]);
        output.push(this.map[position.y][position.x + 1]);
        output.push(this.map[position.y + 1][position.x]);
        output.push(this.map[position.y][position.x - 1]);
        return output;
    }

    getAdjacentCellPosition(currentPosition, direction) {
        switch (direction) {
            case 0: // N
                return { x: currentPosition.x, y: currentPosition.y - 1 };
            case 1: // E
                return { x: currentPosition.x + 1, y: currentPosition.y };
            case 2: // S
                return { x: currentPosition.x, y: currentPosition.y + 1 };
            case 3: // W
                return { x: currentPosition.x - 1, y: currentPosition.y };
        }
    }
}