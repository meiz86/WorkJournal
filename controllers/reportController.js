const Report = require("../models/reportModel");
const Station = require("../models/stationModel");
const Center = require("../models/centerModel");
const chartService = require("../services/chartService");

const ExcelJS = require("exceljs");
const pdfService = require("../services/pdfService");

// =================================================
// Reports Home
// =================================================

exports.index = (req, res) => {
  res.render("reports/index", {
    title: "Reports",
  });
};

// =================================================
// Station Report
// =================================================

exports.stationReport = (req, res) => {
  const filters = {
    center_id: req.query.center_id || "",
    protocol: req.query.protocol || "",
    media: req.query.media || "",
    search: req.query.search || "",
  };

  Center.getAll((err, centers) => {
    if (err) return res.send(err.message);

    Station.getReport(filters, (err, stations) => {
      if (err) return res.send(err.message);

      res.render("reports/stations", {
        title: "Station Report",
        centers,
        stations,
        filters,
      });
    });
  });
};

// =================================================
// Hardware Report
// =================================================

exports.hardwareReport = (req, res) => {
  res.render("reports/hardware", {
    title: "Hardware Report",
  });
};

// =================================================
// Center Report
// =================================================

exports.centerReport = (req, res) => {
  Report.getCenterReport((err, rows) => {
    if (err) return res.send(err.message);

    const medias = [...new Set(rows.map((r) => r.media).filter(Boolean))];

    const centers = {};

    rows.forEach((r) => {
      if (!centers[r.center]) {
        centers[r.center] = {
          name: r.center,
          total: 0,
        };

        medias.forEach((m) => {
          centers[r.center][m] = 0;
        });
      }

      if (r.media) {
        centers[r.center][r.media] = r.stations;
        centers[r.center].total += r.stations;
      }
    });

    res.render("reports/centers", {
      title: "Center Report",
      medias,
      report: Object.values(centers),
    });
  });
};
// =================================================
// Existing Reports
// =================================================

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

  Report.getWeeklyReport(req.session.user.id, week, (err, report) => {
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

  Report.getMonthlyReport(req.session.user.id, month, (err, report) => {
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

    Report.getProjectReport(req.session.user.id, projectId, (err, report) => {
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
exports.projectPDF = (req, res) => {
  const projectId = req.query.project_id || "";

  Report.getProjectReport(req.session.user.id, projectId, (err, report) => {
    if (err) return res.send(err.message);

    pdfService.generateReport(res, {
      title: "Project Report",
      rows: report,
    });
  });
};
exports.projectExcel = async (req, res) => {
  const projectId = req.query.project_id || "";

  Report.getProjectReport(
    req.session.user.id,
    projectId,
    async (err, report) => {
      if (err) return res.send(err.message);

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Project Report");

      sheet.columns = [
        { header: "Project", key: "project", width: 30 },
        { header: "Activities", key: "activities", width: 15 },
        { header: "Hours", key: "hours", width: 15 },
        { header: "Completed", key: "completed", width: 15 },
        { header: "Pending", key: "pending", width: 15 },
      ];

      report.forEach((r) => {
        sheet.addRow({
          project: r.project,
          activities: r.activities,
          hours: ((r.minutes || 0) / 60).toFixed(1),
          completed: r.completed,
          pending: r.pending,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=project-report.xlsx",
      );

      await workbook.xlsx.write(res);
      res.end();
    },
  );
};

exports.daily = (req, res) => {
  const filters = {
    date: req.query.date || "",
    project_id: req.query.project_id || "",
    department_id: req.query.department_id || "",
    status: req.query.status || "",
    search: req.query.search || "",
  };

  Report.getDailyReport(req.session.user.id, filters, (err, activities) => {
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

exports.dailyPDF = (req, res) => {
  const filters = {
    date: req.query.date || "",
    project_id: req.query.project_id || "",
    department_id: req.query.department_id || "",
    status: req.query.status || "",
    search: req.query.search || "",
  };

  Report.getDailyReport(req.session.user.id, filters, (err, activities) => {
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
    department_id: req.query.department_id || "",
    status: req.query.status || "",
    search: req.query.search || "",
  };

  Report.getDailyReport(
    req.session.user.id,
    filters,
    async (err, activities) => {
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

      activities.forEach((activity) => sheet.addRow(activity));

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
    },
  );
};
// =================================================
// Station Report PDF
// =================================================

// =================================================
// Station Report Excel
// =================================================

exports.stationExcel = async (req, res) => {
  const filters = {
    center_id: req.query.center_id || "",
    protocol: req.query.protocol || "",
    media: req.query.media || "",
    search: req.query.search || "",
  };

  Station.getReport(filters, async (err, stations) => {
    if (err) return res.send(err.message);

    const workbook = new ExcelJS.Workbook();

    // =========================================================
    // Stations Sheet
    // =========================================================

    const sheet = workbook.addWorksheet("Stations");

    sheet.columns = [
      { header: "Center", key: "center_name", width: 30 },
      { header: "Station", key: "name", width: 30 },
      { header: "Protocol", key: "protocol", width: 18 },
      { header: "Media", key: "media", width: 18 },
      { header: "Notes", key: "notes", width: 40 },
    ];

    stations.forEach((station) => sheet.addRow(station));

    // Header Style
    sheet.getRow(1).font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1F4E78" },
    };

    sheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    sheet.getRow(1).height = 22;

    // =========================================================
    // Statistics
    // =========================================================

    const protocolStats = {};
    const mediaStats = {};

    stations.forEach((station) => {
      const protocol = station.protocol || "Unknown";
      const media = station.media || "Unknown";

      protocolStats[protocol] = (protocolStats[protocol] || 0) + 1;
      mediaStats[media] = (mediaStats[media] || 0) + 1;
    });

    // =========================================================
    // Generate Charts
    // =========================================================

    const protocolChart = await chartService.generatePieChart(
      "Protocols",
      protocolStats,
    );

    const mediaChart = await chartService.generatePieChart("Media", mediaStats);

    // =========================================================
    // Summary Sheet
    // =========================================================

    const summary = workbook.addWorksheet("Summary");

    summary.mergeCells("A1:D1");

    summary.getCell("A1").value = "Station Report Summary";

    summary.getCell("A1").font = {
      bold: true,
      size: 18,
    };

    summary.getCell("A1").alignment = {
      horizontal: "center",
    };

    summary.addRow([]);

    summary.addRow([
      "Total Centers",
      new Set(stations.map((s) => s.center_name)).size,
    ]);

    summary.addRow(["Total Stations", stations.length]);

    summary.addRow([]);

    summary.addRow(["Protocol", "Count"]);

    Object.entries(protocolStats).forEach(([protocol, count]) => {
      summary.addRow([protocol, count]);
    });

    summary.addRow([]);

    summary.addRow(["Media", "Count"]);

    Object.entries(mediaStats).forEach(([media, count]) => {
      summary.addRow([media, count]);
    });

    summary.columns.forEach((column) => {
      column.width = 22;
    });

    // =========================================================
    // Add Charts
    // =========================================================

    const protocolImageId = workbook.addImage({
      buffer: protocolChart,
      extension: "png",
    });

    const mediaImageId = workbook.addImage({
      buffer: mediaChart,
      extension: "png",
    });

    summary.addImage(protocolImageId, {
      tl: { col: 4, row: 1 },
      ext: { width: 340, height: 240 },
    });

    summary.addImage(mediaImageId, {
      tl: { col: 4, row: 18 },
      ext: { width: 340, height: 240 },
    });

    // =========================================================
    // Download
    // =========================================================

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=station-report.xlsx",
    );

    await workbook.xlsx.write(res);

    res.end();
  });
};

// =================================================
// Station Report PDF
// =================================================

exports.stationPDF = (req, res) => {
  const filters = {
    center_id: req.query.center_id || "",
    protocol: req.query.protocol || "",
    media: req.query.media || "",
    search: req.query.search || "",
  };

  Station.getReport(filters, async (err, stations) => {
    if (err) return res.send(err.message);

    const protocolStats = {};
    const mediaStats = {};

    stations.forEach((station) => {
      const protocol = station.protocol || "Unknown";
      const media = station.media || "Unknown";

      protocolStats[protocol] = (protocolStats[protocol] || 0) + 1;
      mediaStats[media] = (mediaStats[media] || 0) + 1;
    });

    const protocolChart = await chartService.generatePieChart(
      "Protocols",
      protocolStats,
    );

    const mediaChart = await chartService.generatePieChart("Media", mediaStats);

    pdfService.generateStationReport(
      res,
      stations,
      protocolStats,
      mediaStats,
      protocolChart,
      mediaChart,
    );
  });
};
exports.weeklyPDF = (req, res) => {
  let week = req.query.week || "";

  Report.getWeeklyReport(req.session.user.id, week, (err, report) => {
    if (err) return res.send(err.message);

    pdfService.generateReport(res, {
      title: "Weekly Report",
      rows: report,
    });
  });
};
exports.weeklyExcel = async (req, res) => {
  let week = req.query.week || "";

  Report.getWeeklyReport(req.session.user.id, week, async (err, report) => {
    if (err) return res.send(err.message);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Weekly Report");

    sheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Activities", key: "activities", width: 15 },
      { header: "Minutes", key: "minutes", width: 15 },
      { header: "Completed", key: "completed", width: 15 },
      { header: "Pending", key: "pending", width: 15 },
    ];

    report.forEach((row) => sheet.addRow(row));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=weekly-report.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  });
};
exports.monthlyPDF = (req, res) => {
  const month = req.query.month || "";

  Report.getMonthlyReport(req.session.user.id, month, (err, report) => {
    if (err) return res.send(err.message);

    pdfService.generateReport(res, {
      title: "Monthly Report",
      rows: report,
    });
  });
};
exports.monthlyExcel = async (req, res) => {
  const month = req.query.month || "";

  Report.getMonthlyReport(req.session.user.id, month, async (err, report) => {
    if (err) return res.send(err.message);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Monthly Report");

    sheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Activities", key: "activities", width: 15 },
      { header: "Minutes", key: "minutes", width: 15 },
      { header: "Completed", key: "completed", width: 15 },
      { header: "Pending", key: "pending", width: 15 },
    ];

    report.forEach((row) => sheet.addRow(row));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=monthly-report.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  });
};
// =================================================
// Center Report PDF
// =================================================

exports.centerPDF = (req, res) => {
  Report.getCenterMediaReport((err, report) => {
    if (err) return res.send(err.message);
    console.log(report);
    pdfService.generateReport(res, {
      title: "Center Report",
      rows: report,
    });
  });
};
// =================================================
// Center Report Excel
// =================================================

exports.centerExcel = async (req, res) => {
  Report.getCenterMediaReport(async (err, report) => {
    if (err) return res.send(err.message);

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Center Report");

    sheet.columns = [
      {
        header: "Center",
        key: "center",
        width: 25,
      },

      {
        header: "Stations",
        key: "stations",
        width: 12,
      },

      {
        header: "Fiber",
        key: "Fiber",
        width: 12,
      },

      {
        header: "Microwave",
        key: "Microwave",
        width: 12,
      },

      {
        header: "PLC",
        key: "PLC",
        width: 12,
      },

      {
        header: "Radio",
        key: "Radio",
        width: 12,
      },

      {
        header: "Wireless",
        key: "Wireless",
        width: 12,
      },

      {
        header: "Satellite",
        key: "Satellite",
        width: 12,
      },
    ];

    report.forEach((row) => {
      sheet.addRow(row);
    });

    sheet.getRow(1).font = {
      bold: true,
    };

    sheet.getRow(1).alignment = {
      horizontal: "center",
    };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=center-report.xlsx",
    );

    await workbook.xlsx.write(res);

    res.end();
  });
};
