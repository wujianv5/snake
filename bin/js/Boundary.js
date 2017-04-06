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
        var Boundary = (function (_super) {
            __extends(Boundary, _super);
            function Boundary(width, height) {
                var _this = _super.call(this) || this;
                _this.size(width, height);
                // draw background rect
                _this.graphics.drawRect(0, 0, width, height, "#FFFFFF");
                var cols = 20;
                var rows = 20;
                var colWidth = width / cols;
                var rowHeight = height / rows;
                // draw grids
                var startX = 0;
                var startY = 0;
                var endX = startX;
                var endY = startY + height;
                for (var c = 0; c <= cols; ++c) {
                    var fromX = startX + c * colWidth;
                    var fromY = startY;
                    var toX = fromX;
                    var toY = endY;
                    _this.graphics.drawLine(fromX, fromY, toX, toY, "#666666", 1);
                }
                startX = 0;
                startY = 0;
                endX = startX + width;
                endY = startY;
                for (var r = 0; r <= rows; ++r) {
                    var fromX = startX;
                    var fromY = startY + r * rowHeight;
                    var toX = endX;
                    var toY = fromY;
                    _this.graphics.drawLine(fromX, fromY, toX, toY, "#666666", 1);
                }
                return _this;
            }
            return Boundary;
        }(Laya.Sprite));
        test.Boundary = Boundary;
    })(test = com.test || (com.test = {}));
})(com || (com = {}));
//# sourceMappingURL=Boundary.js.map