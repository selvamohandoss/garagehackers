document.addEventListener('DOMContentLoaded', function  () {
    InitializeCanvas();
});

function InitializeCanvas() {
    var ctx = document.getElementById('game-view').getContext('2d');
    var p = new window.BIPLANES.Airplane({ x: 50, y: 50, rotationAngle: 0, ctx: ctx});
    var lastTimeStamp = (new Date()).valueOf();
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
        p.update( (new Date()).valueOf() - lastTimeStamp );
        lastTimeStamp = (new Date()).valueOf();

        p.Draw();
    }
    setInterval(render, 5);
};
