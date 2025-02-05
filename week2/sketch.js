let video;
let poseNet;
let pose;
let capturedFrame;
let button;

function setup() {
  createCanvas(400, 400);
  background(255);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video);
  poseNet.on('pose', gotPoses);

  textAlign(CENTER, CENTER);

  button = createButton('Capture');
  button.position(180, 350);
  button.mousePressed(captureEyes);

  imageMode(CENTER);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function draw() {
  background(255);
  if (capturedFrame) {
    image(capturedFrame, width / 2, height / 2);
  }
}

function captureEyes() {
  if (pose) {
    capturedFrame = createGraphics(100, 50); // Adjust size for eye region
    capturedFrame.image(
      video,
      -pose.rightEye.x + 50, // Adjust position to center the eye
      -pose.rightEye.y + 25
    );
  }
}
