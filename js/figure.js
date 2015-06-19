function Figure() {
    this.finalized = false;
    this.color = "silver";
}

Figure.prototype.finalize = function() {
    if (!this.finalized) {
        this.finalized = true;
        this.color = this.generateColor();
    }
};

Figure.prototype.animate = function() {};

Figure.prototype.collide = function() {};

Figure.prototype.generateColor = function() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
};