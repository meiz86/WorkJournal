const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

require("./database/init");

const app = express();

const navigation = require("./config/navigation");

// Routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboardRoutes");
const activityRoutes = require("./routes/activityRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projects");
const reportRoutes = require("./routes/reports");
const exportRoutes = require("./routes/export");
const calendarRoutes = require("./routes/calendar");

const requireLogin = require("./middleware/auth");

const PORT = 3000;

// ======================================
// View Engine
// ======================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");

// ======================================
// Middleware
// ======================================

app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "workjournal-secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);

// Global variables
app.use((req, res, next) => {
  res.locals.navigation = navigation;
  res.locals.currentPath = req.path;
  res.locals.user = req.session.user || null;
  next();
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

// ======================================
// Public Routes
// ======================================

app.use("/", authRoutes);

// ======================================
// Protected Routes
// ======================================

app.use("/", requireLogin, dashboardRoutes);
app.use("/activities", requireLogin, activityRoutes);
app.use("/tasks", requireLogin, taskRoutes);
app.use("/projects", requireLogin, projectRoutes);
app.use("/reports", requireLogin, reportRoutes);
app.use("/calendar", requireLogin, calendarRoutes);
app.use("/export", requireLogin, exportRoutes);

// ======================================
// Server
// ======================================
// app.use((req, res) => {
//   res.status(404).render("errors/404", {
//     title: "Page Not Found",
//   });
// });
// app.use((err, req, res, next) => {
//   console.error(err);

//   res.status(500).render("errors/500", {
//     title: "Server Error",
//     error: process.env.NODE_ENV === "development" ? err : null,
//   });
// });
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
