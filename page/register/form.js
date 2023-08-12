const form = document.querySelector("form");
const username = document.querySelector("#username");
const repository = document.querySelector("#repo");

const errorText = document.createElement("p");
errorText.id = "form-error";
errorText.textContent = "input field should not be blank";

document.querySelector("#submit").addEventListener("click", (e) => {
  e.preventDefault();
  github_user = [];

  if (username.value == "" || repository.value == "") {
    form.appendChild(errorText);
  } else {
    let github_user = JSON.parse(localStorage.getItem("github_user")) || [];
    const data = {
      username: username.value,
      repository: repository.value,
    };
    github_user.push(data);
    localStorage.setItem("github_user", JSON.stringify(github_user));
    username.value = "";
    repository.value = "";
    errorText.remove();
  }
});
