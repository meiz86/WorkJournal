document.addEventListener("DOMContentLoaded", () => {
  if (!window.monthlyData || window.monthlyData.length === 0) {
    return;
  }

  const labels = [];
  const values = [];

  window.monthlyData.forEach((day) => {
    labels.push(day.date);
    values.push(Number(((day.minutes || 0) / 60).toFixed(1)));
  });

  const canvas = document.getElementById("monthlyChart");

  if (!canvas) return;

  new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Hours",
          data: values,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,.2)",
          fill: true,
          tension: 0.3,
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
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
});
