document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const output = document.querySelector(".output");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      // Assuming you have a function saveAndClear in children.js
      saveAndClear();
  
      // Additional logic for scheduling activities can go here
  
      // You might want to update the output or perform other actions
      // based on the scheduling logic
    });
  });
  