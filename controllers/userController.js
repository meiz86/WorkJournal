const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const Role = require("../models/roleModel");

// =====================================
// Users List
// =====================================

exports.index = (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) return res.send(err.message);

    Role.getAll((err, roles) => {
      if (err) return res.send(err.message);

      res.render("users/index", {
        title: "Users",
        users,
        roles,
      });
    });
  });
};

// =====================================
// New User Form
// =====================================

exports.newForm = (req, res) => {
  Role.getAll((err, roles) => {
    if (err) return res.send(err.message);

    res.render("users/new", {
      title: "Create User",
      roles,
    });
  });
};

// =====================================
// Create User
// =====================================

exports.create = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    Role.getById(role_id, (err, role) => {
      if (err) return res.send(err.message);

      User.createUser(
        {
          name,
          email,
          password: hashedPassword,
          role: role.name,
          role_id,
        },

        (err) => {
          if (err) {
            if (err.message.includes("UNIQUE")) {
              return res.send("Email already exists.");
            }

            return res.send(err.message);
          }

          res.redirect("/users");
        },
      );
    });
  } catch (err) {
    res.send(err.message);
  }
};

// =====================================
// Edit User Form
// =====================================

exports.editForm = (req, res) => {
  const id = req.params.id;

  User.findById(id, (err, user) => {
    if (err) return res.send(err.message);

    Role.getAll((err, roles) => {
      if (err) return res.send(err.message);

      res.render("users/edit", {
        title: "Edit User",
        user,
        roles,
      });
    });
  });
};

// =====================================
// Update User
// =====================================

exports.update = async (req, res) => {
  const id = req.params.id;

  const { name, email, password, role_id } = req.body;

  let hashedPassword = null;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  Role.getById(role_id, (err, role) => {
    if (err) return res.send(err.message);

    User.update(
      id,
      {
        name,
        email,
        password: hashedPassword,
        role: role.name,
        role_id,
      },

      (err) => {
        if (err) return res.send(err.message);

        res.redirect("/users");
      },
    );
  });
};

// =====================================
// Update Role Only
// =====================================

exports.updateRole = (req, res) => {
  const id = req.params.id;

  const { role_id } = req.body;

  User.updateRole(
    id,
    role_id,

    (err) => {
      if (err) return res.send(err.message);

      res.redirect("/users");
    },
  );
};

// =====================================
// Delete User
// =====================================

exports.delete = (req, res) => {
  const id = req.params.id;

  if (id == req.session.user.id) {
    return res.send("You cannot delete yourself.");
  }

  User.delete(
    id,

    (err) => {
      if (err) return res.send(err.message);

      res.redirect("/users");
    },
  );
};
// =====================================
// Update User Status
// =====================================

exports.updateStatus = (req, res) => {

  const id = req.params.id;

  const { status } = req.body;


  User.updateStatus(
    id,
    status,
    (err) => {

      if (err) return res.send(err.message);


      res.redirect("/users");

    }
  );

};