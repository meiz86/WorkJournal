const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("./database/init");
const app = express();
const activityRoutes = require("./routes/activityRoutes");
const navigation = require("./config/navigation");
const dashboardRoutes = require("./routes/dashboardRoutes");
const PORT = 3000;

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use((req, res, next) => {
  res.locals.navigation = navigation;

  res.locals.currentPath = req.path;

  next();
});

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/activities", activityRoutes);
app.use("/", dashboardRoutes);

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Layout
app.set("layout", "layouts/main");


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
