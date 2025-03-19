export default class InputController {
	public keys: Record<string, boolean> = {};
	public mouseX: number = window.innerWidth / 2;
	public mouseY: number = window.innerHeight / 2;
	public isMouseDown = false;

	constructor() {
		window.addEventListener("keydown", this.onKeyDown.bind(this));
		window.addEventListener("keyup", this.onKeyUp.bind(this));
		window.addEventListener("mousemove", this.onMouseMove.bind(this));
		window.addEventListener("mousedown", this.onMouseDown.bind(this));
		window.addEventListener("mouseup", this.onMouseUp.bind(this));
	}

	public onKeyDown(event: KeyboardEvent): void {
		this.keys[event.key] = true;
	}

	public onKeyUp(event: KeyboardEvent): void {
		this.keys[event.key] = false;
	}

	private onMouseMove(event: MouseEvent): void {
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	}

	private onMouseDown(event: MouseEvent): void {
		this.isMouseDown = true;
	}

	private onMouseUp(event: MouseEvent): void {
		this.isMouseDown = false;
	}
}
