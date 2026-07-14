const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.showRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    layout: "layouts/auth",
  });
};

exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    User.createUser(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: "Employee",
      },
      (err) => {
        if (err) {
          return res.send(err.message);
        }

        res.redirect("/login");
      },
    );
  } catch (err) {
    res.send(err.message);
  }
};
exports.showLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    layout: "layouts/auth",
  });
};
exports.login = (req, res) => {
  User.findByEmail(req.body.email, async (err, user) => {
    if (err) return res.send(err.message);

    if (!user) return res.send("Invalid email or password.");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!validPassword) return res.send("Invalid email or password.");

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    res.redirect("/");
  });
};
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
