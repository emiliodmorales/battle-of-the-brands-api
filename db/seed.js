import db from "#db/client";
import { createUser, getUserHistory, getUsers } from "#db/queries/users";
import {
  createCharacter,
  getAllCharacters,
  getCharacterHistory,
} from "#db/queries/characters";
import { allTeams, createTeam, getTeamHistory } from "#db/queries/teams";
import { addCharacterToTeam } from "#db/queries/teams_characters";
import { createBattle } from "#db/queries/battles";
import { createAbility } from "#db/queries/abilities";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const pokemon = await createPokemon();
  const digimon = await createDigimon();
  await createAbilities();

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

  await createBattle({
    challenger: pokemon.id,
    defender: digimon.id,
    winner: pokemon.id,
  });
  await createBattle({
    challenger: pokemon.id,
    defender: digimon.id,
    winner: pokemon.id,
  });
  await createBattle({
    challenger: pokemon.id,
    defender: digimon.id,
    winner: pokemon.id,
  });
  await createBattle({
    challenger: pokemon.id,
    defender: digimon.id,
    winner: digimon.id,
  });

  const characterBattles = await getCharacterHistory(characters[8].id);
  console.log(characters[8].name + " Battles");
  for (const battle of characterBattles) {
    console.log(battle);
  }
  console.log();

  const userBattles = await getUserHistory(users[0].id);
  console.log(users[0].username + " Battles");
  for (const battle of userBattles) {
    console.log(battle);
  }
  console.log();

  const teamBattles = await getTeamHistory(digimon.id);
  console.log(digimon.name + " Battles");
  for (const battle of teamBattles) {
    console.log(battle);
  }
  console.log();
}

async function createPokemon() {
  const ash = await createUser("Ash", "ketchum");
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
  const taichi = await createUser("Taichi", "yagami");
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

async function createAbilities() {
  const abilities = [
    {
      cost: 1,
      name: "Thorn",
      description: "Enemy takes 1 damage when hit, per stack of thorn",
    },

    {
      cost: 1,
      name: "Double Strike",
      description: "Character attacks attacks twice in one turn",
    },

    {
      cost: 1,
      name: "Regen",
      description: "Heal 1 HP at the end of every turn",
    },

    {
      cost: 1,
      name: "First Strike",
      description: "Hit the enemy before before they hit you",
    },

    {
      cost: 1,
      name: "Shield",
      description: "Block the first source of damage this round",
    },

    {
      cost: 1,
      name: "Burn",
      description:
        "After you attack the enemy apply 1 burn(Lose 1 hp per burn stack at end of turn)",
    },

    {
      cost: 1,
      name: "Reach",
      description:
        "Ignore the enemy in front, and hit the next enemy in the lineup",
    },

    {
      cost: 1,
      name: "Dodge",
      description: "25% chance enemy attacks will miss",
    },

    {
      cost: 1,
      name: "Durable",
      description: "Reduce dmg taken from attacks by 20%",
    },

    {
      cost: 1,
      name: "Gamble",
      description:
        "At the start of the turn, flip a coin. Heads: Deal double damage on the next attack. Tails: Take double damage from the next attack",
    },
  ];
  for (const ability of abilities) {
    await createAbility(ability);
  }
}
