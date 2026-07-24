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
const departmentRoutes = require("./routes/departmentRoutes");
const requireLogin = require("./middleware/auth");
const centerRoutes = require("./routes/centerRoutes");
const stationRoutes = require("./routes/stationRoutes");
const hardwareRoutes = require("./routes/hardwareRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes");
const permissionRoutes = require("./routes/permissionRoutes");

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

// ======================================
// Global Variables
// ======================================

app.use((req, res, next) => {
  let menu = [...navigation];

  // Filter menu by permissions
  if (req.session.user) {
    const permissions = req.session.user.permissions || [];

    menu = navigation.filter((item) => {
      if (!item.permission) return true;

      return permissions.includes(item.permission);
    });
  }

  // Make user available in every EJS
  res.locals.user = req.session.user;

  // Navigation
  res.locals.navigation = menu;

  // Permission helper
  res.locals.can = (permission) => {
    const user = req.session.user;

    if (!user) return false;

    return (user.permissions || []).includes(permission);
  };

  // Current page
  res.locals.currentPath = req.path;

  next();
});

// ======================================
// Static Files
// ======================================

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

app.use("/departments", requireLogin, departmentRoutes);

app.use("/centers", requireLogin, centerRoutes);

app.use("/stations", requireLogin, stationRoutes);

app.use("/users", requireLogin, userRoutes);

app.use("/roles", requireLogin, roleRoutes);

app.use("/permissions", requireLogin, permissionRoutes);

app.use(
  "/centers/:centerId/hardware",
  requireLogin,
  hardwareRoutes
);

app.use("/settings", requireLogin, settingsRoutes);

// ======================================
// Error Handling
// ======================================

app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).render("errors/500", {
    title: "Server Error",
    error: process.env.NODE_ENV === "development" ? err : null,
  });
});

// ======================================
// Server
// ======================================

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});