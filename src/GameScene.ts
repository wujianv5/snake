/**
* name 
*/
module com.test {

export class GameScene extends Laya.Sprite {

    inputController: InputController;
	hero: Snake;
    gameController: GameController;
    boundary: Boundary;
    playGround: Laya.Sprite;

	constructor(width: number, height: number) {
		super();
		
		this.hitArea = new Laya.Rectangle(-width, -height, width * 2, height * 2);
        this.pos(width / 2, height / 2);

        this.playGround = new Laya.Sprite();
        this.addChild(this.playGround);

        this.boundary = new Boundary(2000);
        this.boundary.zOrder = -1000000;
        this.playGround.addChild(this.boundary);

		this.hero = new Snake(this, 0, 0, 0);

        this.inputController = new InputController();
        this.inputController.x = 0;
        this.inputController.y = height / 2 - this.inputController.height / 2 - 80;
        this.inputController.setControllable(this.hero);
        this.addChild(this.inputController);

        this.gameController = new GameController(this);

        this.frameLoop(1, this.gameController, this.gameController.update);

		this.on(Laya.Event.MOUSE_MOVE, this.inputController, this.inputController.onTouchMove);
        this.on(Laya.Event.MOUSE_UP, this.inputController, this.inputController.onTouchUp);
	}
}

}