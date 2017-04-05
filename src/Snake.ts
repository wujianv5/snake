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

const SNAKE_TEXTURE_MATRIX = new laya.maths.Matrix();
SNAKE_TEXTURE_MATRIX.rotate(_PI_2);

export class Snake extends Laya.Sprite {

	readonly velocity: number = 4;
	vx: number = 0;
	vy: number = -this.velocity;

	angle: number = _2PI * 3 / 4;
	targetAngle: number = this.angle;
	angleVelocity: number = ANGLE_VELOCITY;
	angleDegrees: number = this.angle * 180 / _PI;

	gameScene: GameScene;
	baseZ: number;
	bodies: Body[] = [];
	lastPos: HistoryPos = new HistoryPos();

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
		body.zOrder = this.baseZ - this.bodies.length;
		if (this.bodies.length > 0) {
			let last = this.bodies[this.bodies.length - 1];
			let lp = last.getLastPos();
			body.pos(lp.x, lp.y, true);
			body.rotation = lp.r;
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
			this.angleDegrees = this.angle * 180 / _PI;
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

	getLastPos(): HistoryPos {
		return this.lastPos.set(this.x, this.y, this.angleDegrees);
	}

	getHeadRadius() {
		return this.bodies[0].radius;
	}

	reset(x: number, y: number) {
		this.pos(x, y, true);
		this.angle = 0;

		this.angle = _2PI * 3 / 4;
		this.targetAngle = this.angle;
		this.angleVelocity = ANGLE_VELOCITY;
		this.angleDegrees = this.angle * 180 / _PI;

		this.calcVelocity();

		while (this.bodies.length > INIT_LENGTH) {
			let body = this.bodies.pop();
			Laya.Pool.recover(BODY_POOL_SIGN, body);
			body.removeSelf();
		}
		for (let i = 0; i < this.bodies.length; ++i) {
			let body = this.bodies[i];
			body.pos(x, y, true);
			body.reset();
		}
	}
}

const MAX_HISTORY = 8;

class HistoryPos {
	x: number;
	y: number;
	r: number;	// rotation in degrees
	set(x:number, y:number, r:number) {
		this.x = x;
		this.y = y;
		this.r = r;
		return this;
	}
}

class Body extends Laya.Sprite {
	
	historyPos: HistoryPos[] = [];
	historyPosIdx: number = -1;
	protected _radius: number = 15;

	constructor() {
		super();

		this.setupLooking();		
	}

	get radius(): number {
		return this._radius;
	}

	setupLooking() {
		let texture: Laya.Texture = Laya.Loader.getRes("game/skin_1_body.png");
		this.size(texture.width, texture.height);
		this.graphics.drawTexture(texture, -texture.width / 2, -texture.height / 2, texture.width, texture.height, SNAKE_TEXTURE_MATRIX);
		this._radius = Math.min(texture.width, texture.height) / 2;
		
	}

	updatePos(p: {getLastPos():HistoryPos}) {
		let lp = p.getLastPos();
		if (lp) {
			if (this.historyPos.length < MAX_HISTORY) {
				let pos:HistoryPos = Laya.Pool.getItemByClass(POINT_POOL_SIGN, HistoryPos);
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
	}

	getLastPos(): HistoryPos {
		if (this.historyPos.length == 0)
			return null;

		if (this.historyPos.length < MAX_HISTORY) {
			return this.historyPos[0];
		}
				
		return this.historyPos[this.historyPosIdx];
	}

	reset() {
		while (this.historyPos.length > 0) {
			let pos = this.historyPos.pop();
			Laya.Pool.recover(POINT_POOL_SIGN, pos);
		}
		this.historyPosIdx = -1;
	}
}

class Head extends Body {

	constructor() {
		super();
	}

	setupLooking() {
		let texture: Laya.Texture = Laya.Loader.getRes("game/skin_1_head.png");
		this.size(texture.width, texture.height);
		
		this.graphics.drawTexture(texture, -texture.width / 2, -texture.height / 2, texture.width, texture.height, SNAKE_TEXTURE_MATRIX);
		this._radius = Math.min(texture.width, texture.height) / 2;
	}
}

}