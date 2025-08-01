import { createRequire } from "module";
import { defineConfig, configDefaults } from "vitest/config";
const require = createRequire(import.meta.url);
const intersectionObserverPolyfill = require.resolve(
	"./test/vitest.setup.ts",
);

export default defineConfig({
	test: {
		environment: 'jsdom',
		exclude: [
			"packages/*/dist",
			...configDefaults.exclude
		],
		setupFiles: [intersectionObserverPolyfill],
	},
});
