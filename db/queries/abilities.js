import db from "#db/client";

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

export async function getAbilities() {
  const sql = "SELECT * FROM abilities";
  const { rows: abilities } = await db.query(sql);
  return abilities;
}

export async function getAbilityById(id) {
  const sql = "SELECT * FROM abilities WHERE id= $1";
  const {
    rows: [abilities],
  } = await db.query(sql, [id]);
  return abilities;
}
