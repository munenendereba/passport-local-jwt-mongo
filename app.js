import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morganbody from "morgan-body";
import { configDotenv } from "dotenv";

import { router as routes } from "./routes/routes.js";
import { router as secureRoute } from "./routes/secure-routes.js";
import("./auth/auth.js");

configDotenv();

const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;

const app = express();

morganbody(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use("/user", passport.authenticate("jwt", { session: false }), secureRoute);

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(3000, () => {
  console.log("Server started.");
});
