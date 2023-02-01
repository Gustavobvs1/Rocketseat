const button = document.querySelector("#openModal");

const modalWrapper = document.querySelector(".modal-wrapper");

button.addEventListener("click", function () {
  modalWrapper.classList.toggle("invisible");
});

document.addEventListener("keydown", function (event) {
  const isKeyEsc = event.key === "Escape";
  if (modalWrapper.classList.contains("invisible")) {
    return;
  } else {
    if (isKeyEsc) {
      modalWrapper.classList.add("invisible");
    }
  }
});
