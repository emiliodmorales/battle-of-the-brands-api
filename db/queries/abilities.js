import db from "#db/client";

/**
 * Represents an ability
 * @typedef {object} abilityInfo
 * @property {string} name
 * @property {string} description
 * @property {number} cost
 */
/**
 * Create an ability
 * @param {abilityInfo} abilityInfo
 * @returns the new ability
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
 * @returns An array containing all abilities
 */
export async function getAbilities() {
  const sql = "SELECT * FROM abilities";
  const { rows: abilities } = await db.query(sql);
  return abilities;
}

/**
 * Get an ability by its id
 * @param {number} id Ability ID to retrieve
 * @returns the ability with the given id
 * @returns null, if no ability has the given id
 */
export async function getAbilityById(id) {
  const sql = "SELECT * FROM abilities WHERE id= $1";
  const {
    rows: [abilities],
  } = await db.query(sql, [id]);
  return abilities;
}
