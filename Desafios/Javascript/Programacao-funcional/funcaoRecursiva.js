//Fatorial recursiva
const Factorial = (n) => {
  if (n === 0) {
    return 1;
  }
  return n * Factorial(n - 1);
};

//fatorial não recursiva

let result = 1;

function fato(x) {
  for (let i = 1; i <= x; i++) {
    result *= i;
  }
  console.log(result);
}

fato(5);
