/**
* name 
*/
module com.test {

export class Food extends Laya.Sprite {

	readonly radius: number = 5;

	constructor() {
		super();

		this.graphics.drawCircle(0, 0, this.radius, "#00FFFF");
	}
}

}