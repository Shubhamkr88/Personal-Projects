const input = document.getElementById("arrSize");
const generateBtn = document.getElementById("generate");
const genArray = document.getElementById("genArray");
const sortedArray = document.getElementById("sortedArray");
const barContainer = document.querySelector(".barContainer");
const algoSelect = document.getElementById("algoSelect");
const sortBtn = document.getElementById("sort");

let randomArray = [];

generateBtn.onclick = function generateRandomArray() {
  //input size of array validation
  let size = 0;
  if (isNaN(input.value) || input.value === "") {
    window.alert("Please enter a number!");
    return;
  }

  const inputSize = Number(input.value);
  if (inputSize <= 0) {
    window.alert("Please enter a positive number!");
    return;
  }

  if (inputSize > 50) {
    window.alert(`Entered array size should not be greater than 50 !!`);
    return;
  } else {
    size = inputSize;
  }

  //clear the random array first
  randomArray = [];

  //random number generator
  for (let i = 0; i < size; i++) {
    //    Math.floor(Math.random() * (max - min + 1)) + min;
    randomArray[i] = Math.floor(Math.random() * (100 - 1) + 1) + 1;
  }

  //show random number with better formatting for large arrays
  if (size <= 50) {
    genArray.textContent = `Generated array (${size} elements): [${randomArray.join(
      ", "
    )}]`;
  } else {
    // For large arrays, show first 10 and last 10 elements
    const first10 = randomArray.slice(0, 10).join(", ");
    const last10 = randomArray.slice(-10).join(", ");
    genArray.textContent = `Generated array (${size} elements): [${first10} ... ${last10}]`;
  }

  // pass the array to generate Bars
  generateBars(randomArray);
};

//generate bars function
function generateBars(array, highlightIndices = []) {
  //clear previous bars
  barContainer.innerHTML = "";

  //error handling
  if (array.length === 0) return;

  //get actual width of the container
  const containerWidth = barContainer.offsetWidth;
  const availableWidth = containerWidth - 40;

  array.forEach((value, index) => {
    const bar = document.createElement("div");

    /* using dynamic bar width */
    let barWidth = 30;

    if (array.length <= 30) {
      barWidth = availableWidth / array.length;
      barWidth = Math.max(5, barWidth);
    }
    bar.style.width = `${barWidth}px`;
    //

    /* value inside bars*/
    const valueText = document.createElement("span");
    valueText.textContent = value;
    valueText.style.position = "absolute";
    valueText.style.top = "-25px";
    valueText.style.left = "50%";
    valueText.style.transform = "translateX(-50%)";
    //changing font size according to no of bars
    if (array.length <= 25) {
      valueText.style.fontSize = "13px";
    } else {
      valueText.style.fontSize = "10px";
    }
    valueText.style.color = "black";
    bar.appendChild(valueText);
    //

    bar.classList.add("bar");
    /*Highlight the indexes from highlight Indices []*/
    if (highlightIndices.includes(index)) {
      bar.style.background = "orange";
    }
    //

    bar.style.height = `${value * 2}px`;
    bar.style.margin = "0 5px";
    barContainer.appendChild(bar);
  });
}

//it let's us pause between steps ***
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Sort button functionality ***
sortBtn.onclick = async function sortArray() {
  if (randomArray.length === 0) {
    window.alert("please generate array first !!");
    return;
  }

  // Disable all buttons during sorting
  sortBtn.disabled = true;
  generateBtn.disabled = true;
  input.disabled = true;
  algoSelect.disabled = true;

  // Create a copy of the array to avoid modifying the original
  const arrayToSort = [...randomArray];

  //Algo selection and applying the sorting logic ***
  const selectedAlgo = algoSelect.value;

  if (selectedAlgo === "bubble") {
    await bubbleSortVisualized(arrayToSort);
  } else if (selectedAlgo === "insertion") {
    await insertionSortVisualized(arrayToSort);
  } else if (selectedAlgo === "selection") {
    await selectionSortVisualized(arrayToSort);
  } else if (selectedAlgo === "merge") {
    await mergeSortVisualized(arrayToSort) ; 
  }

  /* brute or static sorting */
  /*
  for (let i = arrayToSort.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arrayToSort[j] > arrayToSort[j + 1]) {
        let temp = arrayToSort[j];
        arrayToSort[j] = arrayToSort[j + 1];
        arrayToSort[j + 1] = temp;
      }
    }
  }
  */

  //update the original array
  randomArray = [...arrayToSort];

  //generate new bars after sorting
  generateBars(arrayToSort);

  //display the sorted Array
  if (arrayToSort.length <= 50) {
    sortedArray.textContent = `Sorted array (${
      arrayToSort.length
    } elements) : [${arrayToSort.join(", ")}]`;
  } else {
    const first10 = arrayToSort.slice(0, 10).join(", ");
    const last10 = arrayToSort.slice(-10).join(", ");
    sortedArray.textContent = `Sorted array (${arrayToSort.length} elements) : [${first10} ... ${last10}]`;
  }

  // Re-enable all buttons after sorting is complete
  sortBtn.disabled = false;
  generateBtn.disabled = false;
  input.disabled = false;
  algoSelect.disabled = false;
};

