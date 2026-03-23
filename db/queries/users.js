import db from "#db/client";
import bcrypt from "bcrypt";

export async function createUser(username, password) {
  const sql = `
  INSERT INTO users
    (username, password)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

export async function getUsers() {
  const sql = `
  SELECT *
  FROM users
  `;
  const { rows: users } = await db.query(sql);
  return users;
}

export async function getUserHistory(id) {
  const sql = `
    SELECT
      json_agg(battles) AS battle_history,
      count(battles) AS total_battles,
      (
        SELECT count(battles)
        FROM battles
        JOIN "teams" ON teams.user_id=$1
        WHERE winner=teams.id
      ) AS wins
    FROM "battles"
    JOIN "teams" ON teams.user_id=$1
    WHERE challenger=teams.id OR defender=teams.id
  `;
  const { rows: history } = await db.query(sql, [id]);
  return history;
}

/** Gets everyone who FOLLOWS the user */
export async function getUserFollowers(id) {
  const sql = `
    SELECT *
    FROM users
    JOIN followers
    ON users.id = followers.follower
    WHERE followers.following = $1
  `;
  const { rows: users } = await db.query(sql, [id]);
  return users;
}

/** Gets everybody who the USER follows */
export async function getUserFollowing(id) {
  const sql = `
    SELECT *
    FROM users
    JOIN followers
    ON users.id = followers.following
    WHERE followers.follower = $1
  `;
  const { rows: users } = await db.query(sql, [id]);
  return users;
}
