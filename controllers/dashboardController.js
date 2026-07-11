const Dashboard = require("../models/dashboardModel");

exports.index = (req, res) => {

    Dashboard.getStatistics((err, stats) => {

        if (err) return res.send(err.message);

        Dashboard.getRecentActivities(5, (err, activities) => {

            if (err) return res.send(err.message);

            Dashboard.getUpcomingTasks(5, (err, tasks) => {

                if (err) return res.send(err.message);

                Dashboard.getWeeklyHours((err, hours) => {

                    if (err) return res.send(err.message);

                    Dashboard.getTaskStatus((err, taskStatus) => {

                        if (err) return res.send(err.message);

                        res.render("dashboard", {

                            title: "Dashboard",

                            stats,

                            activities,

                            tasks,

                            hours,

                            taskStatus

                        });

                    });

                });

            });

        });

    });

};