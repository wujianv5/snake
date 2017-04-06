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
var com;
(function (com) {
    var test;
    (function (test) {
        var InputController = (function (_super) {
            __extends(InputController, _super);
            function InputController() {
                var _this = _super.call(this) || this;
                _this.radius = 60;
                _this.innerRadius = 30;
                _this.tmpPoint = new Laya.Point();
                _this.touching = false;
                _this.controllable = null;
                _this.hitArea = new Laya.Rectangle(-_this.radius, -_this.radius, _this.radius * 2, _this.radius * 2);
                _this.backgroundSp = new Laya.Sprite();
                _this.controlSp = new Laya.Sprite();
                _this.addChild(_this.backgroundSp);
                _this.addChild(_this.controlSp);
                _this.size(_this.radius * 2, _this.radius * 2);
                // TODO: change looking
                _this.backgroundSp.graphics.drawCircle(0, 0, _this.radius, "#999999");
                _this.controlSp.graphics.drawCircle(0, 0, _this.innerRadius, "#aaaaaa");
                _this.on(Laya.Event.MOUSE_DOWN, _this, _this.onTouchDown);
                return _this;
            }
            InputController.prototype.calcDirection = function (touchX, touchY) {
                this.tmpPoint.setTo(0, 0);
                this.localToGlobal(this.tmpPoint);
                var dx = touchX - this.tmpPoint.x;
                var dy = touchY - this.tmpPoint.y;
                var radian = Math.atan2(dy, dx);
                var d = Math.min(Math.sqrt(dx * dx + dy * dy), this.radius - this.innerRadius);
                this.controlSp.x = Math.cos(radian) * d;
                this.controlSp.y = Math.sin(radian) * d;
                if (this.controllable)
                    this.controllable.event("change_dir", radian);
            };
            InputController.prototype.onTouchDown = function (e) {
                this.touching = true;
                this.calcDirection(e.stageX, e.stageY);
            };
            InputController.prototype.onTouchMove = function (e) {
                if (this.touching) {
                    this.calcDirection(e.stageX, e.stageY);
                }
            };
            InputController.prototype.onTouchUp = function () {
                this.touching = false;
                this.controlSp.pos(0, 0);
            };
            InputController.prototype.setControllable = function (s) {
                this.controllable = s;
            };
            return InputController;
        }(Laya.Sprite));
        test.InputController = InputController;
    })(test = com.test || (com.test = {}));
})(com || (com = {}));
//# sourceMappingURL=InputController.js.map