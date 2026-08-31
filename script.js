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
      "Nothing selected yet. Raid that pantry.";

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


/* RECIPE DATABASE */

const recipes = {

  couch: {

    title:
      "The Couch Potato",

    time:
      "10 MIN",

    difficulty:
      "★ MINIMAL",

    ingredients: [

      "Crispy potatoes",

      "Cheese",

      "Hot sauce",

      "Greek yogurt",

      "Fresh herbs"

    ],

    instructions:
      "Crisp the potatoes in a pan or air fryer. Top with cheese and let it melt. Add a dramatic drizzle of hot sauce and a dollop of yogurt. Finish with herbs. Eat directly from the pan while watching something questionable."

  },


  together: {

    title:
      "I Totally Planned This",

    time:
      "25 MIN",

    difficulty:
      "★★ EASY",

    ingredients: [

      "Your chosen protein",

      "A carb",

      "Two vegetables",

      "A sauce",

      "Fresh herbs"

    ],

    instructions:
      "Cook your protein until golden. Sauté the vegetables separately so everything looks intentional. Add your carb, toss with sauce, and plate it like you absolutely knew what you were doing."

  },


  midnight: {

    title:
      "Midnight Snack Plate",

    time:
      "5 MIN",

    difficulty:
      "★ ZERO",

    ingredients: [

      "Cheese",

      "Crackers or bread",

      "Pickles",

      "Something salty",

      "Something crunchy"

    ],

    instructions:
      "Put everything on a plate. There is no cooking. There is barely any assembly. Congratulations: you have invented dinner."

  },


  healthy: {

    title:
      "Hot Girl Fridge Bowl",

    time:
      "15 MIN",

    difficulty:
      "★★ EASY",

    ingredients: [

      "Greens",

      "Your chosen protein",

      "Roasted vegetables",

      "Greek yogurt",

      "Herbs and chili flakes"

    ],

    instructions:
      "Cook the protein and vegetables with your favorite spices. Put them over greens, add yogurt as a creamy dressing, and finish aggressively with herbs and chili flakes."

  },


  broke: {

    title:
      "Financially Responsible Pasta",

    time:
      "15 MIN",

    difficulty:
      "★ EASY",

    ingredients: [

      "Pasta",

      "Garlic",

      "Cheese",

      "Chili flakes",

      "A splash of pasta water"

    ],

    instructions:
      "Boil the pasta. Sauté garlic and chili flakes in whatever oil you have. Toss in the pasta with a splash of pasta water and a heroic amount of cheese. Stir until glossy."

  },


  cook: {

    title:
      "I Fear I Have Become a Chef",

    time:
      "30 MIN",

    difficulty:
      "★★★ FUN",

    ingredients: [

      "Your chosen protein",

      "Pasta or rice",

      "Three vegetables",

      "A sauce",

      "Fresh herbs"

    ],

    instructions:
      "Prep everything before you start. Sear the protein until deeply browned. Cook your vegetables separately, build your sauce, then bring everything together with your carb. Taste constantly. Pretend you're on a cooking show."

  },


  guests: {

    title:
      "Casual Dinner Party Flex",

    time:
      "35 MIN",

    difficulty:
      "★★★ IMPRESSIVE",

    ingredients: [

      "A protein",

      "A beautiful carb",

      "Seasonal vegetables",

      "A creamy element",

      "Fresh herbs"

    ],

    instructions:
      "Build a colorful platter with your protein in the center and the vegetables and carb around it. Add the creamy element as a sauce and finish with herbs. Serve family-style and accept compliments."

  }

};


/* GENERATE RECIPE */

document
  .getElementById("generateRecipe")
  .addEventListener(
    "click",
    generateRecipe
  );


