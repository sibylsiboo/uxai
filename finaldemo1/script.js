let userQuestion = '';
let tarotDeck = [
  { name: "The Fool", meaning: "New beginnings, adventure, and spontaneity." },
  { name: "The Lovers", meaning: "Love, harmony, and choices from the heart." },
  { name: "The Tower", meaning: "Sudden change, upheaval, and revelation." },
  { name: "The Hermit", meaning: "Introspection, solitude, and inner wisdom." },
  { name: "The Star", meaning: "Hope, healing, and spiritual clarity." }
];
let selectedCard = null;
let canvasInstance;

function startReading() {
  const overlay = document.getElementById('overlay-ui');
  overlay.style.display = 'none';

  userQuestion = document.getElementById('question-input').value.trim();
  const output = document.getElementById("reading-output");
  output.innerHTML = '';

  if (userQuestion) {
    output.innerHTML += `<div class="chat-bubble"><strong>You:</strong> ${userQuestion}</div>`;
  }

  canvasInstance = new p5(sketch);
}

function resetReading() {
  document.getElementById("reading-output").innerHTML = '';
  document.getElementById("reset-btn").style.display = 'none';
  document.getElementById("question-input").value = '';
  document.getElementById("overlay-ui").style.display = 'flex';
  if (canvasInstance) canvasInstance.remove();
}

async function fetchChatGPTResponse(userMsg, card) {
  const output = document.getElementById("reading-output");
  output.style.display = "block";
  output.innerHTML += '<div class="typing">The Oracle is contemplating your question...</div>';

  const systemPrompt = "You are a mystical tarot guide. Interpret the card in the context of the user's question with intuition and symbolism.";
  const userPrompt = `User question: "${userMsg}"\nCard drawn: ${card.name} - ${card.meaning}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer `, 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8
      })
    });

    const data = await res.json();
    output.querySelector('.typing')?.remove();

    if (data.choices && data.choices.length > 0) {
      output.innerHTML += `<div class="chat-bubble"><strong>Oracle:</strong> ${data.choices[0].message.content}</div>`;
    } else {
      output.innerHTML += "<div class='chat-bubble'>Hmm... something went wrong. Please try again.</div>";
    }

    document.getElementById("reset-btn").style.display = 'block';

  } catch (error) {
    console.error("ChatGPT API error:", error);
    output.querySelector('.typing')?.remove();
    output.innerHTML += "<div class='chat-bubble'>Unable to reach the Tarot Oracle. Check your internet or API key.</div>";
    document.getElementById("reset-btn").style.display = 'block';
  }
}

const sketch = (p) => {
  let video, handpose, predictions = [];
  let cardShown = false;

  p.setup = () => {
    const canvas = p.createCanvas(640, 360);
    canvas.parent("main-container");

    video = p.createCapture(p.VIDEO);
    video.size(640, 360);
    video.hide();

    handpose = ml5.handpose(video.elt, () => console.log("Handpose model loaded"));
    handpose.on("predict", results => predictions = results);
  };

  p.draw = () => {
    p.image(video, 0, 0, p.width, p.height);

    if (!cardShown && predictions.length > 0) {
      cardShown = true;
      selectedCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
      fetchChatGPTResponse(userQuestion || "General Reading", selectedCard);
    }

    if (selectedCard) {
      p.fill(255);
      p.stroke(0);
      p.strokeWeight(2);
      p.rect(p.width / 2 - 75, p.height / 2 - 100, 150, 200, 10);
      p.textAlign(p.CENTER);
      p.fill(0);
      p.textSize(16);
      p.text(selectedCard.name, p.width / 2, p.height / 2);
    }

    drawHand(p);
  };

  function drawHand(p) {
    for (let hand of predictions) {
      for (let kp of hand.landmarks) {
        p.fill(0, 255, 0);
        p.noStroke();
        p.circle(kp[0], kp[1], 10);
      }
    }
  }
};
