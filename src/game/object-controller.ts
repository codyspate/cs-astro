import { SpaceObject } from "./space-object";

export class ObjectController {
    private objects: SpaceObject[] = [];
    private isLoading: boolean = false;

    constructor(objects: SpaceObject[] = []) {
        this.objects = objects;
    }

    /**
     * Returns all SpaceObjects whose positions fall within the current viewport.
     *
     * @param cameraX The x-coordinate of the camera's center (in world space).
     * @param cameraY The y-coordinate of the camera's center (in world space).
     * @param viewWidth The width of the viewport.
     * @param viewHeight The height of the viewport.
     * @returns An array of SpaceObjects that are visible.
     */
    public getObjectsInView(
        cameraX: number,
        cameraY: number,
        viewWidth: number,
        viewHeight: number
    ): SpaceObject[] {
        const halfWidth = viewWidth / 2;
        const halfHeight = viewHeight / 2;
        // Viewport boundaries
        const left = cameraX - (viewWidth * 1.5);
        const right = cameraX + (viewWidth * 1.5);
        const top = cameraY - (viewHeight * 1.5);
        const bottom = cameraY + (viewHeight * 1.5);

        return this.objects.filter(obj =>
            obj.posX >= left &&
            obj.posX <= right &&
            obj.posY >= top &&
            obj.posY <= bottom
        );
    }

    public async loadObjects(url?: string): Promise<void> {
        this.objects = [];
        // const requestUrl = new URL(`/api/space-objects.json`, url ?? window.location.href);
        // this.isLoading = true;
        // const response = await fetch(requestUrl);

        // if (!response.ok) {
        //     throw new Error("Failed to load SpaceObjects from API");
        // }
        // const data = await response.json();

        // const objects: SpaceObject[] = data.map((obj: any) => {
        //     return new SpaceObject(obj.posX, obj.posY, obj.size, obj.shape, obj.fillStyle);
        // });
        // this.objects = objects;
    }

    /**
     * Loads SpaceObjects from the API for an area larger than the current view.
     *
     * This method expands the viewport by a buffer factor so that objects 
     * outside the immediate canvas are loaded to allow sufficient time 
     * for requests to complete.
     *
     * @param cameraX The x-coordinate of the camera's center (in world space).
     * @param cameraY The y-coordinate of the camera's center (in world space).
     * @param viewWidth The width of the viewport.
     * @param viewHeight The height of the viewport.
     * @param bufferFactor The multiplier to expand the viewport by (default 1.5).
     * @returns A Promise that resolves with an array of SpaceObjects for the expanded area.
     */
    public async loadObjectsForArea(
        cameraX: number,
        cameraY: number,
        viewWidth: number,
        viewHeight: number,
        url?: URL
    ): Promise<SpaceObject[]> {
        if (this.isLoading) {
            return this.objects;
        }
        const left = cameraX - viewWidth / 2;
        const right = cameraX + viewWidth / 2;
        const top = cameraY - viewHeight / 2;
        const bottom = cameraY + viewHeight / 2;
        const buffer = Math.max(viewWidth, viewHeight) * 6;
        const requestUrl = new URL(`/api/space-objects.json`, url ?? window.location.href);
        requestUrl.searchParams.set("left", (left - buffer).toString());
        requestUrl.searchParams.set("right", (right + buffer).toString());
        requestUrl.searchParams.set("top", (top - buffer).toString());
        requestUrl.searchParams.set("bottom", (bottom + buffer).toString());
        this.isLoading = true;
        const response = await fetch(requestUrl);
        console.log(response, 'das response');
        if (!response.ok) {
            throw new Error("Failed to load SpaceObjects from API");
        }
        const data = await response.json();

        // Assume the API returns an array of objects that match SpaceObject's properties.
        const loadedObjects: SpaceObject[] = data.map((obj: any) => {
            return new SpaceObject(obj.posX, obj.posY, obj.size, obj.shape, obj.fillStyle);
        });
        console.log("loaded objects:", loadedObjects);

        // Optionally, update the internal objects list.
        this.objects = loadedObjects;
        this.isLoading = false;

        return loadedObjects;
    }

    /**
     * Adds a new SpaceObject to the controller.
     *
     * @param object A SpaceObject to add.
     */
    public addObject(object: SpaceObject): void {
        this.objects.push(object);
    }
}