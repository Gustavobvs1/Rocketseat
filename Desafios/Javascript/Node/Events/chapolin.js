const { inherits } = require("util");
const { EventEmitter } = require("events");

function Character(name) {
  this.name = name;
}

inherits(Character, EventEmitter);

const Chapolin = new Character("Chapolin Colorado");

Chapolin.on("help", () => console.log(`Eu! o ${Chapolin.name}!`));

function help() {
  Chapolin.emit("help");
}

let timeout = 6000;

setTimeout(help, timeout);

console.log("E agora, quem poderá me defender");
