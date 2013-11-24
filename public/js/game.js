document.addEventListener('DOMContentLoaded', function  () {
    var ctx = document.getElementById('game-view').getContext('2d');
    var p = new window.BIPLANES.Airplane({ x: 50, y: 50, rotationAngle: 0, ctx: ctx});
    function render(){
        ctx.clearRect(0,0,640,240);
        p.update();
        p.Draw();
    }
    setInterval(render, 5);
});
