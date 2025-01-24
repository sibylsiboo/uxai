let mCamera;

function preload() {
  mCamera = createCapture(VIDEO);
  mCamera.size();
  mCamera.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(180, 200, 255);
  image(mCamera, 0, 0);
}
