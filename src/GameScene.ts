/**
* name 
*/
module com.test {

export class GameScene extends Laya.Sprite {

    inputController: InputController;

	constructor(width: number, height: number) {
		super();
		
		this.size(width, height);

		let snake = new Snake();
		this.addChild(snake);
		snake.pos(width / 2, height / 2);

        this.inputController = new InputController();
        this.addChild(this.inputController);
        this.inputController.x = width / 2;
        this.inputController.y = height - this.inputController.height / 2 - 80;
        this.inputController.setControllable(snake);
		this.on(Laya.Event.MOUSE_MOVE, this.inputController, this.inputController.onTouchMove);
        this.on(Laya.Event.MOUSE_UP, this.inputController, this.inputController.onTouchUp);
	}
}

}