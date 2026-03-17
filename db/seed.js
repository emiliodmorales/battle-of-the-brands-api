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
}
