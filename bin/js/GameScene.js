var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
* name
*/
var com;
(function (com) {
    var test;
    (function (test) {
        test.ZORDER_BOUNDARY = -1000000;
        test.ZORDER_FOOD = test.ZORDER_BOUNDARY + 1;
        var GameScene = (function (_super) {
            __extends(GameScene, _super);
            function GameScene() {
                var _this = _super.call(this) || this;
                _this.groundWidth = 2000;
                _this.groundHeight = 2000;
                console.log("game scene init start");
                var stageWidth = Laya.stage.width;
                var stageHeight = Laya.stage.height;
                _this.hitArea = new Laya.Rectangle(-stageWidth, -stageHeight, stageWidth * 3, stageHeight * 3);
                var rootSprite = new Laya.Sprite();
                rootSprite.pos(-_this.groundWidth / 2 + stageWidth / 2, -_this.groundHeight / 2 + stageHeight / 2);
                _this.addChild(rootSprite);
                _this.playGround = new Laya.Sprite();
                rootSprite.addChild(_this.playGround);
                _this.boundary = new test.Boundary(_this.groundWidth, _this.groundHeight);
                _this.boundary.zOrder = test.ZORDER_BOUNDARY;
                _this.playGround.addChild(_this.boundary);
                _this.hero = new test.Snake(_this, 0, _this.groundWidth / 2, _this.groundHeight / 2);
                _this.inputController = new test.InputController();
                _this.inputController.x = stageWidth / 2;
                _this.inputController.y = stageHeight - _this.inputController.height / 2 - 80;
                _this.inputController.setControllable(_this.hero);
                _this.addChild(_this.inputController);
                // init game controller after all others've been inited.
                _this.gameController = new test.GameController(_this);
                _this.frameLoop(1, _this.gameController, _this.gameController.update);
                _this.on(Laya.Event.MOUSE_MOVE, _this.inputController, _this.inputController.onTouchMove);
                _this.on(Laya.Event.MOUSE_UP, _this.inputController, _this.inputController.onTouchUp);
                console.log("game scene init ok");
                return _this;
            }
            return GameScene;
        }(Laya.Sprite));
        test.GameScene = GameScene;
    })(test = com.test || (com.test = {}));
})(com || (com = {}));
//# sourceMappingURL=GameScene.js.map