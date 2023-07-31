const elementsInput = document.getElementById("elements");
const speedInput = document.getElementById("speed");
const algorithmSelect = document.getElementById("algorithm");
const buttons = document.querySelector(".buttons");

let elements = elementsInput.valueAsNumber;
let speed = speedInput.valueAsNumber;
let algorithm = algorithmSelect.selectedOptions[0].value;

const numbers = [];
const bars = [];

elementsInput.addEventListener("change", () => {
  if (elementsInput.valueAsNumber > 200) {
    elements = 200;
    elementsInput.value = "200";
  } else elements = elementsInput.valueAsNumber;

  shuffle();
});
speedInput.addEventListener("change", () => {
  if (speed > 10) {
    speed = 10;
    speedInput.value = "10";
  } else speed = speedInput.valueAsNumber;
});
algorithmSelect.addEventListener(
  "change",
  () => (algorithm = algorithmSelect.selectedOptions[0].value)
);

let step = 0;
let playing = false;

function generateBars() {
  if (bars.length) {
    bars.splice(0, bars.length);
    Array.from(document.querySelectorAll(".bar")).forEach((bar) => bar.remove());
  }

  for (let number of numbers) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.flex = 1;
    bar.style.height = `${(number / elements) * 100}%`;

    document.body.appendChild(bar);
    bars.push(bar);
  }
}

function generateNumbers() {
  if (numbers.length) numbers.splice(0, numbers.length);

  const temp = [];
  for (let i = 0; i < elements; i++) temp.push(i + 1);

  // Shuffle
  while (temp.length > 0) {
    const removed = temp.splice(Math.floor(Math.random() * temp.length), 1)[0];
    numbers.push(removed);
  }
}

function highlightBar(i) {
  bars[i].classList.add("highlight");
}

function removeHighlight() {
  bars.forEach((bar) => bar.classList.contains("highlight") && bar.classList.remove("highlight"));
}

function makeButton(type) {
  const button = document.createElement("button");
  button.innerText = type.charAt(0).toUpperCase() + type.substring(1);

  const event =
    type === "play"
      ? play
      : type === "stop"
      ? stop
      : type === "resume"
      ? resume
      : type === "pause"
      ? pause
      : shuffle;
  button.addEventListener("click", event);

  buttons.appendChild(button);
}

function removeButtons() {
  buttons.innerHTML = "";
}

function shuffle() {
  generateNumbers();
  generateBars();
}

function play() {
  if (step) {
    step = 0;
    shuffle();
  }

  elementsInput.disabled = true;
  speedInput.disabled = true;
  algorithmSelect.disabled = true;
  playing = true;

  removeButtons();
  makeButton("pause");
  makeButton("stop");

  sort();
}

function pause() {
  playing = false;
  speedInput.disabled = false;

  removeButtons();
  makeButton("resume");
}

function resume() {
  playing = true;
  speedInput.disabled = true;

  removeButtons();
  makeButton("pause");
  makeButton("stop");

  sort();
}

function stop() {
  elementsInput.disabled = false;
  speedInput.disabled = false;
  algorithmSelect.disabled = false;
  step = 0;
  playing = false;

  removeButtons();
  makeButton("play");
  makeButton("shuffle");
}

async function sort() {
  let s = step;

  if (algorithm === "selection") {
    for (let i = 0; i < elements; i++) {
      for (let j = 0; j < elements; j++) {
        if (s) {
          s--;
          continue;
        }

        if (!playing) return;

        step++;

        if (i === j) continue;
        else if (numbers[i] < numbers[j]) {
          const temp = numbers[i];
          numbers[i] = numbers[j];
          numbers[j] = temp;

          generateBars();
          highlightBar(j);
          await delay();
        }
      }
    }
  } else if (algorithm === "bubble") {
    for (let i = 0; i < elements; i++) {
      for (let j = 0; j < elements - i - 1; j++) {
        if (s) {
          s--;
          continue;
        }

        if (!playing) return;

        step++;

        if (numbers[j] > numbers[j + 1]) {
          const temp = numbers[j];
          numbers[j] = numbers[j + 1];
          numbers[j + 1] = temp;

          generateBars();
          highlightBar(j + 1);
          await delay();
        }
      }
    }
  } else if (algorithm === "insertion") {
    let key;

    for (let i = 1; i < elements; i++) {
      if (s) {
        s--;
        continue;
      }
      if (!playing) return;

      key = numbers[i];
      let j = i - 1;

      while (key < numbers[j] && j >= 0) {
        if (!playing) return;

        numbers[j + 1] = numbers[j];
        j--;

        generateBars();
        highlightBar(j + 1);

        await delay();
      }

      numbers[j + 1] = key;

      generateBars();
      highlightBar(j + 1);
      await delay();

      step++;
    }
  }

  stop();
  removeHighlight();
}

function delay() {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), (10 - speed) * 1));
}

generateNumbers();
generateBars();

makeButton("play");
makeButton("shuffle");
