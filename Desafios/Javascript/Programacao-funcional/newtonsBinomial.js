function factorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}

function combinatorial(n, k) {
  return factorial(n) / (factorial(n - k) * factorial(k));
}

function newtonsBinomial(num1, num2, exponent) {
  let result = 0;
  for (let i = 0; i <= exponent; i++) {
    result +=
      combinatorial(exponent, i) *
      Math.pow(num1, exponent - i) *
      Math.pow(num2, i);
  }
  return result;
}

console.log(newtonsBinomial(2, 3, 2));
