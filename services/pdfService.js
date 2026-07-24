const PDFDocument = require("pdfkit");
const jalaali = require("jalaali-js");
const path = require("path");

function getShamsiDate() {
  const now = new Date();

  const j = jalaali.toJalaali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );

  return `${j.jy}-${String(j.jm).padStart(2, "0")}-${String(j.jd).padStart(2, "0")}`;
}

function registerFonts(doc) {
  doc.registerFont(
    "Persian",
    path.join(__dirname, "../assets/fonts/Vazirmatn-Regular.ttf"),
  );

  doc.registerFont(
    "Persian-Bold",
    path.join(__dirname, "../assets/fonts/Vazirmatn-Bold.ttf"),
  );
}

function createDocument(res, filename) {
  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  registerFonts(doc);

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);

  doc.pipe(res);

  return doc;
}

function drawHeader(doc, title) {
  doc.font("Persian-Bold").fontSize(22).text("WORK JOURNAL", {
    align: "center",
  });

  doc.moveDown(0.3);

  doc.font("Persian-Bold").fontSize(16).text(title, {
    align: "center",
  });

  doc.moveDown();

  doc
    .font("Persian")
    .fontSize(10)
    .text("Generated : " + getShamsiDate(), {
      align: "center",
    });

  doc.moveDown();
}
function drawDailySummary(doc, rows) {
  let completed = 0;
  let pending = 0;
  let inProgress = 0;
  let totalMinutes = 0;

  rows.forEach((r) => {
    totalMinutes += Number(r.duration || 0);

    if (r.status === "Completed") completed++;
    else if (r.status === "Pending") pending++;
    else if (r.status === "In Progress") inProgress++;
  });

  doc.font("Persian-Bold").fontSize(14).text("Summary");

  doc.moveDown(0.5);

  doc.font("Persian").fontSize(10);

  doc.text(`Activities : ${rows.length}`);
  doc.text(`Completed : ${completed}`);
  doc.text(`In Progress : ${inProgress}`);
  doc.text(`Pending : ${pending}`);
  doc.text(`Total Hours : ${(totalMinutes / 60).toFixed(1)}`);

  doc.moveDown();
}
function drawWeeklySummary(doc, rows) {
  let activities = 0;
  let completed = 0;
  let pending = 0;
  let minutes = 0;

  rows.forEach((r) => {
    activities += Number(r.activities || 0);
    completed += Number(r.completed || 0);
    pending += Number(r.pending || 0);
    minutes += Number(r.minutes || 0);
  });

  doc.font("Persian-Bold").fontSize(14).text("Summary");

  doc.moveDown(0.5);

  doc.font("Persian").fontSize(10);

  doc.text(`Days : ${rows.length}`);
  doc.text(`Activities : ${activities}`);
  doc.text(`Completed : ${completed}`);
  doc.text(`Pending : ${pending}`);
  doc.text(`Total Hours : ${(minutes / 60).toFixed(1)}`);

  doc.moveDown();
}
function drawMonthlySummary(doc, rows) {
  drawWeeklySummary(doc, rows);
}
function drawProjectSummary(doc, rows) {
  let projects = rows.length;
  let activities = 0;
  let completed = 0;
  let pending = 0;
  let minutes = 0;

  rows.forEach((r) => {
    activities += Number(r.activities || 0);
    completed += Number(r.completed || 0);
    pending += Number(r.pending || 0);
    minutes += Number(r.minutes || 0);
  });

  doc.font("Persian-Bold").fontSize(14).text("Summary");

  doc.moveDown(0.5);

  doc.font("Persian").fontSize(10);

  doc.text(`Projects : ${projects}`);
  doc.text(`Activities : ${activities}`);
  doc.text(`Completed : ${completed}`);
  doc.text(`Pending : ${pending}`);
  doc.text(`Total Hours : ${(minutes / 60).toFixed(1)}`);

  doc.moveDown();
}
function generateReport(res, options) {
  const { title, rows } = options;

  const filename = title.toLowerCase().replace(/\s+/g, "-");

  const doc = createDocument(res, filename);

  drawHeader(doc, title);

  switch (title) {
    case "Daily Report":
      drawDailySummary(doc, rows);
      drawDailyTable(doc, rows);
      drawDescriptions(doc, rows);
      break;

    case "Weekly Report":
      drawWeeklySummary(doc, rows);
      drawWeeklyTable(doc, rows);
      break;

    case "Monthly Report":
      drawMonthlySummary(doc, rows);
      drawMonthlyTable(doc, rows);
      break;

    case "Project Report":
      drawProjectSummary(doc, rows);
      drawProjectTable(doc, rows);
      break;
    case "Center Report":
      drawCenterTable(doc, rows);
      break;
  }

  doc.end();
}
function drawCenterTable(doc, rows) {
  let y = doc.y + 20;

  doc.font("Persian-Bold").fontSize(9);

  doc.text("Center", 40, y);
  doc.text("Stations", 110, y);
  doc.text("Fiber", 180, y);
  doc.text("Microwave", 240, y);
  doc.text("PLC", 330, y);
  doc.text("Radio", 380, y);
  doc.text("Wireless", 440, y);
  doc.text("Satellite", 500, y);

  y += 20;

  doc.moveTo(40, y).lineTo(550, y).stroke();

  y += 10;

  doc.font("Persian");

rows.forEach(row=>{

    doc.text(row.center || "-",40,y);

    doc.text(String(row.stations || 0),110,y);

    doc.text(String(row.Fiber || 0),180,y);

    doc.text(String(row.Microwave || 0),240,y);

    doc.text(String(row.PLC || 0),330,y);

    doc.text(String(row.Radio || 0),380,y);

    doc.text(String(row.Wireless || 0),440,y);

    doc.text(String(row.Satellite || 0),500,y);

    y += 20;

});
}
function drawDailyTable(doc, rows) {
  let y = doc.y;

  doc.font("Persian-Bold").fontSize(10);

  doc.text("Date", 40, y);
  doc.text("Project", 110, y);
  doc.text("Activity", 220, y);
  doc.text("Hours", 400, y);
  doc.text("Status", 470, y);

  y += 18;

  doc.moveTo(40, y).lineTo(550, y).stroke();

  y += 10;

  doc.font("Persian").fontSize(9);

  rows.forEach((r) => {
    if (y > 730) {
      doc.addPage();

      y = 50;

      doc.font("Persian-Bold").fontSize(10);

      doc.text("Date", 40, y);
      doc.text("Project", 110, y);
      doc.text("Activity", 220, y);
      doc.text("Hours", 400, y);
      doc.text("Status", 470, y);

      y += 18;

      doc.moveTo(40, y).lineTo(550, y).stroke();

      y += 10;

      doc.font("Persian").fontSize(9);
    }

    doc.text(r.date || "-", 40, y);

    doc.text(r.project || "-", 110, y, {
      width: 100,
    });

    doc.text(r.activity || "-", 220, y, {
      width: 160,
    });

    doc.text(((r.duration || 0) / 60).toFixed(1), 400, y);

    doc.text(r.status || "-", 470, y);

    y += 20;
  });

  doc.moveDown();
}
function drawWeeklyTable(doc, rows) {
  let y = doc.y;

  doc.font("Persian-Bold").fontSize(10);

  doc.text("Date", 40, y);
  doc.text("Activities", 150, y);
  doc.text("Hours", 260, y);
  doc.text("Completed", 360, y);
  doc.text("Pending", 470, y);

  y += 18;

  doc.moveTo(40, y).lineTo(550, y).stroke();

  y += 10;

  doc.font("Persian").fontSize(9);

  rows.forEach((r) => {
    if (y > 730) {
      doc.addPage();

      y = 50;

      doc.font("Persian-Bold");

      doc.text("Date", 40, y);
      doc.text("Activities", 150, y);
      doc.text("Hours", 260, y);
      doc.text("Completed", 360, y);
      doc.text("Pending", 470, y);

      y += 18;

      doc.moveTo(40, y).lineTo(550, y).stroke();

      y += 10;

      doc.font("Persian");
    }

    doc.text(r.date || "-", 40, y);

    doc.text(String(r.activities || 0), 150, y);

    doc.text(((r.minutes || 0) / 60).toFixed(1), 260, y);

    doc.text(String(r.completed || 0), 360, y);

    doc.text(String(r.pending || 0), 470, y);

    y += 20;
  });

  doc.moveDown();
}
function drawMonthlyTable(doc, rows) {
  drawWeeklyTable(doc, rows);
}
function drawProjectTable(doc, rows) {
  let y = doc.y;

  doc.font("Persian-Bold").fontSize(10);

  doc.text("Project", 40, y);
  doc.text("Activities", 220, y);
  doc.text("Hours", 320, y);
  doc.text("Completed", 410, y);
  doc.text("Pending", 500, y);

  y += 18;

  doc.moveTo(40, y).lineTo(550, y).stroke();

  y += 10;

  doc.font("Persian").fontSize(9);

  rows.forEach((r) => {
    if (y > 730) {
      doc.addPage();

      y = 50;

      doc.font("Persian-Bold");

      doc.text("Project", 40, y);
      doc.text("Activities", 220, y);
      doc.text("Hours", 320, y);
      doc.text("Completed", 410, y);
      doc.text("Pending", 500, y);

      y += 18;

      doc.moveTo(40, y).lineTo(550, y).stroke();

      y += 10;

      doc.font("Persian");
    }

    doc.text(r.project || "-", 40, y, {
      width: 160,
    });

    doc.text(String(r.activities || 0), 220, y);

    doc.text(((r.minutes || 0) / 60).toFixed(1), 320, y);

    doc.text(String(r.completed || 0), 410, y);

    doc.text(String(r.pending || 0), 500, y);

    y += 20;
  });

  doc.moveDown();
}
function drawDescriptions(doc, rows) {
  const descriptions = rows.filter(
    (r) => r.description && r.description.trim() !== "",
  );

  if (!descriptions.length) return;

  let y = doc.y + 20;

  if (y > 680) {
    doc.addPage();
    y = 50;
  }

  doc.moveTo(40, y).lineTo(550, y).stroke();

  y += 15;

  doc.font("Persian-Bold").fontSize(14).text("Descriptions", 40, y);

  y += 20;

  doc.font("Persian").fontSize(10);

  descriptions.forEach((r) => {
    if (y > 700) {
      doc.addPage();
      y = 50;
    }

    doc.font("Persian-Bold").text(`• ${r.activity}`, 40, y);

    y += 15;

    doc.font("Persian").text(r.description, 55, y, {
      width: 470,
      align: "right",
    });

    y = doc.y + 15;
  });
}
function drawStatBar(doc, label, count, total, maxWidth = 180) {
  const percent = total === 0 ? 0 : count / total;

  const width = percent * maxWidth;

  const y = doc.y;

  doc.font("Persian").fontSize(10);

  doc.text(label, 40, y, {
    width: 90,
  });

  doc.save();

  doc.fillColor("#e5e7eb");
  doc.rect(140, y + 4, maxWidth, 10).fill();

  doc.fillColor("#2563eb");
  doc.rect(140, y + 4, width, 10).fill();

  doc.restore();

  doc.fillColor("black");

  doc.text(`${count} (${(percent * 100).toFixed(1)}%)`, 340, y);

  doc.moveDown(1.4);
}
function generateStationReport(
  res,
  stations,
  protocolStats,
  mediaStats,
  protocolChart,
  mediaChart,
) {
  const doc = createDocument(res, "station-report");

  drawHeader(doc, "Station Report");

  let y = doc.y;

  const COL = {
    center: 40,
    station: 120,
    protocol: 240,
    media: 320,
    notes: 390,
  };

  doc.font("Persian-Bold").fontSize(10);

  doc.text("Center", COL.center, y);
  doc.text("Station", COL.station, y);
  doc.text("Protocol", COL.protocol, y);
  doc.text("Media", COL.media, y);
  doc.text("Notes", COL.notes, y);

  y += 18;

  doc.moveTo(40, y).lineTo(555, y).stroke();

  y += 10;

  doc.font("Persian").fontSize(9);

  stations.forEach((s) => {
    const noteHeight = doc.heightOfString(s.notes || "-", {
      width: 150,
    });

    const rowHeight = Math.max(20, noteHeight + 4);

    if (y + rowHeight > 730) {
      doc.addPage();

      y = 50;

      doc.font("Persian-Bold").fontSize(10);

      doc.text("Center", COL.center, y);
      doc.text("Station", COL.station, y);
      doc.text("Protocol", COL.protocol, y);
      doc.text("Media", COL.media, y);
      doc.text("Notes", COL.notes, y);

      y += 18;

      doc.moveTo(40, y).lineTo(555, y).stroke();

      y += 10;

      doc.font("Persian").fontSize(9);
    }

    doc.text(s.center_name || "-", COL.center, y, { width: 70 });

    doc.text(s.name || "-", COL.station, y, { width: 110 });

    doc.text(s.protocol || "-", COL.protocol, y, { width: 70 });

    doc.text(s.media || "-", COL.media, y, { width: 60 });

    doc.text(s.notes || "-", COL.notes, y, {
      width: 150,
      align: "right",
    });

    y += rowHeight;
  });

  doc.addPage();

  doc.font("Persian-Bold").fontSize(18).text("Summary");

  doc.moveDown();

  doc.font("Persian").fontSize(12);

  doc.text(
    `Total Centers : ${new Set(stations.map((s) => s.center_name)).size}`,
  );

  doc.text(`Total Stations : ${stations.length}`);

  doc.moveDown();

  doc.font("Persian-Bold").fontSize(14).text("Protocols");

  doc.moveDown(0.5);

  Object.entries(protocolStats).forEach(([k, v]) => {
    drawStatBar(doc, k, v, stations.length);
  });

  doc.moveDown();

  doc.font("Persian-Bold").fontSize(14).text("Media");

  doc.moveDown(0.5);

  Object.entries(mediaStats).forEach(([k, v]) => {
    drawStatBar(doc, k, v, stations.length);
  });

  doc.addPage();

  doc.font("Persian-Bold").fontSize(18).text("Charts", {
    align: "center",
  });

  doc.moveDown();

  doc.font("Persian-Bold").fontSize(14).text("Protocol Distribution");

  doc.moveDown();

  doc.image(protocolChart, {
    fit: [240, 240],
    align: "center",
  });

  doc.moveDown(2);

  doc.font("Persian-Bold").fontSize(14).text("Media Distribution");

  doc.moveDown();

  doc.image(mediaChart, {
    fit: [240, 240],
    align: "center",
  });

  doc.end();
}
function drawProjectTable(doc, rows) {
  let y = doc.y;

  doc.font("Persian-Bold").fontSize(10);

  doc.text("Project", 40, y);
  doc.text("Activities", 220, y);
  doc.text("Hours", 320, y);
  doc.text("Completed", 410, y);
  doc.text("Pending", 500, y);

  y += 20;

  doc.moveTo(40, y).lineTo(560, y).stroke();

  y += 10;

  doc.font("Persian");

  rows.forEach((r) => {
    if (y > 730) {
      doc.addPage();
      y = 50;
    }

    doc.text(r.project || "-", 40, y, { width: 160 });
    doc.text(String(r.activities || 0), 220, y);
    doc.text(((r.minutes || 0) / 60).toFixed(1), 320, y);
    doc.text(String(r.completed || 0), 410, y);
    doc.text(String(r.pending || 0), 500, y);

    y += 20;
  });
}
module.exports = {
  generateReport,
  generateStationReport,
};
