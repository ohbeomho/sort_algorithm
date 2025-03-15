const lengthInput = document.getElementById("length");
const speedInput = document.getElementById("speed");
const algorithmSelect = document.getElementById("algorithm");
const buttons = document.querySelector(".buttons");

let length = lengthInput.valueAsNumber;
let speed = speedInput.valueAsNumber;
let algorithm = algorithmSelect.selectedOptions[0].value;

const algorithms = {
  selection: async () => {
    for (let i = 0; i < length; i++) {
      for (let j = i + 1; j < length; j++) {
        if (!playing) return;

        if (numbers[i] > numbers[j]) {
          swap(i, j);
          await delay();
        }
      }
    }
  },
  insertion: async () => {
    let key;

    for (let i = 1; i < length; i++) {
      if (!playing) return;

      key = numbers[i];
      let j = i - 1;

      while (key < numbers[j] && j >= 0) {
        if (!playing) return;

        numbers[j + 1] = numbers[j];
        j--;

        generateBars();
        await delay();
      }

      numbers[j + 1] = key;

      generateBars();
      await delay();
    }
  },
  bubble: async () => {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length - i - 1; j++) {
        if (!playing) return;

        if (numbers[j] > numbers[j + 1]) {
          swap(j, j + 1);
          await delay();
        }
      }
    }
  },
  quick: async () => {
    const quickSort = async (start, end) => {
      if (!playing) return;

      const pivot = numbers[end];
      const gt = [],
        lt = [];
      let eq = 1;

      for (let i = start; i < end; i++) {
        if (numbers[i] > pivot) gt.push(numbers[i]);
        else if (numbers[i] < pivot) lt.push(numbers[i]);
        else eq++;
      }

      let idx = start;
      for (let number of [...lt, ...new Array(eq).fill(pivot), ...gt]) {
        numbers[idx++] = number;
        generateBars();
        await delay();
      }

      if (lt.length) await quickSort(start, start + lt.length - 1);
      if (gt.length) await quickSort(end - gt.length + 1, end);
    };

    await quickSort(0, length - 1);
  },
  merge: async () => {
    const mergeSort = async (start, end) => {
      if (!playing || start >= end) return;

      const mid = Math.floor((start + end) / 2);

      await mergeSort(start, mid);
      await mergeSort(mid + 1, end);

      let idx = start,
        idx1 = 0,
        idx2 = 0;
      const arr1 = numbers.slice(start, mid + 1),
        arr2 = numbers.slice(mid + 1, end + 1);

      while (idx1 < arr1.length && idx2 < arr2.length) {
        numbers[idx++] = arr1[idx1] < arr2[idx2] ? arr1[idx1++] : arr2[idx2++];

        generateBars();
        await delay();
      }

      for (let number of [...arr1.slice(idx1), ...arr2.slice(idx2)]) {
        numbers[idx++] = number;
        generateBars();
        await delay();
      }
    };

    await mergeSort(0, length - 1);
  },
};
const numbers = [];
const bars = [];

lengthInput.addEventListener("change", () => {
  if (lengthInput.valueAsNumber > 200) {
    length = 200;
    lengthInput.value = "200";
  } else length = lengthInput.valueAsNumber;

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
  () => (algorithm = algorithmSelect.selectedOptions[0].value),
);

let playing = false;

function generateBars() {
  if (bars.length) {
    bars.splice(0, bars.length);
    Array.from(document.querySelectorAll(".bar")).forEach((bar) =>
      bar.remove(),
    );
  }

  for (let number of numbers) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.flex = 1;
    bar.style.height = `${(number / length) * 100}%`;

    document.body.appendChild(bar);
    bars.push(bar);
  }
}

function generateNumbers() {
  if (numbers.length) numbers.splice(0, numbers.length);

  const temp = [];
  for (let i = 0; i < length; i++) temp.push(i + 1);

  // Shuffle
  while (temp.length > 0) {
    const removed = temp.splice(Math.floor(Math.random() * temp.length), 1)[0];
    numbers.push(removed);
  }
}

function makeButton(type) {
  const button = document.createElement("button");
  button.innerText = type.charAt(0).toUpperCase() + type.substring(1);

  const event = type === "play" ? play : type === "stop" ? stop : shuffle;
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
  lengthInput.disabled = true;
  speedInput.disabled = true;
  algorithmSelect.disabled = true;
  playing = true;

  removeButtons();
  makeButton("stop");

  sort();
}

function stop() {
  lengthInput.disabled = false;
  speedInput.disabled = false;
  algorithmSelect.disabled = false;
  playing = false;

  removeButtons();
  makeButton("play");
  makeButton("shuffle");
}

function swap(a, b) {
  numbers[a] += numbers[b];
  numbers[b] = numbers[a] - numbers[b];
  numbers[a] -= numbers[b];

  generateBars();
}

async function sort() {
  await algorithms[algorithm]();

  stop();
  generateBars();
}

function delay() {
  return new Promise((resolve, _reject) =>
    setTimeout(() => resolve(), (10 - speed) * 1),
  );
}

generateNumbers();
generateBars();

makeButton("play");
makeButton("shuffle");
