import { Ship } from "./ship";

export class State {
    public ship: Ship;
    public isUpdating: boolean;
    private lastUpdate: number;

    constructor(ship: Ship) {
        this.ship = ship;
        this.isUpdating = false;
        this.lastUpdate = 0;
    }
    backgroundUpdate() {
        // update every 30 seconds
        if (performance.now() - this.lastUpdate > 30000 && !this.isUpdating) {
            this._update();
        }

    }
    private async _update() {
        this.isUpdating = true;
        fetch("http://localhost:3001/ship", {
            method: "POST",
            body: JSON.stringify({
                id: this.ship.id,
                posX: this.ship.posX,
                posY: this.ship.posY,
                worldX: this.ship.worldX,
                worldY: this.ship.worldY
            })
        }).then(() => {
            this.isUpdating = false;
            this.lastUpdate = performance.now()
        })

    }
}