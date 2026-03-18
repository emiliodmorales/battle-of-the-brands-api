import db from "#db/client";
import { createUser, getUsers } from "#db/queries/users";
import {
  createCharacter,
  getAllCharacters,
  getCharacterHistory,
} from "#db/queries/characters";
import { allTeams, createTeam } from "#db/queries/teams";
import { addCharacterToTeam } from "#db/queries/teams_characters";
import { createBattle } from "#db/queries/battles";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
}

async function createPokemon() {
  const ash = await createUser("ash", "ketchum");
  const pokemonTeam = await createTeam({
    userId: ash.id,
    name: "Ash's pokemon",
  });

  const pikachu = await createCharacter({
    name: "Pikachu",
    description: "electric mouse",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: ash.id,
  });
  await addCharacterToTeam({
    teamId: pokemonTeam.id,
    characterId: pikachu.id,
    position: 1,
  });

  const charizard = await createCharacter({
    name: "Charizard",
    description: "fire lizard",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: ash.id,
  });
  await addCharacterToTeam({
    teamId: pokemonTeam.id,
    characterId: charizard.id,
    position: 2,
  });

  const bulbasaur = await createCharacter({
    name: "Bulbasaur",
    description: "grass lover",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: ash.id,
  });
  await addCharacterToTeam({
    teamId: pokemonTeam.id,
    characterId: bulbasaur.id,
    position: 3,
  });

  const geodude = await createCharacter({
    name: "Geodude",
    description: "floating rocks",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: ash.id,
  });
  await addCharacterToTeam({
    teamId: pokemonTeam.id,
    characterId: geodude.id,
    position: 4,
  });

  const beedrill = await createCharacter({
    name: "Beedrill",
    description: "big bee",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: ash.id,
  });
  await addCharacterToTeam({
    teamId: pokemonTeam.id,
    characterId: beedrill.id,
    position: 5,
  });

  return pokemonTeam;
}
