class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCals();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._displayCaloriesTotal();
    this._displayCalorieLimit();
    this._displayCaloriesBurned();
    this._displayCaloriesConsumed();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
    document.getElementById("limit").value = this._calorieLimit;
  }
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.numberOfCalories;
    Storage.updateTotalCals(this._totalCalories);
    Storage.saveMeals(meal);
    this._render();
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.numberOfCalories;
    Storage.updateTotalCals(this._totalCalories);
    Storage.saveWorkouts(workout);
    this._render();
  }
  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.numberOfCalories;
      Storage.updateTotalCals(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }
  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.numberOfCalories;
      Storage.updateTotalCals(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }
  reset() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }
  setLimit(calLimit) {
    this._calorieLimit = calLimit;
    Storage.setCalorieLimit(calLimit);
    this._displayCalorieLimit();
    this._render();
  }
  loadItems() {
    this._meals.forEach((meal) => {
      const mealItemsForm = document.getElementById("meal-items");
      const div = document.createElement("div");
      div.classList.add("card", "my-2");
      div.setAttribute("data-id", meal.id);
      div.innerHTML = `
      <div class = 'card-body'>
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
      <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
            ${meal.numberOfCalories}
        </div>
      <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
        </div>
         </div>
        `;
      mealItemsForm.appendChild(div);
    });
    this._workouts.forEach((workout) => {
      const workoutItemsForm = document.getElementById("workout-items");
      const div = document.createElement("div");
      div.classList.add("card", "my-2");
      div.setAttribute("data-id", workout.id);
      div.innerHTML = `
      <div class = 'card-body'>
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
      <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
            ${workout.numberOfCalories}
        </div>
      <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
        </div>
         </div>
        `;
      workoutItemsForm.appendChild(div);
    });
  }
  _displayCaloriesTotal() {
    const totalCals = document.getElementById("calories-total");
    totalCals.innerHTML = this._totalCalories;
  }
  _displayCalorieLimit() {
    const calLimit = document.getElementById("calories-limit");
    calLimit.innerHTML = this._calorieLimit;
  }
  _displayCaloriesConsumed() {
    const calsConsumed = document.getElementById("calories-consumed");
    // let totalCals = 0;
    // for (let { numberOfCalories } of this._meals) {
    //   totalCals += numberOfCalories;
    //   calsConsumed.innerHTML = totalCals;
    // }
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.numberOfCalories,
      0
    );
    calsConsumed.innerHTML = consumed;
  }
  _displayCaloriesBurned() {
    const calsBurned = document.getElementById("calories-burned");
    let totalCals = 0;
    for (let { numberOfCalories } of this._workouts) {
      totalCals += numberOfCalories;
    }
    calsBurned.innerHTML = totalCals;
  }
  _displayCaloriesRemaining() {
    const calsRemaining = document.getElementById("calories-remaining");
    const remaining = this._calorieLimit - this._totalCalories;
    calsRemaining.innerHTML = remaining;
    const cardBodyEl = calsRemaining.parentElement.parentElement;
    if (remaining <= 0) {
      cardBodyEl.classList.remove("bg-light");
      cardBodyEl.classList.add("bg-danger");
    } else {
      cardBodyEl.classList.remove("bg-danger");
      cardBodyEl.classList.add("bg-light");
    }
  }
  _displayCaloriesProgress() {
    const calsRemaining = document.getElementById("calories-remaining");
    const progressBar = document.getElementById("calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressBar.style.width = `${width}%`;
    if (calsRemaining.innerHTML <= 0) {
      progressBar.classList.add("bg-danger");
    } else {
      progressBar.classList.remove("bg-danger");
    }
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, numberOfCalories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.numberOfCalories = numberOfCalories;
  }
}
class Workout {
  constructor(name, numberOfCalories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.numberOfCalories = numberOfCalories;
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }
  static getTotalCals(defaultCals = 0) {
    let totalCals;
    if (localStorage.getItem("totalCals") === null) {
      totalCals = defaultCals;
    } else {
      totalCals = +localStorage.getItem("totalCals");
    }
    return totalCals;
  }
  static updateTotalCals(calories) {
    localStorage.setItem("totalCals", calories);
  }
  static getMeals() {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    return meals;
  }
  static saveMeals(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }
  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem("meals", JSON.stringify(meals));
  }
  static getWorkouts() {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    return workouts;
  }
  static saveWorkouts(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }
  static clearAll() {
    localStorage.removeItem("workouts");
    localStorage.removeItem("meals");
    localStorage.removeItem("totalCals");
    localStorage.removeItem("calorieLimit");
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();

    this._tracker.loadItems();
  }
  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem);
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem);
    document
      .getElementById("workout-items")
      .addEventListener("click", this._deleteItem.bind(this, "workout"));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._deleteItem.bind(this, "meal"));
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItem.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItem.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._resetApp.bind(this));
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit);
  }
  _newItem = (e) => {
    e.preventDefault();
    const target = e.target.id.split("-")[0];
    const itemName = document.getElementById(`${target}-name`);
    const itemCals = document.getElementById(`${target}-calories`);
    if (itemName.value === "" || itemCals.value === "") {
      alert("Please fill in all fields");
      return;
    }
    if (target === "meal") {
      const meal = new Meal(itemName.value, Number(itemCals.value));
      this._tracker.addMeal(meal);
      this._addNewItem(meal, target);
    } else {
      const workout = new Workout(itemName.value, Number(itemCals.value));
      this._tracker.addWorkout(workout);
      this._addNewItem(workout, target);
    }

    itemName.value = "";
    itemCals.value = "";
    const collapseItem = document.getElementById(`collapse-${target}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, { toggle: true });
  };
  _addNewItem = (obj, target) => {
    const mealItemsForm = document.getElementById("meal-items");
    const workoutItemsForm = document.getElementById("workout-items");
    const div = document.createElement("div");
    div.classList.add("card", "my-2");
    div.setAttribute("data-id", obj.id);

    div.innerHTML = `
    <div class = 'card-body'>
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${obj.name}</h4>
        ${
          target === "meal"
            ? '<div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">'
            : '<div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">'
        }
          ${obj.numberOfCalories}
        </div>
       
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
        </div>
         </div>
        `;

    if (target === "meal") {
      mealItemsForm.appendChild(div);
    } else {
      workoutItemsForm.appendChild(div);
    }
  };
  _filterItem(type, e) {
    const value = e.target.value.toLowerCase();
    const items = document.querySelectorAll(`#${type}-items .card`);
    items.forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().includes(value)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
  _deleteItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const itemId = e.target.closest(".card").getAttribute("data-id");

        type === "meal"
          ? this._tracker.removeMeal(itemId)
          : this._tracker.removeWorkout(itemId);

        e.target.closest(".card").remove();
      }
    }
  }
  _resetApp() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }
  _setLimit = (e) => {
    e.preventDefault();
    const limit = document.getElementById("limit");
    if (limit.value === "") {
      alert("Please fill in all fields");
      return;
    }
    this._tracker.setLimit(Number(limit.value));
    limit.value = "";
    const modalEl = document.getElementById("limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  };
}
// const collapseItem = document.getElementById(`collapse-${target}`);
// const bsCollapse = new bootstrap.Collapse(collapseItem, { toggle: true });

const run = new App();
