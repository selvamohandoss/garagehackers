(function(exports) {
/**
 * Plane object
 */
var Plane = function(params) {
    this.x = params.x;
    this.y = params.y;
    this.rotationAngle = params.rotationAngle;
    this.inputHandler = params.inputController;
    this.ctx = params.ctx;
    //this.pathArray = [this.x,this.y, 20,12, 25,20, 60,23, 70,15, 82,15, 90,23, 100,27, 100,40, 82,43, 70,43, 60,39, 25,32, 12,27];
    this.pathArray = [this.x,this.y, 60,52, 65,60, 100,63, 110,55, 122,55, 130,63, 140,67, 140,80, 122,83, 110,83, 100,79, 65,72, 52,67];
};

Plane.prototype.update = function() {
    if(this.inputHandler.leftKeyDown()){
        this.rotationAngle -= 1;
    }
    if(this.inputHandler.rightKeyDown()){
        this.rotationAngle += 1;
    }
};

Plane.prototype.Draw =
function() {
    this.ctx.save();
    this.ctx.translate(100, 70);
    this.ctx.rotate((Math.PI/180)*this.rotationAngle);
    this.ctx.translate(-100, -70);
    this.DrawBody();
    this.ctx.restore();
};

Plane.prototype.DrawBody =
function() {
    
    this.ctx.fillStyle = '#449944';
    this.ctx.beginPath();
    this.ctx.moveTo(this.pathArray[0], this.pathArray[1]);
    for(var i=2;i < this.pathArray.length; i+=2) {
        this.ctx.lineTo(this.pathArray[i], this.pathArray[i+1]);
    }
    this.ctx.fill();
    
};

exports.Plane = Plane;

}(window));
