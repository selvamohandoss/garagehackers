(function(exports) {
/**
 * Desktop input handler (ie. mouse, keyboard)
 */

function DesktopInput(game) {
  this.game = game;
  var ctx = this;
  var preventPropogationKeys = [left, right];

  var heldDownKeys = {};

  // Listen for mouse events on the canvas element
  var canvas = document.getElementById('canvas');
  canvas.addEventListener('click', function(e) {
    ctx.onclick.call(ctx, e);
  });

  canvas.addEventListener('keyup', function  (e) {
      heldDownKeys[e.keyCode] = false;
      if (preventPropogationKeys.contains(e.keyCode)) {
          e.preventDefault();
      }
  });

  canvas.addEventListener('keydown', function  (e) {
      heldDownKeys[e.keyCode] = true;
      if (preventPropogationKeys.contains(e.keyCode)) {
          e.preventDefault();
      }
  });

  // Bind to the join button
  var join = document.getElementById('join');
  join.addEventListener('click', function(e) {
    ctx.onjoin.call(ctx, e);
  });

  // Bind to music button.
  var music = document.getElementById('music');
  music.addEventListener('click', function(e) {
    ctx.onmusic.call(ctx, e);
  });
}

DesktopInput.prototype.onjoin = function() {
  if (!playerId) {
    smoke.prompt("what is your name", function(name) {
      if (name) {
        socket.emit('join', {name: name});
        document.querySelector('#join').style.display = 'none';
      } else {
        smoke.signal('sorry, name required');
      }
    });
  }
};

DesktopInput.prototype.onmusic = function() {
  sound.toggleSoundtrack();
};

DesktopInput.prototype.onleave = function() {
  socket.emit('leave', {name: playerId});
};

DesktopInput.prototype.onclick = function(event) {
  // Get the position of the click.
  var cx = event.clientX - event.target.getBoundingClientRect().left;
  var cy = event.clientY - event.target.getBoundingClientRect().top;
  // Get the current player.
  var player = this.game.state.objects[playerId];
  // Sometimes the player isn't there.
  if (!player) {
    return;
  }
  // Consider where the player is positioned.
  var px = player.x;
  var py = player.y;
  // Get the angle of the shot
  var angle = Math.atan2(cy - py, cx - px);
  // Send the corresponding shoot() command.
  socket.emit('shoot', { direction: angle });
};

exports.Input = DesktopInput;

}(window));
