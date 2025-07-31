import { createRequire } from "module";
import { defineConfig, configDefaults } from "vitest/config";
const require = createRequire(import.meta.url);
const intersectionObserverPolyfill = require.resolve(
	"intersection-observer",
);

export default defineConfig({
	test: {
		environment: 'jsdom',
		exclude: [
			"./lib",
			...configDefaults.exclude
		],
		setupFiles: [intersectionObserverPolyfill],
	},
});
