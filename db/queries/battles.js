import db from "#db/client";

/**
 * @typedef {object} BattleHistory
 * @property {BattleTeam[]} battle_history
 * @property {number} total_battles
 * @property {number} wins
 * @property {number} losses
 * @property {number} draws
 */

/**
 * @typedef {object} BattleTeam
 * @property {Team} challenger
 * @property {Team} defender
 * @property {Team} winner
 */

/**
 * @typedef {object} Team
 * @property {number} id
 * @property {number} userId
 * @property {string} name
 */

/**
 * @typedef {object} Battle
 * @property {number} challenger
 * @property {number} defender
 * @property {number} winner
 */

/**
 * @typedef {object} ID
 * @property {number} id
 */

/**
 * @typedef {BattleInfo & ID} Battle
 */

/**
 * Creates a BattleHistory
 */
const BATTLE_HISTORY_FRAGMENT = `
  json_agg(json_build_object(
    'challenger', (SELECT teams FROM teams WHERE teams.id=battles.challenger),
    'defender', (SELECT teams FROM teams WHERE teams.id=battles.defender),
    'winner', (SELECT teams FROM teams WHERE teams.id=battles.winner)
  )) AS battle_history
 `;

/**
 * Create a new battle
 * @param {BattleInfo}
 * @returns {Promise<Battle>} The new battle
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

/**
 * Get the battle history of a character by its id
 * @param {number} id The id of the character
 * @returns {Promise<BattleHistory>} the character's battle history
 */
export async function getCharacterHistory(id) {
  const sql = `
    SELECT
      ${BATTLE_HISTORY_FRAGMENT},
      count(battles) AS total_battles,
      (
        SELECT count(battles)
        FROM battles
        JOIN "teams_characters" ON teams_characters.character_id=$1
        WHERE winner=teams_characters.team_id
      ) AS wins,
      (
        SELECT count(battles)
        FROM battles
        JOIN "teams_characters" ON teams_characters.character_id=$1
        WHERE (challenger=teams_characters.team_id OR defender=teams_characters.team_id) AND winner!=teams_characters.team_id
      ) AS losses,
      (
        SELECT count(battles)
        FROM battles
        JOIN "teams_characters" ON teams_characters.character_id=$1
        WHERE (challenger=teams_characters.team_id OR defender=teams_characters.team_id) AND winner IS NULL
      ) AS draws
    FROM "battles"
    JOIN "teams_characters" ON teams_characters.character_id=$1
    WHERE challenger=teams_characters.team_id OR defender=teams_characters.team_id
  `;
  const {
    rows: [history],
  } = await db.query(sql, [id]);
  return history;
}

/**
 * Get the battle history of a team by its id
 * @param {number} id - The id of the team
 * @returns {Promise<BattleHistory>} the team's battle history
 */
export async function getTeamHistory(id) {
  const sql = `
    SELECT
      ${BATTLE_HISTORY_FRAGMENT},
      count(battles) AS total_battles,
      (
        SELECT count(battles)
        FROM battles
        WHERE winner=$1
      ) AS wins,
      (
        SELECT count(battles)
        FROM battles
        WHERE (challenger=$1 OR defender=$1) AND winner!=$1
      ) AS losses,
      (
        SELECT count(battles)
        FROM battles
        WHERE (challenger=$1 OR defender=$1) AND winner IS NULL
      ) AS draws
    FROM "battles"
    WHERE challenger=$1 OR defender=$1
  `;
  const {
    rows: [history],
  } = await db.query(sql, [id]);
  return history;
}

/**
 * Get the battle history of a user by their id
 * @param {number} id - The id of the user
 * @returns {Promise<BattleHistory>} the user's battle history
 */
export async function getUserHistory(id) {
  const sql = `
    SELECT
      ${BATTLE_HISTORY_FRAGMENT},
      count(battles) AS total_battles,
      (
        SELECT count(battles)
        FROM battles
        JOIN "teams" ON teams.user_id=$1
        WHERE winner=teams.id
      ) AS wins,
      (
        SELECT count(battles)
        FROM battles
        WHERE (challenger=teams.id OR defender=teams.id) AND winner!=teams.id
      ) AS losses,
      (
        SELECT count(battles)
        FROM battles
        WHERE (challenger=teams.id OR defender=teams.id) AND winner IS NULL
      ) AS draws
    FROM "battles"
    JOIN "teams" ON teams.user_id=$1
    WHERE challenger=teams.id OR defender=teams.id
    GROUP BY teams.id
  `;
  const {
    rows: [history],
  } = await db.query(sql, [id]);
  return history;
}
