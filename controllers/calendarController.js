const Calendar = require("../models/calendarModel");

exports.index = (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const today = new Date().toISOString().split("T")[0];

  Calendar.getCalendarData(req.session.user.id, month, (err, data) => {
    if (err) return res.send(err.message);

    const [year, monthNumber] = month.split("-");

    const firstDay = new Date(year, monthNumber - 1, 1);
    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const startDay = firstDay.getDay();

    const yearNum = Number(year);
    const monthNum = Number(monthNumber);

    let previousYear = yearNum;
    let previousMonthNum = monthNum - 1;

    if (previousMonthNum < 1) {
      previousMonthNum = 12;
      previousYear--;
    }

    let nextYear = yearNum;
    let nextMonthNum = monthNum + 1;

    if (nextMonthNum > 12) {
      nextMonthNum = 1;
      nextYear++;
    }

    const previousMonth = `${previousYear}-${String(previousMonthNum).padStart(2, "0")}`;
    const nextMonth = `${nextYear}-${String(nextMonthNum).padStart(2, "0")}`;

    const monthName = firstDay.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    res.render("calendar/index", {
      title: "Calendar",
      month,
      monthName,
      data,
      daysInMonth,
      startDay,
      today,
      previousMonth,
      nextMonth,
    });
  });
};

exports.day = (req, res) => {
  const date = req.params.date;

  Calendar.getDayData(req.session.user.id, date, (err, result) => {
    if (err) return res.send(err.message);

    res.render("calendar/day", {
      title: "Daily Agenda",
      date,
      activities: result.activities,
      tasks: result.tasks,
    });
  });
};
