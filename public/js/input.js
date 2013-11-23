document.addEventListener('DOMContentLoaded', function  () {
    var ctx = document.getElementById('game-view').getContext('2d');
    var ic = new InputController();
    var p = new Plane({x: 50, y: 50, ctx: ctx, inputController: ic, rotationAngle: 0});
    function render(){
        ctx.clearRect(0,0,640,240);
        p.update();
        p.Draw();
    }
    setInterval(render, 5);
});

InputController = function() {
    this.left = 37;
    this.right = 39;

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


