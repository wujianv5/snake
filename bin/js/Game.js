// 程序入口
var com;
(function (com) {
    var test;
    (function (test) {
        var GameMain = (function () {
            function GameMain() {
                this.inited = false;
                Laya.init(720, 400, Laya.WebGL);
                Laya.stage.scaleMode = "fixedwidth";
                Laya.stage.screenMode = "vertical";
                Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
                Laya.Stat.show(0, 0);
            }
            GameMain.prototype.onResize = function () {
                if (!this.inited) {
                    this.inited = true;
                    Laya.stage.bgColor = "#EEEEEE";
                    Laya.loader.load("res/atlas/game.json", Laya.Handler.create(this, this.onLoaded), null, Laya.Loader.ATLAS);
                }
            };
            GameMain.prototype.onLoaded = function () {
                console.log(Laya.Loader.loadedMap);
                for (var i in Laya.Loader.loadedMap)
                    console.log(i + " -> " + Laya.Loader.loadedMap[i]);
                this.initGameScene();
            };
            GameMain.prototype.initGameScene = function () {
                var stageWidth = Laya.stage.width;
                var stageHeight = Laya.stage.height;
                console.log("stage size: " + stageWidth + ", " + stageHeight);
                console.log("client size: " + Laya.Browser.clientWidth + ", " + Laya.Browser.clientHeight);
                Laya.stage.addChild(new test.GameScene());
            };
            return GameMain;
        }());
        test.GameMain = GameMain;
    })(test = com.test || (com.test = {}));
})(com || (com = {}));
new com.test.GameMain();
//# sourceMappingURL=Game.js.map