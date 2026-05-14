import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	// External peer deps — DO NOT bundle these
	external: ["@opencode-ai/plugin"],
	// Bundle @you-search/shared inline (don't leave as import)
	noExternal: ["@you-search/shared"],
});
