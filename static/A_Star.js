var gridWidth = 45;
var gridHeight = 9;
var grid = new Array(gridWidth)
var start;
var goal;
var nodes = [];
var path = [];
var mult = 20;
var offset = 50;
var wordCoords = [];
var wCoords = [[2,2], [2,3], [2,4], [2,5], [2,6], [3,6], [4,4], [4,5], [4,6], [5,6], [6,2], [6,3], [6,4], [6,5], [6,6]];
var e1Coords = [[8,2], [8,3], [8,4], [8,5], [8,6], [9,2], [9,4], [9,6], [10,2], [10,4], [10,6], [11,2], [11,4], [11,6], [12,2], [12,6]];
var lCoords = [[14,2], [14,3], [14,4], [14,5], [14,6], [15,6], [16,6], [17,6], [18,6]];
var cCoords = [[20,2], [20,3], [20,4], [20,5], [20,6], [21,2], [21,6], [22,2], [22,6], [23,2], [23,6], [24,2], [24,6]];
var oCoords = [[26,2], [26,3], [26,4], [26,5], [26,6], [27,2], [27,6], [28,2], [28,6], [29,2], [29,6], [30,2], [30,4], [30,5], [30,6]];
var mCoords = [[32,2], [32,3], [32,4], [32,5], [32,6], [33,3], [34,4], [35,3], [36,2], [36,3], [36,4], [36,5], [36,6]];
var e2Coords = [[38,2], [38,3], [38,4], [38,5], [38,6], [39,2], [39,4], [39,6], [40,2], [40,4], [40,6], [41,2], [41,4], [41,6], [42,2], [42,6]];
var resetTimer = 0;
var resetToggle = false;
var resetTime = 60;

class Node {
  constructor(x, y, f, g, cameFrom, obs) {
    this.x = x;
    this.y = y;
    this.f = f;
    this.g = g;
    this.cameFrom = cameFrom;
    this.neighbours = [];
    this.obstacle = obs;
  }
}

function reset() {
  gridWidth = 45;
  gridHeight = 9;
  grid = new Array(gridWidth)
  start = null;
  goal = null;
  nodes = [];
  path = [];
  mult = 20;
  offset = 50;
  wordCoords = [];
  wCoords = [[2,2], [2,3], [2,4], [2,5], [2,6], [3,6], [4,4], [4,5], [4,6], [5,6], [6,2], [6,3], [6,4], [6,5], [6,6]];
  e1Coords = [[8,2], [8,3], [8,4], [8,5], [8,6], [9,2], [9,4], [9,6], [10,2], [10,4], [10,6], [11,2], [11,4], [11,6], [12,2], [12,6]];
  lCoords = [[14,2], [14,3], [14,4], [14,5], [14,6], [15,6], [16,6], [17,6], [18,6]];
  cCoords = [[20,2], [20,3], [20,4], [20,5], [20,6], [21,2], [21,6], [22,2], [22,6], [23,2], [23,6], [24,2], [24,6]];
  oCoords = [[26,2], [26,3], [26,4], [26,5], [26,6], [27,2], [27,6], [28,2], [28,6], [29,2], [29,6], [30,2], [30,4], [30,5], [30,6]];
  mCoords = [[32,2], [32,3], [32,4], [32,5], [32,6], [33,3], [33,4], [34,4], [34,5], [35,3], [35,4], [36,2], [36,3], [36,4], [36,5], [36,6]];
  e2Coords = [[38,2], [38,3], [38,4], [38,5], [38,6], [39,2], [39,4], [39,6], [40,2], [40,4], [40,6], [41,2], [41,4], [41,6], [42,2], [42,6]];
  resetToggle = false;
  resetTimer = 0;
  loop();
  setup();
}

function setup() {
  for (let x = 0; x < gridWidth; x++) {
    grid[x] = new Array(gridHeight);
  }

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      grid[x][y] = new Node(x, y, Infinity, Infinity, null, false);
      chance = random();
      if (chance < 0.2) {
        //grid[x][y].obstacle = true;
      }
    }
  }

  for (let y = 10; y < 25; y++) {
    //grid[10][y].obstacle = true;
  }
  
  for (let x = 10; x < 25; x++) {
    //grid[x][10].obstacle = true;
  }
  wordCoords.push(wCoords);
  wordCoords.push(e1Coords);
  wordCoords.push(lCoords);
  wordCoords.push(cCoords);
  wordCoords.push(oCoords);
  wordCoords.push(mCoords);
  wordCoords.push(e2Coords);
  for (let i = 0; i < wordCoords.length; i++) {
    for (let j = 0; j < wordCoords[i].length; j++) {
      coords = wordCoords[i][j]
      grid[coords[0]][coords[1]].obstacle = true;
    }
  }
  //for (let i = 0; i < wCoords.length; i++) {
    //coords = wCoords[i]
    //grid[coords[0]][coords[1]].obstacle = true;
  //}
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      addNeighbours(grid[x][y]);
    }
  }
  
  start = grid[0][0];
  randX = random();
  randY = random();
  randX = int(map(randX, 0, 1, 1, gridWidth-1));
  randY = int(map(randY, 0, 1, 1, gridHeight-1));
  while (grid[randX][randY].obstacle) {
    randX = random();
    randY = random();
    randX = int(map(randX, 0, 1, 1, gridWidth-1));
    randY = int(map(randY, 0, 1, 1, gridHeight-1));
  }
  //randX = int(map(randX, 0, 1, 1, gridWidth-1));
  //randY = int(map(randY, 0, 1, 1, gridHeight-1));
  //print("goal: (" + randX + ", " + randY + ")");
  goal = grid[randX][randY];
  
  start.obstacle = false;
  goal.obstacle = false;

  nodes.push(start);

  start.g = 0;
  start.f = h(start);

  var myCanvas = createCanvas(980, 260);
  myCanvas.parent("test");
  background(150);
  
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      cur = grid[x][y]
      if (cur.obstacle) {
        fill(0, 0, 255);
        stroke(0, 0, 255);
      } else if (cur == start) {
        fill(0, 255, 0);
        stroke(0, 255, 0);
      } else if (cur == goal) {
        fill(255, 0, 0);
        stroke(255, 0, 0);
      } else {
        fill(150);
        stroke(150);
      }
      circle((x*mult)+offset, (y*mult)+offset, 10);
    }
  }
  textSize(12);
  stroke(0);
  fill(0);
  strokeWeight(0);
  textAlign(RIGHT, BOTTOM);
  text('JavaScript animation of the A* algorithm', width-2, height-2);
  draw();
}


