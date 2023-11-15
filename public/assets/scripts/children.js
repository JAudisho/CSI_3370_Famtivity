document.querySelector(".btn-success").addEventListener("click", function () {
  const form = document.getElementById("myform");
  const formData = new FormData(form);

  const section = document.createElement("div");

  formData.forEach((value, key) => {
    // Create a paragraph for each form field
    const paragraph = document.createElement("p");
    paragraph.innerHTML = `<span>${key}:</span> ${value}`;
    section.appendChild(paragraph);
  });

  // Append the new section to the output container
  document.querySelector(".output").appendChild(section);

  // Clear the form
  form.reset();
});