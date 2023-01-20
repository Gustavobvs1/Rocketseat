function transformDegree(degrees) {
  const celsiusExistis = degrees.toUpperCase().includes("C");
  const fahrenheitExistis = degrees.toUpperCase().includes("F");

  if (!celsiusExistis && !fahrenheitExistis) {
    throw new Error("Grau invalido");
  }

  //formula com base em Fahrenheit
  let formula = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;
  let updatedDegree = Number(degrees.toUpperCase().replace("F", ""));
  let degreeSign = "C";

  if (celsiusExistis) {
    formula = (celsius) => (celsius * 9) / 5 + 32;
    updatedDegree = Number(degrees.toUpperCase().replace("C", ""));
    degreeSign = "F";
  }

  return formula(updatedDegree) + degreeSign;
}

try {
  console.log(transformDegree("50F"));
  console.log(transformDegree("10C"));
} catch (error) {
  console.log(error.message);
}
