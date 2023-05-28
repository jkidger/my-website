// Play with params here:

let numClusters = 7;
let numPoints = 200;

let deviation = 100;
let pointSize = 10;
let clusterSize = 15;

let WIDTH = 1800;
let HEIGHT = 900;
let fps = 1;

// ----------------------------------------------------------------------- \/ FURTHER STUFF TO PLAY WITH LOWER DOWN \/ -----------------------------------------------------------------------

var w = [[2,2], [2,3], [2,4], [2,5], [2,6], [3,6], [4,4], [4,5], [4,6], [5,6], [6,2], [6,3], [6,4], [6,5], [6,6]];
var e = [[8,2], [8,3], [8,4], [8,5], [8,6], [9,2], [9,4], [9,6], [10,2], [10,4], [10,6], [11,2], [11,4], [11,6], [12,2], [12,6]];
var l = [[14,2], [14,3], [14,4], [14,5], [14,6], [15,6], [16,6], [17,6], [18,6]];
var c = [[20,2], [20,3], [20,4], [20,5], [20,6], [21,2], [21,6], [22,2], [22,6], [23,2], [23,6], [24,2], [24,6]];
var o = [[26,2], [26,3], [26,4], [26,5], [26,6], [27,2], [27,6], [28,2], [28,6], [29,2], [29,6], [30,2], [30,4], [30,5], [30,6]];
var m = [[32,2], [32,3], [32,4], [32,5], [32,6], [33,3], [34,4], [35,3], [36,2], [36,3], [36,4], [36,5], [36,6]];
var ee = [[38,2], [38,3], [38,4], [38,5], [38,6], [39,2], [39,4], [39,6], [40,2], [40,4], [40,6], [41,2], [41,4], [41,6], [42,2], [42,6]];

class Node {
  constructor(pos, deviation) {
    this.pos = [random(pos[0] - deviation, pos[0] + deviation), random(pos[1] - deviation, pos[1] + deviation)];
    this.cluster = null;
  }
}

class Cluster {
  constructor(pos) {
    this.pos = pos;
    this.children = [];
    this.colour = color(random(255), random(255), random(255));
  }
}

function genPoints() {
  let list = [];
  for (let i = 0; i < numClusters; i++) {
    let clusterPos = [random(deviation, width-deviation), random(deviation, height-deviation)];
    for (let j = 0; j < (numPoints/numClusters); j++) {
        let point = new Node(clusterPos, deviation);
        list.push(point);
    }
  }
  return list;
}

function genPointsWelcome() {
  let list = [];
  let welcome = [];
  welcome.push(w)
  welcome.push(e);
  welcome.push(l);
  welcome.push(c);
  welcome.push(o);
  welcome.push(m);
  welcome.push(ee);
  for (let i = 0; i < welcome.length; i++) {
    let letterCoords = welcome[i];
    for (let j = 0; j < letterCoords.length; j++) {
      let point = new Node([(letterCoords[j][0]*20) + (i * 50), letterCoords[j][1]*20], 0);
      list.push(point);
    }
  }
  return list;
}

function genClusters() {
  let list = [];
  for (let i = 0; i < numClusters; i++) {
    let clusterPos = [random(width), random(height)];
    let cluster = new Cluster(clusterPos);
    list.push(cluster);
  }
  return list;
}

function genClustersForgy() {
  let list = [];
  let seen = [];
  for (let i = 0; i < numClusters; i++) {
    let randIndex = int(random(nodes.length));
    while (seen.includes(randIndex)) {
      randIndex = int(random(nodes.length));
    }
    seen.push(randIndex);
    let clusterPos = nodes[randIndex].pos;
    let cluster = new Cluster(clusterPos);
    list.push(cluster);
  }
  return list;
}

function randomPartition() {
  for (let i = 0; i < nodes.length; i++) {
    let randIndex = int(random(clusters.length));
    nodes[i].cluster = randIndex;
  }
  return nodes;
}

 // ----------------------------------------------------------------------- \/ PLAY WITH STUFF HERE \/ -----------------------------------------------------------------------
function reset() {
  // \/------- Random nodes gen -------\/
  //nodes = genPoints();
  
  // \/------- "WELCOME" nodes -------\/
  nodes = genPointsWelcome();
  
  
  
  // \/------- Naive cluster gen -------\/
  //clusters = genClusters();
  
  // \/------- Forgy cluster gen -------\/
  clusters = genClustersForgy();
  
  // \/------- Random Partition cluster gen -------\/
  //clusters = genClusters();
  //nodes = randomPartition();
  //let temp = stage2(nodes, clusters);
  //nodes = temp[0];
  //clusters = temp[1];
// ----------------------------------------------------------------------- /\ PLAY WITH STUFF HERE /\ -----------------------------------------------------------------------
  
  ping = 0;
  pong = -1;
  
  updateScene();
  pong = 1;
  
  clusterPoints = [];
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(fps);
  reset();
}

