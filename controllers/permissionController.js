const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");

// =====================================
// Permission Management
// =====================================

exports.index = (req, res) => {
  Role.getAll((err, roles) => {
    if (err) return res.send(err.message);

    Permission.getAll((err, permissions) => {
      if (err) return res.send(err.message);

      const loadPermissions = (index = 0) => {
        if (index >= roles.length) {
          return res.render("permissions/index", {
            title: "Permission Management",
            roles,
            permissions,
          });
        }

        Permission.getByRole(roles[index].id, (err, assigned) => {
          if (err) return res.send(err.message);

          roles[index].permissions = assigned.map((p) => p.id);

          loadPermissions(index + 1);
        });
      };

      loadPermissions();
    });
  });
};

// =====================================
// Save Role Permissions
// =====================================

exports.update = (req, res) => {
  const roleId = req.params.id;

  let permissions = req.body.permissions || [];

  if (!Array.isArray(permissions)) permissions = [permissions];

  Permission.updateRolePermissions(roleId, permissions, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/permissions");
  });
};
