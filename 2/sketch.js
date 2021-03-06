let myFont, size;
let prevTime, tx, ty;
let fontSize = 90;
const data = {};
const ballCount = 1500;
let rootNode;

function preload() {
  myFont = loadFont('./RobotoMonoBold.ttf');
}

function setup() {
  size = Math.min(700, window.innerHeight, window.innerWidth) - 10;
  if (size < 470) {
    fontSize = 60;
  }
  createCanvas(size, size);
  data.nodes = d3.range(ballCount).map((_, i) => {
    if (i === 0) {
      return { r: 0, color: `rgba(0,0,0,0)`, cx: -size, cy: -size };
    }
    return { r: (Math.random() * 15 + 2), color: `rgba(255,0,0,0.4)` };
  });
  rootNode = data.nodes[0];
  data.simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force("charge", d3.forceManyBody().strength((d) => { return d.r ? (-d.r * 2) : -500 }))
    .force("x", d3.forceX().strength(0.3))
    .force("y", d3.forceY().strength(0.3));
}

function draw() {
  clear();
  const time = timeString();
  if (time != prevTime) {
    data.nodes = data.nodes.slice(0, ballCount);
    const { points, posx, posy } = drawTime(time);
    tx = posx;
    ty = posy;
    points.forEach((p) => {
      data.nodes.push({ r: 4, x: p.x, y: p.y, cx: p.x, cy: p.y, color: `rgba(0,0,255,0.4)` });
    });
    prevTime = time;
    data.simulation.nodes(data.nodes);
    data.simulation.alpha(1).restart();
  }
  data.nodes.forEach((d) => {
    push();
    noStroke();
    if (d.cx || d.cy) {
      d.x = d.cx - (size / 2);
      d.y = d.cy - (size / 2);
    }
    fill(d.color);
    ellipse(size / 2 + d.x, size / 2 + d.y, d.r, d.r);
    pop();
  });
}

function timeString() {
  // return 'HELLO WORLD';
  var hours = hour();
  var minutes = minute();
  var seconds = second();
  hours = nf(hours, 2, 0);
  minutes = nf(minutes, 2, 0);
  seconds = nf(seconds, 2, 0);
  return `${hours}:${minutes}:${seconds}`;
}

function drawTime(time) {
  const bounds = myFont.textBounds(time, 0, 0, fontSize);
  const posx = size / 2 - bounds.w / 2;
  const posy = size / 2 + bounds.h / 2;
  const points = myFont.textToPoints(time, posx, posy, fontSize, { sampleFactor: 0.2 });
  return { points, posx, posy };
}

function mouseMoved() {
  if (rootNode) {
    rootNode.cx = mouseX;
    rootNode.cy = mouseY;
    if (mouseX > 0 && mouseY > 0 && mouseX < size && mouseY < size) {
      data.simulation.alpha(1).restart();
    }
  }
  return false;
}