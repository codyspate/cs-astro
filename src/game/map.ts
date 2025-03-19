import type { Ship } from "./ship";

interface Star {
	x: number;
	y: number;
	radius: number;
	color: string;
}

interface StarLayer {
	parallax: number;
	stars: Star[];
}

const nuttyStarColor = () => {
	const color = `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)} 0.8)`;
	console.log(color);
	return color;
};

class MapController {
	private starLayers: StarLayer[];
	private canvasWidth: number;
	private canvasHeight: number;

	constructor(canvasWidth: number, canvasHeight: number) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.starLayers = [];
		this.handleResize(canvasWidth, canvasHeight);
	}

	public update(ship: Ship, deltaTime: number): void {
		// Regenerate stars if they move out of the visible region with a margin
		const margin = 3000;
		const centerX = this.canvasWidth / 2;
		const centerY = this.canvasHeight / 2;

		for (const layer of this.starLayers) {
			// Calculate effective offset for the layer based on ship's world coordinates.
			const layerOffsetX = ship.worldX * layer.parallax;
			const layerOffsetY = ship.worldY * layer.parallax;
			const regionLeft = layerOffsetX - centerX - margin;
			const regionRight = layerOffsetX + centerX + margin;
			const regionTop = layerOffsetY - centerY - margin;
			const regionBottom = layerOffsetY + centerY + margin;

			for (const star of layer.stars) {
				if (
					star.x < regionLeft ||
					star.x > regionRight ||
					star.y < regionTop ||
					star.y > regionBottom
				) {
					star.x = regionLeft + Math.random() * (regionRight - regionLeft);
					star.y = regionTop + Math.random() * (regionBottom - regionTop);
					star.radius = Math.random() * 1.5 + 0.5;
					star.color =
						Math.random() > 0.91
							? nuttyStarColor()
							: `rgba(255, 255, 255, ${Math.max(0.3, Math.random())})`;
				}
			}
		}
	}

	public handleResize(width: number, height: number): void {
		this.canvasWidth = width;
		this.canvasHeight = height;

		// Recreate stars with new canvas dimensions
		this.starLayers = [
			{ parallax: 0.9, stars: [] }, // Near layer
			{ parallax: 0.6, stars: [] }, // Near layer
			{ parallax: 0.5, stars: [] }, // Middle layer
			{ parallax: 0.3, stars: [] }, // Middle layer
			{ parallax: 0.2, stars: [] }, // Far layer
		];

		const starDensity = 0.00004;
		const starsPerLayer = Math.round(
			this.canvasWidth * this.canvasHeight * starDensity,
		);
		for (const layer of this.starLayers) {
			for (let i = 0; i < starsPerLayer; i++) {
				layer.stars.push({
					x: Math.random() * this.canvasWidth * 4 - this.canvasWidth * 2,
					y: Math.random() * this.canvasHeight * 4 - this.canvasHeight * 2,
					radius: Math.random() * 1.5 + 0.5,
					color: `rgba(255, 255, 255, ${Math.max(0.3, Math.random())})`,
				});
			}
		}
	}

	public render(context: CanvasRenderingContext2D, ship: Ship): void {
		const centerX = this.canvasWidth / 2;
		const centerY = this.canvasHeight / 2;

		for (const layer of this.starLayers) {
			// Use the ship's world coordinates multiplied by the layer's parallax factor
			const layerOffsetX = ship.worldX * layer.parallax;
			const layerOffsetY = ship.worldY * layer.parallax;

			for (const star of layer.stars) {
				let starX = star.x - layerOffsetX + centerX;
				let starY = star.y - layerOffsetY + centerY;

				// Use modulo arithmetic to wrap stars around the canvas edges
				starX =
					((starX % this.canvasWidth) + this.canvasWidth) % this.canvasWidth;
				starY =
					((starY % this.canvasHeight) + this.canvasHeight) % this.canvasHeight;

				context.beginPath();
				context.arc(starX, starY, star.radius, 0, Math.PI * 2);
				context.fillStyle = star.color;
				context.fill();
			}
		}
	}
}

export default MapController;
