const Project = require("../models/projectModel");

exports.index = (req, res) => {
  Project.getAll(req.session.user.id, (err, projects) => {
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
  req.body.user_id = req.session.user.id;

  Project.create(req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/projects");
  });
};

exports.editForm = (req, res) => {
  Project.getById(req.params.id, req.session.user.id, (err, project) => {
    if (err) return res.send(err.message);

    if (!project) {
      return res.status(404).send("Project not found.");
    }

    res.render("projects/edit", {
      title: "Edit Project",
      project,
    });
  });
};

exports.update = (req, res) => {
  Project.update(req.params.id, req.session.user.id, req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/projects");
  });
};

exports.delete = (req, res) => {
  Project.remove(req.params.id, req.session.user.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/projects");
  });
};

exports.details = (req, res) => {
  Project.getDashboard(req.params.id, req.session.user.id, (err, dashboard) => {
    if (err) return res.send(err.message);

    if (!dashboard) {
      return res.status(404).send("Project not found.");
    }

    res.render("projects/dashboard", {
      title: dashboard.project.name,
      dashboard,
    });
  });
};
