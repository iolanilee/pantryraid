/* STATE */

const customIngredients = [];

let selectedVibe = "couch";

let selectedFlavor = "sweet";


/* VIBE SELECTION */

document
  .querySelectorAll(".vibe-options li")
  .forEach(option => {

    option.addEventListener("click", () => {

      document
        .querySelectorAll(".vibe-options li")
        .forEach(item => {

          item.classList.remove("selected");

        });

      option.classList.add("selected");

      selectedVibe = option.dataset.vibe;

    });

  });


/* Default vibe */

document
  .querySelector(
    '.vibe-options li[data-vibe="couch"]'
  )
  .classList.add("selected");


/* FLAVOR SELECTION */

document
  .querySelectorAll(".flavor-option")
  .forEach(option => {

    option.addEventListener("click", () => {

      document
        .querySelectorAll(".flavor-option")
        .forEach(item => {

          item.classList.remove("selected");

        });

      option.classList.add("selected");

      selectedFlavor = option.dataset.flavor;

      updateFlavorDisplay();

    });

  });


/* FLAVOR DISPLAY */

function updateFlavorDisplay() {

  const flavorDisplay =
    document.getElementById("recipeFlavor");

  const flavorLabels = {

    sweet:
      "🍓 SWEET",

    savory:
      "🧂 SAVORY",

    "spicy-bold":
      "🌶️ SPICY & BOLD",

    "fresh-tangy":
      "🍋 FRESH & TANGY",

    "sweet-savory":
      "🍯 SWEET & SAVORY",

    surprise:
      "🎲 SURPRISE ME"

  };

  flavorDisplay.textContent =
    flavorLabels[selectedFlavor];

}


/* GET SELECTED INGREDIENTS */

function getSelectedIngredients() {

  const checkedIngredients = [

    ...document.querySelectorAll(
      '.ingredient-checklist input[type="checkbox"]:checked'
    )

  ].map(
    checkbox => checkbox.value
  );

  return [
    ...checkedIngredients,
    ...customIngredients
  ];

}


/* UPDATE SUMMARY */

function updateIngredientSummary() {

  const summary =
    document.getElementById("selectedSummary");

  const ingredients =
    getSelectedIngredients();

  if (!ingredients.length) {

    summary.textContent =
      "Nothing selected yet.";

    return;

  }

  summary.textContent =
    ingredients.join(" • ");

}


/* CHECKBOX LISTENERS */

document
  .querySelectorAll(
    '.ingredient-checklist input[type="checkbox"]'
  )
  .forEach(checkbox => {

    checkbox.addEventListener(
      "change",
      updateIngredientSummary
    );

  });


/* CUSTOM INGREDIENTS */

const ingredientInput =
  document.getElementById("ingredientInput");

const addIngredientButton =
  document.getElementById("addIngredient");

const customList =
  document.getElementById("customList");


function addCustomIngredient() {

  const value =
    ingredientInput.value.trim();

  if (!value) {
    return;
  }

  customIngredients.push(value);

  ingredientInput.value = "";

  renderCustomIngredients();

  updateIngredientSummary();

}


addIngredientButton.addEventListener(
  "click",
  addCustomIngredient
);


ingredientInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      event.preventDefault();

      addCustomIngredient();

    }

  }
);


function renderCustomIngredients() {

  customList.innerHTML = "";

  customIngredients.forEach(
    (ingredient, index) => {

      const tag =
        document.createElement("div");

      tag.className = "custom-tag";

      tag.innerHTML = `
        ${ingredient}
        <button
          type="button"
          aria-label="Remove ${ingredient}"
        >
          ×
        </button>
      `;

      tag
        .querySelector("button")
        .addEventListener(
          "click",
          () => {

            customIngredients.splice(
              index,
              1
            );

            renderCustomIngredients();

            updateIngredientSummary();

          }
        );

      customList.appendChild(tag);

    }
  );

}


/* SLIDERS */

const effort =
  document.getElementById("effort");

