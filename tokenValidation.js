document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("github_api_token");
  const validateToken = await fetch(`https://api.github.com/`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const basePath =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? ":" + window.location.port : "");
  if (token == null) {
    window.location.href = `${basePath}/page/auth/token.html?message=token-not-found`;
  } else {
    if (!validateToken.ok) {
      window.location.href = `${basePath}/page/auth/token.html?message=token-not-valid`;
    }
  }
});
