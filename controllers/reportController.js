const Report = require("../models/reportModel");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const pdfService = require("../services/pdfService");

exports.index = (req, res) => {
  res.render("reports/index", {
    title: "Reports",
  });
};

exports.weekly = (req, res) => {
  let week = req.query.week;

  if (!week) {
    const today = new Date();

    const year = today.getFullYear();

    const firstJan = new Date(year, 0, 1);

    const weekNumber = Math.ceil(
      ((today - firstJan) / 86400000 + firstJan.getDay() + 1) / 7,
    );

    week = `${year}-W${String(weekNumber).padStart(2, "0")}`;
  }

  Report.getWeeklyReport(week, (err, report) => {
    if (err) return res.send(err.message);

    res.render("reports/weekly", {
      title: "Weekly Report",

      week,

      report,
    });
  });
};
exports.monthly = (req, res) => {
  const month = req.query.month || "";

  Report.getMonthlyReport(month, (err, report) => {
    if (err) return res.send(err.message);

    res.render("reports/monthly", {
      title: "Monthly Report",

      month,

      report,
    });
  });
};
exports.project = (req, res) => {
  const projectId = req.query.project_id || "";

  Report.getProjects((err, projects) => {
    if (err) return res.send(err.message);

    Report.getProjectReport(projectId, (err, report) => {
      if (err) return res.send(err.message);

      res.render("reports/project", {
        title: "Project Report",

        projects,

        projectId,

        report,
      });
    });
  });
};
exports.dailyPDF = (req, res) => {
  const filters = {
    date: req.query.date || "",
    project_id: req.query.project_id || "",
    department: req.query.department || "",
    status: req.query.status || "",
    search: req.query.search || "",
  };

  Report.getDailyReport(filters, (err, activities) => {
    if (err) return res.send(err.message);

    pdfService.generateReport(res, {
      title: "Daily Report",
      rows: activities,
    });
  });
};

exports.dailyExcel = async (req, res) => {
  const filters = {
    date: req.query.date || "",
    project_id: req.query.project_id || "",
    department: req.query.department || "",
    status: req.query.status || "",
    search: req.query.search || "",
  };

  Report.getDailyReport(filters, async (err, activities) => {
    if (err) return res.send(err.message);

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Daily Report");

    sheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Project", key: "project", width: 25 },
      { header: "Department", key: "department", width: 20 },
      { header: "Activity", key: "activity", width: 35 },
      { header: "Duration", key: "duration", width: 12 },
      { header: "Status", key: "status", width: 15 },
    ];

    activities.forEach((activity) => {
      sheet.addRow(activity);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=daily-report.xlsx",
    );

    await workbook.xlsx.write(res);

    res.end();
  });
};
exports.daily = (req, res) => {
  const filters = {
    date: req.query.date || "",
    project_id: req.query.project_id || "",
    department: req.query.department || "",
    status: req.query.status || "",
    search: req.query.search || "",
  };

  Report.getDailyReport(filters, (err, activities) => {
    if (err) return res.send(err.message);

    Report.getProjects((err, projects) => {
      if (err) return res.send(err.message);

      Report.getDepartments((err, departments) => {
        if (err) return res.send(err.message);

        res.render("reports/daily", {
          title: "Daily Report",
          filters,
          activities,
          projects,
          departments,
        });
      });
    });
  });
};
