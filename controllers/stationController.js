const Station = require("../models/stationModel");
const CenterStationAssignment = require("../models/centerStationAssignmentModel");

// ============================
// List Stations
// ============================

exports.index = (req, res) => {
  const search = req.query.search || "";

  if (search) {
    Station.search(search, (err, stations) => {
      if (err) return res.send(err.message);

      res.render("stations/index", {
        title: "Stations",
        stations,
        search,
      });
    });

    return;
  }

  Station.getAll((err, stations) => {
    if (err) return res.send(err.message);

    res.render("stations/index", {
      title: "Stations",
      stations,
      search: "",
    });
  });
};

// ============================
// Station Details
// ============================

exports.show = (req, res) => {
  Station.getById(req.params.id, (err, station) => {
    if (err) return res.send(err.message);

    if (!station) {
      return res.status(404).send("Station not found.");
    }

    CenterStationAssignment.getCentersForStation(
      req.params.id,
      (err, centers) => {
        if (err) return res.send(err.message);

        res.render("stations/show", {
          title: station.name,
          station,
          centers,
        });
      },
    );
  });
};

// ============================
// New Station Form
// ============================

exports.newForm = (req, res) => {
  res.render("stations/new", {
    title: "New Station",
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
  Station.getById(req.params.id, (err, station) => {
    if (err) return res.send(err.message);

    if (!station) {
      return res.status(404).send("Station not found.");
    }

    res.render("stations/edit", {
      title: "Edit Station",
      station,
    });
  });
};

// ============================
// Update Station
// ============================

exports.update = (req, res) => {
  Station.update(req.params.id, req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect(`/stations/${req.params.id}`);
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
