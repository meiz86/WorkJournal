const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const Permission = require("../models/permissionModel");

// ============================
// Register
// ============================

exports.showRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    layout: "layouts/auth",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.render("auth/register", {
        title: "Register",
        layout: "layouts/auth",
        error: "All fields are required.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    User.createUser(
      {
        name,
        email,
        password: hashedPassword,

        // default role
        role: "Employee",
        role_id: 3,
      },

      (err) => {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res.render("auth/register", {
              title: "Register",
              layout: "layouts/auth",
              error: "Email already exists.",
            });
          }

          return res.send(err.message);
        }

        res.redirect("/login");
      },
    );
  } catch (err) {
    res.send(err.message);
  }
};

// ============================
// Login
// ============================

exports.showLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    layout: "layouts/auth",
    error: null,
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("auth/login", {
      title: "Login",
      layout: "layouts/auth",
      error: "Email and password are required.",
    });
  }

  User.findByEmail(email, async (err, user) => {
    if (err) {
      return res.render("auth/login", {
        title: "Login",
        layout: "layouts/auth",
        error: err.message,
      });
    }

    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        layout: "layouts/auth",
        error: "Invalid email or password.",
      });
    }

    // ============================
    // Check account status
    // ============================

    if (user.status === "Disabled") {
      return res.render("auth/login", {
        title: "Login",
        layout: "layouts/auth",
        error: "Your account is disabled.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.render("auth/login", {
        title: "Login",
        layout: "layouts/auth",
        error: "Invalid email or password.",
      });
    }

    req.session.regenerate((err) => {
      if (err) {
        return res.send(err.message);
      }

      Permission.getByRole(
        user.role_id,

        (err, permissions) => {
          if (err) {
            return res.send(err.message);
          }

          req.session.user = {
            id: user.id,

            name: user.name,

            email: user.email,

            role_id: user.role_id,

            // IMPORTANT
            // use database role name
            role: user.role_name || user.role,

            permissions: permissions.map((p) => p.name),
          };

          // console.log("LOGIN USER:", req.session.user);

          res.redirect("/");
        },
      );
    });
  });
};

// ============================
// Logout
// ============================

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");

    res.redirect("/login");
  });
};
