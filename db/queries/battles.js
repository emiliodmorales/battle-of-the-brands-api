import db from "#db/client";

/**
 * Represents a battle
 * @typedef {object} battleInfo
 * @property {number} challenger - The id of the challenging team
 * @property {number} defender - The id of the defending team
 * @property {number} winner - The id of the winning team
 */
/**
 * Create a new battle
 * @param {battleInfo} battleInfo
 * @returns the new battle
 */
export async function createBattle({ challenger, defender, winner }) {
  const sql = `
    INSERT INTO "battles"
      (challenger, defender, winner)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [battle],
  } = await db.query(sql, [challenger, defender, winner]);
  return battle;
}
