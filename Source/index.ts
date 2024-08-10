import Logger from "./Utils/Logger";
import PreloadTemplates from "./PreloadTemplates";
import { RegisterSettings } from "./Utils/Settings";
import { initFabEffect } from "./fab-effect";
import { setupPatching } from "./patching";

Hooks.once("init", async () => {
	RegisterSettings();
	initFabEffect();
	await PreloadTemplates();
});

Hooks.once("setup", () => {
	Logger.Log("Fabula Effect module is being setup.");
	setupPatching();
});

Hooks.once("ready", () => {
	Logger.Ok("Fabula Effect module is now ready.");
});

