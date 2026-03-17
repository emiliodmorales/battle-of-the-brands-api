import db from "#db/client";

export async function createCharacter({
  name,
  description,
  image,
  hp,
  attack,
  defense,
  abilityId,
  userId,
}) {
  const sql = `
    INSERT INTO "characters"
      (name, description, image, hp, attack, defense, ability_id, user_id)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const {
    rows: [character],
  } = await db.query(sql, [
    name,
    description,
    image,
    hp,
    attack,
    defense,
    abilityId,
    userId,
  ]);
  return character;
}
