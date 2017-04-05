/**
* name 
*/
module com.test {

export class Boundary extends Laya.Sprite {

	constructor(size: number) {
		super();

		let width = size;
		let height = size;

		this.size(width, height);

		// draw background rect
		this.graphics.drawRect(-width / 2, -height / 2, width, height, "#FFFFFF");

		let cols = 20;
		let rows = 20;
		let colWidth = width / cols;
		let rowHeight = height / rows;

		// draw grids
		let startX = -width / 2;
		let startY = -height / 2;
		let endX = startX;
		let endY = startY + height;
		for (let c = 0; c <= cols; ++c) {
			let fromX = startX + c * colWidth;
			let fromY = startY;
			let toX = fromX;
			let toY = endY;
			this.graphics.drawLine(fromX, fromY, toX, toY, "#666666", 1);
		}
		startX = -width / 2;
		startY = -height / 2;
		endX = startX + width;
		endY = startY;
		for (let r = 0; r <= rows; ++r) {
			let fromX = startX;
			let fromY = startY + r * rowHeight;
			let toX = endX;
			let toY = fromY;
			this.graphics.drawLine(fromX, fromY, toX, toY, "#666666", 1);
		}
	}
}

}