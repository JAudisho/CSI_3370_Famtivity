const storage2 = localStorage.getItem("events");
const form = document.querySelector("form");
const output = document.getElementById("scheduleButton");
if (storage2) {
  previousEvents = JSON.parse(storage2);
  console.log(previousEvents);
  previousEvents.forEach((element) => {
    const markUp = `<div style="background-color: #7FFFD4;">
    <p>${element[0]}</p>
    <p>${element[1]}</p>
    <p>${element[2]}</p>
    <p>${element[3]}</p>
    <p>${element[4]}</p>
  </div>`;
    output.insertAdjacentHTML("afterend", markUp);
  });
}

let storage = [];
output.addEventListener("click", function (event) {
  const formElements = Array.from(document.querySelectorAll(".form-control"));
  const valueOfElements = formElements.map((element) => element.value);
  event.preventDefault();
  const markUp = `<div style="background-color: #7FFFD4;">
    <p>${valueOfElements[0]}</p>
    <p>${valueOfElements[1]}</p>
    <p>${valueOfElements[2]}</p>
    <p>${valueOfElements[3]}</p>
    <p>${valueOfElements[4]}</p>
  </div>`;
  output.insertAdjacentHTML("afterend", markUp);
  storage.push(valueOfElements);
  localStorage.setItem("events", JSON.stringify(storage));
});

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
