const db = require("../database/db");

// =====================================
// Get All Permissions
// =====================================

function getAll(callback) {
  db.all(
    `
    SELECT *
    FROM permissions
    ORDER BY name
  `,
    callback,
  );
}

// =====================================
// Get Permissions For Role
// =====================================

function getByRole(roleId, callback) {
  db.all(
    `
    SELECT
      permissions.*

    FROM role_permissions

    INNER JOIN permissions
      ON permissions.id = role_permissions.permission_id

    WHERE role_permissions.role_id = ?

    ORDER BY permissions.name
  `,
    [roleId],
    callback,
  );
}

// =====================================
// Replace Role Permissions
// =====================================

function updateRolePermissions(roleId, permissionIds, callback) {
  db.serialize(() => {
    db.run(
      `
      DELETE FROM role_permissions
      WHERE role_id = ?
    `,
      [roleId],
    );

    if (!permissionIds || permissionIds.length === 0) {
      return callback(null);
    }

    const stmt = db.prepare(`
      INSERT INTO role_permissions(role_id, permission_id)
      VALUES (?, ?)
    `);

    permissionIds.forEach((id) => {
      stmt.run(roleId, id);
    });

    stmt.finalize(callback);
  });
}

module.exports = {
  getAll,
  getByRole,
  updateRolePermissions,
};
