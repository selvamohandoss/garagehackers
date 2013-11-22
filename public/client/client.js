document.addEventListener('DOMContentLoaded', function  () {
    // Globals
    socket = io.connect('http://localhost:5050');
    game = new Game();
    playerId = null;
    totalSkew = 0;

    var renderer = new Renderer(game);
    var input = new Input(game);

    socket.on('start', function  (data) {
        console.log('recv state', data);
        // Load the game
        game.load(data.state);

        // Get initial time to sync with.
        var startDelta = new Date().valueOf() - data.state.timeStamp;

        // setup game loop
        game.updateEvery(Game.UPDATE_INTERVAL, startDelta);

        // Start the renderer
        renderer.render();
    });

    socket.on('state', function(data) {
        game.load(data.state);
    });

    socket.on('join', function(data) {
        console.log('recv join', data);
        game.join(data.name);
        if (data.isme) {
            playerId = data.name;

            window.location.hash = '#' + data.name;
        }
    });

    socket.on('time', function(data) {
        // compute how much we've skewed from server since last tick
        var updateDelta = data.lastUpdate - game.state.timeStamp;

        // add to cumulative skew offset.
        totalSkew += updateDelta;

        // if skewoffset is too large in either direction, get 
        // real state from the server
        if (Math.abs(totalSkew) > Game.TARGET_LATENCY) {
            // Fetch real game state from server.
            socket.emit('state');
            totalSkew = 0;
        }
        document.getElementById('observer-count').innerText =
            Math.max(data.observerCount - game.getPlayerCount(), 0);
        document.getElementById('player-count').innerText = game.getPlayerCount();
        document.getElementById('average-lag').innerText = Math.abs(updateDelta);
    });
});
