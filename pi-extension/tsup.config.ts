import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	// External peer deps — DO NOT bundle these
	external: ["@earendil-works/pi-coding-agent", "typebox"],
	// Bundle @you-search/shared inline (don't leave as import)
	noExternal: ["@you-search/shared"],
});
