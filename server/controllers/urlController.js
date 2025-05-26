import { evaluateHeuristics } from "../services/heuristics.js";
import { logUrlCheck } from "../models/urlModel.js";
import { isValidUrl } from "../utils/urlValidator.js";

export const checkUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const { score, isPhishing, label } = await evaluateHeuristics(url);

    // Log to DB
    await logUrlCheck(req.userId, url, isPhishing, score, label);

    return res.json({ phishing: isPhishing, score, label });
  } catch (error) {
    console.error("Error in checkUrl:", error.message || error);
    return res.status(500).json({ error: "Something went wrong while checking the URL." });
  }
};
