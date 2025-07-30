import { defineConfig, globalIgnores } from "eslint/config";
import { createConfig } from "@vikr01/eslint-config";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const tsConfigPath = require.resolve("./tsconfig.json");

export default defineConfig(
  [
    createConfig({
      tsConfigPath,
      json: false,
      typescript: true,
    }),
  ],
  globalIgnores(["./dist/*"]),
);
