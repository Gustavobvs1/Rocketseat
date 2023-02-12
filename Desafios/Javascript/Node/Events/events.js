const { EventEmitter } = require("events");
const ev = new EventEmitter();

ev.on("saySomething", (message) => {
  console.log("OLá", message);
});

ev.emit("saySomething", "Gustavo");

console.log(ev);
