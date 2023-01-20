function getNota(nota) {
  let notaA = (nota >= 90) & (nota <= 100);
  let notaB = (nota >= 80) & (nota < 90);
  let notaC = (nota >= 70) & (nota < 80);
  let notaD = (nota >= 60) & (nota < 70);
  let notaE = (nota < 60) & (nota >= 0);

  if (notaA) {
    console.log("A");
  } else if (notaB) {
    console.log("B");
  } else if (notaC) {
    console.log("C");
  } else if (notaD) {
    console.log("D");
  } else if (notaE) {
    console.log("E");
  } else {
    console.log("Tem parada errada aí");
  }
}

getNota("ola");
