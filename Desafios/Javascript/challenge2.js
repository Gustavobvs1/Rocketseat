let family = {
  recipes: [1500, 4000, 200.54],
  expenses: [1000, 200.4, 300.5, 1500],
};

function sum(array) {
  let total = 0;
  for (value of array) {
    total += value;
  }

  return total;
}

function Balance() {
  const balanceRecipes = sum(family.recipes);
  const balanceExpenses = sum(family.expenses);

  let total = balanceRecipes - balanceExpenses;
  console.log(balanceRecipes, balanceExpenses);

  if (total > 0) {
    console.log("Superavit");
  } else {
    console.log("Deficit");
  }
}

Balance();
