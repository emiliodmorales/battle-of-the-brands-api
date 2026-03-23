import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

import {
  createTeam,
  allTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  getTeamHistory,
} from "#db/queries/teams";

router.get("/", async (req, res) => {
  const teams = await allTeams();
  res.send(teams);
});

router.post("/", requireUser, requireBody(["name"]), async (req, res) => {
  const team = createTeam({ userId: req.user.id, name });
  res.status(201).send();
});

router.param("id", async (req, res, next, id) => {
  const team = await getTeam(id);
  if (!team) return res.status(404).send("Team not found.");
  req.team = team;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.team);
});

router.get("/:id/history", async (req, res) => {
  const history = await getTeamHistory(req.id);
  res.send(history);
});

router.get("/:id/challenge", requireUser, async (req, res) => {
  // TODO - Battle
  res.send();
});

// In these two, remember to check if req.user id matches the team's creator's id
router.use(function (req, res, next) {
  if (req.user?.id !== req.team.user_id)
    return res.status(401).send("Unauthorized");
  next();
});

router.put("/:id", requireUser, async (req, res) => {
  const char = await updateTeam({
    id: req.team.id,
    userId: req.team.user_id,
    name,
  });
  res.send(char);
});

router.delete("/:id", requireUser, async (req, res) => {
  await deleteTeam(req.team.id).then(() => res.status(204).send());
});
