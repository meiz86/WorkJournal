const Activity = require("../models/activityModel");
const { STATUS } = require("../config/constants");

exports.showForm = (req, res) => {
  res.render("activities/new", {
    title: "Add Activity",
    statuses: STATUS,
  });
};

exports.create = (req, res) => {
  req.body.user_id = req.session.user.id;

  Activity.createActivity(req.body, (err, id) => {
    if (err) {
      return res.send(err.message);
    }

    res.redirect("/activities");
  });
};
exports.index = (req, res) => {
  Activity.getActivities(req.query, req.session.user.id, (err, activities) => {
    if (err) return res.send(err.message);

    res.render("activities/index", {
      title: "Activities",
      activities,
      filters: req.query,
      statuses: STATUS,
    });
  });
};
