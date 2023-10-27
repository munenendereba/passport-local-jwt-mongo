import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morganbody from "morgan-body";

import { router as routes } from "./routes/routes.js";
import { router as secureRoute } from "./routes/secure-routes.js";
import { UserModel } from "./model/model.js";
import("./auth/auth.js");

mongoose.connect("mongodb://127.0.0.1:27017/passport-jwt", {
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
