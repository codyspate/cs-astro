
export interface Vertex {
    x: number;
    y: number;
}

export class SpaceObject {
    public id: string;
    public posX: number;
    public posY: number;
    public size: number;
    public shape: Vertex[];
    public fillStyle: string;

    /**
     * Creates a new space object.
     *
     * @param posX The x coordinate in world space.
     * @param posY The y coordinate in world space.
     * @param size A scaling factor for the object's size.
     * @param shape An array of vertices defining a polygon shape.
     * @param fillStyle The fill color for the object.
     */
    constructor(posX: number, posY: number, size: number, shape: Vertex[], fillStyle = "gray", id?: string) {
        this.id = id ?? crypto.randomUUID();
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.shape = shape;
        this.fillStyle = fillStyle;
    }

    static fromDb(dbObject: any): SpaceObject {
        return new SpaceObject(dbObject.posX, dbObject.posY, dbObject.size, dbObject.shape, dbObject.fillStyle, dbObject.id);
    }

    /**
     * Renders the space object relative to a given camera offset.
     *
     * @param context The drawing context.
     * @param offsetX The x offset, typically derived from the camera or ship.
     * @param offsetY The y offset.
     */
    public render(context: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        context.save();
        // Translate to the object's position relative to the camera
        context.translate(this.posX - offsetX, this.posY - offsetY);
        // Scale the object based on its size
        context.scale(this.size, this.size);
        context.beginPath();
        if (this.shape.length > 0) {
            context.moveTo(this.shape[0].x, this.shape[0].y);
            for (let i = 1; i < this.shape.length; i++) {
                context.lineTo(this.shape[i].x, this.shape[i].y);
            }
            context.closePath();
            context.fillStyle = this.fillStyle;
            context.fill();
        }
        context.restore();
    }
}