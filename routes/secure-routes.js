import express from "express";

export const router = express.Router();

router.get("/profile", (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query.access_token,
  });
});
