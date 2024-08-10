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
}

export interface FUActor extends FUData {
	type: "character" | "npc";
	system: {
		level: {
			value: number;
		};
	};
}

export const isFUActor = (data: unknown): data is FUActor => {
	return !!data && typeof data === "object" && "type" in data && (data.type === "character" || data.type === "npc");
};

