DROP TABLE IF EXISTS "battles";

DROP TABLE IF EXISTS "teams_characters";

DROP TABLE IF EXISTS "followers";

DROP TABLE IF EXISTS "favorite_characters";

DROP TABLE IF EXISTS "favorite_teams";

DROP TABLE IF EXISTS "teams";

DROP TABLE IF EXISTS "characters";

DROP TABLE IF EXISTS "users";

DROP TABLE IF EXISTS "abilities";

CREATE TABLE
  "users" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255) NOT NULL
  );

CREATE TABLE
  "teams" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "user_id" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL
  );

CREATE TABLE
  "abilities" (
    "id" SMALLSERIAL PRIMARY KEY NOT NULL,
    "cost" INTEGER NOT NULL,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" VARCHAR(255) NOT NULL
  );

CREATE TABLE
  "characters" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "user_id" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "ability_id" INTEGER REFERENCES "abilities" ("id") ON DELETE SET NULL
  );

CREATE TABLE
  "battles" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "challenger" INTEGER REFERENCES "teams" ("id") ON DELETE SET NULL,
    "defender" INTEGER REFERENCES "teams" ("id") ON DELETE SET NULL,
    "winner" INTEGER REFERENCES "teams" ("id") ON DELETE SET NULL
  );

CREATE TABLE
  "followers" (
    "follower" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "following" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("follower", "following")
  );

CREATE TABLE
  "favorite_characters" (
    "character_id" INTEGER NOT NULL REFERENCES "characters" ("id") ON DELETE CASCADE,
    "user_id" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("user_id", "character_id")
  );

CREATE TABLE
  "favorite_teams" (
    "team_id" INTEGER NOT NULL REFERENCES "teams" ("id") ON DELETE CASCADE,
    "user_id" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("user_id", "team_id")
  );

CREATE TABLE
  "teams_characters" (
    "team_id" INTEGER NOT NULL REFERENCES "teams" ("id") ON DELETE CASCADE,
    "character_id" INTEGER REFERENCES "characters" ("id") ON DELETE SET NULL,
    "position" SMALLINT NOT NULL,
    PRIMARY KEY ("team_id", "character_id"),
    UNIQUE ("team_id", "position")
  );