import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res) => {
  // TODO - Get teams
  res.send();
});

router.post("/", requireUser, requireBody(["name"]), async (req, res) => {
  // TODO - Make new team
  res.status(201).send();
});

router.param("id", async (req, res, next, id) => {
  // TODO - Get team by ID
  const team = await getTeamById(id);
  if (!team) return res.status(404).send("Team not found.");
  req.team = team;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.team);
});

router.get("/:id/history", async (req, res) => {
  // TODO - Get team history
  res.send();
});

router.get("/:id/challenge", requireUser, async (req, res) => {
  // TODO - Battle
  res.send();
});

// In these two, remember to check if req.user id matches the team's creator's id

router.put("/:id", requireUser, async (req, res) => {
  // TODO - Edit team
  res.send();
});

router.delete("/:id", requireUser, async (req, res) => {
  // TODO - Delete team
});
