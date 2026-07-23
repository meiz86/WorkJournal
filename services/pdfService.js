const PDFDocument = require("pdfkit");
const jalaali = require("jalaali-js");
function getShamsiDate() {
  const now = new Date();

  const j = jalaali.toJalaali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );

  return `${j.jy}-${String(j.jm).padStart(2, "0")}-${String(j.jd).padStart(2, "0")}`;
}
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
}
function drawHeader(doc, title) {
  doc.fontSize(22).text("WORK JOURNAL", {
    align: "center",
  });

  doc.fontSize(16).text(title, {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(10).text("Generated : " + getShamsiDate());

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
function drawStatBar(doc, label, count, total, maxWidth = 180) {
  const percent = total === 0 ? 0 : count / total;

  const barWidth = percent * maxWidth;

  const y = doc.y;

  doc.font("Helvetica").fontSize(11);

  doc.text(label, 40, y, {
    width: 90,
  });

  // Background

  doc.rect(150, y + 4, maxWidth, 10).fill("#e5e7eb");

  // Filled bar

  doc.rect(150, y + 4, barWidth, 10).fill("#2563eb");

  doc.fillColor("black");

  doc.text(`${count} (${(percent * 100).toFixed(1)}%)`, 350, y);

  doc.moveDown(1.3);
}

function generateStationReport(
  res,
  stations,
  protocolStats,
  mediaStats,
  protocolChart,
  mediaChart,
) {
  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=station-report.pdf",
  );

  doc.pipe(res);

  // ==========================================================
  // Header
  // ==========================================================

  doc.font("Helvetica-Bold").fontSize(20).text("Station Report", {
    align: "center",
  });

  doc.moveDown(0.5);

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("Generated : " + getShamsiDate(), {
      align: "right",
    });

  doc.moveDown();

  // ==========================================================
  // Table
  // ==========================================================

  let y = doc.y;

  const COL = {
    center: 40,
    station: 120,
    protocol: 240,
    media: 320,
    notes: 390,
  };

  doc.font("Helvetica-Bold").fontSize(10);

  doc.text("Center", COL.center, y, { width: 70 });
  doc.text("Station", COL.station, y, { width: 110 });
  doc.text("Protocol", COL.protocol, y, { width: 70 });
  doc.text("Media", COL.media, y, { width: 60 });
  doc.text("Notes", COL.notes, y, { width: 150 });

  y += 18;

  doc.moveTo(40, y).lineTo(555, y).stroke();

  y += 10;

  doc.font("Helvetica").fontSize(9);

  stations.forEach((s) => {
    // Calculate required row height
    const noteHeight = doc.heightOfString(s.notes || "-", {
      width: 150,
    });

    const rowHeight = Math.max(20, noteHeight + 4);

    if (y + rowHeight > 730) {
      doc.addPage();

      y = 50;

      doc.font("Helvetica-Bold").fontSize(10);

      doc.text("Center", COL.center, y, { width: 70 });
      doc.text("Station", COL.station, y, { width: 110 });
      doc.text("Protocol", COL.protocol, y, { width: 70 });
      doc.text("Media", COL.media, y, { width: 60 });
      doc.text("Notes", COL.notes, y, { width: 150 });

      y += 18;

      doc.moveTo(40, y).lineTo(555, y).stroke();

      y += 10;

      doc.font("Helvetica").fontSize(9);
    }

    doc.text(s.center_name || "-", COL.center, y, {
      width: 70,
    });

    doc.text(s.name || "-", COL.station, y, {
      width: 110,
    });

    doc.text(s.protocol || "-", COL.protocol, y, {
      width: 70,
    });

    doc.text(s.media || "-", COL.media, y, {
      width: 60,
    });

    doc.text(s.notes || "-", COL.notes, y, {
      width: 150,
      align: "left",
    });

    y += rowHeight;
  });
  // ==========================================================
  // Summary Page
  // ==========================================================

  doc.addPage();

  doc.font("Helvetica-Bold").fontSize(18).text("Summary");

  doc.moveDown();

  const totalStations = stations.length;
  const totalCenters = new Set(stations.map((s) => s.center_name)).size;

  doc.font("Helvetica").fontSize(12);

  doc.text(`Total Centers : ${totalCenters}`);
  doc.text(`Total Stations : ${totalStations}`);

  doc.moveDown();

  // ==========================================================
  // Protocol Statistics
  // ==========================================================

  doc.font("Helvetica-Bold").fontSize(14).text("Protocols");

  doc.moveDown(0.5);

  Object.entries(protocolStats).forEach(([protocol, count]) => {
    drawStatBar(doc, protocol, count, totalStations);
  });
  // ==========================================================
  // Media Statistics
  // ==========================================================

  doc.font("Helvetica-Bold").fontSize(14).text("Media");

  doc.moveDown(0.5);

  doc.font("Helvetica");

  Object.entries(mediaStats).forEach(([media, count]) => {
    drawStatBar(doc, media, count, totalStations);
  });

  // IMPORTANT
  // Finish PDF stream
  // ==========================================================
  // Charts
  // ==========================================================

  doc.addPage();

  doc.font("Helvetica-Bold").fontSize(18).text("Charts", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(14).text("Protocol Distribution");

  doc.moveDown(0.5);

  doc.image(protocolChart, {
    fit: [240, 240],
    align: "center",
  });

  doc.moveDown(2);

  doc.fontSize(14).text("Media Distribution");

  doc.moveDown(0.5);

  doc.image(mediaChart, {
    fit: [240, 240],
    align: "center",
  });
  doc.end();
}
module.exports = {
  generateReport,
  generateStationReport,
};
