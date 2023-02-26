const express = require("express");

const app = express();

app.set("view engine", "ejs");

//POST
app.use(express.json());
app.post("/", (req, res) => res.send(req.body));

//PUT
let author = "";

app.put("/", (req, res) => {
  author = req.body.author;
  res.send(author);
});

//DELETE
app.delete("/:identificador", (req, res) => {
  author = "";
  res.send(req.params.identificador);
});

app.listen("3000");
console.log("rodando server express");
