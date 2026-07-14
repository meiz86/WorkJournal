const Dashboard = require("../models/dashboardModel");

exports.index = async (req, res) => {
  try {
    const userId = req.session.user.id;

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
      Dashboard.getStatisticsAsync(userId),
      Dashboard.getRecentActivitiesAsync(userId, 5),
      Dashboard.getUpcomingTasksAsync(userId, 5),
      Dashboard.getWeeklyHoursAsync(userId),
      Dashboard.getTaskStatusAsync(userId),
      Dashboard.getWorkStreakAsync(userId),
      Dashboard.getTopProjectAsync(userId),
      Dashboard.getAverageHoursAsync(userId),
      Dashboard.getCompletionRateAsync(userId),
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
