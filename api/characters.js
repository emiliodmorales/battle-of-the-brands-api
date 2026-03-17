import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res) => {
  // TODO - Get characters
  res.send();
});

router.post(
  "/",
  requireUser,
  requireBody(["name", "description", "image"]),
  async (req, res) => {
    // TODO - Make new character
    // To clarify, are we still doing randomized HP/ATK/DEF, not user-input?
    // Because if we're randomizing, we should probably do so in the maker function
    res.status(201).send();
  },
);

router.param("id", async (req, res, next, id) => {
  // TODO - Get character by ID
  const char = await getCharacterById(id);
  if (!char) return res.status(404).send("Character not found.");
  req.character = char;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.character);
});

// In these two, remember to check if req.user id matches the character's creator's id

router.put("/:id", requireUser, async (req, res) => {
  // TODO - Edit character
  res.send();
});

router.delete("/:id", requireUser, async (req, res) => {
  // TODO - Delete character
});
