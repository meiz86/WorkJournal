const Project = require("../models/projectModel");

exports.index = (req, res) => {
  Project.getAll((err, projects) => {
    if (err) return res.send(err.message);

    res.render("projects/index", {
      title: "Projects",

      projects,
    });
  });
};

exports.newForm = (req, res) => {
  res.render("projects/new", {
    title: "New Project",
  });
};

exports.create = (req, res) => {
  Project.create(req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/projects");
  });
};

exports.editForm = (req, res) => {
  Project.getById(req.params.id, (err, project) => {
    if (err) return res.send(err.message);

    res.render("projects/edit", {
      title: "Edit Project",

      project,
    });
  });
};

exports.update = (req, res) => {
  Project.update(req.params.id, req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/projects");
  });
};

exports.delete = (req, res) => {
  Project.remove(req.params.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/projects");
  });
};
exports.details = (req, res) => {
  Project.getDashboard(req.params.id, (err, dashboard) => {
    if (err) return res.send(err.message);

    res.render("projects/dashboard", {
      title: dashboard.project.name,

      dashboard,
    });
  });
};
