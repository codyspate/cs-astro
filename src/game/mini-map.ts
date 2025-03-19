import type { Ship } from "./ship";
import type { SpaceObject } from "./space-object";

/**
 * Represents a mini-map that shows the ship's location and nearby objects
 */
export class MiniMap {
	private width: number;
	private height: number;
	private scale: number;
	private x: number;
	private y: number;
	private padding: number;
	private borderWidth: number;
	private backgroundColor: string;
	private borderColor: string;
	private shipColor: string;
	private objectColor: string;

	/**
	 * Creates a new MiniMap instance
	 *
	 * @param width Width of the minimap in pixels
	 * @param height Height of the minimap in pixels
	 * @param x X position of the minimap on the canvas
	 * @param y Y position of the minimap on the canvas
	 * @param scale Scale factor for world coordinates to minimap coordinates
	 */
	constructor(width = 150, height = 150, x = 20, y = 20, scale = 0.001) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.scale = scale;
		this.padding = 10;
		this.borderWidth = 2;
		this.backgroundColor = "rgba(0, 0, 0, 0.5)";
		this.borderColor = "rgba(255, 255, 255, 0.7)";
		this.shipColor = "#00ff00";
		this.objectColor = "#ffff00";
	}

	/**
	 * Renders the minimap on the specified context
	 *
	 * @param context The rendering context
	 * @param ship The player's ship
	 * @param objects Array of space objects to display on the minimap
	 */
	public render(
		context: CanvasRenderingContext2D,
		ship: Ship,
		objects: SpaceObject[],
	): void {
		// Save the current canvas state
		context.save();

		// Draw minimap background and border
		context.fillStyle = this.backgroundColor;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.strokeStyle = this.borderColor;
		context.lineWidth = this.borderWidth;
		context.strokeRect(this.x, this.y, this.width, this.height);

		// Calculate minimap center
		const centerX = this.x + this.width / 2;
		const centerY = this.y + this.height / 2;

		// Draw visible objects
		context.fillStyle = this.objectColor;
		for (const obj of objects) {
			// Convert world coordinates to minimap coordinates
			const objX = centerX + (obj.posX - ship.worldX) * this.scale;
			const objY = centerY + (obj.posY - ship.worldY) * this.scale;

			// Only draw if object is within minimap boundaries
			if (
				objX >= this.x + this.padding &&
				objX <= this.x + this.width - this.padding &&
				objY >= this.y + this.padding &&
				objY <= this.y + this.height - this.padding
			) {
				context.beginPath();
				context.arc(objX, objY, 2, 0, Math.PI * 2);
				context.fill();
			}
		}

		// Draw the ship at the center
		context.fillStyle = this.shipColor;
		context.beginPath();
		context.arc(centerX, centerY, 3, 0, Math.PI * 2);
		context.fill();

		// Restore the canvas state
		context.restore();
	}
}

export default MiniMap;
