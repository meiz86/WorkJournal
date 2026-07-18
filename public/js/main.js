// Persian (Jalali) date in the top navbar
const currentDate = document.getElementById("currentDate");

if (currentDate) {
  const today = new Date();

  const weekday = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    calendar: "persian",
  }).format(today);

  const day = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    day: "numeric",
  }).format(today);

  const month = new Intl.DateTimeFormat("fa-IR", {
    month: "long",
    calendar: "persian",
  }).format(today);

const year = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric"
})
.format(today)
.replace(" AP", "");

  currentDate.textContent = `${weekday} ${day} ${month} ${year}`;
}

