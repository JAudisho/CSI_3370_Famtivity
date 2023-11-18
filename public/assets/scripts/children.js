const scheduleButton = document.querySelector("#scheduleButton");
const entireForm = document.querySelector("#myform");

scheduleButton.addEventListener("click", (e) => {
  e.preventDefault();
  const formFields = Array.from(document.querySelectorAll(".form-control"));
  const checkForInputValues = formFields.some((field) => (field.value = ""));
  console.log(checkForInputValues);
  if (!checkForInputValues) {
    const dynamicHTML = `<div class="children-container">
  <ul >
    <li>${formFields[0].value}</li>
    <li>${formFields[1].value}</li>
    <li>${formFields[2].value}</li>
    <li>${formFields[3].value}</li>
  </ul>
</div>`;
    setTimeout(
      () => entireForm.insertAdjacentHTML("afterend", dynamicHTML),
      300
    );
  }
});
