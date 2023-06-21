function Primo(num) {
  let array = [];
  let primos = [];
  for (let i = num; i > 1; i--) {
    array.push(i);
  }
  array.forEach((element) => {
    for (let j = 2; j < element; j++) {
      if (element % j == 0) {
        return false;
      }
    }
    primos.push(element);
  });
  return primos.sort((a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
}

console.log(Primo(32));
