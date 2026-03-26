import db from "#db/client";
import bcrypt from "bcrypt";

/**
 * @typedef {object} UserInfo
 * @property {string} username
 * @property {string} password
 * @property {string} image
 */

/**
 * @typedef {object} ID
 * @property {number} id
 */

/**
 * @typedef {UserInfo & ID} User
 */

/**
 * @param {UserInfo}
 * @returns {Promise<User>} the new user
 */
export async function createUser(username, password, image) {
  const sql = `
  INSERT INTO users
    (username, password, image)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword, image]);
  return user;
}

/**
 * @param {UserInfo}
 * @returns {Promise<User>} the user with the given credentials
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
 * @param {number} id - the user's id
 * @returns {Promise<User>} the user with the given id
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
 * @returns {Promise<User[]>} an array containing all users
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
 * @returns {Promise<User[]>} everyone who FOLLOWS the user
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
 * @returns {Promise<User[]>} everybody who the USER follows
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

/**
 * @param {number} followerId user id of the follower
 * @param {number} userId user id being followed
 * @returns {Promise<boolen>} whether the follower is following the user
 */
export async function getUserIsFollowing(followerId, userId) {
  const sql = `
    SELECT FROM followers
    WHERE follower = $1 AND following = $2
  `;
  const {
    rows: [user],
  } = await db.query(sql, [followerId, userId]);
  return user !== undefined;
}

/**
 * @param {number} followerId user id of the follower
 * @param {number} userId user id being followed
 */
export async function addFollower(followerId, userId) {
  const sql = `
    INSERT INTO followers
      (follower, following)
    VALUES
      ($1, $2)
  `;
  await db.query(sql, [followerId, userId]);
}

/**
 * @param {number} followerId user id of the follower
 * @param {number} userId user id being followed
 */
export async function removeFollower(followerId, userId) {
  const sql = `
    DELETE FROM followers
    WHERE follower = $1 AND following = $2
  `;
  await db.query(sql, [followerId, userId]);
}
