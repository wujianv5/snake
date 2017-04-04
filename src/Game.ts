// 程序入口

module com.test {

export class GameMain {
    
    inited: boolean = false;

    constructor() {
        Laya.init(600, 400, Laya.WebGL);
        Laya.stage.scaleMode="fixedwidth";
        Laya.stage.screenMode = "vertical"
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

    onResize() {
        if (!this.inited) {
            this.inited = true;
            Laya.stage.bgColor = "#EEEEEE";
            this.initGameScene();
        }
    }

    initGameScene() {
        let stageWidth = Laya.stage.width;
        let stageHeight = Laya.stage.height;
        console.log("stage size: " + stageWidth + ", " + stageHeight);
        console.log("client size: " + Laya.Browser.clientWidth + ", " + Laya.Browser.clientHeight);
        let gameScene = new GameScene(stageWidth, stageHeight);
        Laya.stage.addChild(gameScene);
    }
}

}

new com.test.GameMain();