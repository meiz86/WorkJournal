exports.allowPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const userPermissions = req.session.user.permissions || [];

    const allowed = permissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!allowed) {
      return res.status(403).render("errors/403", {
        title: "Access Denied",
      });
    }

    next();
  };
};
