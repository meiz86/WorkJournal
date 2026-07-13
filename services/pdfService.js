const PDFDocument = require("pdfkit");
function generateReport(res, options) {
  const { title, rows } = options;

  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
  );

  doc.pipe(res);

  drawHeader(doc, title);
  drawSummary(doc, rows);
  drawTable(doc, rows);
  drawDescriptions(doc, rows);

  doc.end();
}
function drawHeader(doc, title) {
  doc.fontSize(22).text("WORK JOURNAL", {
    align: "center",
  });

  doc.fontSize(16).text(title, {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(10).text("Generated: " + new Date().toLocaleString());

  doc.moveDown();
}
function drawSummary(doc, activities) {
  let completed = 0;
  let pending = 0;
  let inProgress = 0;
  let totalMinutes = 0;

  activities.forEach((activity) => {
    totalMinutes += Number(activity.duration || 0);

    switch (activity.status) {
      case "Completed":
        completed++;
        break;

      case "Pending":
        pending++;
        break;

      case "In Progress":
        inProgress++;
        break;
    }
  });

  doc.fontSize(14).font("Helvetica-Bold").text("Summary");

  doc.moveDown(0.5);

  doc.fontSize(10);
  doc.font("Helvetica");

  doc.text(`Activities : ${activities.length}`);
  doc.text(`Completed  : ${completed}`);
  doc.text(`In Progress: ${inProgress}`);
  doc.text(`Pending    : ${pending}`);
  doc.text(`Total Hours: ${(totalMinutes / 60).toFixed(1)}`);

  doc.moveDown();
}
function drawTable(doc, activities) {
  let y = doc.y + 10;

  // ==========================
  // Table Header
  // ==========================

  doc.font("Helvetica-Bold");
  doc.fontSize(10);

  doc.text("Date", 40, y);
  doc.text("Project", 100, y);
  doc.text("Activity", 220, y);
  doc.text("Duration", 380, y);
  doc.text("Status", 470, y);

  y += 15;

  doc.moveTo(40, y).lineTo(560, y).stroke();

  y += 10;

  // ==========================
  // Table Rows
  // ==========================

  doc.font("Helvetica");

  activities.forEach((activity) => {
    // Create a new page if needed
    if (y > 730) {
      doc.addPage();

      y = 50;

      doc.font("Helvetica-Bold");

      doc.text("Date", 40, y);
      doc.text("Project", 100, y);
      doc.text("Activity", 220, y);
      doc.text("Duration", 380, y);
      doc.text("Status", 470, y);

      y += 15;

      doc.moveTo(40, y).lineTo(560, y).stroke();

      y += 10;

      doc.font("Helvetica");
    }

    doc.text(activity.date || "", 40, y);

    doc.text(activity.project || "", 100, y, {
      width: 110,
    });

    doc.text(activity.activity || "", 220, y, {
      width: 150,
    });

    doc.text(`${activity.duration || 0} min`, 380, y);

    doc.text(activity.status || "", 470, y);

    y += 20;
  });

  doc.moveDown();
}
function drawDescriptions(doc, activities) {
  // Keep only activities with descriptions
  const descriptions = activities.filter(
    (activity) => activity.description && activity.description.trim() !== "",
  );

  if (descriptions.length === 0) {
    return;
  }

  let y = doc.y + 20;

  // Start a new page if we're near the bottom
  if (y > 680) {
    doc.addPage();
    y = 50;
  }

  // Divider
  doc.moveTo(40, y).lineTo(560, y).stroke();

  y += 15;

  // Section title
  doc.font("Helvetica-Bold");
  doc.fontSize(14);
  doc.text("Descriptions", 40, y);

  y += 25;

  doc.font("Helvetica");
  doc.fontSize(10);

  descriptions.forEach((activity) => {
    // Add a new page if needed
    if (y > 700) {
      doc.addPage();
      y = 50;
    }

    // Activity name
    doc.font("Helvetica-Bold");
    doc.text(`• ${activity.activity}`, 40, y);

    y += 15;

    // Description text
    doc.font("Helvetica");
    doc.text(activity.description, 55, y, {
      width: 470,
      align: "left",
    });

    // Move y to the end of the wrapped text
    y = doc.y + 15;
  });
}
function drawFooter(doc) {}

module.exports = {
  generateReport,
};
