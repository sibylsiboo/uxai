// camera object
let mCamera;

// model object
let mModel;

// array to keep track of detected "things"
let mDetected = [];

// start camera and create model
function preload() {
  mCamera = createCapture(VIDEO, { flipped: true });
  mCamera.hide();

  // mModel = ml5.faceMesh({ flipped: true });
  mModel = ml5.handPose({ flipped: true });
}

// when some "thing" is detected, just copy it
function updateDetected(detected) {
  mDetected = detected;
}

function setup() {
  // create p5js canvas
  createCanvas(windowWidth, windowHeight);

  // start running the model on camera stream
  // call updateDetected whenever "thing" is detected
  mModel.detectStart(mCamera, updateDetected);
}

function draw() {
  background(180, 200, 255);
  image(mCamera, 0, 0);

  fill(0, 255, 0);
  noStroke();

  // draw a circle at every keypoint of each detected "thing"
  for (const dObj of mDetected) {
    for (const kpoint of dObj.keypoints) {
      circle(kpoint.x, kpoint.y, 8);
    }
  }
}
