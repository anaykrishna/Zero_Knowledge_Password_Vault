import { pool } from "../../config/db.js";

export async function getAllForUser(userId) {
  const result = await pool.query(
    `SELECT id, service, username, encrypted_password
    FROM vault_entries
    WHERE user_id = $1
    ORDER BY created_at DESC`,
    [userId]
  );
  console.log("Vault entries:", result.rows);
  return result.rows;
}

export async function save({ userId, service, username, encrypted_password }) {
  await pool.query(
    `INSERT INTO vault_entries (user_id, service, username, encrypted_password)
    VALUES ($1, $2, $3, $4)`,
    [userId, service, username, encrypted_password]
  );
}

export async function deleteEntry(userId, entryId) {
  const result = await pool.query(
    `DELETE FROM vault_entries
    WHERE id = $1 AND user_id = $2
    RETURNING id`,
    [entryId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Entry not found");
  }

  return result.rows[0];
}

export async function updateEntry(userId, entryId, { service, username, encrypted_password}) {
  const result = await pool.query(
    `UPDATE vault_entries
    SET service = $1, username = $2, encrypted_password = $3
    WHERE id = $4 and user_id = $5
    RETURNING id, service, username, encrypted_password`,
    [service, username, encrypted_password, entryId, userId]
  );

  if (result.rows[0].length === 0){
    throw new Error("Update Not Successful(QUERY EXECUTION ERROR)!!!");
  }

  return result.rows[0];
}