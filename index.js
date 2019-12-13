const https = require("https");
// const request = require('request');
const consoleRed = '\x1b[31m%s\x1b[0m';
const consoleGreen = '\x1b[32m%s\x1b[0m';
const Maze = require("./maze.js")

const request = require('request-promise');

let solution = null;

const directions = ['N', 'E', 'S', 'W'];

async function race() {
    const mazeCount = 100;
    let nextMaze = await getRace();

    for (let i = 0; i < mazeCount; i++) {
        console.log(nextMaze);
        nextMaze = await solveMaze(nextMaze);
        if (nextMaze === null) {
            i = mazeCount + 1;
        }

    }
}

async function getRace() {
    const options = {
        method: "POST",
        url: `https://api.noopschallenge.com/mazebot/race/start`,
        body: {
            login: "<login>"
        },
        json: true
    }
    const json = await request(options);
    console.log(json);
    return json.nextMaze;
}

async function getMazeRandom() {
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

async function getMaze(mazePath) {
    const options = {
        url: `https://api.noopschallenge.com${mazePath}`,
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


async function solveMaze(mazePath) {
    solution = null;
    let maze;
    if (mazePath) {
        maze = await getMaze(mazePath);
    } else {
        maze = await getMazeRandom();
    }
    console.log(consoleGreen, `Solving maze ${maze.name} ${maze.mazePath}`);
    maze.pad();
    depthFirstSearch(maze, maze.startingPostion, 0, "");
    console.log("Done");
    // console.log(maze.map);
    const result = await submitSolution(maze.mazePath, solution.path)
    if (result.result === 'success') {
        console.log(consoleGreen, "Success");
        return result.nextMaze;
    } else if (result.result === 'finished') {

    } else {
        console.log(consoleRed, "Failed");
        return null;
    }
}


function depthFirstSearch(maze, position, steps, path) {
    if (solution === null) {
        const childNodes = maze.getAdjacentCells(position);
        childNodes.forEach((node, index) => {
            if (node === ' ') {
                const nodePosition = maze.getAdjacentCellPosition(position, index);
                maze.recordPosition(nodePosition);
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


// solveMaze();
race();

