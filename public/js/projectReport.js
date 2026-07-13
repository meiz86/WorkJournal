document.addEventListener("DOMContentLoaded", () => {
  const labels = [];
  const values = [];

  window.projectData.forEach((project) => {
    labels.push(project.project);

    values.push(Number(((project.minutes || 0) / 60).toFixed(1)));
  });

  new Chart(document.getElementById("projectChart"), {
    type: "bar",

    data: {
      labels,

      datasets: [
        {
          label: "Hours",

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
        },
      },
    },
  });
});