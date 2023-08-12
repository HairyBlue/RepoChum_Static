const noUserText = document.createElement("p");
const containerList = document.querySelector(".container__userlist");
noUserText.textContent = "Looks like there is no users yet...";

const containerGrid = document.querySelector(".container__grid");
window.addEventListener("load", async () => {
  const data = localStorage.getItem("github_user");

  if (!data) {
    containerList.appendChild(noUserText);
    return;
  }

  const parseData = JSON.parse(data);
  for (let i = 0; i < parseData.length; i++) {
    try {
      const response = await fetch(
        `https://api.github.com/users/${parseData[i].username}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer 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",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      const containerGridDiv = document.createElement("div");
      if (response.ok) {
        const githubData = await response.json();

        const containerGridProfile = document.createElement("div");
        const containerGridImg = document.createElement("div");
        const image = document.createElement("img");
        const _user = document.createElement("p");

        containerGridProfile.setAttribute("data-key", i.toString());
        containerGridProfile.className = "container__grid--profile";
        containerGridImg.className = "container__grid--img";
        _user.className = "container__grid--username";

        image.src = `${githubData.avatar_url}`;
        _user.textContent = `${githubData.login}`;
        containerGridImg.appendChild(image);
        containerGridProfile.appendChild(containerGridImg);
        containerGridProfile.appendChild(_user);

        const containerGridInfo = document.createElement("div");
        const _repo = document.createElement("p");
        const _github = document.createElement("p");
        const _link = document.createElement("a");

        containerGridInfo.className = "container__grid--info";
        _repo.textContent = `repo: ${parseData[i].repository}`;
        _github.textContent = "github: ";
        _link.href = `${githubData.html_url}`;
        _link.textContent = `${githubData.html_url}`;
        _github.appendChild(_link);
        containerGridInfo.appendChild(_repo);
        containerGridInfo.appendChild(_github);

        containerGridDiv.appendChild(containerGridProfile);
        containerGridDiv.appendChild(containerGridInfo);

        containerGrid.append(containerGridDiv);
      } else {
        const noUser = document.createElement("p");
        noUser.textContent = "Invalid User";
        containerGridDiv.append(noUser);
        containerGrid.append(containerGridDiv);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const userRepoInfo = document.querySelectorAll(".container__grid--profile");

  if (userRepoInfo.length !== 0) {
    userRepoInfo.forEach((userItem) => {
      userItem.addEventListener("click", (e) => {
        const key = e.currentTarget.getAttribute("data-key");
        window.location.href = `./page/repo/events.html?key=${key}`;
      });
    });
  }
});

const trash = document.querySelector("#trash")

trash.addEventListener("click", () => {
    localStorage.clear("github_user")
    window.location.reload()
})