import type InputController from "./input-controller";
import { Weapon } from "./weapon";

export class Ship {
	public id: string;
	public posX: number;
	public posY: number;
	public worldX: number;
	public worldY: number;
	public angle: number;
	public velocityX: number;
	public velocityY: number;
	public weapon: Weapon;
	public isAccelerating: boolean;

	constructor(x: number, y: number, id?: string) {
		this.id = id ?? crypto.randomUUID();
		// On-screen (local) position is centered initially
		this.posX = x;
		this.posY = y;
		// World position starts at zero (or could match on-screen center)
		// this.worldX = Math.random() * 10000;
		// this.worldY = Math.random() * 10000;
		this.worldX = 0;
		this.worldY = 0;
		this.angle = 0;
		this.velocityX = 0;
		this.velocityY = 0;
		this.isAccelerating = false;
		// Instantiate a default weapon.
		// Parameters: fireRate (ms), bulletSpeed, bulletRadius, maxBulletRange.
		this.weapon = new Weapon(200, 0.5, 2, 500);
	}

	public update(deltaTime: number, input: InputController): void {
		// Pass mouse coordinates to the weapon update.
		this.weapon.update(this, deltaTime, input);
	}

	public render(context: CanvasRenderingContext2D): void {
		context.save();
		context.translate(this.posX, this.posY);
		context.rotate(this.angle);

		// Draw a futuristic, trapezoidal ship body
		context.beginPath();
		context.moveTo(30, -7); // Nose
		context.lineTo(30, 7); // Nose
		context.lineTo(15, 10); // Lower right corner
		context.lineTo(0, 10); // Rear right corner
		// context.lineTo(-10, 0);     // Rear tip
		context.lineTo(0, -10); // Rear left corner
		context.lineTo(15, -10); // Upper right corner
		context.closePath();
		context.fillStyle = "white";
		context.fill();

		// Draw forward probes on the nose
		context.beginPath();
		context.moveTo(30, 6);
		context.lineTo(35, 6);
		context.moveTo(30, -6);
		context.lineTo(35, -6);
		context.lineWidth = 2;
		context.strokeStyle = "white";
		context.stroke();

		// If accelerating, draw the flame with a glow effect
		if (this.isAccelerating) {
			context.save(); // Isolate shadow settings for glow
			context.shadowColor = "orange";
			context.shadowBlur = 15;
			context.beginPath();
			context.moveTo(0, 5);
			context.lineTo(-10, 0);
			context.lineTo(0, -5);
			context.closePath();
			context.fillStyle = "orange";
			context.fill();
			context.restore();
		}
		context.restore();

		// Render the weapon (bullets)
		this.weapon.render(context, this);
	}
}
