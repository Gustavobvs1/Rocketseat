let pedido = false;
console.log("\nPedir uber\n");

const promise = new Promise((resolve, reject) => {
  if (pedido == true) {
    return resolve("Pedido aceito");
  }
  return reject("Pedido negado");
});

console.log("Aguarde um momento por favor\n");

// setTimeout(
//   () =>
//     promise
//       .then((yes) => console.log(yes))
//       .catch((no) => console.log(no))
//       .finally(() => console.log("Promise finalizada")),
//   3000
// );

promise
  .then((yes) => console.log(yes))
  .catch((no) => console.log(no))
  .finally(() => console.log("Promise finalizada"));
