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
        var IMGS = [
            "game/food_1.png",
            "game/food_2.png",
            "game/food_3.png",
            "game/food_4.png",
            "game/food_5.png",
            "game/food_6.png",
            "game/food_7.png",
            "game/food_8.png",
            "game/food_9.png",
            "game/food_10.png",
        ];
        var Food = (function (_super) {
            __extends(Food, _super);
            function Food() {
                var _this = _super.call(this) || this;
                _this.radius = 5;
                var idx = Math.min(Math.floor(Math.random() * IMGS.length), IMGS.length - 1);
                var texture = Laya.Loader.getRes(IMGS[idx]);
                _this.size(texture.width, texture.height);
                _this.graphics.drawTexture(texture, -texture.width / 2, -texture.height / 2, texture.width, texture.height);
                _this.radius = Math.min(texture.width, texture.height) / 2;
                return _this;
            }
            return Food;
        }(Laya.Sprite));
        test.Food = Food;
    })(test = com.test || (com.test = {}));
})(com || (com = {}));
//# sourceMappingURL=Food.js.map