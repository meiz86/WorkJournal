const Dashboard = require("../models/dashboardModel");

exports.index = async (req, res) => {
  try {
    const [
      stats,
      activities,
      tasks,
      hours,
      taskStatus,
      streak,
      topProject,
      averageHours,
      completionRate,
    ] = await Promise.all([
      Dashboard.getStatisticsAsync(),
      Dashboard.getRecentActivitiesAsync(5),
      Dashboard.getUpcomingTasksAsync(5),
      Dashboard.getWeeklyHoursAsync(),
      Dashboard.getTaskStatusAsync(),
      Dashboard.getWorkStreakAsync(),
      Dashboard.getTopProjectAsync(),
      Dashboard.getAverageHoursAsync(),
      Dashboard.getCompletionRateAsync(),
    ]);

    res.render("dashboard", {
      title: "Dashboard",

      stats,
      activities,
      tasks,
      hours,
      taskStatus,

      kpi: {
        streak,

        topProject,

        averageHours,

        completionRate,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).send(err.message);
  }
};
