const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const Report = require("../models/reportModel");
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

    const PDFDocument = require("pdfkit");

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=daily-report.pdf",
    );

    doc.pipe(res);

    // ==========================
    // Title
    // ==========================

    doc.fontSize(22).text("WORK JOURNAL", {
      align: "center",
    });

    doc.fontSize(16).text("Daily Report", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(10).text("Generated: " + new Date().toLocaleString());

    doc.moveDown();

    // ==========================
    // Table Header
    // ==========================

    const startY = doc.y;

    doc.font("Helvetica-Bold");

    doc.text("Date", 40, startY);
    doc.text("Project", 120, startY);
    doc.text("Activity", 240, startY);
    doc.text("Duration", 420, startY);
    doc.text("Status", 500, startY);

    doc
      .moveTo(40, startY + 15)
      .lineTo(560, startY + 15)
      .stroke();

    doc.font("Helvetica");

    let y = startY + 25;

    let totalMinutes = 0;

    activities.forEach((activity) => {
      totalMinutes += activity.duration || 0;

      doc.text(activity.date || "", 40, y);

      doc.text(activity.project || "-", 120, y);

      doc.text(activity.activity || "", 240, y, {
        width: 170,
      });

      doc.text((activity.duration || 0) + " min", 420, y);

      doc.text(activity.status || "", 500, y);

      y += 20;

      // New page if needed
      if (y > 760) {
        doc.addPage();

        y = 50;
      }
    });

    // ==========================
    // Summary
    // ==========================

    doc.moveDown(2);

    doc.font("Helvetica-Bold");

    doc.text("Total Activities : " + activities.length);

    doc.text("Total Hours : " + (totalMinutes / 60).toFixed(1));

    doc.end();
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
      { header: "Activity", key: "activity", width: 40 },
      { header: "Duration", key: "duration", width: 15 },
      { header: "Status", key: "status", width: 20 },
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
