const https = require("https");
// const request = require('request');
const consoleRed = '\x1b[31m%s\x1b[0m';
const consoleGreen = '\x1b[32m%s\x1b[0m';
const Maze = require("./maze.js")

var request = require('request-promise');

async function getMaze() {
    const options = {
        url: `https://api.noopschallenge.com/mazebot/random`,
    }
    const json = await request(options);
    console.log(consoleGreen, "Getting the maze")
    const payload = JSON.parse(json);
    const maze = new Maze(
        payload.name,
        payload.startingPosition,
        payload.endingPosition,
        payload.mazePath,
        payload.map.length,
        payload.map.length,
        payload.map);
    return maze;
}

async function submitSolution(mazePath, solution) {
    const options = {
        method: "POST",
        url: `https://api.noopschallenge.com${mazePath}`,
        body: {
            directions: solution
        },
        json: true
    };
    const json = await request(options);
    console.log(json);
    return json
}

function getMazeMock(minSize, maxSize) {
    const map = [[' ', ' ', 'B', 'X', ' ', ' ', 'X', ' ', ' ', 'X'],
    [' ', 'X', 'X', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
    [' ', ' ', 'X', ' ', 'X', 'X', 'X', ' ', ' ', 'X'],
    ['X', ' ', 'X', ' ', 'A', ' ', 'X', ' ', 'X', 'X'],
    [' ', ' ', 'X', 'X', 'X', 'X', 'X', ' ', ' ', 'X'],
    ['X', ' ', 'X', ' ', ' ', ' ', 'X', ' ', 'X', 'X'],
    [' ', ' ', 'X', ' ', 'X', 'X', 'X', ' ', ' ', 'X'],
    [' ', 'X', 'X', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
    [' ', 'X', ' ', 'X', ' ', ' ', 'X', ' ', ' ', 'X'],
    [' ', ' ', ' ', ' ', ' ', 'X', 'X', 'X', 'X', 'X']];
    return new Maze("MockMaze", [4, 3], [2, 0], "/", 10, 10, map);
}


async function solveMaze() {
    // const maze = await getMaze(10, 10);
    const maze = await getMaze();
    console.log(consoleGreen, "Solving maze ", maze.name);

    const path = [];
    maze.pad();
    depthFirstSearch(maze, maze.startingPostion, 0, "");
    console.log("Done");
    const result = await submitSolution(maze.mazePath, solution.path)
    if (result.result === 'success') {
        console.log(consoleGreen, "Success");
    } else {
        console.log(consoleRed, "Failed");
    }
}

let solution = null;
const directions = ['N', 'E', 'S', 'W'];


function depthFirstSearch(maze, position, steps, path) {
    if (solution === null) {
        const childNodes = maze.getAdjacentCells(position);
        childNodes.forEach((node, index) => {
            if (node === ' ') {
                const nodePosition = maze.getAdjacentCellPosition(position, index);
                maze.printPosition(nodePosition);
                return depthFirstSearch(maze, nodePosition, steps + 1, path + directions[index]);
            }
            if (node === 'B') {
                console.log("👌 ");
                path = path + directions[index];
                solution = { path: path, steps: steps }
                return;
            }
        });
    }
}


solveMaze();
