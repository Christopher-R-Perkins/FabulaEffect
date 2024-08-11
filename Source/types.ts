export type ReplaceFormulaDataFn = (
	result: string,
	data: unknown,
	options?: { missing?: string; warn?: boolean }
) => string;

export type ReplaceFormulaDataWrapperFn = (
	...args: [ReplaceFormulaDataFn, ...Parameters<ReplaceFormulaDataFn>]
) => string;

export interface FUData {
	parent: FUData | undefined;
	id: string;
	name: string;
	prepareData: () => void;
	sheet: {
		render: (force: boolean) => void;
		rendered: boolean;
	};
}

export interface FUSkill extends FUData {
	type: "skill";
	system: {
		level: {
			value: number;
			min: number;
			max: number;
		};
	};
}

export const isFUSkill = (data: unknown): data is FUSkill => {
	return !!data && typeof data === "object" && "type" in data && data.type === "skill";
};

export interface FUActor extends FUData {
	type: "character" | "npc";
	system: {
		level: {
			value: number;
		};
	};
	items: Map<string, FUData>;
}

export const isFUActor = (data: unknown): data is FUActor => {
	return !!data && typeof data === "object" && "type" in data && (data.type === "character" || data.type === "npc");
};

