/**
* name 
*/
module com.test {

export const ZORDER_BOUNDARY = -1000000;
export const ZORDER_FOOD = ZORDER_BOUNDARY + 1;

export class GameScene extends Laya.Sprite {

    inputController: InputController;
	hero: Snake;
    gameController: GameController;
    boundary: Boundary;
    playGround: Laya.Sprite;
	readonly groundWidth: number = 2000;
	readonly groundHeight: number = 2000;

	constructor() {
		super();

        let stageWidth = Laya.stage.width;
        let stageHeight = Laya.stage.height;
		
		this.hitArea = new Laya.Rectangle(-stageWidth, -stageHeight, stageWidth * 3, stageHeight * 3);

        let rootSprite = new Laya.Sprite();
        rootSprite.pos(-this.groundWidth / 2 + stageWidth / 2, -this.groundHeight / 2 + stageHeight / 2);
        this.addChild(rootSprite);

        this.playGround = new Laya.Sprite();
        rootSprite.addChild(this.playGround);

        this.boundary = new Boundary(this.groundWidth, this.groundHeight);
        this.boundary.zOrder = ZORDER_BOUNDARY;
        this.playGround.addChild(this.boundary);

		this.hero = new Snake(this, 0, this.groundWidth / 2, this.groundHeight / 2);

        this.inputController = new InputController();
        this.inputController.x = stageWidth / 2;
        this.inputController.y = stageHeight - this.inputController.height / 2 - 80;
        this.inputController.setControllable(this.hero);
        this.addChild(this.inputController);

        // init game controller after all others've been inited.
        this.gameController = new GameController(this);

        this.frameLoop(1, this.gameController, this.gameController.update);

		this.on(Laya.Event.MOUSE_MOVE, this.inputController, this.inputController.onTouchMove);
        this.on(Laya.Event.MOUSE_UP, this.inputController, this.inputController.onTouchUp);
	}
}

}