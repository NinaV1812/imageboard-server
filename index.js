const { request } = require("express");
const express = require("express");
const imageRouter = require("./routers/image");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth.js");

const app = express();
const port = 4000;
const jsonParser = express.json();

app.use(jsonParser);

app.use("/users", userRouter);
app.use("/images", imageRouter);
app.use("/auth", authRouter);

app.listen(port, () => console.log(`Listening on: ${port}`));
