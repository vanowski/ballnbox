function Box(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Box.prototype = Object.create(Figure.prototype);
Box.prototype.constructor = Box;

Box.prototype.trace = function(context) {
    context.beginPath();
    context.setLineDash([2, 3]);
    context.strokeStyle = this.color;
    context.rect(this.x, this.y, this.w, this.h);
    context.stroke();
};

Box.prototype.draw = function(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.w, this.h);
};