//BUBBLE SORT

// replaced the bubble sort code for visualization (comparison and swapping operations) functions
async function bubbleSortVisualized(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      generateBars(array, [j, j + 1]); // highlight compared bars ***
      await sleep(currentSpeed);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        generateBars(array, [j, j + 1]); // highlight swapped bars ***
        await sleep(currentSpeed);
      }
    }
  }
  generateBars(array); //final state ***
}

// INSERTION SORT

async function insertionSortVisualized(array) {
  for (let i = 0; i < array.length; i++) {
    let j = i;
    while (j > 0 && array[j - 1] > array[j]) {
      generateBars(array, [j - 1, j]); // highlight compared bars ***
      await sleep(currentSpeed);
      [array[j - 1], array[j]] = [array[j], array[j - 1]];
      j--;
      generateBars(array, [j - 1, j]); // show swap ***
      await sleep(currentSpeed);
    }
  }
  generateBars(array); // final state ***
}

// SELECTION SORT
async function selectionSortVisualized(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let min = i;
    for (j = i; j < array.length; j++) {
      generateBars(array, [j, min]); // highlight compared bars ***
      await sleep(currentSpeed);
      if (array[j] < array[min]) {
        min = j;
      }
    }

    [array[i], array[min]] = [array[min], array[i]];
    generateBars(array, [i, min]); // highlight compared bars ***
    await sleep(currentSpeed);
  }
  generateBars(array); // final state ***
}


// MERGE SORT
  async function merge(array, low, mid, high) {
  let left = low;
  let right = mid + 1;
  let temp = [];
  while (left <= mid && right <= high) {
    generateBars(array, [left, right]) ; 
    await sleep(currentSpeed) ;
    if (array[left] <= array[right]) {
      temp.push(array[left]);
      left++;
    } else {
      temp.push(array[right]);
      right++;
    }

  }
  while (left <= mid) {
    generateBars(array, [left, mid]) ; 
    await sleep(currentSpeed) ;
    temp.push(array[left]);
    left++;
  }
  while (right <= high) {
    generateBars(array, [right, high]) ; 
    await sleep(currentSpeed) ;
    temp.push(array[right]);
    right++;
  }

  // put temp element into array
  for (let i = low; i <= high; i++) {
    array[i] = temp[i - low];
    generateBars(array , [i]) ; // Show updated bar after each placement
    await sleep(currentSpeed) ; 
  }
}

  async function mergeSort(array, low, high) {
  if (low >= high) return;
  let mid = Math.floor((low + high) / 2);

  await mergeSort(array, low, mid); // 1st completion 
  await mergeSort(array, mid + 1, high); // 2nd completion
  await merge(array, low, mid, high); //3rd completion

}

  async function mergeSortVisualized(array) {
  let n = array.length;
  const low = 0;
  const high = n - 1;
  await mergeSort(array, low, high);
  generateBars(array) // final state 
}




// speed functionality : normal 2x 4x
const normalBtn = document.getElementById("normal");
const fastBtn = document.getElementById("2x");
const fastestBtn = document.getElementById("4x");

let currentSpeed = 300; // Default speed

// Initialize normal speed as active
normalBtn.style.backgroundColor = "#126cacff";
normalBtn.style.color = "white";

normalBtn.onclick = function normalSpeed() {
  currentSpeed = 300; // Default speed
  console.log("Speed set to Normal:", currentSpeed + "ms");
  // Visual feedback - highlight the active button
  resetButtonStyles();
  normalBtn.style.backgroundColor = "#126cacff";
  normalBtn.style.color = "white";
};

fastBtn.onclick = function fastSpeed() {
  currentSpeed = 150; // 2x speed
  console.log("Speed set to 2x:", currentSpeed + "ms");
  // Visual feedback - highlight the active button
  resetButtonStyles();
  fastBtn.style.backgroundColor = "#126cacff";
  fastBtn.style.color = "white";
};

fastestBtn.onclick = function fastestSpeed() {
  currentSpeed = 15; // 4x speed (fastest)
  console.log("Speed set to 4x:", currentSpeed + "ms");
  // Visual feedback - highlight the active button
  resetButtonStyles();
  fastestBtn.style.backgroundColor = "#126cacff";
  fastestBtn.style.color = "white";
};

// Helper function to reset button styles
function resetButtonStyles() {
  normalBtn.style.backgroundColor = "#d0d0d0";
  fastBtn.style.backgroundColor = "#d0d0d0";
  fastestBtn.style.backgroundColor = "#d0d0d0";
  normalBtn.style.color = "black";
  fastBtn.style.color = "black";
  fastestBtn.style.color = "black";
}

//issues : sorting the already sorted array with insertion sort is not showing swapping
