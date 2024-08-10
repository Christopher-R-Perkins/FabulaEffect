import Logger from "./Utils/Logger";
import { replaceFormulaData } from "./effects";
import { libWrapper } from "./fab-effect";

export const setupPatching = (): void => {
	Logger.Log("Patching Roll.replaceFormulaData");

	libWrapper.register("fabula-effect", "Roll.replaceFormulaData", replaceFormulaData, "MIXED");

	Logger.Ok("Patching successful");
};

