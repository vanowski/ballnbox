var G = 1;

function App() {
    this.g = G;
    this.init();
    this.addListeners();
}

App.prototype.init = function() {
    var $canvas = document.getElementById('canvas');
    this.physics = new Physics();
    this.canvas = new Canvas($canvas, this.physics);
};

App.prototype.addListeners = function() {
    var $ballControls = document.getElementById('ballControls');
    var $boxControls = document.getElementById('boxControls');
    var $appControls = document.getElementById('appControls');
    var $addBallRandom = document.getElementById('addBallRandom');
    var $addBoxRandom = document.getElementById('addBoxRandom');

    var $ballX = document.querySelector('[name=ballX]');
    var $ballY = document.querySelector('[name=ballY]');
    var $ballD = document.querySelector('[name=ballD]');
    var $ballElast = document.querySelector('[name=ballElast]');

    var $boxX = document.querySelector('[name=boxX]');
    var $boxY = document.querySelector('[name=boxY]');
    var $boxW = document.querySelector('[name=boxW]');
    var $boxH = document.querySelector('[name=boxH]');

    var $g = document.querySelector('[name=g]');

    function randomFromRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function addBall() {
        this.canvas.flush();
        if ($ballControls.matches(':valid')) {
            this.canvas.addFigure(new Ball(
                parseInt($ballX.value, 10),
                parseInt($ballY.value, 10),
                parseInt($ballD.value, 10) / 2,
                parseFloat($ballElast.value, 10)
            ));
        } else {
            this.canvas.redraw();
        }
    }

    function addBox() {
        this.canvas.flush();
        if ($boxControls.matches(':valid')) {
            this.canvas.addFigure(new Box(
                parseInt($boxX.value, 10),
                parseInt($boxY.value, 10),
                parseInt($boxW.value, 10),
                parseInt($boxH.value, 10)
            ));
        } else {
            this.canvas.redraw();
        }
    }

    ("keyup change keypress".split(" ")).forEach(function(event) {
        $ballControls.addEventListener(event, addBall.bind(this));
        $boxControls.addEventListener(event, addBox.bind(this));
    }.bind(this));

    $addBallRandom.addEventListener('click', function(e) {
        this.canvas.addFigure(new Ball(
            randomFromRange(20, this.canvas.$canvas.width),
            randomFromRange(20, this.canvas.$canvas.height),
            randomFromRange(10, 60),
            randomFromRange(0, 1)
        ));
        this.canvas.finalize();
    }.bind(this));

    $addBoxRandom.addEventListener('click', function(e) {
        this.canvas.addFigure(new Box(
            randomFromRange(10, this.canvas.$canvas.width),
            randomFromRange(10, this.canvas.$canvas.height),
            randomFromRange(100, 400),
            randomFromRange(10, 30)
        ));
        this.canvas.finalize();
    }.bind(this));

    $appControls.addEventListener('submit', function(e) {
        e.preventDefault();
        this.g = parseInt($g.value, 10);
    }.bind(this));

    $ballControls.addEventListener('submit', function(e) {
        e.preventDefault();
        this.canvas.finalize();
        this.canvas.redraw();
    }.bind(this));

    $boxControls.addEventListener('submit', function(e) {
        e.preventDefault();
        this.canvas.finalize();
        this.canvas.redraw();
    }.bind(this));
};

App.prototype.update = function() {
    if (this.delta) {
        this.physics.update(this.g * this.delta);
    }
};

App.prototype.play = function() {
    this.setDelta();
    this.update();
    this.canvas.render();
    requestAnimationFrame(this.play.bind(this));
};


// Track frames to make app fps-independent
App.prototype.setDelta = function() {
    this.now = Date.now();
    this.delta = (this.now - this.then) / 1000;
    this.then = this.now;
};
