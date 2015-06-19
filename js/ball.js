function Ball(x, y, r, elast) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.elast = elast;
    this.vy = 0;
    this.vx = 0;
    this.m = ((4 * Math.PI * Math.pow(this.r, 3)) / 3) * 1;
}

Ball.prototype = Object.create(Figure.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.trace = function(context) {
    context.beginPath();
    context.setLineDash([2, 3]);
    context.strokeStyle = this.color;
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    context.stroke();
};

Ball.prototype.draw = function(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    context.fill();
};

Ball.prototype.animate = function() {
    this.vy += this.physics.g;
    this.y += this.vy;
    this.x += this.vx;
    this.checkWalls();
};

Ball.prototype.collide = function(otherFigure) {
    if (otherFigure instanceof Ball) {
        var distX = this.x - otherFigure.x;
        var distY = this.y - otherFigure.y;

        var ang = Math.atan2(distX, distY);
        var mag1 = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        var mag2 = Math.sqrt(otherFigure.vx * otherFigure.vx + otherFigure.vy * otherFigure.vy);
        var dir1 = Math.atan2(this.vy, this.vx);
        var dir2 = Math.atan2(otherFigure.vy, otherFigure.vx);

        var vxNew1 = mag1 * Math.cos(dir1 - ang);
        var vyNew1 = mag1 * Math.sin(dir1 - ang);
        var vxNew2 = mag2 * Math.cos(dir2 - ang);
        var vyNew2 = mag2 * Math.sin(dir2 - ang);

        var vxNewFinal1 = ((2 * otherFigure.m) * vxNew2 + (this.m - otherFigure.m) * vxNew1) / (this.m + otherFigure.m);
        var vxNewFinal2 = ((2 * this.m) * vxNew1 + (otherFigure.m - this.m) * vxNew2) / (this.m + otherFigure.m);
        var vyNewFinal1 = vyNew1;
        var vyNewFinal2 = vyNew2;

        this.vx = Math.cos(ang) * vxNewFinal1 + Math.cos(ang + Math.PI/2) * vyNewFinal1;
        this.vy = Math.sin(ang) * vxNewFinal1 + Math.sin(ang + Math.PI/2) * vyNewFinal1;
        otherFigure.vx = Math.cos(ang) * vxNewFinal2 + Math.cos(ang + Math.PI/2) * vyNewFinal2;
        otherFigure.vy = Math.sin(ang) * vxNewFinal2 + Math.sin(ang + Math.PI/2) * vyNewFinal2;
    } else {
        // Simply bounce off if there was a box in the way
        this.y = otherFigure.y - this.r;
        this.bounce();
    }
};

Ball.prototype.bounce = function() {
    this.vy *= -this.elast;
};

Ball.prototype.checkWalls = function() {
    if (this.y + this.r > this.$canvas.height) {
        this.y = this.$canvas.height - this.r;
        this.bounce();
    }
    if (this.x + this.r > this.$canvas.width || this.x < this.r) {
        this.vx *= -this.elast;
    }

    // Handle situations when ball gets stuck to the bottom of the canvas
    var drowned = this.y + this.r - this.$canvas.height;
    if (drowned >= 0) {
        this.y -= 2 * drowned;
    }
};