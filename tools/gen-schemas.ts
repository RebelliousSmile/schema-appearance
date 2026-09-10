import fs from "node:fs";
import { z } from "zod";
import { TARGET } from "../src/zod/constants";

const json = z.toJSONSchema(TARGET.zod, { target: "draft-7" });
const directory = `schemas/${TARGET.folder}`;
const output = `${directory}/${TARGET.name}.schema.json`;

fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(output, JSON.stringify(json, null, 2));
console.log("Wrote", output);
