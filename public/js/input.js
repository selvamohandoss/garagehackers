document.addEventListener('DOMContentLoaded', function  () {
    InitializeCanvas();
});

function InitializeCanvas() {
    var ctx = document.getElementById('game-view').getContext('2d');
    var ic = new InputController();
    var p = new Plane({x: 50, y: 50, ctx: ctx, inputController: ic, rotationAngle: 0});
    function render(){
        ctx.clearRect(0,0,640,240);
        ctx.rect(0,0, 640, 240);
        var gradient = ctx.createLinearGradient(0,0,0, 240);
        gradient.addColorStop(0, '#8ED6FF');
        gradient.addColorStop(0.95, '#004CB3');
        gradient.addColorStop(0.95, '#00AA00');
        gradient.addColorStop(1, '#007700');
        ctx.fillStyle = gradient;
        ctx.fill();
        p.update();
        p.Draw();
    }
    setInterval(render, 5);
};

InputController = function() {
    this.left = 37;
    this.right = 39;

    this._rotationSpeed = 5;
    this.preventPropogationKeys = [this.left, this.right];

    this.heldDownKeys = {};

    var that = this;

    addEventListener("keyup", function  (e) {
        that.heldDownKeys[e.keyCode] = false;
        if (that.preventPropogationKeys.indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    });

    addEventListener("keydown", function  (e) {
        that.heldDownKeys[e.keyCode] = true;
        if (that.preventPropogationKeys.indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    });

};

InputController.prototype.leftKeyDown =
function() {
    return this.heldDownKeys[this.left];
};

InputController.prototype.rightKeyDown =
function() {
    return this.heldDownKeys[this.right];
};
