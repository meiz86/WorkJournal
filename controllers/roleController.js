const Role = require("../models/roleModel");

// ============================
// Roles List
// ============================

exports.index = (req, res) => {
  Role.getAll((err, roles) => {
    if (err) return res.send(err.message);

    res.render("roles/index", {
      title: "Roles",
      roles,
    });
  });
};

// ============================
// Create Role
// ============================

exports.create = (req, res) => {
  const { name, description } = req.body;

  Role.create(
    {
      name,
      description,
    },
    (err) => {
      if (err) return res.send(err.message);

      res.redirect("/roles");
    },
  );
};

// ============================
// Update Role
// ============================

exports.update = (req, res) => {
  const id = req.params.id;

  const { name, description } = req.body;

  Role.update(
    id,
    {
      name,
      description,
    },
    (err) => {
      if (err) return res.send(err.message);

      res.redirect("/roles");
    },
  );
};

// ============================
// Delete Role
// ============================

exports.delete = (req, res) => {
  Role.remove(req.params.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/roles");
  });
};
