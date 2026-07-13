document.addEventListener("DOMContentLoaded", () => {

    const labels = [];
    const values = [];

    window.monthlyData.forEach(day => {

        labels.push(day.date);

        values.push(Number((day.minutes / 60).toFixed(1)));

    });

    new Chart(document.getElementById("monthlyChart"), {

        type: "line",

        data: {

            labels,

            datasets: [{

                label: "Hours",

                data: values,

                borderColor: "#2563eb",

                backgroundColor: "rgba(37,99,235,0.2)",

                tension: 0.3,

                fill: true

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

});