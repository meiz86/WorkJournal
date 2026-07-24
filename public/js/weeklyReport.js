document.addEventListener("DOMContentLoaded", () => {

  if (!window.weeklyData || window.weeklyData.length === 0) {
    return;
  }

  const labels = [];
  const values = [];

  window.weeklyData.forEach((day) => {
    labels.push(day.date);
    values.push(Number((day.minutes / 60).toFixed(1)));
  });

  const ctx = document.getElementById("weeklyChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Hours",
          data: values,
          backgroundColor: "#2563eb",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
