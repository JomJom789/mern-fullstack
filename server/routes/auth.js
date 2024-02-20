import express from "express";

import {
  login,
  logout,
  google,
  verify,
  forgotPassword,
  resetPassword,
  activeStatus,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.patch("/logout/:id", logout);
router.post("/google", google);
router.get("/:id/verify/:token/", verify)
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.patch("/active-status/:id/:online", activeStatus);

export default router;
