(function(App) {
    var events = App.eventDispatcher;
/**
 * Airplane object
 */
var Airplane = function (params) {
    this.x = params.x;
    this.y = params.y;
    this.vx = 0.01;
    this.vy = 0.01;
    this.dr = 0;
    this.speed = 0.2;
    this.rotation = params.rotationAngle;
    this.rotationSpeed = 1;
    this.ctx = params.ctx;
    //this.pathArray = [10,2, 15,10, 50,13, 60,5, 72,5, 80,13, 90,17, 90,30, 72,33, 60,33, 50,29, 15,22, 2,17];
    this.pathArray = [-10,-4, -18,-12, -30,-12, -40,-4, -75,-7, -80,-15, -90,-17, -88,0, -75,5, -40,12, -30,16, -18,16, 0,13];
    this.controls = { 32: fireWeapon, 37: elevatorUp, 39: elevatorDown };
    var that = this;
    events.subscribe("keydown", controlOn)
    events.subscribe("keyup", controlOff)
    function controlOn( keyCode ) {
        that.controls[keyCode]("on");
    };

function controlOff( keyCode ) {
    that.controls[keyCode]("off");
}

function elevatorUp (state) {
    that.dr = state === "on" ? -1 : 0;
};

function elevatorDown (state) {
    that.dr = state === "on" ? 1 : 0;
};

function fireWeapon (state) {
    // body...
};
};

Airplane.prototype.update = function(dt) {
    // calculate new position
    this.rotation += this.dr * this.speed * dt * Math.PI/180;
    var dx = (this.speed * dt * Math.cos(this.rotation));
    var dy = (this.speed * dt * Math.sin(this.rotation));
    this.x = (this.x + dx) % 740;
    if (this.x < -75) { this.x = 740; }
    this.y = (this.y + dy) % 540;
    if (this.y < -60) { this.y = 540; }
};

Airplane.prototype.Draw =
function() {
    this.ctx.save();
    this.ctx.translate(this.x-25, this.y-6);
    this.ctx.rotate(this.rotation);
    this.ctx.translate(-this.x+25, -this.y+6);
    this.DrawFuselage();
    this.DrawWing();
    this.ctx.restore();
};

Airplane.prototype.DrawWing =
function() {
    
    this.ctx.fillStyle = '#B20000';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x-13, this.y+4);
    this.ctx.bezierCurveTo(this.x-10, this.y-2, this.x-20, this.y-2, this.x-42, this.y+5);
    this.ctx.lineWidth = 3;

    this.ctx.strokeStyle = '#990000';
    this.ctx.stroke();
    this.ctx.fill();
    
};

Airplane.prototype.DrawFuselage =
function() {
    
    this.ctx.fillStyle = '#BA1919';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    for(var i=0;i < this.pathArray.length; i+=2) {
        this.ctx.lineTo(this.x + this.pathArray[i], this.y + this.pathArray[i+1]);
    }
    
    this.ctx.fill();
};
App.Airplane = Airplane;

}(window.BIPLANES));
