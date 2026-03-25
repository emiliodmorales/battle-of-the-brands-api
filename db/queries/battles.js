import db from "#db/client";

/**
 * Represents a battle
 * @typedef {object} BattleInfo
 * @property {number} challenger - The id of the challenging team
 * @property {number} defender - The id of the defending team
 * @property {number} winner - The id of the winning team
 */

/**
 * Create a new battle
 * @param {BattleInfo} battleInfo
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
 * @returns {BattleHistory} the team's battle history
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
 * @returns {BattleHistory} the user's battle history
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
    JOIN "teams" ON teams.user_id=$1
    WHERE challenger=teams.id OR defender=teams.id
  `;
  const {
    rows: [history],
  } = await db.query(sql, [id]);
  return history;
}
