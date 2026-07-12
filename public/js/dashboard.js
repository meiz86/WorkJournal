document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // Hours Worked Chart
  // ===============================

  const hoursCanvas = document.getElementById("hoursChart");

  if (hoursCanvas && window.dashboardData) {
    const labels = [];
    const values = [];

    const today = new Date();

    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);

      d.setDate(today.getDate() - i);

      labels.push(
        d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      );

      values.push(0);
    }

    // Fill values from database
    window.dashboardData.hours.forEach((item) => {
      const dbDate = new Date(item.date);

      const label = dbDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const index = labels.indexOf(label);

      if (index !== -1) {
        values[index] = Number((item.total_minutes / 60).toFixed(2));
      }
    });

    new Chart(hoursCanvas, {
      type: "bar",

      data: {
        labels,

        datasets: [
          {
            label: "Hours Worked",

            data: values,

            backgroundColor: "#2563eb",

            hoverBackgroundColor: "#1d4ed8",

            borderRadius: 8,

            borderSkipped: false,

            maxBarThickness: 40,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        animation: {
          duration: 1200,
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            callbacks: {
              label: function (context) {
                const hours = context.raw;

                const minutes = Math.round(hours * 60);

                return `${hours} hrs (${minutes} minutes)`;
              },
            },
          },
        },

        scales: {
          x: {
            grid: {
              display: false,
            },
          },

          y: {
            beginAtZero: true,

            ticks: {
              callback: function (value) {
                return value + " h";
              },
            },

            grid: {
              color: "#e2e8f0",
            },
          },
        },
      },
    });
  }
  // ===============================
  // Task Status Chart
  // ===============================

  const taskCanvas = document.getElementById("taskChart");

  if (taskCanvas && window.dashboardData) {
    new Chart(taskCanvas, {
      type: "doughnut",

      data: {
        labels: window.dashboardData.taskStatus.map((x) => x.status),

        datasets: [
          {
            data: window.dashboardData.taskStatus.map((x) => x.total),

            backgroundColor: ["#3b82f6", "#f59e0b", "#22c55e", "#ef4444"],

            borderWidth: 2,

            borderColor: "#ffffff",
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        cutout: "70%",

        animation: {
          animateRotate: true,
        },

        plugins: {
          legend: {
            position: "bottom",

            labels: {
              padding: 18,

              usePointStyle: true,
            },
          },

          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw} task(s)`;
              },
            },
          },
        },
      },
    });
  }
});
