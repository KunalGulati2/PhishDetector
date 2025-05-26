import express from "express";
import { checkUrl } from "../controllers/urlController.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/check", authMiddleware, checkUrl);

export default router;