function draw() {
  //background(100);
  if (!resetToggle) {
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        cur = grid[x][y]
        if (cur.obstacle) {
          fill(0, 0, 255);
          stroke(0, 0, 255);
        } else if (cur == start) {
          fill(0, 255, 0);
          stroke(0, 255, 0);
        } else if (cur == goal) {
          fill(255, 0, 0);
          stroke(255, 0, 0);
        } else {
          fill(0);
          stroke(0);
        }
        //circle((x*mult)+offset, (y*mult)+offset, 10);
      }
    }
    if (path.length > 0) {
      oldX = path[0][0];
      oldY = path[0][1];
      for (let i = 0; i < path.length; i++) {
        curX = path[i][0];
        curY = path[i][1];
        //print("(" + path[i][0] + ", " + path[i][1] + ")");
        strokeWeight(5);
        stroke(255, 165, 0);
        line((oldX*mult)+offset, (oldY*mult)+offset, (curX*mult)+offset, (curY*mult)+offset);
        oldX = curX;
        oldY = curY;
      }
    }
    
    
    if (nodes.length>0) {
      current = lowestFScore(nodes);
      if (current == goal) {
        //textSize(32);
        //fill(0);
        //textAlign(LEFT, TOP);
        //stroke(0);
        //strokeWeight(1);
        //text("DONE", 0, 0);
        //print("Found a path to the goal node!");
        path = reconstructPath(current);
        oldX = path[0][0];
        oldY = path[0][1];
        for (let i = 0; i < path.length; i++) {
          curX = path[i][0];
          curY = path[i][1];
          //print("(" + path[i][0] + ", " + path[i][1] + ")");
          strokeWeight(5);
          stroke(0, 255, 0);
          line((oldX*mult)+offset, (oldY*mult)+offset, (curX*mult)+offset, (curY*mult)+offset);
          oldX = curX;
          oldY = curY;
        }
        //noLoop();
        //sleep(1000).then(function() {
        resetToggle = true;
        //reset(); // Finished so reset
        //})
        return
      }
      index = nodes.indexOf(current);
      nodes.splice(index, 1);
      
      for (let i = 0; i < current.neighbours.length; i++) {
        path = []
        neighbour = current.neighbours[i]
        testG = current.g + distance(current, neighbour);
        if (testG < neighbour.g) {
          neighbour.cameFrom = current;
          neighbour.g = testG;
          neighbour.f = testG + h(neighbour);
          if (nodes.indexOf(neighbour)==-1) {
            nodes.push(neighbour);
          }
          path = reconstructPath(current);
        }
      }
    } else {
      //sleep(1000).then(function() {
        resetToggle = true;
      //reset(); // Finished so reset
      //})
      //textSize(32);
      //fill(0);
      //textAlign(LEFT, TOP);
      //stroke(0);
      //text("FAIL", 0, 0);
      //noLoop();
    }
  } else { // If in reset phase
    if (resetTimer == resetTime) {
      reset();
      return;
    }
    //print("resetTimer: " + resetTimer);
    resetTimer++;
  }
}

function addNeighbours(node) {
  nodeX = node.x
  nodeY = node.y
  
  for (let y = -1; y < 2; y++) {
    for (let x = -1; x < 2; x++) {
      if (inRange(nodeX+x, 0, gridWidth-1) && inRange(nodeY+y, 0, gridHeight-1) && !(x==0 && y==0) && !node.obstacle) {
        node.neighbours.push(grid[nodeX+x][nodeY+y]);
      }
    }
  }
}

function inRange(x, min, max) {
  return ((x-min)*(x-max) <= 0);
}

function h(node) {
  return distance(node, goal);
}

function distance(nodeA, nodeB) {
  dx = nodeB.x - nodeA.x;
  dy = nodeB.y - nodeA.y;
  return Math.sqrt((dx*dx) + (dy*dy));
}

function lowestFScore(list) {
  lowest = new Node(-1, -1, Infinity, null, null);
  for (let i = 0; i < list.length; i++) {
    current = list[i];
    if (current.f < lowest.f) {
      lowest = current;
    }
  }
  return lowest;
}

function reconstructPath(node) {
  //print("reconstructing path from node: (" + node.x + ", " + node.y + ")")
  path = getPath(node, []);
  return path.reverse();
}

function getPath(node, path) {
  path.push([node.x, node.y]);
  if (node != start) {
    path = getPath(node.cameFrom, path);
    return path;
  } else {
    return path;
  }
}

function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}
