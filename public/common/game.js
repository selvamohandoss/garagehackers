(function  (exports) {
    var Game = function  () {
        this.state = {};
        this.oldState = {};

        this.lastId = 0;
        this.callbacks = {};

        // Counter for the number of updates
        this.updateCount = 0;
        // Timer for the update loop.
        this.timer = null;
    }

    Game.UPDATE_INTERVAL = Math.round(1000 / 30);
    Game.MAX_DELTA = 10000;
    Game.WIDTH = 640;
    Game.HEIGHT = 480;
    Game.SHOT_AREA_RATIO = 0.1;
    Game.TRANSFER_RATE = 0.05;
    Game.TARGET_LATENCY = 1000; // Max latency skew.
    Game.RESTART_DELAY = 1000;

    Game.prototype.computeState = function  (delta) {
        var newState = {
            objects: {},
            timeStamp: this.state.timeStamp + delta
        };
        var newObjects = newState.objects;
        var objects = this.state.objects;

        for (var objId in objects) {
            var obj = objects[objId];
            if (!obj.dead) {
                newObjects[obj.id] = obj.computeState(delta);
            }
        }

        return newState;
    }

    Game.prototype.update = function(timeStamp) {
        var delta = timeStamp - this.state.timeStamp;
        if (delta < 0) {
            throw "Can't compute state in the past. Delta: " + delta;
        }
        if (delta > Game.MAX_DELTA) {
            throw "Can't compute state so far in the future. Delta: " + delta;
        }
        this.state = this.computeState(delta);
        this.updateCount++;
    };

    Game.prototype.updateEvery = function  (interval, skew) {
        if (!skew) {
            skew = 0;
        }

        var lastUpdate = (new Date()).valueOf() - skew;
        var ctx = this;
        this.timer = setInterval(function  () {
            var date = (new Date()).valueOf() - skew;
            if (date - lastUpdate >= interval) {
                ctx.update(date);
                lastUpdate += interval;
            }
        }, 1);
    };

    Game.prototype.getPlayerCount = function() {
        var count = 0;
        var objects = this.state.objects;
        for (var id in objects) {
            if (objects[id].type = 'player') {
                count++;
            }
        }
        return count;
    }

    Game.prototype.save = function () {
        var serialized = {
            objects: {},
            timeStamp: this.state.timeStamp
        };
        for (var id in this.state.objects) {
            var obj = this.state.objects[id];
            // Serialize to JSON!
            serialized.objects[id] = obj.toJSON();
        }

        return serialized;
    };

    Game.prototype.load = function (savedState) {
        var objects = savedState.objects;
        this.state = {
            objects: {},
            timeStamp: savedState.timeStamp.valueOf()
        }
        for (var id in objects) {
            var obj = objects[id];

            if (obj.type == 'blob') {
                this.state.objects[obj.id] = new Blob(obj);
            }

            if (obj.id > this.lastId) {
                this.lastId = obj.id
            }
        }
    };

    var Blob = function(params) {
        if(!params) {
            return;
        }
        this.id = params.id;
        this.x = params.x;
        this.y = params.y;
        this.r = params.r;
        this.vx = params.vx;
        this.vy = params.vy;

        if (!this.type) {
            this.type = 'blob';
        }
    };

    Blob.prototype.overlap = function(blob) {
        var overlap = blob.r + this.r - this.distanceFrom(blob);
        return (overlap > 0 ? overlap : 0);
    };

    Blob.prototype.intersects = function(blob) {
        return this.distanceFrom(blob) < blob.r + this.r;
    };

    Blob.prototype.distanceFrom = function(blob) {
        return Math.sqrt(Math.pow(this.x - blob.x, 2) + Math.pow(this.y - blob.y, 2));
    };

    Blob.prototype.area = function  () {
        return Math.PI * this.r * this.r;
    };
    
    Blob.prototype.transferArea = function  (area) {
        var sign = (area < 0) ? 1 : -1;
        this.r += sign * Math.sqrt(Math.abs(area) / Math.PI);
    };

    Blob.prototype.computeState = function  (delta) {
        var newBlob = new this.constructor(this.toJSON());
        newBlob.x += this.vx * delta/10;
        newBlob.y += this.vy * delta/10;
        return newBlob;
    };

    Blob.prototype.toJSON = function  () {
        var obj = {};
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                obj[prop] = this[prop];
            }
        }
        return obj;
    };

    exports.Game = Game;
    exports.Blob = Blob;

})(typeof global === "undefined" ? window : exports);
