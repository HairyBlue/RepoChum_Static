const param = new URLSearchParams(window.location.search);
const key = param.get("key");
const parseData = JSON.parse(localStorage.getItem("github_user")) || [];
let githubData = [];

const containerUserInfo = document.querySelector(".container__userinfo");
const username = document.createElement("h1");
const _link = document.createElement("a");
const containerEventContent = document.querySelector(
  ".container__events--content"
);
const containerList = document.querySelector(".container__list");

window.addEventListener("load", () => {
  const token = localStorage.getItem("github_api_token");
  parseData.forEach(async (userItem, index) => {
    if (key == index) {
      username.textContent = userItem.username;
      _link.textContent = userItem.repository;
      _link.href = `https://github.com/${userItem.username}/${userItem.repository}`;
      containerUserInfo.append(username, _link);

      try {
        const response = await fetch(
          `https://api.github.com/repos/${userItem.username}/${userItem.repository}/events`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${token}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();

          if (data.length !== 0) {
            let commitsLength = [];
            githubData = data;
            githubData.forEach((item) => {
              const containerListData = document.createElement("div");
              containerListData.className = "container__list--data";

              const _type = document.createElement("p");
              const _message = document.createElement("p");
              const _createdAt = document.createElement("p");

              commitsLength = item?.payload.commits || [];
              _type.textContent = `Type: ${item.type}`;
              _message.textContent = `Commits: ${commitsLength.length}  ${
                commitsLength.length > 1 ? "commits" : "commit"
              } in this event`;
              _createdAt.textContent = `Created at: ${getTime(
                item.created_at
              )}`;
              containerListData.append(_type, _message, _createdAt);
              containerList.appendChild(containerListData);
            });
          } else {
            const noEvents = document.createElement("p");
            noEvents.textContent =
              "Looks like there is no events in this repository...";
            containerList.appendChild(noEvents);
          }
        } else {
          const noEvents = document.createElement("p");
          noEvents.textContent =
            "The repository of this user was not found on github...";
          containerList.appendChild(noEvents);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
});

function getTime(utcTime) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const time = new Date(utcTime);

  const hours = (time.getHours() % 24) % 12 || 12;
  const minutes =
    (time.getMinutes() < 10 ? "0" : "") + time.getMinutes().toString();
  // const seconds = time.getSeconds().toString()
  const calcTime =
    hours.toString() + ":" + minutes + (time.getHours() < 12 ? "AM" : "PM");

  return `${calcTime} - ${days[time.getDay()]}, ${
    months[time.getMonth()]
  } ${time.getDate()} ${time.getFullYear()}`;
}
