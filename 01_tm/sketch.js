// Hand Model
let HAND_MODEL = "https://teachablemachine.withgoogle.com/models/oP47yiMBB/model.json"

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

  mModel = ml5.imageClassifier(HAND_MODEL, { flipped: true });
}

// when classification is done, just copy result to mDetected
function updateDetected(detected) {
  mDetected = detected;
  mModel.classify(mCamera, updateDetected);
}

function setup() {
  // create p5js canvas
  createCanvas(windowWidth, windowHeight);

  // run the model once on camera image
  mModel.classify(mCamera, updateDetected);
}

function draw() {
  background(180, 200, 255);
  image(mCamera, 0, 0);

  // draw a bar chart for top-3 classes in classifier
  push();
  translate(0, mCamera.height + 12);
  
  for (let dObj of mDetected.slice(0,3)) {
    fill(20, 200, 20);
    noStroke();
    rect(0, 0, dObj.confidence * mCamera.width, 24);

    noFill();
    stroke(0);
    text(dObj.label, 8, 12);

    translate(0, 48);
  }
  pop();
}
