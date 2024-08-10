export let libWrapper: any = null;

export const initFabEffect = (): void => {
	libWrapper = (globalThis as any).libWrapper;
};
