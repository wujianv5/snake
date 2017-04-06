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
        var _PI = Math.PI;
        var _2PI = _PI * 2;
        var _PI_2 = _PI / 2;
        var ANGLE_VELOCITY = _PI_2 / 10; // 90 degrees per frames
        var INIT_LENGTH = 5;
        var HEAD_POOL_SIGN = "snake_head";
        var BODY_POOL_SIGN = "snake_body";
        var POINT_POOL_SIGN = "point";
        var SNAKE_TEXTURE_MATRIX = new laya.maths.Matrix();
        SNAKE_TEXTURE_MATRIX.rotate(_PI_2);
        var Snake = (function (_super) {
            __extends(Snake, _super);
            function Snake(scene, baseZ, x, y) {
                var _this = _super.call(this) || this;
                _this.velocity = 4;
                _this.vx = 0;
                _this.vy = -_this.velocity;
                _this.angle = _2PI * 3 / 4;
                _this.targetAngle = _this.angle;
                _this.angleVelocity = ANGLE_VELOCITY;
                _this.angleDegrees = _this.angle * 180 / _PI;
                _this.bodies = [];
                _this.lastPos = new HistoryPos();
                _this.gameScene = scene;
                _this.baseZ = baseZ;
                _this.addBody(Laya.Pool.getItemByClass(HEAD_POOL_SIGN, Head));
                for (var i = 0; i < INIT_LENGTH - 1; ++i) {
                    _this.addBody(_this.newBody());
                }
                _this.reset(x, y);
                _this.frameLoop(1, _this, _this.update);
                _this.on("change_dir", _this, _this.onDirChanged);
                return _this;
            }
            Snake.prototype.newBody = function () {
                return Laya.Pool.getItemByClass(BODY_POOL_SIGN, Body);
            };
            Snake.prototype.addBody = function (body) {
                body.zOrder = this.baseZ - this.bodies.length;
                if (this.bodies.length > 0) {
                    var last = this.bodies[this.bodies.length - 1];
                    var lp = last.getLastPos();
                    body.pos(lp.x, lp.y, true);
                    body.rotation = lp.r;
                }
                this.bodies.push(body);
                this.gameScene.playGround.addChild(body);
            };
            Snake.prototype.onDirChanged = function (radians) {
                if (radians < 0)
                    radians += _2PI;
                this.targetAngle = radians;
                if (radians > this.angle) {
                    if (radians > this.angle + _PI)
                        this.angleVelocity = -ANGLE_VELOCITY;
                    else
                        this.angleVelocity = ANGLE_VELOCITY;
                }
                else {
                    if (radians < this.angle - _PI)
                        this.angleVelocity = ANGLE_VELOCITY;
                    else
                        this.angleVelocity = -ANGLE_VELOCITY;
                }
            };
            Snake.prototype.calcVelocity = function () {
                this.vx = this.velocity * Math.cos(this.angle);
                this.vy = this.velocity * Math.sin(this.angle);
            };
            Snake.prototype.update = function () {
                if (this.angle != this.targetAngle) {
                    if (Math.abs(this.angle - this.targetAngle) <= Math.abs(this.angleVelocity))
                        this.angle = this.targetAngle;
                    else {
                        this.angle += this.angleVelocity;
                        if (this.angle < 0)
                            this.angle += _2PI;
                        else if (this.angle >= _2PI)
                            this.angle -= _2PI;
                    }
                    this.calcVelocity();
                    this.angleDegrees = this.angle * 180 / _PI;
                }
                this.x += this.vx;
                this.y += this.vy;
                this.updateBodies();
            };
            Snake.prototype.updateBodies = function () {
                this.bodies[0].updatePos(this);
                for (var i = 1; i < this.bodies.length; ++i) {
                    this.bodies[i].updatePos(this.bodies[i - 1]);
                }
            };
            Snake.prototype.getLastPos = function () {
                return this.lastPos.set(this.x, this.y, this.angleDegrees);
            };
            Snake.prototype.getHeadRadius = function () {
                return this.bodies[0].radius;
            };
            Snake.prototype.reset = function (x, y) {
                this.pos(x, y, true);
                this.angle = 0;
                this.angle = _2PI * 3 / 4;
                this.targetAngle = this.angle;
                this.angleVelocity = ANGLE_VELOCITY;
                this.angleDegrees = this.angle * 180 / _PI;
                this.calcVelocity();
                while (this.bodies.length > INIT_LENGTH) {
                    var body = this.bodies.pop();
                    body.reset();
                    body.removeSelf();
                    Laya.Pool.recover(BODY_POOL_SIGN, body);
                }
                for (var i = 0; i < this.bodies.length; ++i) {
                    var body = this.bodies[i];
                    body.pos(x, y, true);
                    body.reset();
                }
            };
            return Snake;
        }(Laya.Sprite));
        test.Snake = Snake;
        var MAX_HISTORY = 8;
        var HistoryPos = (function () {
            function HistoryPos() {
            }
            HistoryPos.prototype.set = function (x, y, r) {
                this.x = x;
                this.y = y;
                this.r = r;
                return this;
            };
            return HistoryPos;
        }());
        var Body = (function (_super) {
            __extends(Body, _super);
            function Body() {
                var _this = _super.call(this) || this;
                _this.historyPos = [];
                _this.historyPosIdx = -1;
                _this._radius = 15;
                _this.setupLooking();
                return _this;
            }
            Object.defineProperty(Body.prototype, "radius", {
                get: function () {
                    return this._radius;
                },
                enumerable: true,
                configurable: true
            });
            Body.prototype.setupLooking = function () {
                var texture = Laya.Loader.getRes("game/skin_1_body.png");
                this.size(texture.width, texture.height);
                this.graphics.drawTexture(texture, -texture.width / 2, -texture.height / 2, texture.width, texture.height, SNAKE_TEXTURE_MATRIX);
                this._radius = Math.min(texture.width, texture.height) / 2;
            };
            Body.prototype.updatePos = function (p) {
                var lp = p.getLastPos();
                if (lp) {
                    if (this.historyPos.length < MAX_HISTORY) {
                        var pos = Laya.Pool.getItemByClass(POINT_POOL_SIGN, HistoryPos);
                        this.historyPos.push(pos.set(lp.x, lp.y, lp.r));
                        this.historyPosIdx = this.historyPos.length;
                        if (this.historyPosIdx == MAX_HISTORY)
                            this.historyPosIdx = 0;
                    }
                    else {
                        this.historyPos[this.historyPosIdx].set(lp.x, lp.y, lp.r);
                        this.historyPosIdx++;
                        if (this.historyPosIdx == this.historyPos.length)
                            this.historyPosIdx = 0;
                    }
                    this.pos(lp.x, lp.y, true);
                    this.rotation = lp.r;
                }
            };
            Body.prototype.getLastPos = function () {
                if (this.historyPos.length == 0)
                    return null;
                if (this.historyPos.length < MAX_HISTORY) {
                    return this.historyPos[0];
                }
                return this.historyPos[this.historyPosIdx];
            };
            Body.prototype.reset = function () {
                while (this.historyPos.length > 0) {
                    var pos = this.historyPos.pop();
                    Laya.Pool.recover(POINT_POOL_SIGN, pos);
                }
                this.historyPosIdx = -1;
            };
            return Body;
        }(Laya.Sprite));
        var Head = (function (_super) {
            __extends(Head, _super);
            function Head() {
                return _super.call(this) || this;
            }
            Head.prototype.setupLooking = function () {
                var texture = Laya.Loader.getRes("game/skin_1_head.png");
                this.size(texture.width, texture.height);
                this.graphics.drawTexture(texture, -texture.width / 2, -texture.height / 2, texture.width, texture.height, SNAKE_TEXTURE_MATRIX);
                this._radius = Math.min(texture.width, texture.height) / 2;
            };
            return Head;
        }(Body));
    })(test = com.test || (com.test = {}));
})(com || (com = {}));
//# sourceMappingURL=Snake.js.map