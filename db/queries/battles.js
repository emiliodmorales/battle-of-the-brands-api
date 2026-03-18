import db from "#db/client";

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
