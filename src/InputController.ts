module com.test {

    export class InputController extends Laya.Sprite {
        
        radius: number = 60;
        innerRadius: number = 30;
        tmpPoint: Laya.Point = new Laya.Point();
        touching: boolean = false;

        backgroundSp: Laya.Sprite;
        controlSp: Laya.Sprite;
        controllable: Laya.Sprite = null;

        constructor() {
            super();
            
            this.hitArea = new Laya.Rectangle(-this.radius, -this.radius, this.radius * 2, this.radius * 2);

            this.backgroundSp = new Laya.Sprite();
            this.controlSp = new Laya.Sprite();
            this.addChild(this.backgroundSp);
            this.addChild(this.controlSp);

            this.size(this.radius * 2, this.radius * 2);

            // TODO: change looking
            this.backgroundSp.graphics.drawCircle(0, 0, this.radius, "#999999");
            this.controlSp.graphics.drawCircle(0, 0, this.innerRadius, "#aaaaaa");
            
            this.on(Laya.Event.MOUSE_DOWN, this, this.onTouchDown);
        }

        calcDirection(touchX: number,touchY: number) {
            this.tmpPoint.setTo(0, 0);
            this.localToGlobal(this.tmpPoint);
            let dx = touchX - this.tmpPoint.x;
            let dy = touchY - this.tmpPoint.y;
            let radian = Math.atan2(dy, dx);
            let d = Math.min(Math.sqrt(dx * dx + dy * dy), this.radius - this.innerRadius);
            this.controlSp.x = Math.cos(radian) * d;
            this.controlSp.y = Math.sin(radian) * d;
            if (this.controllable)
                this.controllable.event("change_dir", radian);
        }

        onTouchDown(e : Laya.Event) {
            this.touching = true;
            this.calcDirection(e.stageX, e.stageY);
        }

        onTouchMove(e : Laya.Event) {
            if (this.touching) {
                this.calcDirection(e.stageX, e.stageY);
            }
        }

        onTouchUp() {
            this.touching = false;
            this.controlSp.pos(0, 0);
        }

        setControllable(s: Laya.Sprite) {
            this.controllable = s;
        }
    }
}