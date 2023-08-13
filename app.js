const noUserText = document.createElement("p");
const containerList = document.querySelector(".container__userlist");
noUserText.textContent = "Looks like there is no users yet...";

const containerGrid = document.querySelector(".container__grid");
window.addEventListener("load", async () => {
  const data = localStorage.getItem("github_user");
  const token = localStorage.getItem("github_api_token");
  if (!data) {
    containerList.appendChild(noUserText);
  }

  if (data) {
    const parseData = JSON.parse(data);
    for (let i = 0; i < parseData.length; i++) {
      try {
        const response = await fetch(
          `https://api.github.com/users/${parseData[i].username}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${token}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        const containerGridDiv = document.createElement("div");
        if (response.ok) {
          const githubData = await response.json();

          const containerCheckBox = document.createElement("div");
          const inputCheckBox = document.createElement("input");
          containerCheckBox.className = "container__checkbox";
          inputCheckBox.type = "checkbox";
          inputCheckBox.className = "checkbox-delete";
          inputCheckBox.value = i;
          containerCheckBox.appendChild(inputCheckBox);
          containerGridDiv.appendChild(containerCheckBox);

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
          const containerCheckBox = document.createElement("div");
          const inputCheckBox = document.createElement("input");
          containerCheckBox.className = "container__checkbox";
          inputCheckBox.type = "checkbox";
          inputCheckBox.className = "checkbox-delete";
          inputCheckBox.value = i;
          containerCheckBox.appendChild(inputCheckBox);
          containerGridDiv.appendChild(containerCheckBox);

          const noUser = document.createElement("p");
          noUser.textContent = "Invalid User";
          containerGridDiv.append(noUser);
          containerGrid.append(containerGridDiv);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  const userRepoInfo = document.querySelectorAll(".container__grid--profile");
  const checkboxDelete = document.querySelectorAll(".checkbox-delete");
  const trash = document.querySelector("#trash");
  let localData = JSON.parse(localStorage.getItem("github_user")) || [];
  let toTrash = [];
  if (userRepoInfo.length !== 0) {
    userRepoInfo.forEach((userItem) => {
      userItem.addEventListener("click", (e) => {
        const key = e.currentTarget.getAttribute("data-key");
        window.location.href = `./page/repo/events.html?key=${key}`;
      });
    });
  }

  if (checkboxDelete.length !== 0) {
    checkboxDelete.forEach((checkItem) => {
      checkItem.addEventListener("change", () => {
        if (checkItem.checked) {
          toTrash.push(parseInt(checkItem.value));
        } else {
          toTrash = toTrash.filter(
            (item) => item !== parseInt(checkItem.value)
          );
        }
      });
    });
  }

  trash.addEventListener("click", () => {
    if (toTrash.length == 0) return;

    let finalData = [];
    for (let i = 0; i < toTrash.length; i++) {
      finalData = localData.filter((_, index) => !toTrash.includes(index));
    }
    console.log(finalData);
    if (finalData.length == 0) {
      localStorage.removeItem("github_user");
    } else {
      localStorage.setItem("github_user", JSON.stringify(finalData));
    }
    window.location.reload();
  });

  const containerMenuFile = document.querySelector(".container__menu--file");
  const exportLink = document.createElement("a");
  const blob = new Blob([JSON.stringify(localData)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  exportLink.id = "export";
  exportLink.href = url;
  exportLink.download = "github-user-data.json";
  exportLink.textContent = "export file";

  if (localData.length !== 0) {
    containerMenuFile.appendChild(exportLink);
  }

  const importLink = document.querySelector("#import");
  const hiddenFileInput = document.querySelector("#hiddenFileInput");

  importLink.addEventListener("click", () => {
    hiddenFileInput.click();
  });

  hiddenFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = (event) => {
        const uploadedJsonString = event.target.result;
        localStorage.setItem("github_user", uploadedJsonString);
        // const uploadedData = JSON.parse(uploadedJsonString);
        window.location.reload();
      };
    }
  });
});