function draw() {
  if (pong == 1) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].cluster = null;
    }
    for (let i = 0; i < clusters.length; i++) {
      clusters[i].children = [];
    }
    let temp = stage1(nodes, clusters);
    nodes = temp[0];
    clusters = temp[1];
    prevClusters = clusters;
  } else if (pong == -1) {
    clusterPoints = [];
    for (let i = 0; i < clusters.length; i++) {
      clusterPoints.push(clusters[i].pos);
    }
    temp = stage2(nodes, clusters);
    nodes = temp[0];
    clusters = temp[1];
    
    let fin = finished(clusterPoints);
    if (fin) {
      pong = 0;
    }
  }
  
  updateScene(); // Draw to scene
  
  if (pong == 0) {
    textSize(30);
    fill(0);
    stroke(0);
    text("Finished!", width/2, height/2);
    ping++;
    if (ping == 5) {
      reset();
      return;
    }
  }
  
  
  pong *= -1;
}

function updateScene() {
  // Refresh background
  background(255);
  
  // Draw points
  for (let i = 0; i < nodes.length; i++) {
    if (clusters[nodes[i].cluster] == null) {
      fill(0);
      stroke(0);
    } else {
      fill(clusters[nodes[i].cluster].colour);
      stroke(clusters[nodes[i].cluster].colour);
    }
    circle(nodes[i].pos[0], nodes[i].pos[1], pointSize);
  }
  
  // Draw cluster points
  for (let i = 0; i < clusters.length; i++) {
    fill(clusters[i].colour);
    stroke(clusters[i].colour);
    circle(clusters[i].pos[0], clusters[i].pos[1], clusterSize);
  }
  
  if (pong == 1) {
    for (let i = 0; i < clusters.length; i++) {
      let c = clusters[i].pos;
      for (let j = 0; j < clusters[i].children.length; j++) {
        let p = nodes[clusters[i].children[j]].pos;
        stroke(clusters[i].colour);
        line(c[0], c[1], p[0], p[1]);
      }
    }
  }
}

function stage1(nodes, clusters) {
  for (let i = 0; i < nodes.length; i++) { // For each point
    let closest = getClosest(nodes[i], clusters); // Find closest cluster
    nodes[i].cluster = closest; // Assign closest cluster id to node
    clusters[closest].children.push(i); // Add node to closest cluster's children list
  }
  return [nodes, clusters];
}

function getClosest(node, clusters) {
  let min = [((pow((width), 2) + pow((height), 2)) + 100), -1]; // Init min: largest possible distance (plus 100 for safety), cluster ID (init as -1)
  for (let i = 0; i < clusters.length; i++) { // For each cluster
      let distance = [distt(node.pos, clusters[i].pos), i]; // Get distance to cluster
      if (distance[0] < min[0]) {
        min = distance;
      }
    }
    return min[1];
}

function distt(pos1, pos2) {
  return (pow((pos1[0] - pos2[0]), 2) + pow((pos1[1] - pos2[1]), 2)) // Return approximation for distance (no need for sqrt, save computation!)
}

function stage2(nodes, clusters) {
  let seen = [];
  for (let i = 0; i < clusters.length; i++) { // For each cluster
    if (clusters[i].children.length > 0) {
      let newPos = getAveragePos(nodes, clusters[i].children); // Get average position of children
      clusters[i].pos = newPos; // Move cluster to average posistion
    } else { // If cluster has no children
      
      // Randomize cluster position
      //clusters[i].pos = [random(width), random(height)]; 
    
      // Set cluster pos to a random node
      let randIndex = int(random(nodes.length));
      while (seen.includes(randIndex)) {
        randIndex = int(random(nodes.length));
      }
      seen.push(randIndex);
      let clusterPos = nodes[randIndex].pos;
      clusters[i].pos = clusterPos;
    }
}
  return [nodes, clusters];
}

function getAveragePos(nodes, children) {
  avgPos = [0,0]
  for (let i = 0; i < children.length; i++) { // For each child
    let node = nodes[children[i]];
    avgPos = [(avgPos[0] + node.pos[0]), (avgPos[1] + node.pos[1])]; // Add up positions
  }
  avgPos = [avgPos[0] / children.length, avgPos[1] / children.length]; // Find average position
  return avgPos;
}

function finished(clusterPoints) {
  for (let i = 0; i < clusters.length; i++) {
    if (clusters[i].children.length == 0) { // If a cluster has no children, carry on
      return false;
    }
    if ((int(clusters[i].pos[0]) != int(clusterPoints[i][0])) || (int(clusters[i].pos[1]) != int(clusterPoints[i][1]))) { // If a cluster has moved, carry on
      return false;
    }
 }
 return true; // Otherwise finish (if all have children + have stopped moving)
}

function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}
