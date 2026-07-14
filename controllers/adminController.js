exports.index = (req, res) => {
  res.render("admin/index", {
    title: "Admin Dashboard",
  });
};
