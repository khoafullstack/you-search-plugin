/**
 * @you-search/opencode-plugin
 *
 * OpenCode plugin for web_you_fetch and web_you_search tools.
 */
import type { PluginModule } from "@opencode-ai/plugin";
import { YouSearchPlugin } from "./plugin.js";

const mod: PluginModule = {
	id: "you-search",
	server: YouSearchPlugin,
};

export default mod;
