import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createCharacter } from "#db/queries/characters";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user = await createUser("foo", "bar");
  const pikachu = await createCharacter({
    name: "Pikachu",
    description: "electric mouse",
    image: "",
    hp: 5,
    attack: 10,
    defense: 2,
    abilityId: null,
    userId: user.id,
  });
  console.log(pikachu);

  await db.insert("abilities", [
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
  ]);
}
