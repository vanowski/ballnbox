function Canvas($canvas, physics) {
    this.$canvas = $canvas;
    this.physics = physics;
    this.context = $canvas.getContext('2d');
    this.figures = [];

    this.$canvas.addEventListener('mousedown', function(e) {
        e.preventDefault();

    });

    this.$canvas.addEventListener('mousemove', function() {

    });

    this.$canvas.addEventListener('mouseup', function() {

    });
}

Canvas.prototype.dim = function() {
    this.context.globalAlpha = 0.5;
};

Canvas.prototype.restore = function() {
    this.context.globalAlpha = 1;
    this.context.restore();
};

Canvas.prototype.flush = function() {
    this.figures = this.figures.filter(function(fig) {
        return fig.finalized === true;
    });
};

Canvas.prototype.finalize = function() {
    this.figures.forEach(function(fig) {
        fig.finalize();
    });
};

Canvas.prototype.clear = function() {
    this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
};

Canvas.prototype.redraw = function() {
    this.clear();
    this.figures.forEach(function(fig) {
        if (fig.finalized) {
            fig.draw(this.context);
        } else {
            fig.trace(this.context);
        }
    }.bind(this));
};

Canvas.prototype.animate = function() {
    this.figures.forEach(function(fig) {
        if (fig.finalized) {
            fig.animate();
            this.checkCollisions(fig);
        }
    }.bind(this));
};

Canvas.prototype.render = function() {
    this.animate();
    this.redraw();
};

Canvas.prototype.addFigure = function(figure) {
    figure.$canvas = this.$canvas;
    figure.physics = this.physics;

    this.figures.push(figure);
    this.redraw();
};

Canvas.prototype.checkCollisions = function(figure) {
    this.figures.forEach(function(otherFigure) {
        if (this.collisionCandidates(figure, otherFigure)) {
            figure.collide(otherFigure);
        }
    }.bind(this));
};

Canvas.prototype.collisionCandidates = function(figure, otherFigure) {
    if (figure === otherFigure) {
        return false;
    }

    var args = [].slice.call(arguments, 0);
    var boxes = args.filter(function(arg) {
        return arg instanceof Box;
    });
    var balls = args.filter(function(arg) {
        return arg instanceof Ball;
    });

    if (boxes.length && balls.length) {
        return this.checkBallBoxCollision(balls[0], boxes[0]);
    } else if (boxes.length) {
        return false;
    } else if (balls.length === 2) {
        return this.checkBallBallCollision(balls[0], balls[1]);
    }
};

Canvas.prototype.checkBallBallCollision = function(ball1, ball2) {
    var distX = ball2.x - ball1.x;
    var distY = ball2.y - ball1.y;
    var rSum = ball1.r + ball2.r;

    return (distX * distX + distY * distY <= rSum * rSum);
};

Canvas.prototype.checkBallBoxCollision = function(ball, box) {
    var distX = Math.abs(ball.x - (box.x + box.w / 2));
    var distY = Math.abs(ball.y - (box.y + box.h / 2));

    if (distX > (ball.r + box.w / 2)) {
        return false;
    }
    if (distY > (ball.r + box.h / 2)) {
        return false;
    }
    if (distX <= box.w) {
        return true;
    }
    if (distY <= box.h) {
        return true;
    }

    var dx = distX - box.w;
    var dy = distY - box.h;

    return (dx * dx + dy * dy <= ball.r * ball.r);
};
