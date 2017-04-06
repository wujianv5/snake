/**
* name 
*/
module com.test {

const IMGS: string[] = [
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

export class Food extends Laya.Sprite {

	readonly radius: number = 5;

	constructor() {
		super();

		let idx = Math.min(Math.floor(Math.random() * IMGS.length), IMGS.length - 1);
		let texture: Laya.Texture = Laya.Loader.getRes(IMGS[idx]);
		this.size(texture.width, texture.height);
		this.graphics.drawTexture(texture, -texture.width / 2, -texture.height / 2, texture.width, texture.height);
		this.radius = Math.min(texture.width, texture.height) / 2;
	}
}

}