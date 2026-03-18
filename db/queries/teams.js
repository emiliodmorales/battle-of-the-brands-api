import db from "#db/client";

export async function createTeam({ userId, name }) {
  const sql = `
  INSERT INTO teams
    (user_id, name)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const {
    rows: [teams],
  } = await db.query(sql, [userId, name]);
  return teams;
}

export async function allTeams() {
  const sql = "SELECT * FROM teams";
  const { rows: teams } = await db.query(sql);
  return teams;
}

export async function getTeam(id) {
  const sql = "SELECT * FROM teams WHERE id= $1";
  const {
    rows: [teams],
  } = await db.query(sql, [id]);
  return teams;
}

export async function updateTeam({ id, userId, name }) {
  const sql = `
  UPDATE teams
  SET
    user_id = $2
    name = $3
  WHERE id = $1
  RETURNING *
  `;

  const {
    rows: [teams],
  } = await db.query(sql, [id, userId, name]);
  return teams;
}

export async function deleteTeam(id) {
  const sql = `
  DELETE FROM teams
  WHERE id = $1
  RETURNING *
  `;

  const {
    rows: [teams],
  } = await db.query(sql, [id]);
  return teams;
}
