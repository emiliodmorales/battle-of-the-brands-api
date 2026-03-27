import db from "#db/client";

/**
 * Basic character query
 */
const CHARACTERS_FRAGMENT = `
    SELECT
      characters.*,
      users.username,
      abilities.name AS ability_name
    FROM "characters"
    LEFT OUTER JOIN "users" ON users.id = characters.user_id
    LEFT OUTER JOIN "abilities" ON abilities.id = characters.ability_id
    `;

/**
 * @typedef {object} CharacterInfo
 * @property {string} name
 * @property {string} description
 * @property {string} image
 * @property {number} hp
 * @property {number} attack
 * @property {number} defense
 * @property {number} abilityId
 * @property {number} userId
 */

/**
 * @typedef {object} ID
 * @property {number} id
 */

/**
 * @typedef {CharacterInfo & ID} Character
 */

/**
 * @param {CharacterInfo}
 * @returns {Promise<Character>} the new character
 */
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

/**
 * @returns {Promise<Character[]>} An array containing all characters
 */
export async function getAllCharacters() {
  const sql = CHARACTERS_FRAGMENT;
  const { rows: characters } = await db.query(sql);
  return characters;
}

/**
 * @param {number} id Id of the character to retrieve
 * @returns {Promise<Character>} the character with the given id
 */
export async function getCharacterById(id) {
  const sql = `
    ${CHARACTERS_FRAGMENT}
    WHERE characters.id=$1
  `;
  const {
    rows: [character],
  } = await db.query(sql, [id]);
  return character;
}

/**
 * @param {number} id Id of the user
 * @returns {Promise<Character[]>} an array of characters owned by the user
 */
export async function getCharactersByUserId(id) {
  const sql = `
    ${CHARACTERS_FRAGMENT}
    WHERE characters.user_id=$1
  `;
  const { rows: characters } = await db.query(sql, [id]);
  return characters;
}

/**
 * @param {Character} characterInfo
 */
export async function updateCharacterById({
  id,
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

/**
 * @param {number} id
 * @returns {Promise<Character>}
 */
export async function deleteCharacterById(id) {
  const sql = `
    DELETE FROM "characters"
    WHERE id=$1
    RETURNING *
  `;
  const {
    rows: [character],
  } = await db.query(sql, [id]);
  return character;
}

/**
 * Get a user's favorite characters
 * @param {number} id id of the user
 * @returns {Promise<Character[]>} an array of the user's favorite characters
 */
export async function getFavoriteCharacters(id) {
  const sql = `
    ${CHARACTERS_FRAGMENT}
    JOIN favorite_characters
    ON favorite_characters.character_id = characters.id
    WHERE favorite_characters.user_id = $1
  `;
  const { rows: characters } = await db.query(sql, [id]);
  return characters;
}

/**
 * Check if a user has favorited a character
 * @param {number} userId The user's id
 * @param {number} characterId The character's id
 * @returns {Promise<boolean>} Whether the character is a favorite
 */
export async function getIsFavoriteCharacter(userId, characterId) {
  const sql = `
    SELECT * FROM "favorite_characters"
    WHERE favorite_characters.user_id = $1
      AND favorite_characters.character_id = $2
  `;
  const {
    rows: [character],
  } = await db.query(sql, [userId, characterId]);
  return character !== undefined;
}

/**
 * Favorite a character
 * @param {number} userId The user's id
 * @param {number} characterId The character's id
 */
export async function addFavoriteCharacter(userId, characterId) {
  const sql = `
    INSERT INTO "favorite_characters"
      (user_id, character_id)
    VALUES
      ($1, $2)
  `;
  await db.query(sql, [userId, characterId]);
}

/**
 * Unfavorite a character
 * @param {number} userId The user's id
 * @param {number} characterId The character's id
 */
export async function removeFavoriteCharacter(userId, characterId) {
  const sql = `
    DELETE FROM "favorite_characters"
    WHERE user_id = $1 AND character_id = $2
  `;
  await db.query(sql, [userId, characterId]);
}
