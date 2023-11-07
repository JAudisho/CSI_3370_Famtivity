function saveAndClear() {
  const form = document.querySelector("form");
  const formData = new FormData(form);
  const output = document.querySelector("form");

  // Create a new section to display the entered information
  const section = document.createElement("div");

  formData.forEach((value, key) => {
    // Create a paragraph for each form field
    const paragraph = document.createElement("p");
    paragraph.innerHTML = `<span>${key}:</span> ${value}`;
    section.appendChild(paragraph);
  });

  // Append the new section to the output container
  output.appendChild(section);

  // Clear the form
  form.reset();
}

document.querySelector(".btn-success").addEventListener("click", saveAndClear);
