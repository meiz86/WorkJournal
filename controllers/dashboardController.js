const Dashboard = require("../models/dashboardModel");

exports.index = (req, res) => {
  Dashboard.getStatistics((err, stats) => {
    if (err) return res.send(err.message);

    res.render("dashboard", {
      title: "Dashboard",

      stats,
    });
  });
};
