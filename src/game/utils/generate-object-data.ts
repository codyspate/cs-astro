import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SpaceObject, type Vertex } from "../space-object";

/**
 * Generates a random polygon shape.
 *
 * @param vertexCount Number of vertices in the polygon.
 * @param baseRadius Base distance from the center to each vertex.
 * @param variance Amount to vary the radius for each vertex.
 * @returns An array of vertices defining the polygon.
 */
function generateRandomShape(
  vertexCount: number,
  baseRadius: number,
  variance: number,
): Vertex[] {
  const shape: Vertex[] = [];
  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * 2 * Math.PI;
    const randomRadius = baseRadius + (Math.random() * variance - variance / 2);
    shape.push({
      x: Math.cos(angle) * randomRadius,
      y: Math.sin(angle) * randomRadius,
    });
  }
  return shape;
}

/**
 * Generates an array of random SpaceObjects.
 *
 * The objects' positions are generated within [-worldWidth, worldWidth] and [-worldHeight, worldHeight].
 *
 * @param count Number of SpaceObjects to generate.
 * @param worldWidth Maximum absolute x-coordinate.
 * @param worldHeight Maximum absolute y-coordinate.
 * @returns An array of SpaceObjects.
 */
export function generateSpaceObjects(
  count: number,
  worldWidth: number,
  worldHeight: number,
): SpaceObject[] {
  const objects: SpaceObject[] = [];
  // Possible fill colors for space objects.
  const possibleColors = ["gray", "darkgray", "slategray"];

  for (let i = 0; i < count; i++) {
    console.log(`Generating object ${i}`);
    // Generate positions in the range [-worldWidth, worldWidth] and [-worldHeight, worldHeight]
    const posX = (Math.random() * 2 - 1) * worldWidth;
    const posY = (Math.random() * 2 - 1) * worldHeight;
    // Random size factor between 0.5 and 2.
    const size = 0.5 + Math.random() * 1.5;

    // Create a random polygon shape (e.g., for an asteroid or wreck)
    const vertexCount = 5 + Math.floor(Math.random() * 4); // between 5 and 8 vertices
    const baseRadius = 40;
    const variance = 4;
    const shape = generateRandomShape(vertexCount, baseRadius, variance);

    const fillStyle =
      possibleColors[Math.floor(Math.random() * possibleColors.length)];

    const spaceObject = new SpaceObject(posX, posY, size, shape, fillStyle);

    objects.push(spaceObject);
  }
  return objects;
}

const _spaceObjectsToRegions = (
  spaceObjects: SpaceObject[],
  regionSize: number,
): Map<string, SpaceObject[]> => {
  const regions = new Map<string, SpaceObject[]>();
  for (const spaceObject of spaceObjects) {
    const regionX = Math.floor(spaceObject.posX / regionSize);
    const regionY = Math.floor(spaceObject.posY / regionSize);
    const regionKey = `${regionX},${regionY}`;
    if (!regions.has(regionKey)) {
      regions.set(regionKey, []);
    }
    regions.get(regionKey)?.push(spaceObject);
  }
  return regions;
};

export const getRegionKeys = (
  regions: Map<string, SpaceObject[]>,
): string[] => {
  return Array.from(regions.keys());
};

export const getRegionFromCoords = (
  regions: Map<string, SpaceObject[]>,
  regionSize: number,
  x: number,
  y: number,
): SpaceObject[] => {
  const regionX = Math.floor(x / regionSize);
  const regionY = Math.floor(y / regionSize);
  const regionKey = `${regionX},${regionY}`;
  return regions.get(regionKey) || [];
};

export const getSpaceObjectsInArea = (
  left: number,
  right: number,
  top: number,
  bottom: number,
): SpaceObject[] => {
  console.log("Getting objects in area", left, right, top, bottom);
  const spaceObjectJson = readFileSync(
    join(import.meta.dirname, "objects.json"),
    "utf-8",
  );
  const spaceObjects = JSON.parse(spaceObjectJson) as SpaceObject[];
  return spaceObjects.filter(
    (obj) =>
      obj.posX >= left &&
      obj.posX <= right &&
      obj.posY >= top &&
      obj.posY <= bottom,
  );
};

const REGION_SIZE = 500;

export const loadRegionFromCoords = (x: number, y: number): SpaceObject[] => {
  const regions = readFileSync(
    join(import.meta.dirname, "regions.json"),
    "utf-8",
  );
  const regionMap = new Map<string, SpaceObject[]>(JSON.parse(regions));
  const regionX = Math.floor(x / REGION_SIZE);
  const regionY = Math.floor(y / REGION_SIZE);
  const regionKey = `${regionX},${regionY}`;
  return regionMap.get(regionKey) || [];
};

// export const _generateObjects = () => {
//     console.log("Starting generation of objects.json");
//     const writeStream = fs.createWriteStream(join(import.meta.dirname, "objects.json"), {});
//     console.log("WriteStream created");
//     generateSpaceObjects(1000000, 10000000, 10000000, writeStream);
//     writeStream.end();
//     console.log("Generated objects.json");
// }

// const _generateRegions = () => {
//     const spaceObjects = generateSpaceObjects(1000000, 10000, 10000, fs.createWriteStream(join(import.meta.dirname, "objects.json"), {}));
//     const regions = spaceObjectsToRegions(spaceObjects, REGION_SIZE);
//     fs.writeFileSync(join(import.meta.dirname, "regions.json"), JSON.stringify(Array.from(regions.entries())));
// }

// _generateRegions();
