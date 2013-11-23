(function(exports) {
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
}());

/**
 * Canvas-based renderer
 */
var CanvasRenderer = function(game) {
  this.game = game;
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
};

CanvasRenderer.prototype.render = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  var objects = this.game.state.objects;
  var i;
  // Render the game state
  for (i in objects) {
    var o = objects[i];
    if (o.dead) {
      // TODO: render animation.
      if (o.type === 'player') {
        console.log('player', o.id, 'died');
      }
    }
    if (o.r > 0) {
      this.renderObject_(o);
    }
  }

  var ctx = this;
  requestAnimFrame(function() {
    ctx.render.call(ctx);
  });
};

CanvasRenderer.prototype.renderObject_ = function(obj) {
  var ctx = this.context;
  ctx.fillStyle = (obj.type === "player" ? 'green' : 'red');
  // bottom wing
  ctx.fillRect(obj.x+20, obj.y+3, 10, 3);

  // tail
  ctx.fillRect(obj.x, obj.y-10, 6, 4);
  ctx.fillRect(obj.x, obj.y-7, 8, 4);

  // fuselage
  ctx.fillRect(obj.x+8, obj.y-1, 27, 3);
  ctx.fillRect(obj.x, obj.y-4, 35, 3);

  // top wing
  ctx.fillRect(obj.x+20, obj.y-8, 10, 3);

  if (obj.type === 'player') {
      ctx.font = "8pt monospace";
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      //ctx.fillText(obj.id, obj.x, obj.y);
  }

};

exports.Renderer = CanvasRenderer;

}(window));
