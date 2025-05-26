import { getUserHistory } from "../models/historyModel.js";

export const getHistory = async (req, res) => {
  const history = await getUserHistory(req.userId);
  res.json(history);
};
