const Center = require("../models/centerModel");

// ============================
// List Centers
// ============================

exports.index = (req, res) => {
  Center.getAll((err, centers) => {
    if (err) return res.send(err.message);

    res.render("centers/index", {
      title: "Centers",
      centers,
    });
  });
};

// ============================
// New Center Form
// ============================

exports.newForm = (req, res) => {
  res.render("centers/new", {
    title: "New Center",
  });
};

// ============================
// Create Center
// ============================

exports.create = (req, res) => {
  Center.create(req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/centers");
  });
};

// ============================
// Edit Form
// ============================

exports.editForm = (req, res) => {
  Center.getById(req.params.id, (err, center) => {
    if (err) return res.send(err.message);

    if (!center) {
      return res.status(404).send("Center not found.");
    }

    res.render("centers/edit", {
      title: "Edit Center",
      center,
    });
  });
};

// ============================
// Update Center
// ============================

exports.update = (req, res) => {
  Center.update(req.params.id, req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/centers");
  });
};

// ============================
// Delete Center
// ============================

exports.delete = (req, res) => {
  Center.remove(req.params.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/centers");
  });
};
