let handPose, video, hands = [];
let cards = [];
let selectedCards = [];

const tarotDeck = [
  { name: "The Fool", meaning: "New beginnings, adventure, and spontaneity." },
  { name: "The Lovers", meaning: "Love, harmony, and choices from the heart." },
  { name: "The Tower", meaning: "Sudden change, upheaval, and revelation." },
  { name: "The Hermit", meaning: "Introspection, solitude, and inner wisdom." },
  { name: "The Star", meaning: "Hope, healing, and spiritual clarity." }
];

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(800, 600);
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
      name: tarotDeck[i].name,
      meaning: tarotDeck[i].meaning,
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
  textAlign(CENTER);
  textSize(12);
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

    // Show tooltip with meaning if selected
    if (card.selected) {
      fill(0, 0, 0, 180);
      noStroke();
      rect(card.x, card.y - 60, card.w, 50, 5);

      fill(255);
      textStyle(BOLD);
      text(card.name, card.x + card.w / 2, card.y - 45);
      textStyle(NORMAL);
      textSize(10);
      text(card.meaning, card.x + card.w / 2, card.y - 30, card.w - 10);
    }
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
