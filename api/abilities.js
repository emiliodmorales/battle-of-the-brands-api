import express from "express";
const router = express.Router();
export default router;

import { getAbilities, getAbilityById } from "#db/queries/abilities";

router.get("/", async (req, res) => {
  const abilities = await getAbilities();
  res.send(abilities);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const ability = await getAbilityById(id);
  res.send(ability);
});
