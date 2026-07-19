const Hardware = require("../models/hardwareModel");

const Center = require("../models/centerModel");

const hardwareTypes = [
  "Server",

  "Switch",

  "Router",

  "Firewall",

  "GPS",

  "NPort",

  "PC",

  "UPS",

  "Printer",

  "Radio",

  "Fiber Converter",

  "Monitor",

  "Other",
];

const statuses = ["Operational", "Maintenance", "Faulty", "Retired"];

// List

exports.index = (req, res) => {
  const centerId = req.params.centerId;

  Hardware.getByCenter(centerId, (err, hardware) => {
    if (err) return res.send(err.message);

    Center.getById(centerId, (err, center) => {
      if (err) return res.send(err.message);

      res.render("hardware/index", {
        title: "Hardware",

        center,

        hardware,
      });
    });
  });
};

// New Form

exports.newForm = (req, res) => {
  Center.getById(req.params.centerId, (err, center) => {
    res.render("hardware/new", {
      title: "Add Hardware",

      center,

      hardwareTypes,

      statuses,
    });
  });
};

// Create

exports.create = (req, res) => {
  req.body.center_id = req.params.centerId;

  Hardware.create(req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect(`/centers/${req.params.centerId}/hardware`);
  });
};

// Edit Form

exports.editForm = (req, res) => {
  Hardware.getById(req.params.id, (err, item) => {
    if (err) return res.send(err.message);

    Center.getById(req.params.centerId, (err, center) => {
      res.render("hardware/edit", {
        title: "Edit Hardware",

        center,

        item,

        hardwareTypes,

        statuses,
      });
    });
  });
};

// Update

exports.update = (req, res) => {
  Hardware.update(req.params.id, req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect(`/centers/${req.params.centerId}/hardware`);
  });
};

// Delete

exports.delete = (req, res) => {
  Hardware.remove(req.params.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect(`/centers/${req.params.centerId}/hardware`);
  });
};
