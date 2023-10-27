import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

export const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),

  async (req, res, next) => {
    console.log("user:", req.user);

    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