const hunger =
  document.getElementById("hunger");

const effortValue =
  document.getElementById("effortValue");

const hungerValue =
  document.getElementById("hungerValue");


effort.addEventListener(
  "input",
  () => {

    const labels = [

      "Zero",

      "Bare Minimum",

      "Pretty Easy",

      "I'm Cooking",

      "Doing the Most"

    ];

    effortValue.textContent =
      labels[effort.value - 1];

  }
);


hunger.addEventListener(
  "input",
  () => {

    const labels = [

      "Snackish",

      "Meal",

      "Famished"

    ];

    hungerValue.textContent =
      labels[hunger.value - 1];

  }
);


/* GENERATE RECIPE */

document
  .getElementById("generateRecipe")
  .addEventListener("click", generateRecipe);


async function generateRecipe() {

  const ingredients = getSelectedIngredients();

  /* USER MUST SELECT */

  if (!ingredients.length) {

    document.getElementById(
      "recipeTitle"
    ).textContent =
      "Add some ingredients first!";

    document.getElementById(
      "recipeInstructions"
    ).textContent =
      "Check off a few ingredients above and I'll turn them into dinner.";

    return;

  }


  /* Slider values */

  const effortLabels = [

    "Zero",
    "Bare Minimum",
    "Pretty Easy",
    "I'm Cooking",
    "Doing the Most"

  ];

  const hungerLabels = [

    "Snackish",
    "Meal",
    "Famished"

  ];


  const effortLevel =
    effortLabels[effort.value - 1];

  const hungerLevel =
    hungerLabels[hunger.value - 1];


  /* Show loading state */

  const recipeColumn =
    document.querySelector(".recipe-column");

  const recipeTitle =
    document.getElementById("recipeTitle");

  const recipeInstructions =
    document.getElementById("recipeInstructions");

  const ingredientList =
    document.getElementById("recipeIngredients");


  recipeTitle.textContent =
    "Cooking up some ideas...";

  recipeInstructions.textContent =
    "Grabbing my chef hat...";

  ingredientList.innerHTML =
    "<li>Gathering ingredients...</li>";


  /* Send information to our Node server */

  try {

    const response =
      await fetch("/.netlify/functions/generate-recipe", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          vibe: selectedVibe,

          flavor: selectedFlavor,

          effort: effortLevel,

          hunger: hungerLevel,

          ingredients: ingredients

        })

      });


    /* Check for an error */

    if (!response.ok) {

      throw new Error(
        "Recipe request failed."
      );

    }


    /* Get Gemini's recipe */

    const recipe =
      await response.json();


    /* DISPLAY TITLE */

    recipeTitle.textContent =
      recipe.title;


    /* DISPLAY TIME */

    document.getElementById(
      "recipeTime"
    ).textContent =
      `⏱ ${recipe.time}`;


    /* DISPLAY DIFFICULTY */

    document.getElementById(
      "recipeDifficulty"
    ).textContent =
      recipe.difficulty;


    /* DISPLAY FLAVOR */

    document.getElementById(
      "recipeFlavor"
    ).textContent =
      recipe.flavor;


    /* DISPLAY INGREDIENTS */

    ingredientList.innerHTML = "";


    recipe.ingredients.forEach(
      ingredient => {

        const li =
          document.createElement("li");

        li.textContent =
          ingredient;

        ingredientList.appendChild(li);

      }
    );


    /* DISPLAY INSTRUCTIONS */

    recipeInstructions.textContent =
      recipe.instructions;


    /* VISUAL FEEDBACK */

    recipeColumn.style.background =
      "#f7c9c5";


    setTimeout(() => {

      recipeColumn.style.background =
        "rgba(255, 255, 255, 0.12)";

    }, 300);


  } catch (error) {

    console.error(error);

    recipeTitle.textContent =
      "HUH?! Let's try that again.";


    recipeInstructions.textContent =
      "OOPS! Something went wrong.";


    ingredientList.innerHTML =
      "<li>Try again in a moment.</li>";

  }

}
