import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

import {
  createCharacter,
  getAllCharacters,
  getCharacterById,
  updateCharacterById,
  deleteCharacterById,
} from "#db/queries/characters";

router.get("/", async (req, res) => {
  const chars = await getAllCharacters();
  res.send(chars);
});

router.post(
  "/",
  requireUser,
  requireBody([
    "name",
    "description",
    "image",
    "hp",
    "attack",
    "defense",
    "abilityId",
  ]),
  async (req, res) => {
    const char = await createCharacter({
      name,
      description,
      image,
      hp,
      attack,
      defense,
      abilityId,
      user_id: req.user.id,
    });
    res.status(201).send();
  },
);

router.param("id", async (req, res, next, id) => {
  const char = await getCharacterById(id);
  if (!char) return res.status(404).send("Character not found.");
  req.character = char;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.character);
});

// In these two, remember to check if req.user id matches the character's creator's id
router.use(function (req, res, next) {
  if (req.user?.id !== req.character.user_id)
    return res.status(401).send("Unauthorized");
  next();
});

router.put(
  "/:id",
  requireBody([
    "name",
    "description",
    "image",
    "hp",
    "attack",
    "defense",
    "abilityId",
  ]),
  async (req, res) => {
    const { id, user_id } = req.character;
    const char = await updateCharacterById({
      id,
      user_id,
      name,
      description,
      image,
      hp,
      attack,
      defense,
      abilityId,
    });
    res.status(204).send(char);
  },
);

router.delete("/:id", requireUser, async (req, res) => {
  await deleteCharacterById(req.character.id).then(() =>
    res.status(204).send(),
  );
});
