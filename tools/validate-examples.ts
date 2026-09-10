import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { TARGET } from "../src/zod/constants";

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
