const { Router } = require("express");
const User = require("../models").user;
const { toJWT } = require("../auth/jwt");
const router = new Router();
const bcrypt = require("bcrypt");
const authMiddleware = require("../auth/middleware");

//router postwith end point at /signup

router.get("/test-auth", authMiddleware, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.email}.`,
  });
});

router.post("/login", async (req, res, next) => {
  // Here goes the login logic.
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(400).send({
      message: "Please supply a valid email and password",
    });
  } else {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(400).send({
        message: "User with this email does not exist",
      });
    } else if (bcrypt.compareSync(password, user.password)) {
      const jwt = toJWT({ userId: user.id });
    } else {
      res.status(400).send({
        message: "Password was incorrect",
      });
    }
    res.send({
      jwt: toJWT({ userId: 1 }),
    });
  }
});

module.exports = router;
