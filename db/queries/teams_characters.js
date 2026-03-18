import db from "#db/client";

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
