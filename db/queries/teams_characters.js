import db from "#db/client";

/**
 * @typedef {object} TeamCharacter
 * @property {number} teamId - Id of the team
 * @property {number} characterId - Id of the character
 * @property {number} position - Character position in the team
 */

/**
 * @param {TeamCharacter} teamCharacter
 */
export async function addCharacterToTeam({ teamId, characterId, position }) {
  const sql = `
    INSERT INTO "teams_characters"
      (team_id, character_id, position)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  await db.query(sql, [teamId, characterId, position]);
}
