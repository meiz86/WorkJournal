const bcrypt = require("bcrypt");
const User = require("../models/userModel");

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
      return res.send("All fields are required.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    User.createUser(
      {
        name,
        email,
        password: hashedPassword,
        role: "Employee",
      },
      (err) => {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res.send("Email already exists.");
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
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Email and password are required.");
  }

  User.findByEmail(email, async (err, user) => {
    if (err) return res.send(err.message);

    if (!user) {
      return res.send("Invalid email or password.");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.send("Invalid email or password.");
    }

    req.session.regenerate((err) => {
      if (err) return res.send(err.message);

      req.session.user = {
        id: user.id,
        name: user.name,
        role: user.role,
      };

      res.redirect("/");
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
