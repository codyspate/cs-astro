import InputController from "./input-controller.js";
import MapController from "./map.js";
import { updateMovement } from "./movement.js";
import { Ship } from "./ship.js";
import { State } from "./state.js";
import { ObjectController } from "./object-controller.js";
import MiniMap from "./mini-map.js";

class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private isRunning: boolean;
    private lastTime: number;
    public ship: Ship;
    public input: InputController;
    public map: MapController;
    public state: State;
    // public miniMap: MiniMap;
    private objectController: ObjectController;
    public isLoading = false;
    public isLoaded = false;
    private url?: URL;
    // New properties for controlling API object load frequency
    private lastObjectLoadTime: number;
    private objectLoadInterval: number; // in milliseconds

    constructor(canvas: HTMLCanvasElement, options?: { url?: URL }) {
        // Set up canvas and context
        this.canvas = canvas;
        this.context = canvas.getContext("2d")!;
        this.updateCanvasSize();

        // Initialize game state
        this.isRunning = false;
        this.lastTime = 0;
        this.input = new InputController();
        this.ship = new Ship(this.canvas.width / 2, this.canvas.height / 2);
        this.map = new MapController(this.canvas.width, this.canvas.height);
        this.state = new State(this.ship);
        // this.miniMap = new MiniMap(150, 150, this.canvas.width - 170, 20, 0.0005);

        // Initialize ObjectController with an empty array of SpaceObjects.
        this.objectController = new ObjectController([]);

        // Initialize the last object load time and set the desired interval (e.g. every 5 seconds)
        this.lastObjectLoadTime = performance.now();
        this.objectLoadInterval = 5000; // 5000ms = 5 seconds

        // Listen for window resize events
        window.addEventListener("resize", this.handleResize.bind(this));
        this.url = options?.url;
    }

    private updateCanvasSize(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private handleResize(): void {
        this.updateCanvasSize();
        this.ship.posX = this.canvas.width / 2;
        this.ship.posY = this.canvas.height / 2;
    }

    public async load(): Promise<void> {
        this.isLoading = true;
        await this.objectController.loadObjects();
        this.isLoading = false;
        this.isLoaded = true;
    }

    public start(): void {
        if (!this.isLoaded) {
            console.warn("Game is not loaded yet. Call load() before starting the game.");
            return;
        }
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    public stop(): void {
        this.isRunning = false;
    }

    private gameLoop(): void {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update game objects
        updateMovement(this.ship, this.input, deltaTime, this.canvas);
        this.ship.update(deltaTime, this.input);
        this.map.update(this.ship, deltaTime);

        // // Load space objects for a buffered area if enough time has passed
        // if (currentTime - this.lastObjectLoadTime > this.objectLoadInterval || !this.lastObjectLoadTime) {
        //     this.lastObjectLoadTime = currentTime;
        //     this.objectController
        //         .loadObjectsForArea(
        //             this.ship.worldX,
        //             this.ship.worldY,
        //             this.canvas.width,
        //             this.canvas.height,
        //             this.url
        //         )
        //         .catch((err) => console.error("Failed to load SpaceObjects:", err));
        // }

        // Render the scene
        this.render();

        // Update the state
        this.state.backgroundUpdate();

        requestAnimationFrame(() => this.gameLoop());
    }

    private render(): void {
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the background map
        this.map.render(this.context, this.ship);

        // Render the ship (and its weapon)
        this.ship.render(this.context);

        // this.miniMap.render(this.context, this.ship, this.objectController.getObjectsInView(
        //     this.ship.worldX,
        //     this.ship.worldY,
        //     this.canvas.width,
        //     this.canvas.height
        // ));

        // Optionally: Render loaded SpaceObjects if you wish to display them
        // const spaceObjects = this.objectController.getObjectsInView(
        //     this.ship.worldX,
        //     this.ship.worldY,
        //     this.canvas.width,
        //     this.canvas.height
        // );
        // spaceObjects.forEach((obj) => obj.render(this.context, this.ship.worldX, this.ship.worldY));

        // Render HUD: display ship's world coordinates
        this.context.font = "12px monospace";
        this.context.fillStyle = "yellow";
        this.context.fillText(
            `Coordinates: (${(this.ship.worldX / 1000).toFixed(4)}, ${(this.ship.worldY / 1000).toFixed(4)})`,
            10,
            20,

        );
        this.context.fillText(
            "Controls: WASD QE",
            this.canvas.width - 160,
            20,

        );
        this.context.fillText(
            `Ammo: ${Math.floor(this.ship.weapon.ammo)}/${this.ship.weapon.maxAmmo}`,
            10,
            this.canvas.height - 20
        );
    }
}

export default Game;