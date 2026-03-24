import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserById,
  getUserByUsernameAndPassword,
  getUsers,
  getUserHistory,
  getUserFollowers,
  getUserFollowing,
} from "#db/queries/users";
import { getFavoriteTeams, getTeamsByUserId } from "#db/queries/teams";
import {
  getFavoriteCharacters,
  getCharactersByUserId,
  addFavoriteCharacter,
  removeFavoriteCharacter,
  getIsFavoriteCharacter,
} from "#db/queries/characters";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);

    const token = await createToken({ id: user.id });
    res.status(201).send(token);
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password.");

    const token = await createToken({ id: user.id });
    res.send(token);
  });

router.get("/profile", requireUser, async (req, res) => {
  res.send(req.user);
});

router.get("/favorite_teams", requireUser, async (req, res) => {
  const faves = await getFavoriteTeams(req.user.id);
  res.send(faves);
});

router.get("/favorite_characters", requireUser, async (req, res) => {
  const faves = await getFavoriteCharacters(req.user.id);
  res.send(faves);
});

router.get("/favorite_characters/:charId", requireUser, async (req, res) => {
  const { charId } = req.params;
  const fave = await getIsFavoriteCharacter(req.user.id, charId);
  res.send(fave);
});

router.post(
  "/favorite_characters",
  requireBody(["id"]),
  requireUser,
  async (req, res) => {
    const { id } = req.body;
    await addFavoriteCharacter(req.user.id, id);
    res.sendStatus(201);
  },
);

router.delete(
  "/favorite_characters",
  requireBody(["id"]),
  requireUser,
  async (req, res) => {
    const { id } = req.body;
    await removeFavoriteCharacter(req.user.id, id);
    res.sendStatus(204);
  },
);

router.param("id", async (req, res, next, id) => {
  const user = await getUserById(id);
  if (!user) return res.status(404).send("User not found.");
  // NOT req.user
  // req.user is taken by the user who is LOGGED IN
  req.aboutUser = user;
  next();
});

router.get("/:id", async (req, res) => {
  // Getting a specific user based on ID
  res.send(req.aboutUser);
});

router.get("/:id/history", async (req, res) => {
  const history = await getUserHistory(req.aboutUser.id);
  res.send(history);
});

router.get("/:id/teams", async (req, res) => {
  const teams = await getTeamsByUserId(req.aboutUser.id);
  res.send(teams);
});

router.get("/:id/characters", async (req, res) => {
  const chars = await getCharactersByUserId(req.aboutUser.id);
  res.send(chars);
});

router.get("/:id/followers", async (req, res) => {
  const followers = await getUserFollowers(req.aboutUser.id);
  res.send(followers);
});

router.get("/:id/following", async (req, res) => {
  const following = await getUserFollowing(req.aboutUser.id);
  res.send(following);
});
