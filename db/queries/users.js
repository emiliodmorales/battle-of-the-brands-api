import db from "#db/client";
import bcrypt from "bcrypt";

/**
 * Represents a battle
 * @typedef {object} BattleInfo
 * @property {number} challenger - The id of the challenging team
 * @property {number} defender - The id of the defending team
 * @property {number} winner - The id of the winning team
 */
/**
 * @typedef {object} BattleHistory
 * @property {number} total_battles - The total number of battles participated in
 * @property {number} wins - How many battles its team has won
 * @property {BattleInfo[]} battle_history - An array of battles participated in
 */

/**
 * Create a new user
 * @param {string} username - The desired username
 * @param {string} password - An unencrypted password
 * @returns the new user
 */
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

/**
 * Get a user by their credentials
 * @param {string} username - the user's name
 * @param {string} password - the user's unencrypted password
 * @returns the user with the given credentials
 */
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

/**
 * Get a user by their id
 * @param {number} id - the user's id
 * @returns the user with the given id
 */
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

/**
 * @returns an array containing all users
 */
export async function getUsers() {
  const sql = `
  SELECT *
  FROM users
  `;
  const { rows: users } = await db.query(sql);
  return users;
}

/**
 * Get the battle history of a user by their id
 * @param {number} id - The id of the user
 * @returns {BattleHistory} the user's battle history
 */
export async function getUserHistory(id) {
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
        JOIN "teams" ON teams.user_id=$1
        WHERE winner=teams.id
      ) AS wins,
      (
        SELECT count(battles)
        FROM battles
        JOIN "teams_characters" ON teams_characters.character_id=$1
        WHERE (challenger=teams_characters.team_id OR defender=teams_characters.team_id) AND winner!=teams_characters.team_id
      ) AS losses,
      (
        SELECT count(battles)
        FROM battles
        JOIN "teams_characters" ON teams_characters.character_id=$1
        WHERE (challenger=teams_characters.team_id OR defender=teams_characters.team_id) AND winner IS NULL
      ) AS draws
    FROM "battles"
    JOIN "teams" ON teams.user_id=$1
    WHERE challenger=teams.id OR defender=teams.id
  `;
  const {
    rows: [history],
  } = await db.query(sql, [id]);
  return history;
}

/**
 * @returns everyone who FOLLOWS the user
 */
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

/**
 * @returns everybody who the USER follows
 */
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

export async function getUserIsFollowing(followerId, followingId) {
  const sql = `
    SELECT FROM followers
    WHERE follower = $1 AND following = $2
  `;
  const {
    rows: [user],
  } = await db.query(sql, [followerId, followingId]);
  return user !== undefined;
}

export async function addFollower(followerId, followingId) {
  const sql = `
    INSERT INTO followers
      (follower, following)
    VALUES
      ($1, $2)
  `;
  await db.query(sql, [followerId, followingId]);
}

export async function removeFollower(followerId, followingId) {
  const sql = `
    DELETE FROM followers
    WHERE follower = $1 AND following = $2
  `;
  await db.query(sql, [followerId, followingId]);
}
