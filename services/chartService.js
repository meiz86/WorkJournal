const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const ChartDataLabels = require("chartjs-plugin-datalabels");

const width = 500;
const height = 500;

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: "white",

  chartCallback: (ChartJS) => {
    ChartJS.register(ChartDataLabels);
  },
});
async function generatePieChart(title, stats) {
  const labels = Object.keys(stats);
  const values = Object.values(stats);

  const colors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#65a30d",
    "#ea580c",
    "#db2777",
    "#475569",
  ];

  const configuration = {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false,

      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 18,
          },
        },

        legend: {
          position: "bottom",
        },

        datalabels: {
          color: "#ffffff",
          font: {
            weight: "bold",
            size: 14,
          },

          formatter: (value, context) => {
            const data = context.chart.data.datasets[0].data;

            const total = data.reduce((a, b) => a + b, 0);

            return ((value / total) * 100).toFixed(1) + "%";
          },
        },
      },
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

module.exports = {
  generatePieChart,
};
