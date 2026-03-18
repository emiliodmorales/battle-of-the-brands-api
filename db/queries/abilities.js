import db from "#db/client";

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
