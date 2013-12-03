var gameObjects = {};
document.addEventListener('DOMContentLoaded', function  () {
    InitializeCanvas();
});

function InitializeCanvas() {
    var ctx = document.getElementById('game-view').getContext('2d');
    var p = new window.BIPLANES.Airplane({ x: 50, y: 50, rotationAngle: 0, ctx: ctx});
    gameObjects[p] = p;
    var lastTimeStamp = (new Date()).valueOf();
    function gameLoop(){
        var now = (new Date()).valueOf();
        for(var o in gameObjects) {
            gameObjects[o].update( now - lastTimeStamp );
        }
        lastTimeStamp = now;
    }

    function renderLoop() {
        var now = (new Date()).valueOf();
        ctx.clearRect(0,0,640,480);
        ctx.rect(0,0, 640, 480);
        var gradient = ctx.createLinearGradient(0,0,0,480);
        gradient.addColorStop(0, '#8ED6FF');
        gradient.addColorStop(0.95, '#004CB3');
        gradient.addColorStop(0.95, '#00AA00');
        gradient.addColorStop(1, '#007700');
        ctx.fillStyle = gradient;
        ctx.fill();
        for(var o in gameObjects) {
            gameObjects[o].draw( now - lastTimeStamp );
        }
        requestAnimationFrame( renderLoop );
    }
    setInterval(gameLoop, 5);
    requestAnimationFrame( renderLoop );
};
