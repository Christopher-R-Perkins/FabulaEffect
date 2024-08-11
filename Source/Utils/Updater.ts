import { FUData, isFUActor } from "../types";
import Logger from "./Logger";

class FUObjectUpdater {
	private static instance: FUObjectUpdater | null = null;
	private toBeUpdated: { [actorID: string]: Set<FUData> } = {};

	static getInstance(): FUObjectUpdater {
		if (!FUObjectUpdater.instance) {
			FUObjectUpdater.instance = new FUObjectUpdater();
		}

		return FUObjectUpdater.instance;
	}

	public attachData(actorID: string, data: FUData): void {
		if (!(actorID in this.toBeUpdated)) {
			this.toBeUpdated[actorID] = new Set<FUData>();
		}

		if (this.toBeUpdated[actorID].has(data)) {
			return;
		}

		Logger.Log(`Attaching ${data.name} to update when actor ${actorID} updates.`);

		this.toBeUpdated[actorID].add(data);
	}

	public updateAttached(actorID: string): void {
		if (!this.toBeUpdated[actorID]) return;

		this.toBeUpdated[actorID].forEach((object) => {
			object.prepareData();

			if (object.sheet.rendered) {
				object.sheet.render(false);
			}

			if (object.parent && object.parent.sheet.rendered) {
				object.parent.sheet.render(false);
			}
		});
	}
}

export const attachData = (actorID: string, data: FUData): void =>
	FUObjectUpdater.getInstance().attachData(actorID, data);

export const updateAttached = (actorID: string): void => FUObjectUpdater.getInstance().updateAttached(actorID);

