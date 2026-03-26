import db from "#db/client";

/**
 * @typedef {object} AbilityInfo
 * @property {string} name
 * @property {string} description
 * @property {number} cost
 */

/**
 * @typedef {object} ID
 * @property {number} id
 */

/**
 * @typedef {AbilityInfo & ID} Ability
 */

/**
 * Creates a new ability
 * @param {AbilityInfo}
 * @returns {Promise<Ability>} The new ability
 */
export async function createAbility({ cost, name, description }) {
  const sql = `
    INSERT INTO abilities
      (cost, name, description)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [ability],
  } = await db.query(sql, [cost, name, description]);
  return ability;
}

/**
 * @returns {Promise<Ability[]>} An array containing all abilities
 */
export async function getAbilities() {
  const sql = "SELECT * FROM abilities";
  const { rows: abilities } = await db.query(sql);
  return abilities;
}

/**
 * Get an ability by its id. Returns null when there is no ability with the given id.
 * @param {number} id Ability ID to retrieve
 * @returns {Promise<Ability>} The ability with the given id
 */
export async function getAbilityById(id) {
  const sql = "SELECT * FROM abilities WHERE id= $1";
  const {
    rows: [abilities],
  } = await db.query(sql, [id]);
  return abilities;
}
