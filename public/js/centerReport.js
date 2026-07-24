document.addEventListener("DOMContentLoaded", () => {
  if (!window.centerData || window.centerData.length === 0) return;

  const labels = [];
  const values = [];

  window.centerData.forEach((center) => {
    labels.push(center.name);
    values.push(Number(center.total));
  });

  new Chart(document.getElementById("centerChart"), {
    type: "bar",

    data: {
      labels,
      datasets: [
        {
          label: "Stations",
          data: values,
          backgroundColor: "#2563eb",
          borderRadius: 8,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
});
