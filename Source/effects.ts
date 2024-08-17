import Logger from "./Utils/Logger";
import { attachData } from "./Utils/Updater";
import { FUActor, FUData, FUSkill, FuClass, ReplaceFormulaDataWrapperFn, isFUActor, isFUClass, isFUSkill } from "./types";

const splitArgs = (args: string): string[] => args.split(",").map((str) => str.trim());

const getActor = (data: FUData, id?: string): FUActor | null => {
	if (id) {
		const actor = (Actor as any).get(id);
		if (actor) {
			attachData(id, data);
			return actor;
		}
		Logger.Warn(`${id} did not retrieve a valid actor.`);
	}

	if (isFUActor(data)) return data;
	if (isFUActor(data.parent)) return data.parent;
	return null;
};

const subroutines: { [couroutine: string]: (args: string, data: unknown) => string } = {
	actorLevel: (args: string, data: unknown): string => {
		const [id] = splitArgs(args);
		const actor = getActor(data as FUData, id);

		if (!actor) {
			Logger.Err(
				`actorLevel formula subroutine invoked on object that is not an actor, is not a child an of an actor, nor was provided a valid actor id: ${data}`
			);
			return "0";
		}

		return String(actor.system.level.value);
	},

	levelBonus: (args: string, data: unknown): string => {
		const actor = getActor(data as FUData);

		const [lvl20, lvl40] = splitArgs(args);
		if (lvl20 === undefined || lvl40 === undefined) {
			Logger.Err(`levelBonus formula subroutine needs at least two arguments, attached to ${data}.`);
			return "0";
		}

		if (!actor) {
			Logger.Err(
				`levelBonus formula subroutine invoked on object that is not an actor, nor is a child an of an actor: ${data}`
			);
			return "0";
		}
		const level = actor.system.level.value;

		if (level >= 40) return lvl40;
		if (level >= 20) return lvl20;
		return "0";
	},

	skillLevel: (args: string, data: unknown): string => {
		const [skillName, id] = splitArgs(args);
		const actor = getActor(data as FUData, id);

		if (!actor) {
			Logger.Err(
				`skillLevel formula subroutine invoked on object that is not an actor, is not a child an of an actor, nor was provided a valid actor id: ${data}.`
			);
			return "0";
		}

		const skill = [...actor.items.values()].find<FUSkill>((item): item is FUSkill => {
			return item.name === skillName && isFUSkill(item);
		});

		if (!skill) return "0";
		return String(skill.system.level.value);
	},
	
	classesLevel: (args: string, data: unknown): string => {
		const [id] = splitArgs(args);
		const actor = getActor(data as FUData, id);

		if (!actor) {
			Logger.Err(
				`actorLevel formula subroutine invoked on object that is not an actor, is not a child an of an actor, nor was provided a valid actor id: ${data}`
			);
			return "0";
		}
		
		const totalClassesValue = [...actor.items.values()].filter<FuClass>((item): item is FuClass => {
			return isFUClass(item);
		}).reduce( (prev, curr) => prev + curr.system.level.value, 0);
		
		return String(totalClassesValue);
	}
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

