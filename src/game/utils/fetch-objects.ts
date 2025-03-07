import { and, between, db, SpaceObject as dbSpaceObject } from "astro:db"
import { SpaceObject } from "../space-object";

export const getSpaceObjectsForArea = async (left: number, right: number, top: number, bottom: number): Promise<SpaceObject[]> => {
    const objects = await db.select().from(dbSpaceObject).where(and(between(dbSpaceObject.posX, left, right), between(dbSpaceObject.posY, top, bottom))).execute();
    console.log(objects, "objects");
    return objects.map(SpaceObject.fromDb)
}

export const getAllSpaceObjects = async (): Promise<SpaceObject[]> => {
    const objects = await db.select().from(dbSpaceObject).execute();
    return objects.map(SpaceObject.fromDb)
}