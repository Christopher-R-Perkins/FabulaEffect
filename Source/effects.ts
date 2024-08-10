import Logger from "./Utils/Logger";
import { FUData, ReplaceFormulaDataWrapperFn, isFUActor } from "./types";

const coroutines: { [couroutine: string]: (args: string, data: unknown) => string } = {
	levelBonus: (args: string, data: unknown): string => {
		const actor = (data as FUData).parent;

		const bonuses = args.split(",").map((str) => str.trim());
		if (bonuses.length < 2) {
			Logger.Err(`levelBonus formula coroutine needs at least two arguments, attached to ${data}.`);
			return "0";
		}

		if (!isFUActor(actor)) {
			Logger.Err(`levelBonus formula coroutine invoked on object no child of an actor: ${data}`);
			return "0";
		}
		const level = actor.system.level.value;

		const [lvl20, lvl40] = bonuses;
		if (level >= 40) return lvl40;
		if (level >= 20) return lvl20;
		return "0";
	},
};

export const replaceFormulaData: ReplaceFormulaDataWrapperFn = (wrapped, formula, data, options) => {
	const { missing, warn } = options ?? { missing: undefined, warn: false };
	let result = formula;

	if (typeof formula !== "string") throw new Error(`Invalid formula ${formula}`);

	result = result.replaceAll(/\$([a-zA-Z]+)\[(.*?)\]/g, (match: string, coroutine: string, args: string): string => {
		if (!Object.hasOwn(coroutines, coroutine)) {
			Logger.Err(`Invalid formula "${formula}": ${coroutine} coroutine does not exist! Skipping coroutine.`);
			return "";
		}
		Logger.Log(`Firing ${coroutine} formula coroutine`);
		return coroutines[coroutine](args, data);
	});

	return wrapped(result, data, { missing, warn });
};

