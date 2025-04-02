let handPose, video, hands = [];
let cards = [];
let selectedCards = [];

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();

  for (let i = 0; i < 5; i++) {
    cards.push({
      x: 100 + i * 130,
      y: 250,
      w: 100,
      h: 150,
      selected: false,
      hovered: false,
    });
  }

  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0, width, height);

  detectHover();

  drawCards();

  drawHand();
}

function drawCards() {
  for (let card of cards) {
    stroke(0);
    strokeWeight(2);
    if (card.selected) {
      fill(200, 255, 200);
    } else if (card.hovered) {
      fill(255, 255, 150);
    } else {
      fill(255);
    }
    rect(card.x, card.y, card.w, card.h, 10);
  }
}

function drawHand() {
  for (let hand of hands) {
    for (let kp of hand.keypoints) {
      fill(0, 255, 0);
      noStroke();
      circle(kp.x, kp.y, 10);
    }
  }
}

function detectHover() {
  for (let card of cards) card.hovered = false;

  if (hands.length > 0) {
    let hand = hands[0];
    let indexTip = hand.keypoints[8];
    for (let card of cards) {
      if (
        indexTip.x > card.x &&
        indexTip.x < card.x + card.w &&
        indexTip.y > card.y &&
        indexTip.y < card.y + card.h
      ) {
        card.hovered = true;
        if (!card.selected) {
          card.selected = true;
          selectedCards.push(card);
        }
      }
    }
  }
}

function gotHands(results) {
  hands = results;
}
