/**
* name 
*/
module com.test {

export class GameController {

	gameScene: GameScene;

	constructor(gameScene: GameScene) {
		this.gameScene = gameScene;
	}

	update() {
		let hero = this.gameScene.hero;
		let ground = this.gameScene.playGround;
		ground.pos(-hero.x, -hero.y);

		let boundary = this.gameScene.boundary;
		let radius = hero.getHeadRadius();
		let leftBound = -boundary.width / 2;
		let rightBound = leftBound + boundary.width;
		let topBound = -boundary.height / 2;
		let bottomBound = topBound + boundary.height;
		if (hero.x - radius < leftBound || hero.x + radius > rightBound 
			|| hero.y - radius < topBound || hero.y + radius > bottomBound) {
			this.gameOver();
		}
	}

	gameOver() {
		this.gameScene.hero.reset(0, 0);
		this.gameScene.playGround.pos(0, 0);
	}
}

}