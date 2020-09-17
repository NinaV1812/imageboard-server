const { request, response } = require("express");
const express = require("express");
const Image = require("../models").image;
const { toJWT, toData } = require("../auth/jwt");

const { Router } = express;

const router = new Router();

// router.get("/", async (request, response) => {
//   try {
//     // const imageId = request.params.imageId;
//     const allImage = await Image.findAll();
//     response.status(200).send("all the images");
//   } catch (e) {
//     console.error(e);
//   }
// });

// this dosn't work. chek the create format
router.post("/", async (req, res, next) => {
  try {
    const { title, url } = req.body;
    const newImage = await Image.create({
      title,
      url,
    });
    res.json(newImage);
  } catch (e) {
    next(e);
  }
});

// Set up some routs. get one image

// router.get("/:imageId", async (req, res, next) => {
//   try {
//     const imageId = parseInt(req.params.imageId);
//     const image = await Image.findByPk(imageId);
//     if (!image) {
//       res.status(200).send("Image not found");
//     } else {
//       res.send(image);
//     }
//   } catch (e) {
//     next(e);
//   }
// });

router.get("/", (req, res, next) => {
  const limit = Math.min(req.query.limit || 25, 500);
  const offset = req.query.offset || 0;

  Image.findAndCountAll({ limit, offset })
    .then((result) => res.send({ images: result.rows, total: result.count }))
    .catch((error) => next(error));
});

router.get("/auth/messy", async (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
    } catch (e) {
      res.status(400).send("Invalid JWT token");
      next(e);
    }
    const allImage = await Image.findAll();
    res.json(allImage);
  } else {
    res.status(401).send({
      message: "We need valid credentials",
    });
  }
});

module.exports = router;
