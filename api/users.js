import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserById,
  getUserByUsernameAndPassword,
  getUsers,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

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
  // TODO - Get history from req.aboutUser
  res.send();
});
