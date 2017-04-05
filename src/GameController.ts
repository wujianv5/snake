/**
* name 
*/
module com.test {

const FOOD_POOL_SIGN = "food";

interface CellElement {
	x: number;
	y: number;
	gameCellRow?: number;
	gameCellCol?: number;
}

export class GameController {

	gameScene: GameScene;
	cells: CellElement[][][];
	cellRows: number;
	cellCols: number;
	readonly cellWidth: number = 100;
	readonly cellHeight: number = 100;
	foods: Food[] = [];
	readonly maxFood: number = 300;

	constructor(gameScene: GameScene) {
		this.gameScene = gameScene;
		this.cellRows = Math.ceil(this.gameScene.groundHeight / this.cellHeight);
		this.cellCols = Math.ceil(this.gameScene.groundWidth / this.cellWidth);

		this.cells = new Array<Array<Array<CellElement>>>(this.cellRows);
		for (let i = 0; i < this.cellRows; ++i) {
			this.cells[i] = new Array<Array<CellElement>>(this.cellCols);
			for (let k = 0; k < this.cellCols; ++k) {
				this.cells[i][k] = new Array<CellElement>();
			}
		}

		for (let i = 0; i < this.maxFood; ++i) {
			let x = Math.random() * this.gameScene.groundWidth;
			let y = Math.random() * this.gameScene.groundHeight;
			let food = Laya.Pool.getItemByClass(FOOD_POOL_SIGN, Food);
			food.pos(x, y);
			food.zOrder = ZORDER_FOOD;
			this.foods.push(food);
			this.addSpriteToCell(food);
			this.gameScene.playGround.addChild(food);
		}
	}

	update() {
		let hero = this.gameScene.hero;
		let playGroundX = this.gameScene.groundWidth / 2 - hero.x;
		let playGroundY = this.gameScene.groundHeight / 2 - hero.y;
		this.gameScene.playGround.pos(playGroundX, playGroundY);

		// check game over 
		let boundary = this.gameScene.boundary;
		let radius = hero.getHeadRadius();
		let leftBound = 0;
		let rightBound = leftBound + boundary.width;
		let topBound = 0;
		let bottomBound = topBound + boundary.height;
		if (hero.x - radius < leftBound || hero.x + radius > rightBound 
			|| hero.y - radius < topBound || hero.y + radius > bottomBound) {
			this.gameOver();
		}

		this.checkFood();
	}

	checkFood() {
		let hero = this.gameScene.hero;
		let cellCol = Math.floor(hero.x / this.cellWidth);
		let cellRow = Math.floor(hero.y / this.cellHeight);
		let cells = this.cells[cellRow][cellCol];

		let i = 0;
		while (i < cells.length) {
			let food = cells[i];
			
			if (food instanceof Food) {
				let dx = food.x - hero.x;
				let dy = food.y - hero.y;
				let dd = food.radius + hero.getHeadRadius();
				if (dx * dx + dy * dy < dd * dd) {
					cells[i].gameCellRow = undefined;
					cells[i].gameCellCol = undefined;
					cells.splice(i, 1);
					
					food.removeSelf();
					
					let idx = this.foods.indexOf(food);
					if (idx > -1)
						this.foods.splice(idx, 1);
					
					Laya.Pool.recover(FOOD_POOL_SIGN, food);

					let body = hero.newBody();
					hero.addBody(body);
					continue;
				}
			}
			++i;
		}
	}

	gameOver() {
		this.gameScene.hero.reset(this.gameScene.groundWidth / 2, this.gameScene.groundHeight / 2);
		this.gameScene.playGround.pos(0, 0);
	}

	addSpriteToCell(sprite: CellElement) {
		let cellRow = sprite.gameCellRow;
		let cellCol = sprite.gameCellCol;
		if (cellRow && cellCol) {
			let idx = this.cells[cellRow][cellCol].indexOf(sprite);
			if (idx > -1) {
				this.cells[cellRow][cellCol].splice(idx, 1);
			}
		}
		// XXX: all positions must be POSITIVE !!!
		cellRow = Math.floor(sprite.y / this.cellHeight);
		cellCol = Math.floor(sprite.x / this.cellWidth);
		sprite.gameCellRow = cellRow;
		sprite.gameCellCol = cellCol;
		this.cells[cellRow][cellCol].push(sprite);
	}
}

}