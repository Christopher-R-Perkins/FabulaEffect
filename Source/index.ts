import Logger from "./Utils/Logger";
import PreloadTemplates from "./PreloadTemplates";
import { RegisterSettings } from "./Utils/Settings";
import { initFabEffect } from "./fab-effect";
import { setupPatching } from "./patching";
import { FUActor } from "./types";
import { updateAttached } from "./Utils/Updater";

Hooks.once("init", async () => {
	Logger.Log("Initializing Fabula Effect.");
	RegisterSettings();
	initFabEffect();
	setupPatching();
	// await PreloadTemplates();
});

Hooks.on("updateActor", (actor: FUActor) => {
	updateAttached(actor.id);
});

// Hooks.once("setup", () => {
// 	Logger.Log("Fabula Effect module is being setup.");
// });

// Hooks.once("ready", () => {
// 	Logger.Ok("Fabula Effect module is now ready.");
// });

