import pool from "../utils/db.js";

export async function getUserHistory(userId) {
  const result = await pool.query(
    `SELECT url, is_phishing, score, label, checked_at 
     FROM url_checks 
     WHERE user_id = $1 
     ORDER BY checked_at DESC`,
    [userId]
  );

  return result.rows;
}
