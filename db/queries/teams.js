import db from "#db/client";

/**
 * For functions where we want to grab the characters associated with the team as well
 */
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
 * @typedef {object} TeamInfo
 * @property {number} userId
 * @property {string} name
 */

/**
 * @typedef {object} ID
 * @property {number} id
 */

/**
 * @typedef {TeamInfo & ID} Team
 */

/**
 * @param {TeamInfo}
 * @returns {Promise<Team>} the new team
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
 * @returns {Promise<Team[]>} an array containing all teams
 */
export async function allTeams() {
  const sql = `SELECT teams.*, ${CHARACTERS_FRAGMENT}
    FROM teams`;
  const { rows: teams } = await db.query(sql);
  return teams;
}

/**
 * @param {number} id Id of the team
 * @returns {Promise<Team>} the team with the given id
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
 * @param {number} id The id of the user
 * @returns {Promise<Team[]>} an array containing teams created by the given user
 */
export async function getTeamsByUserId(id) {
  const sql = `SELECT teams.*, ${CHARACTERS_FRAGMENT}
    FROM teams WHERE user_id= $1`;
  const { rows: teams } = await db.query(sql, [id]);
  return teams;
}

/**
 * @param {number} id The id of the team to update
 * @param {number} userId The id of the user
 * @param {string} name The name of the team
 * @returns {Promise<Team>} The updated team
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
 * @param {number} id The id of the team
 * @returns {Promise<Team>} the deleted team
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
 * @param {number} id user id
 * @returns {Promise<Team>}
 */
export async function getFavoriteTeams(id) {
  const sql = `SELECT teams.*, ${CHARACTERS_FRAGMENT}
    FROM teams
    JOIN favorite_teams
    ON teams.id = favorite_teams.team_id
    WHERE favorite_teams.user_id = $1`;
  const { rows: teams } = await db.query(sql, [id]);
  return teams;
}

/**
 * Check if a user has favorited a team
 * @param {number} userId - The user's id
 * @param {number} teamId - The team's id
 * @returns {Promise<Boolean>} Whether the team is a favorite
 */
export async function getIsFavoriteTeam(userId, teamId) {
  const sql = `
    SELECT * FROM "favorite_teams"
    WHERE favorite_teams.user_id = $1
      AND favorite_teams.team_id = $2
  `;
  const {
    rows: [team],
  } = await db.query(sql, [userId, teamId]);
  return team !== undefined;
}

/**
 * Favorite a team
 * @param {number} userId - The user's id
 * @param {number} teamId - The team's id
 */
export async function addFavoriteTeam(userId, teamId) {
  const sql = `
    INSERT INTO "favorite_teams"
      (user_id, team_id)
    VALUES
      ($1, $2)
  `;
  await db.query(sql, [userId, teamId]);
}

/**
 * Unfavorite a team
 * @param {number} userId - The user's id
 * @param {number} teamId - The team's id
 */
export async function removeFavoriteTeam(userId, teamId) {
  const sql = `
    DELETE FROM "favorite_teams"
    WHERE user_id = $1 AND team_id = $2
  `;
  await db.query(sql, [userId, teamId]);
}

/**
 * Get a random team
 * @returns {Promise<Team>} Random extant team
 */
export async function getRandomTeam() {
  const sql = `
    SELECT teams.*, ${CHARACTERS_FRAGMENT}
    FROM teams
    ORDER BY RANDOM()
    LIMIT 1
  `;
  await db.query(sql);
}
