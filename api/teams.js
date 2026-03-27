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
} from "#db/queries/teams";
import { addCharacterToTeam } from "#db/queries/teams_characters";
import { getTeamHistory } from "#db/queries/battles";

router.get("/", async (req, res) => {
  const teams = await allTeams();
  res.send(teams);
});

router.post(
  "/",
  requireUser,
  requireBody(["name", "characterIds"]),
  async (req, res) => {
    try {
      const { name, characterIds } = req.body;
      if (!Array.isArray(characterIds) || characterIds.length !== 5) {
        return res.status(400).send("You must select exactly 5 characters.");
      }
      // Create the team
      const team = await createTeam({ userId: req.user.id, name });
      for (let i = 0; i < characterIds.length; i++) {
        await addCharacterToTeam({
          teamId: team.id,
          characterId: characterIds[i],
          position: i + 1,
        });
      }
      res.status(201).send(team);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to create team.");
    }
  },
);

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

function requireTeamOwner(req, res, next) {
  if (!req.team) return res.status(400).send("Team not loaded.");
  if (req.user?.id !== req.team.user_id)
    return res.status(401).send("Unauthorized");
  next();
}

router.put("/:id", requireUser, requireTeamOwner, async (req, res) => {
  const char = await updateTeam({
    id: req.team.id,
    userId: req.team.user_id,
    name,
  });
  res.send(char);
});

router.delete("/:id", requireUser, requireTeamOwner, async (req, res, next) => {
  try {
    await deleteTeam(req.team.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
