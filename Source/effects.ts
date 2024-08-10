import Logger from "./Utils/Logger";
import { FUActor, FUData, FUSkill, ReplaceFormulaDataWrapperFn, isFUActor, isFUSkill } from "./types";

const subroutines: { [couroutine: string]: (args: string, data: unknown) => string } = {
	levelBonus: (args: string, data: unknown): string => {
		const actor = (data as FUData).parent;

		const bonuses = args.split(",").map((str) => str.trim());
		if (bonuses.length < 2) {
			Logger.Err(`levelBonus formula subroutine needs at least two arguments, attached to ${data}.`);
			return "0";
		}

		if (!isFUActor(actor)) {
			Logger.Err(`levelBonus formula subroutine invoked on object no child of an actor: ${data}`);
			return "0";
		}
		const level = actor.system.level.value;

		const [lvl20, lvl40] = bonuses;
		if (level >= 40) return lvl40;
		if (level >= 20) return lvl20;
		return "0";
	},

	skillLevel: (args: string, data: unknown): string => {
		const parent = (data as FUData).parent;
		const [skillName, id] = args.split(",").map((str) => str.trim());
		let actor: FUActor;

		if (id && (actor = (Actor as any).get(id))) {
			actor;
		} else if (isFUActor(data)) {
			actor = data;
		} else if (isFUActor(parent)) {
			actor = parent;
		} else {
			Logger.Err(
				`skillLevel formula subroutine invoked on object that is not an actor nor is a child an of an actor: ${data}`
			);
			return "0";
		}

		const skill = [...actor.items.values()].find<FUSkill>((item): item is FUSkill => {
			return item.name === skillName && isFUSkill(item);
		});

		if (!skill) return "0";
		return String(skill.system.level.value);
	},
};

export const replaceFormulaData: ReplaceFormulaDataWrapperFn = (wrapped, formula, data, options) => {
	const { missing, warn } = options ?? { missing: undefined, warn: false };
	let result = formula;

	if (typeof formula !== "string") throw new Error(`Invalid formula ${formula}`);

	result = result.replaceAll(/\$([a-zA-Z]+)\[(.*?)\]/g, (match: string, subroutine: string, args: string): string => {
		if (!Object.hasOwn(subroutines, subroutine)) {
			Logger.Err(`Invalid formula "${formula}": ${subroutine} subroutine does not exist! Skipping subroutine.`);
			return "";
		}
		Logger.Log(`Firing ${subroutine} formula subroutine`);
		return subroutines[subroutine](args, data);
	});

	return wrapped(result, data, { missing, warn });
};

