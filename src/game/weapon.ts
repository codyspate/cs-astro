import type InputController from "./input-controller";
import type { Ship } from "./ship";

export class Bullet {
	public posX: number;
	public posY: number;
	public startX: number;
	public startY: number;
	public velocityX: number;
	public velocityY: number;
	public radius: number;
	public isAlive: boolean;
	public maxRange: number;

	constructor(
		posX: number,
		posY: number,
		angle: number,
		speed: number,
		radius: number,
		maxRange: number,
		shipVelocityX = 0,
		shipVelocityY = 0,
	) {
		// Use the ship’s world coordinates as the bullet’s start position
		this.posX = posX;
		this.posY = posY;
		this.startX = posX;
		this.startY = posY;
		// The bullet's velocity is its own speed plus the ship's current velocity
		this.velocityX = Math.cos(angle) * speed + shipVelocityX / 6;
		this.velocityY = Math.sin(angle) * speed + shipVelocityY / 6;
		this.radius = radius;
		this.isAlive = true;
		this.maxRange = maxRange;
	}

	public update(deltaTime: number): void {
		this.posX += this.velocityX * deltaTime;
		this.posY += this.velocityY * deltaTime;

		// Compute the distance traveled from the starting point and mark as dead if too far
		const dx = this.posX - this.startX;
		const dy = this.posY - this.startY;
		const distance = Math.sqrt(dx * dx + dy * dy);
		if (distance > this.maxRange) {
			this.isAlive = false;
		}
	}

	// This render method draws the bullet at a given screen coordinate.
	public render(
		context: CanvasRenderingContext2D,
		screenX: number,
		screenY: number,
	): void {
		context.beginPath();
		context.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
		context.fillStyle = "white";
		context.fill();
	}
}

export class Weapon {
	public fireRate: number;
	public lastFireTime: number;
	public isFiring: boolean;
	public bulletSpeed: number;
	public bulletRadius: number;
	public maxBulletRange: number;
	public bullets: Bullet[];
	// Allowed fire angle in radians (bullet can only fire within this angle offset from the ship's nose)
	public allowedFireAngle: number;
	// Current firing angle based on the mouse position relative to the ship (on-screen)
	public currentFiringAngle: number;

	// Ammo count for the weapon
	public ammo: number;
	public maxAmmo = 150;

	private mouseMode = false;

	constructor(
		fireRate: number,
		bulletSpeed: number,
		bulletRadius: number,
		maxBulletRange: number,
	) {
		this.fireRate = fireRate;
		this.lastFireTime = -fireRate;
		this.isFiring = false;
		this.bulletSpeed = bulletSpeed;
		this.bulletRadius = bulletRadius;
		this.maxBulletRange = maxBulletRange;
		this.bullets = [];
		// Set default allowed fire angle to 30 degrees (in radians)
		this.allowedFireAngle = (30 * Math.PI) / 180;
		this.currentFiringAngle = 0;
		this.ammo = 100;
	}

	/**
	 * Updates the weapon.
	 *
	 * @param ship The ship that is firing.
	 * @param deltaTime Time elapsed since last update.
	 * @param input The input controller containing mouse info.
	 */
	public update(ship: Ship, deltaTime: number, input: InputController): void {
		// Compute the intended firing angle based on the mouse position relative to the on-screen ship position.
		const firingAngle = this.mouseMode
			? Math.atan2(input.mouseY - ship.posY, input.mouseX - ship.posX)
			: ship.angle;
		// Save current firing angle, so the weapon graphic can rotate with the mouse.
		this.currentFiringAngle = firingAngle;

		// Slowly regenerate ammo over time after the last fire time
		const currentTime = performance.now();
		if (currentTime - this.lastFireTime > 3000 || !this.lastFireTime) {
			this.ammo += 0.01;
			if (this.ammo > this.maxAmmo) {
				this.ammo = this.maxAmmo;
			}
		}

		this.isFiring = input.keys[" "];
		if (this.isFiring) {
			const currentTime = performance.now();
			if (currentTime - this.lastFireTime > this.fireRate) {
				// Normalize the angle difference between the ship's facing direction and firing angle.
				const angleDiff = Math.abs(
					Math.atan2(
						Math.sin(firingAngle - ship.angle),
						Math.cos(firingAngle - ship.angle),
					),
				);

				if (angleDiff <= this.allowedFireAngle) {
					if (this.ammo <= 0) {
						return;
					}
					this.lastFireTime = currentTime;
					// Use ship's world coordinates so the bullet keeps its trajectory.
					// Pass in ship.velocityX and ship.velocityY to include the ship's movement in the bullet's velocity.
					this.bullets.push(
						new Bullet(
							ship.worldX,
							ship.worldY,
							firingAngle,
							this.bulletSpeed,
							this.bulletRadius,
							this.maxBulletRange,
							ship.velocityX,
							ship.velocityY,
						),
					);
					this.ammo--;
				}
			}
		}

		for (const bullet of this.bullets) {
			bullet.update(deltaTime);
		}

		this.bullets = this.bullets.filter((bullet) => bullet.isAlive);
	}

	/**
	 * Renders each bullet relative to the camera.
	 * Assumes the camera is centered on the ship.
	 *
	 * @param context Drawing context.
	 * @param ship The ship used as camera center.
	 */
	public render(context: CanvasRenderingContext2D, ship: Ship): void {
		// Calculate the camera offset. Assuming ship.posX/Y is the on-screen center...
		const offsetX = ship.worldX - ship.posX;
		const offsetY = ship.worldY - ship.posY;
		for (const bullet of this.bullets) {
			const screenX = bullet.posX - offsetX;
			const screenY = bullet.posY - offsetY;
			bullet.render(context, screenX, screenY);
		}
	}
}
