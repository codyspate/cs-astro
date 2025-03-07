import { Ship } from "./ship";



export function updateMovement(
    ship: Ship,
    input: { keys: Record<string, boolean> },
    deltaTime: number,
    canvas: HTMLCanvasElement
): void {
    const rotateSpeed = 0.002 * deltaTime;
    const acceleration = 0.007 * deltaTime;
    const friction = 0.99;

    // Rotate ship with A/D keys
    if (input.keys["q"] || input.keys["Q"]) {
        ship.angle -= rotateSpeed;
    }
    if (input.keys["e"] || input.keys["E"]) {
        ship.angle += rotateSpeed;
    }

    // Accelerate/decelerate with W/S keys
    if (input.keys["w"] || input.keys["W"]) {
        ship.velocityX += Math.cos(ship.angle) * acceleration;
        ship.velocityY += Math.sin(ship.angle) * acceleration;
        ship.isAccelerating = true;
    } else {
        ship.isAccelerating = false;
    }
    if (input.keys["s"] || input.keys["S"]) {
        ship.velocityX -= Math.cos(ship.angle) * acceleration;
        ship.velocityY -= Math.sin(ship.angle) * acceleration;
    }

    // Strafing with Q/E keys
    if (input.keys["a"] || input.keys["A"]) {
        ship.velocityX += Math.cos(ship.angle - Math.PI / 2) * acceleration;
        ship.velocityY += Math.sin(ship.angle - Math.PI / 2) * acceleration;
    }
    if (input.keys["d"] || input.keys["D"]) {
        ship.velocityX += Math.cos(ship.angle + Math.PI / 2) * acceleration;
        ship.velocityY += Math.sin(ship.angle + Math.PI / 2) * acceleration;
    }

    // Update the ship's world coordinates regardless of on-screen position
    ship.worldX += ship.velocityX;
    ship.worldY += ship.velocityY;

    // Apply friction to the velocity for smooth deceleration
    ship.velocityX *= friction;
    ship.velocityY *= friction;

    // The rubber band effect: gradually pull the on-screen (local) position toward canvas center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const returnRate = 0.05;
    ship.posX = lerp(ship.posX, centerX, returnRate);
    ship.posY = lerp(ship.posY, centerY, returnRate);
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}