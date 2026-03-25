import db from "#db/client";

// For functions where we want to grab the characters associated with the team as well
const CHARACTERS_FRAGMENT = `
    (
      SELECT json_agg(characters)
      FROM characters
        JOIN teams_characters
        ON characters.id = teams_characters.character_id
      WHERE teams_characters.team_id = teams.id
    ) AS characters
    `;

/**
 * Represents a battle
 * @typedef {object} BattleInfo
 * @property {number} challenger - The id of the challenging team
 * @property {number} defender - The id of the defending team
 * @property {number} winner - The id of the winning team
 */
/**
 * @typedef {object} BattleHistory
 * @property {number} total_battles - The total number of battles participated in
 * @property {number} wins - How many battles its team has won
 * @property {BattleInfo[]} battle_history - An array of battles participated in
 */

/**
 * Create a new team
 * @param {number} userId - The id of the team creator
 * @param {string} name - The name of the team
 * @returns the new team
 */
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

/**
 * @returns an array containing all teams
 */
export async function allTeams() {
  const sql = `SELECT teams.*, ${CHARACTERS_FRAGMENT}
    FROM teams`;
  const { rows: teams } = await db.query(sql);
  return teams;
}

/**
 * Get a team by id
 * @param {number} id - Id of the team
 * @returns the team with the given id
 */
export async function getTeam(id) {
  const sql = `SELECT teams.*,
    ${CHARACTERS_FRAGMENT},
    users.username AS username
    FROM teams
    JOIN users ON teams.user_id = users.id
    WHERE teams.id= $1`;
  const {
    rows: [teams],
  } = await db.query(sql, [id]);
  return teams;
}

/**
 * Get teams belonging to a user
 * @param {number} id - The id of the user
 * @returns an array containing teams created by the given user
 */
export async function getTeamsByUserId(id) {
  const sql = `SELECT teams.*, ${CHARACTERS_FRAGMENT}
    FROM teams WHERE user_id= $1`;
  const { rows: teams } = await db.query(sql, [id]);
  return teams;
}

/**
 * Update a team by its id
 * @param {number} id - The id of the team to update
 * @param {number} userId - The id of the user
 * @param {string} name - The name of the team
 * @returns The updated team
 */
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

/**
 * Delete a team by its id
 * @param {number} id - The id of the team
 * @returns the deleted team
 */
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

/**
 * Get the battle history of a team by its id
 * @param {number} id - The id of the team
 * @returns {BattleHistory} the team's battle history
 */
export async function getTeamHistory(id) {
  const sql = `
    SELECT
      json_agg(json_build_object(
        'challenger', (SELECT teams FROM teams WHERE teams.id=battles.challenger),
        'defender', (SELECT teams FROM teams WHERE teams.id=battles.defender),
        'winner', (SELECT teams FROM teams WHERE teams.id=battles.winner)
      )) AS battle_history,
      count(battles) AS total_battles,
      (
        SELECT count(battles)
        FROM battles
        WHERE winner=$1
      ) AS wins
    FROM "battles"
    WHERE challenger=$1 OR defender=$1
  `;
  const {
    rows: [history],
  } = await db.query(sql, [id]);
  return history;
}

export async function getFavoriteTeams(id) {
  const sql = `SELECT teams.*, ${CHARACTERS_FRAGMENT}
    FROM teams
    JOIN favorite_teams
    ON teams.id = favorite_teams.team_id
    WHERE favorite_teams.user_id = $1`;
  const { rows: teams } = await db.query(sql, [id]);
  return teams;
}
