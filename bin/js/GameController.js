/**
* name
*/
var com;
(function (com) {
    var test;
    (function (test) {
        var FOOD_POOL_SIGN = "food";
        var GameController = (function () {
            function GameController(gameScene) {
                this.cellWidth = 100;
                this.cellHeight = 100;
                this.foods = [];
                this.maxFood = 300;
                this.gameScene = gameScene;
                this.cellRows = Math.ceil(this.gameScene.groundHeight / this.cellHeight);
                this.cellCols = Math.ceil(this.gameScene.groundWidth / this.cellWidth);
                this.cells = new Array(this.cellRows);
                for (var i = 0; i < this.cellRows; ++i) {
                    this.cells[i] = new Array(this.cellCols);
                    for (var k = 0; k < this.cellCols; ++k) {
                        this.cells[i][k] = new Array();
                    }
                }
                for (var i = 0; i < this.maxFood; ++i) {
                    var x = Math.random() * this.gameScene.groundWidth;
                    var y = Math.random() * this.gameScene.groundHeight;
                    var food = Laya.Pool.getItemByClass(FOOD_POOL_SIGN, test.Food);
                    food.pos(x, y);
                    food.zOrder = test.ZORDER_FOOD;
                    this.foods.push(food);
                    this.addSpriteToCell(food);
                    this.gameScene.playGround.addChild(food);
                }
            }
            GameController.prototype.update = function () {
                var hero = this.gameScene.hero;
                var playGroundX = this.gameScene.groundWidth / 2 - hero.x;
                var playGroundY = this.gameScene.groundHeight / 2 - hero.y;
                this.gameScene.playGround.pos(playGroundX, playGroundY);
                // check game over 
                var boundary = this.gameScene.boundary;
                var radius = hero.getHeadRadius();
                var leftBound = 0;
                var rightBound = leftBound + boundary.width;
                var topBound = 0;
                var bottomBound = topBound + boundary.height;
                if (hero.x - radius < leftBound || hero.x + radius > rightBound
                    || hero.y - radius < topBound || hero.y + radius > bottomBound) {
                    this.gameOver();
                }
                this.checkFood();
            };
            GameController.prototype.checkFood = function () {
                var hero = this.gameScene.hero;
                var cellCol = Math.floor(hero.x / this.cellWidth);
                var cellRow = Math.floor(hero.y / this.cellHeight);
                var cells = this.cells[cellRow][cellCol];
                var i = 0;
                while (i < cells.length) {
                    var food = cells[i];
                    if (food instanceof test.Food) {
                        var dx = food.x - hero.x;
                        var dy = food.y - hero.y;
                        var dd = food.radius + hero.getHeadRadius();
                        if (dx * dx + dy * dy < dd * dd) {
                            cells[i].gameCellRow = undefined;
                            cells[i].gameCellCol = undefined;
                            cells.splice(i, 1);
                            food.removeSelf();
                            var idx = this.foods.indexOf(food);
                            if (idx > -1)
                                this.foods.splice(idx, 1);
                            Laya.Pool.recover(FOOD_POOL_SIGN, food);
                            var body = hero.newBody();
                            hero.addBody(body);
                            continue;
                        }
                    }
                    ++i;
                }
            };
            GameController.prototype.gameOver = function () {
                this.gameScene.hero.reset(this.gameScene.groundWidth / 2, this.gameScene.groundHeight / 2);
                this.gameScene.playGround.pos(0, 0);
            };
            GameController.prototype.addSpriteToCell = function (sprite) {
                var cellRow = sprite.gameCellRow;
                var cellCol = sprite.gameCellCol;
                if (cellRow && cellCol) {
                    var idx = this.cells[cellRow][cellCol].indexOf(sprite);
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
            };
            return GameController;
        }());
        test.GameController = GameController;
    })(test = com.test || (com.test = {}));
})(com || (com = {}));
//# sourceMappingURL=GameController.js.map