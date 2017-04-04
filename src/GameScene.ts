/**
* name 
*/
module com.test {

export class GameScene extends Laya.Sprite {

    inputController: InputController;
	hero: Snake;

	constructor(width: number, height: number) {
		super();
		
		this.size(width, height);

		this.hero = new Snake(this, 0, width / 2, height / 2);

        this.inputController = new InputController();
        this.inputController.x = width / 2;
        this.inputController.y = height - this.inputController.height / 2 - 80;
        this.inputController.setControllable(this.hero);
        this.addChild(this.inputController);

		this.on(Laya.Event.MOUSE_MOVE, this.inputController, this.inputController.onTouchMove);
        this.on(Laya.Event.MOUSE_UP, this.inputController, this.inputController.onTouchUp);
	}
}

}