import db from "#db/client";

// Basic character query
const SELECT_CHARACTERS = `
    SELECT
      characters.*,
      users.username,
      abilities.name AS ability_name
    FROM "characters"
    LEFT OUTER JOIN "users" ON users.id = characters.user_id
    LEFT OUTER JOIN "abilities" ON abilities.id = characters.ability_id
    `;

/**
 * Represents a character
 * @typedef {object} characterInfo
 * @property {string} name - The name of the character
 * @property {string} description - A short description of the character
 * @property {string} image - A url to an image of the character
 * @property {number} hp - Character's health
 * @property {number} attack - Character's damage
 * @property {number} defense - Character's block
 * @property {number} abilityId - Id of character's ability
 * @property {number} userId - Id of character's creator
 */
/**
 * Create a new character
 * @param {characterInfo} characterInfo
 * @returns the new character
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
 * @returns An array containing all characters
 */
export async function getAllCharacters() {
  const sql = SELECT_CHARACTERS;
  const { rows: characters } = await db.query(sql);
  return characters;
}

/**
 * Get a character by its id
 * @param {number} id - Id of the character to retrieve
 * @returns the character with the given id
 */
export async function getCharacterById(id) {
  const sql = `
    ${SELECT_CHARACTERS}
    WHERE characters.id=$1
  `;
  const {
    rows: [character],
  } = await db.query(sql, [id]);
  return character;
}

/**
 * Get owned characters by user's id
 * @param {number} id - Id of the user
 * @returns an array of characters owned by the user
 */
export async function getCharactersByUserId(id) {
  const sql = `
    ${SELECT_CHARACTERS}
    WHERE characters.user_id=$1
  `;
  const { rows: characters } = await db.query(sql, [id]);
  return characters;
}

/**
 * Update a character with the given id
 * @param {characterInfo} characterInfo
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
 * Delete a character by its id
 * @param {number} id - The id of the character to delete
 * @returns the deleted character
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
 * Represents a battle
 * @typedef {object} battleInfo
 * @property {number} challenger - The id of the challenging team
 * @property {number} defender - The id of the defending team
 * @property {number} winner - The id of the winning team
 */
/**
 * @typedef {object} battleHistory
 * @property {number} total_battles - The total number of battles participated in
 * @property {number} wins - How many battles its team has won
 * @property {battleInfo[]} battle_history - An array of battles participated in
 */
/**
 * Get the battle history of a character by its id
 * @param {number} id - The id of the character
 * @returns {battleHistory} the character's battle history
 */
export async function getCharacterHistory(id) {
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
        JOIN "teams_characters" ON teams_characters.character_id=$1
        WHERE winner=teams_characters.team_id
      ) AS wins
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
 * Get a user's favorite characters
 * @param {number} id - id of the user
 * @returns an array of the user's favorite characters
 */
export async function getFavoriteCharacters(id) {
  const sql = `
    ${SELECT_CHARACTERS}
    JOIN favorite_characters
    ON favorite_characters.character_id = characters.id
    WHERE favorite_characters.user_id = $1
  `;
  const {
    rows: [character],
  } = await db.query(sql, [id]);
  return character;
}
