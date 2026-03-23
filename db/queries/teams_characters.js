import db from "#db/client";

/**
 * @typedef {object} teamCharacter
 * @property {number} teamId - Id of the team
 * @property {number} characterId - Id of the character
 * @property {number} position - Character position in the team
 */
/**
 * Add a character to a team
 * @param {teamCharacter} teamCharacter
 * @returns the new team character
 */
export async function addCharacterToTeam({ teamId, characterId, position }) {
  const sql = `
    INSERT INTO "teams_characters"
      (team_id, character_id, position)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [team_character],
  } = await db.query(sql, [teamId, characterId, position]);
  return team_character;
}
