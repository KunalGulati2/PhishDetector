import pool from "../utils/db.js";

export async function logUrlCheck(userId, url, isPhishing, score, label) {
  const query = `
    INSERT INTO url_checks (user_id, url, is_phishing, score, label)
    VALUES ($1, $2, $3, $4, $5)
  `;
  await pool.query(query, [userId, url, isPhishing, score, label]);
}

export const getUserHistory = async (userId) => {
  const result = await pool.query(
    `SELECT url, is_phishing, score, label, checked_at 
     FROM url_checks 
     WHERE user_id = $1 
     ORDER BY checked_at DESC`,
    [userId]
  );
  return result.rows;
};