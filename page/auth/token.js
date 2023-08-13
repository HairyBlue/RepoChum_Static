const param = new URLSearchParams(window.location.search);
const message = param.get("message");
const containerTokenTextValidation = document.querySelector(
  ".container__token--text-validation"
);
const textError = document.createElement("p");

if (message == "token-not-found") {
  textError.innerHTML =
    "Looks like you dont have a token, follow this <a href='https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens'>link</a> to get the github personal token";
  containerTokenTextValidation.appendChild(textError);
}
if (message == "token-not-valid") {
  textError.textContent =
    "Looks like your token is invalid, please add another github personal token";
  containerTokenTextValidation.appendChild(textError);
}

const tokenValue = document.querySelector("#token");
const submitToken = document.querySelector("#submitToken");

submitToken.addEventListener("click", () => {
  if (tokenValue.value == "") {
    textError.remove();
    textError.textContent = "Input field should not be blank";
    containerTokenTextValidation.appendChild(textError);
    return;
  }

  localStorage.setItem("github_api_token", tokenValue.value);

  const basePath =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? ":" + window.location.port : "");
  window.location.href = `${basePath}/index.html`;
});
