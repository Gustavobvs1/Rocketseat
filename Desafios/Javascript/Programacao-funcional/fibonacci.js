const fibonacci = (index) => {
  let sequence = [0, 1, 1];
  if (index < 3) {
    return 1;
  } else {
    for (i = 2; i < index; i++) {
      sequence.push(
        sequence[sequence.length - 1] + sequence[sequence.length - 2]
      );
    }
  }
  return sequence[index];
};

console.log(fibonacci(7));
