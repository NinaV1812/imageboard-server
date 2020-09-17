const express = require("express");
const User = require("../models").user;
const bcrypt = require("bcrypt");

const { Router } = express;

const router = new Router();

router.get("/users", async (request, response) => {
  try {
    // const userId = request.params.userId;
    const allUser = await User.findAll();
    response.status(200).send("all the users");
  } catch (e) {
    console.error(e);
  }
});

// (??)Set up some routs. Add new user and "npm install bcrypy"

router.post("/", async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      res.status(400).send("missing parameters");
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        fullName,
      });
      res.json(newUser);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
