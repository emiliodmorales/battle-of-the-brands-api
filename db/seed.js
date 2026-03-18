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
  const pokemon = await createPokemon();
  const digimon = await createDigimon();

  const users = await getUsers();
  console.log("Users");
  console.log(users);
  console.log();

  const teams = await allTeams();
  console.log("Teams");
  console.log(teams);
  console.log();

  const characters = await getAllCharacters();
  console.log("Characters");
  console.log(characters);
  console.log();
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

async function createDigimon() {
  const taichi = await createUser("taichi", "yagami");
  const digimonTeam = await createTeam({
    userId: taichi.id,
    name: "Taichi's Digimon",
  });

  const agumon = await createCharacter({
    name: "Agumon",
    description: "little trex",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: taichi.id,
  });
  await addCharacterToTeam({
    teamId: digimonTeam.id,
    characterId: agumon.id,
    position: 1,
  });

  const numemon = await createCharacter({
    name: "Numemon",
    description: "slug",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: taichi.id,
  });
  await addCharacterToTeam({
    teamId: digimonTeam.id,
    characterId: numemon.id,
    position: 2,
  });

  const birdramon = await createCharacter({
    name: "Birdramon",
    description: "fire bird",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: taichi.id,
  });
  await addCharacterToTeam({
    teamId: digimonTeam.id,
    characterId: birdramon.id,
    position: 3,
  });

  const monzaemon = await createCharacter({
    name: "Monzaemon",
    description: "teddy bear",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: taichi.id,
  });
  await addCharacterToTeam({
    teamId: digimonTeam.id,
    characterId: monzaemon.id,
    position: 4,
  });

  const vegiemon = await createCharacter({
    name: "Vegiemon",
    description: "plant",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: taichi.id,
  });
  await addCharacterToTeam({
    teamId: digimonTeam.id,
    characterId: vegiemon.id,
    position: 5,
  });

  return digimonTeam;
}
