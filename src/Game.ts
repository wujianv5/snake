// 程序入口

module com.test {

export class GameMain {

    inited: boolean = false;

    constructor() {
        Laya.init(720, 400, Laya.WebGL);
        Laya.stage.scaleMode="fixedwidth";
        Laya.stage.screenMode = "vertical"
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);

        Laya.Stat.show(0,0);
    }

    onResize() {
        if (!this.inited) {
            this.inited = true;
            Laya.stage.bgColor = "#EEEEEE";
            console.log("start load resources");
            Laya.loader.load("res/atlas/game.json", Laya.Handler.create(this, this.onLoaded), null, Laya.Loader.ATLAS)
        }
    }

    onLoaded() {
        this.initGameScene();
    }

    initGameScene() {
        let stageWidth = Laya.stage.width;
        let stageHeight = Laya.stage.height;
        console.log("stage size: " + stageWidth + ", " + stageHeight);
        console.log("client size: " + Laya.Browser.clientWidth + ", " + Laya.Browser.clientHeight);
        Laya.stage.addChild(new GameScene());
    }
}

}

new com.test.GameMain();