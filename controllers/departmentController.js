const Department = require("../models/departmentModel");

exports.index = (req, res) => {
  Department.getAll((err, departments) => {
    if (err) return res.send(err.message);

    res.render("departments/index", {
      title: "Departments",
      departments,
    });
  });
};

exports.newForm = (req, res) => {
  res.render("departments/new", {
    title: "New Department",
  });
};

exports.create = (req, res) => {
  Department.create(req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/departments");
  });
};

exports.editForm = (req, res) => {
  Department.getById(req.params.id, (err, department) => {
    if (err) return res.send(err.message);

    if (!department) {
      return res.status(404).send("Department not found.");
    }

    res.render("departments/edit", {
      title: "Edit Department",
      department,
    });
  });
};

exports.update = (req, res) => {
  Department.update(req.params.id, req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/departments");
  });
};

exports.delete = (req, res) => {
  Department.remove(req.params.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/departments");
  });
};
