import { type Options } from "tsup";

export const tsupBaseConfig: Options = {
  entry: ["src", "!src/**/__tests__/**", "!src/**/*.test.*"],
  outDir: "dist",
  format: ["esm"],
  dts: true,

  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },

  bundle: false,
  clean: true,
  minify: false,
  sourcemap: false,
  skipNodeModulesBundle: true,
  splitting: false,
};