function generateRecipe() {

  const recipe =
    recipes[selectedVibe];

  const ingredients =
    getSelectedIngredients();


  /*
   * Surprise Me gets a random
   * flavor profile every time
   * the recipe is generated.
   */

  let flavorToUse =
    selectedFlavor;


  if (selectedFlavor === "surprise") {

    const surpriseFlavors = [

      "sweet",

      "savory",

      "spicy-bold",

      "fresh-tangy",

      "sweet-savory"

    ];

    flavorToUse =
      surpriseFlavors[
        Math.floor(
          Math.random() *
          surpriseFlavors.length
        )
      ];

  }


  /* RECIPE TITLE */

  document.getElementById(
    "recipeTitle"
  ).textContent =
    recipe.title;


  /* TIME */

  document.getElementById(
    "recipeTime"
  ).textContent =
    `⏱ ${recipe.time}`;


  /* DIFFICULTY */

  document.getElementById(
    "recipeDifficulty"
  ).textContent =
    recipe.difficulty;


  /* FLAVOR */

  if (selectedFlavor === "surprise") {

    document.getElementById(
      "recipeFlavor"
    ).textContent =
      "🎲 SURPRISE ME";

  } else {

    updateFlavorDisplay();

  }


  /* BUILD INGREDIENT LIST */

  let recipeIngredients = [];


  /*
   * Start with the ingredients
   * the user actually has.
   */

  if (ingredients.length) {

    recipeIngredients = [
      ...ingredients
    ];

  }


  /*
   * Add recipe suggestions.
   */

  recipeIngredients =
    recipeIngredients.concat(
      recipe.ingredients
    );


  /* FLAVOR PROFILE ADDITIONS */

  if (flavorToUse === "sweet") {

    recipeIngredients.push(
      "A sweet element"
    );

  }


  if (flavorToUse === "savory") {

    recipeIngredients.push(
      "Extra savory seasoning"
    );

  }


  if (flavorToUse === "spicy-bold") {

    recipeIngredients.push(
      "Chili or hot sauce",
      "Bold seasoning"
    );

  }


  if (flavorToUse === "fresh-tangy") {

    recipeIngredients.push(
      "Lemon or lime",
      "Fresh herbs"
    );

  }


  if (flavorToUse === "sweet-savory") {

    recipeIngredients.push(
      "A sweet element",
      "A salty or savory element"
    );

  }


  /* SURPRISE ME ADDITIONS */

  if (selectedFlavor === "surprise") {

    const surpriseAdditions = [

      [
        "Honey",
        "Chili flakes"
      ],

      [
        "Lemon",
        "Fresh herbs"
      ],

      [
        "Hot sauce",
        "Garlic"
      ],

      [
        "Maple syrup",
        "Feta"
      ],

      [
        "Pickles",
        "Chili flakes"
      ],

      [
        "Jam",
        "Cheddar"
      ]

    ];


    const surprise =
      surpriseAdditions[
        Math.floor(
          Math.random() *
          surpriseAdditions.length
        )
      ];


    recipeIngredients.push(
      ...surprise
    );

  }


  /* REMOVE DUPLICATES */

  recipeIngredients = [
    ...new Set(recipeIngredients)
  ];


  /* 
     KEEP IT READABLE
      */

  recipeIngredients =
    recipeIngredients.slice(0, 9);


  /* DISPLAY INGREDIENTS */

  const ingredientList =
    document.getElementById(
      "recipeIngredients"
    );

  ingredientList.innerHTML = "";


  recipeIngredients.forEach(
    ingredient => {

      const li =
        document.createElement("li");

      li.textContent = ingredient;

      ingredientList.appendChild(li);

    }
  );


  /* FLAVOR-SPECIFIC INSTRUCTIONS */

  let instructions =
    recipe.instructions;


  if (flavorToUse === "sweet") {

    instructions +=
      " Since you're craving sweet, finish it with a little sweetness if it makes sense — think fruit, honey, maple, jam, or a sweet sauce.";

  }


  if (flavorToUse === "savory") {

    instructions +=
      " Keep things firmly savory with garlic, herbs, salt, pepper, cheese, or your favorite savory seasoning.";

  }


  if (flavorToUse === "spicy-bold") {

    instructions +=
      " Turn up the personality with chili flakes, hot sauce, garlic, smoked paprika, or another bold seasoning. Don't be shy.";

  }


  if (flavorToUse === "fresh-tangy") {

    instructions +=
      " Finish with something bright and fresh — a squeeze of lemon or lime, fresh herbs, pickles, or a tangy yogurt-based sauce.";

  }


  if (flavorToUse === "sweet-savory") {

    instructions +=
      " Lean into the contrast: pair something sweet like honey, maple, jam, or fruit with something salty and savory like cheese, chili, or soy sauce.";

  }


  if (selectedFlavor === "surprise") {

    instructions +=
      " You chose Surprise Me, so embrace the chaos. The flavor combination above is your wildcard — trust the process.";

  }


  document.getElementById(
    "recipeInstructions"
  ).textContent =
    instructions;


  /* VISUAL FEEDBACK */

  const recipeColumn =
    document.querySelector(
      ".recipe-column"
    );


  recipeColumn.style.background =
    "#f7c9c5";


  setTimeout(
    () => {

      recipeColumn.style.background =
        "rgba(255, 255, 255, 0.12)";

    },
    300
  );

}