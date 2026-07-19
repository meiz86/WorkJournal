const Center = require("../models/centerModel");
const CenterStationAssignment = require("../models/centerStationAssignmentModel");
const Hardware = require("../models/hardwareModel");
const Station = require("../models/stationModel");

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
// New Center
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
// Center Dashboard
// ============================

exports.show = (req, res) => {
  const id = req.params.id;

  Center.getById(id, (err, center) => {
    if (err) return res.send(err.message);

    if (!center) return res.status(404).send("Center not found.");

    CenterStationAssignment.getStationsForCenter(
      id,

      (err, stations) => {
        if (err) return res.send(err.message);

        res.render("centers/show", {
          title: center.name,
          center,
          stations,
        });
      },
    );
  });
};
// ============================
// Edit Center
// ============================

exports.editForm = (req, res) => {
  Center.getById(req.params.id, (err, center) => {
    if (err) return res.send(err.message);

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
exports.assignStationForm = (req, res) => {
  const centerId = req.params.id;

  Station.getAll((err, stations) => {
    if (err) return res.send(err.message);

    res.render("centers/assignStation", {
      title: "Assign Station",
      centerId,
      stations,
    });
  });
};

exports.assignStation = (req, res) => {
  CenterStationAssignment.assign(
    req.params.id,

    req.body.station_id,

    (err) => {
      if (err) return res.send(err.message);

      res.redirect("/centers/" + req.params.id);
    },
  );
};
