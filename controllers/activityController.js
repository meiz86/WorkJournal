const Activity = require("../models/activityModel");
const Project = require("../models/projectModel");
const Department = require("../models/departmentModel");
const { STATUS } = require("../config/constants");

exports.showForm = (req, res) => {
  Project.getAll(req.session.user.id, (err, projects) => {
    if (err) return res.send(err.message);

    Department.getAll((err, departments) => {
      if (err) return res.send(err.message);

      res.render("activities/new", {
        title: "Add Activity",
        statuses: STATUS,
        projects,
        departments,
      });
    });
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
exports.editForm = (req, res) => {
  Activity.getActivityById(
    req.params.id,
    req.session.user.id,
    (err, activity) => {
      if (err) return res.send(err.message);

      Project.getAll(req.session.user.id, (err, projects) => {
        if (err) return res.send(err.message);

        Department.getAll((err, departments) => {
          if (err) return res.send(err.message);

          res.render("activities/edit", {
            title: "Edit Activity",
            activity,
            statuses: STATUS,
            projects,
            departments,
          });
        });
      });
    },
  );
};

exports.update = (req, res) => {
  Activity.updateActivity(
    req.params.id,
    req.body,
    req.session.user.id,
    (err) => {
      if (err) return res.send(err.message);

      res.redirect("/activities");
    },
  );
};

exports.delete = (req, res) => {
  Activity.deleteActivity(req.params.id, req.session.user.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/activities");
  });
};
