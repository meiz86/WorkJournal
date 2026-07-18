const Station = require("../models/stationModel");
const Center = require("../models/centerModel");

// ============================
// List Stations
// ============================

exports.index = (req, res) => {
  Station.getAll((err, stations) => {
    if (err) return res.send(err.message);

    res.render("stations/index", {
      title: "Stations",
      stations,
    });
  });
};

// ============================
// New Station Form
// ============================

exports.newForm = (req, res) => {
  Center.getAll((err, centers) => {
    if (err) return res.send(err.message);

    res.render("stations/new", {
      title: "New Station",
      centers,
    });
  });
};

// ============================
// Create Station
// ============================

exports.create = (req, res) => {
  Station.create(req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/stations");
  });
};

// ============================
// Edit Station Form
// ============================

exports.editForm = (req, res) => {
  Center.getAll((err, centers) => {
    if (err) return res.send(err.message);

    Station.getById(req.params.id, (err, station) => {
      if (err) return res.send(err.message);

      if (!station) {
        return res.status(404).send("Station not found.");
      }

      res.render("stations/edit", {
        title: "Edit Station",
        station,
        centers,
      });
    });
  });
};

// ============================
// Update Station
// ============================

exports.update = (req, res) => {
  Station.update(req.params.id, req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/stations");
  });
};

// ============================
// Delete Station
// ============================

exports.delete = (req, res) => {
  Station.remove(req.params.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/stations");
  });
};
