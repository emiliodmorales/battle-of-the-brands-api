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
  const sql = `SELECT teams.*,
    (
      SELECT json_agg(characters)
      FROM characters
        JOIN teams_characters
        ON characters.id = teams_characters.character_id
      WHERE teams_characters.team_id = teams.id
    ) AS characters
    FROM teams`;
  const { rows: teams } = await db.query(sql);
  return teams;
}

export async function getTeam(id) {
  const sql = `SELECT teams.*,
    (
      SELECT json_agg(characters)
      FROM characters
        JOIN teams_characters
        ON characters.id = teams_characters.character_id
      WHERE teams_characters.team_id = teams.id
    ) AS characters
    FROM teams WHERE id= $1`;
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

export async function getTeamHistory(id) {
  const sql = `
    SELECT
      json_agg(battles) AS battle_history,
      count(battles) AS total_battles,
      (
        SELECT count(battles)
        FROM battles
        WHERE winner=$1
      ) AS wins
    FROM "battles"
    WHERE challenger=$1 OR defender=$1
  `;
  const { rows: history } = await db.query(sql, [id]);
  return history;
}
