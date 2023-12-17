class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._displayCaloriesTotal();
    this._displayCalorieLimit();
    this._displayCaloriesBurned();
    this._displayCaloriesConsumed();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.numberOfCalories;
    this._render();
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.numberOfCalories;
    this._render();
  }
  _displayCaloriesTotal() {
    const totalCals = document.getElementById("calories-total");
    //totalCals.innerHTML = this._totalCalories;
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

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newMeal);
  }
  _newMeal = (e) => {
    e.preventDefault();
    const mealName = document.getElementById("meal-name");
    const mealCals = document.getElementById("meal-calories");
    if (mealName.value === "" || mealCals.value === "") {
      alert("Please fill in all fields");
      return;
    }
    const meal = new Meal(mealName.value, Number(mealCals.value));
    this._tracker.addMeal(meal);
    console.log(this._tracker);
  };
}

const run = new App();
