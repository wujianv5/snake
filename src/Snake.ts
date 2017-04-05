/**
* name 
*/
module com.test {

const _PI = Math.PI;
const _2PI = _PI * 2;
const _PI_2 = _PI / 2;
const ANGLE_VELOCITY = _PI_2 / 10;	// 90 degrees per frames
const INIT_LENGTH = 5;
const HEAD_POOL_SIGN = "snake_head";
const BODY_POOL_SIGN = "snake_body";
const POINT_POOL_SIGN = "point";

export class Snake extends Laya.Sprite {

	readonly velocity: number = 3;
	vx: number = 0;
	vy: number = -this.velocity;

	angle: number = _2PI * 3 / 4;
	targetAngle: number = this.angle;
	angleVelocity: number = ANGLE_VELOCITY;

	gameScene: GameScene;
	baseZ: number;
	bodies: Body[] = [];
	lastPos: Laya.Point = new Laya.Point();

	constructor(scene: GameScene, baseZ: number, x: number, y: number) {
		super();

		this.gameScene = scene;
		this.baseZ = baseZ;

		this.addBody(Laya.Pool.getItemByClass(HEAD_POOL_SIGN, Head));
		for (let i = 0; i < INIT_LENGTH - 1; ++i) {
			this.addBody(this.newBody());
		}

		this.reset(x, y);

		this.frameLoop(1, this, this.update);
		this.on("change_dir", this, this.onDirChanged);
	}

	newBody() : Body {
		return Laya.Pool.getItemByClass(BODY_POOL_SIGN, Body);
	}

	addBody(body: Body) {
		body.zOrder = this.baseZ -this.bodies.length;
		if (this.bodies.length > 0) {
			let last = this.bodies[this.bodies.length - 1];
			body.pos(last.x, last.y);
		}
		this.bodies.push(body);
		this.gameScene.playGround.addChild(body);
	}

	onDirChanged(radians: number) {
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
	}

	calcVelocity() {
		this.vx = this.velocity * Math.cos(this.angle);
		this.vy = this.velocity * Math.sin(this.angle);
	}

	update() {
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
		}
		this.x += this.vx;
		this.y += this.vy;

		this.updateBodies();
	}

	updateBodies() {
		this.bodies[0].updatePos(this);
		for (let i = 1; i < this.bodies.length; ++i) {
			this.bodies[i].updatePos(this.bodies[i - 1]);
		}
	}

	getLastPoint() {
		return this.lastPos.setTo(this.x, this.y);
	}

	getHeadRadius() {
		return this.bodies[0].radius;
	}

	reset(x: number, y: number) {
		this.pos(x, y);
		this.angle = 0;

		this.angle = _2PI * 3 / 4;
		this.targetAngle = this.angle;
		this.angleVelocity = ANGLE_VELOCITY;

		this.calcVelocity();

		while (this.bodies.length > INIT_LENGTH) {
			let body = this.bodies.pop();
			Laya.Pool.recover(BODY_POOL_SIGN, body);
			body.removeSelf();
		}
		for (let i = 0; i < this.bodies.length; ++i) {
			let body = this.bodies[i];
			body.pos(x, y);
			body.reset();
		}
	}
}

const MAX_HISTORY = 8;

class Body extends Laya.Sprite {
	
	historyPos: Laya.Point[] = [];
	historyPosIdx: number = -1;
	readonly radius: number = 15;

	constructor() {
		super();

		this.graphics.drawCircle(0, 0, this.radius, "#0000FF");
	}


	updatePos(p: {getLastPoint():Laya.Point}) {
		let lp = p.getLastPoint();
		if (lp) {
			if (this.historyPos.length < MAX_HISTORY) {
				let point:Laya.Point = Laya.Pool.getItemByClass(POINT_POOL_SIGN, Laya.Point);
				this.historyPos.push(point.setTo(lp.x, lp.y));
				this.historyPosIdx = this.historyPos.length;
				if (this.historyPosIdx == MAX_HISTORY)
					this.historyPosIdx = 0;
			}
			else {
				this.historyPos[this.historyPosIdx].setTo(lp.x, lp.y);
				this.historyPosIdx++;
				if (this.historyPosIdx == this.historyPos.length)
					this.historyPosIdx = 0;
			}
			this.pos(lp.x, lp.y, true);
		}
	}

	getLastPoint(): Laya.Point {
		if (this.historyPos.length == 0)
			return null;

		if (this.historyPos.length < MAX_HISTORY) {
			return this.historyPos[0];
		}
				
		return this.historyPos[this.historyPosIdx];
	}

	reset() {
		while (this.historyPos.length > 0) {
			let point = this.historyPos.pop();
			Laya.Pool.recover(POINT_POOL_SIGN, point);
		}
		this.historyPosIdx = -1;
	}
}

class Head extends Body {

	constructor() {
		super();

		this.graphics.clear();
		this.graphics.drawCircle(0, 0, 15, "#FF0000");
	}
}

}