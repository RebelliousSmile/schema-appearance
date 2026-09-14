import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { TARGET } from "../src/zod/constants";
import { GamePackSchema } from "../src/zod/appearance/game-pack";

const schemaPath = path.join(
  "schemas",
  TARGET.folder,
  `${TARGET.name}.schema.json`,
);
const examplesDir = path.join("examples", TARGET.folder, TARGET.name);

if (!fs.existsSync(schemaPath)) {
  throw new Error(`Missing schema for target: ${schemaPath}`);
}
if (!fs.existsSync(examplesDir)) {
  throw new Error(`Missing example directory: ${examplesDir}`);
}

const files = fs
  .readdirSync(examplesDir)
  .map((name) => path.join(examplesDir, name))
  .filter((file) => fs.statSync(file).isFile())
  .filter((file) => file.toLowerCase().endsWith(".json"));

if (files.length === 0) {
  throw new Error(`No JSON example files found in: ${examplesDir}`);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const validStylesheetPack = {
  id: "stylesheet-test",
  label: "Stylesheet Test",
  style: {},
  assets: {
    root: "assets/stylesheet-test",
    stylesheets: ["styles/base.css", "themes/dark.css"],
  },
};

const invalidStylesheetPacks = [
  ["duplicate", ["styles/base.css", "styles/base.css"]],
  ["absolute", ["/styles/base.css"]],
  ["traversal", ["../styles/base.css"]],
  ["empty segment", ["styles//base.css"]],
  ["backslash", ["styles\\base.css"]],
  ["drive-qualified", ["C:\\styles\\base.css"]],
  ["URL-like", ["https://example.com/styles/base.css"]],
  ["empty", [""]],
] as const;

function fail(message: string, details?: unknown): never {
  throw new Error(`${message}${details ? `: ${JSON.stringify(details)}` : ""}`);
}

function assertAccepted(name: string, pack: unknown) {
  const zodResult = GamePackSchema.safeParse(pack);
  if (!zodResult.success) {
    fail(`${name} was rejected by GamePackSchema`, zodResult.error.issues);
  }
  if (!validate(pack)) {
    fail(`${name} was rejected by the generated schema`, validate.errors);
  }
}

function assertRejected(name: string, pack: unknown) {
  if (GamePackSchema.safeParse(pack).success) {
    fail(`${name} was accepted by GamePackSchema`);
  }
  if (validate(pack)) {
    fail(`${name} was accepted by the generated schema`);
  }
}

assertAccepted("a valid ordered stylesheet declaration", validStylesheetPack);
const parsedStylesheets = GamePackSchema.parse(validStylesheetPack).assets
  ?.stylesheets;
if (
  parsedStylesheets?.join("\u0000") !==
  validStylesheetPack.assets.stylesheets.join("\u0000")
) {
  fail("GamePackSchema did not preserve stylesheet declaration order");
}
for (const [name, stylesheets] of invalidStylesheetPacks) {
  assertRejected(`${name} stylesheet declaration`, {
    ...validStylesheetPack,
    assets: { ...validStylesheetPack.assets, stylesheets },
  });
}

console.log("✓ Stylesheet contract cases passed");
let failures = 0;

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (validate(data)) {
    console.log(`✓ ${file}`);
  } else {
    failures++;
    console.error(`✗ ${file}`);
    console.error(validate.errors);
  }
}

if (failures > 0) {
  throw new Error(`Validation failed for ${failures} example file(s).`);
}

console.log(`\n✅ All ${files.length} example files passed validation.`);
