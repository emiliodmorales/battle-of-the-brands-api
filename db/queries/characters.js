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

export async function getAllCharacters() {
  const sql = `
    SELECT * FROM "characters"
  `;
  const { rows: characters } = await db.query(sql);
  return characters;
}

export async function getCharacterById(id) {
  const sql = `
    SELECT * FROM "characters"
    WHERE id=$1
  `;
  const {
    rows: [character],
  } = await db.query(sql, [id]);
  return character;
}

export async function updateCharacterById({
  id,
  userId,
  name,
  description,
  image,
  hp,
  attack,
  defense,
  abilityId,
}) {
  const sql = `
    UPDATE "characters"
    SET
      name = $3,
      description = $4,
      image = $5,
      hp = $6,
      attack = $7,
      defense = $8,
      ability_id = $9
    WHERE id=$1 AND user_id=$2
  `;
await db.query(sql, [
    id,
    userId,
    name,
    description,
    image,
    hp,
    attack,
    defense,
    abilityId,
  ]);
}
