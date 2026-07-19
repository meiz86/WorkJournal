const Lookup = require("../models/lookupModel");

// Settings Home

exports.index = (req, res) => {
  Lookup.getCategories((err, categories) => {
    if (err) return res.send(err.message);

    res.render("settings/index", {
      title: "Settings",

      categories,
    });
  });
};

// Category page

exports.category = (req, res) => {
  const category = req.params.category.replace("-", "_");
  Lookup.getByCategory(category, (err, items) => {
    if (err) return res.send(err.message);

    res.render("settings/category", {
      title: category,

      category,

      items,
    });
  });
};

// New form

exports.newForm = (req, res) => {
  res.render("settings/new", {
    title: "New Setting",

    category: req.params.category,
  });
};

// Create

exports.create = (req, res) => {
  Lookup.create(req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/settings/" + req.body.category);
  });
};

// Delete

exports.delete = (req, res) => {
  const category = req.params.category;

  Lookup.remove(req.params.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/settings/" + category);
  });
};
