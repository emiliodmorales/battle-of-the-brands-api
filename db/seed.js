import db from "#db/client";
import { createUser } from "#db/queries/users";
import { addFavoriteCharacter, createCharacter } from "#db/queries/characters";
import { createTeam } from "#db/queries/teams";
import { addCharacterToTeam } from "#db/queries/teams_characters";
import { createBattle } from "#db/queries/battles";
import { createAbility } from "#db/queries/abilities";

const NUM_ABILITIES = 10;

function generateStats() {
  let points = 25;
  const randomStat = () => Math.floor(Math.random() * points);
  const hp = randomStat();
  points -= hp;
  const attack = randomStat();
  points -= attack;
  const defense = points;
  return { hp, attack, defense };
}

const randomAbility = () => Math.floor(Math.random() * NUM_ABILITIES) + 1;

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await createAbilities();
  const pokemon = await createPokemon();
  const digimon = await createDigimon();

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
}

async function createPokemon() {
  const ash = await createUser(
    "Ash",
    "ketchum",
    "https://upload.wikimedia.org/wikipedia/en/e/e4/Ash_Ketchum_Journeys.png",
  );
  const pokemonTeam = await createTeam({
    userId: ash.id,
    name: "Ash's pokemon",
  });

  const pikachu = await createCharacter({
    name: "Pikachu",
    description: "electric mouse",
    image: "https://img.pokemondb.net/artwork/large/pikachu.jpg",
    ...generateStats(),
    abilityId: randomAbility(),
    userId: ash.id,
  });
  await addCharacterToTeam({
    teamId: pokemonTeam.id,
    characterId: pikachu.id,
    position: 1,
  });
  await addFavoriteCharacter(ash.id, pikachu.id);

  const charizard = await createCharacter({
    name: "Charizard",
    description: "fire lizard",
    image:
      "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/006.png",
    ...generateStats(),
    abilityId: randomAbility(),
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
    image:
      "https://breedersguide.home.blog/wp-content/uploads/2019/04/bulbasaur.png",
    ...generateStats(),
    abilityId: randomAbility(),
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
    image:
      "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/074.png",
    ...generateStats(),
    abilityId: randomAbility(),
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
    image:
      "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/015_f2.png",
    ...generateStats(),
    abilityId: randomAbility(),
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
  const taichi = await createUser(
    "Taichi",
    "yagami",
    "https://upload.wikimedia.org/wikipedia/en/0/06/Tai_Kamiya_in_Digimon_Adventure_01.png",
  );
  const digimonTeam = await createTeam({
    userId: taichi.id,
    name: "Taichi's Digimon",
  });

  const agumon = await createCharacter({
    name: "Agumon",
    description: "little trex",
    image:
      "https://wikimon.net/images/thumb/5/5e/Agumon_survive.png/320px-Agumon_survive.png",
    ...generateStats(),
    abilityId: randomAbility(),
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
    image: "https://static.wikitide.net/netdriverwiki/9/9c/Numemon.png",
    ...generateStats(),
    abilityId: randomAbility(),
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
    image:
      "https://cdn.weasyl.com/static/media/1d/e2/47/1de247f587279e41559069651cab31db4e5b628d54ce613069d19a0e176e5522.png",
    ...generateStats(),
    abilityId: randomAbility(),
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
    image:
      "https://static.wikia.nocookie.net/vsbattles/images/3/3e/Monzaemon_New_Century.png",
    ...generateStats(),
    abilityId: randomAbility(),
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
    image:
      "https://static.wikia.nocookie.net/digimon/images/2/29/Vegiemon_b.jpg",
    ...generateStats(),
    abilityId: randomAbility(),
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
