/**
* name 
*/
module com.test {

const _PI = Math.PI;
const _2PI = _PI * 2;
const _PI_2 = _PI / 2;
const ANGLE_VELOCITY = _PI_2 / 20;	// 90 degrees per 20 frames

export class Snake extends Laya.Sprite {

	velocity: number = 2;
	vx: number = 0;
	vy: number = -this.velocity;

	angle: number = _2PI * 3 / 4;
	targetAngle: number = this.angle;
	angleVelocity: number = ANGLE_VELOCITY;		

	constructor() {
		super();

		this.graphics.drawCircle(0, 0, 15, "#FF0000");

		this.calcVelocity();

		this.frameLoop(1, this, this.update);
		this.on("change_dir", this, this.onDirChanged);
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
			console.log("XX-> " + this.angle + ", " + this.targetAngle + ", " + this.angleVelocity);
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
	}
}

}