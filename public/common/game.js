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
    };

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
        var objId;

        for (objId in objects) {
            var obj = objects[objId];
            if (!obj.dead) {
                newObjects[obj.id] = obj.computeState(delta);
            }
        }

        var largest = null;
        var total = 0;

        for (var i in newObjects) {
            var o = newObjects[i];
            for (var j in newObjects) {
                var p = newObjects[j];

                if (o !== p && o.intersects(p)) {
                    this.transferAreas_(o, p, delta);
                }
            }

            if (!this.inBounds_(o)) {
                this.repositionInBounds_(o);
            }

            if (!largest) {
                largest = o;
            }
            if (o.r > largest.r) {
                largest = o;
            }
            total += o.r;
        }

        return newState;
    };

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

    Game.prototype.join = function(id) {
        var x, y, vx, vy;
        switch (this.getPlayerCount() % 4) {
            case 0:
                x = 0; y = 0; vx = 0.1; vy = 0.1;
                break;
            case 1:
                x = 640; y = 0; vx = -0.1; vy = -0.1;
                break;
            case 2:
                x = 0; y = 480; vx = 0.1; vy = 0.1;
                break;
            case 3:
                x = 640; y = 480; vx = -0.1; vy = -0.1;
                break;
        }

        var player = new Player({
            id: id,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            r: 20
        });
        this.state.objects[player.id] = player;
        return player.id;
    };

    Game.prototype.shoot = function(id, direction, timeStamp) {
        console.log('adding shot from', this.state.timeStamp - timeStamp, 'ago');
        var player = this.state.objects[id];

        // Unit vectors
        var ex = Math.cos(direction);
        var ey = Math.sin(direction);

        var diff = player.area() * Game.SHOT_AREA_RATIO;

    };

    Game.prototype.getPlayerCount = function() {
        var count = 0;
        var objects = this.state.objects;
        var id;

        for (id in objects) {
            if (objects[id].type === 'player') {
                count++;
            }
        }
        return count;
    };

    Game.prototype.save = function () {
        var serialized = {
            objects: {},
            timeStamp: this.state.timeStamp
        };
        var id;

        for (id in this.state.objects) {
            var obj = this.state.objects[id];
            // Serialize to JSON!
            serialized.objects[id] = obj.toJSON();
        }

        return serialized;
    };

    Game.prototype.callback_ = function(event, data) {
        var callback = this.callbacks[event];
        if (callback) {
            callback(data);
        } else {
            throw "Warning: No callback defined!";
        }
    };

    Game.prototype.newId_ = function() {
        return ++this.lastId;
    };

    Game.prototype.inBounds_ = function(o) {
        return o.r < o.x && o.x < (Game.WIDTH - o.r) &&
            o.r < o.y && o.y < (Game.HEIGHT - o.r);
    };

    Game.prototype.repositionInBounds_ = function(o) {
        var maxWidth = Game.WIDTH - o.r;
        var maxHeight = Game.HEIGHT - o.r;

        if (o.x < o.r) {
            o.x = o.r;
            o.vx = -o.vx;
        } else if (o.y < o.r) {
            o.y = o.r;
            o.vy = -o.vy;
        } else if (o.x > maxWidth) {
            o.x = maxWidth;
            o.vx = -o.vx;
        } else if (o.y > maxHeight) {
            o.y = maxHeight;
            o.vy = -o.vy;
        }
    };
        

    Game.prototype.load = function (savedState) {
        var objects = savedState.objects;
        this.state = {
            objects: {},
            timeStamp: savedState.timeStamp.valueOf()
        };
        var id;

        for (id in objects) {
            var obj = objects[id];

            if (obj.id > this.lastId) {
                this.lastId = obj.id;
            }
        }
    };

    Game.prototype.on = function(event, callback) {
        this.callbacks[event] = callback;
    };

    var Plane = function(params) {
        if(!params) {
            return;
        }
        this.id = params.id;
        this.rotation = 0;
        this.x = params.x;
        this.y = params.y;
        this.r = params.r;
        this.vx = params.vx;
        this.vy = params.vy;
        this.thrust = false;
        this.rotateAntiClockwise = false;
        this.rotateClockwise = false;

        if (!this.type) {
            this.type = 'plane';
        }
    };

    Plane.prototype.toJSON = function  () {
        var obj = {};
        var prop;

        for (prop in this) {
            if (this.hasOwnProperty(prop)) {
                obj[prop] = this[prop];
            }
        }
        return obj;
    };

    Plane.prototype.computeState = function  (delta) {
        var friction = 0.2;
        var thrust = this.thrust ? 300 : 0;
        var gravity = 600;
        var cos = Math.cos(this.rotation);
        var sin = Math.sin(this.rotation);

        var newPlane = new this.constructor(this.toJSON());

        // velocity component in direction plane is headed
        var forwardSpeed = Math.abs(cos * newPlane.vx + sin * newPlane.vy);

        // maneuverability is the strength of the force generated by wings
        // The more air rushing over wings, the greater the force generated
        // Max force = 2000
        var elevatorForce = Math.min(2000, 1.6*forwardSpeed);
        var elevatorForceX = 0;
        var elevatorForceY = 0;
        var dRotation = 0;

        // rotating the plane uses elevators which also apply forces in
        // x & y directions
        if (newPlane.rotateAntiClockwise) {
            dRotation = 1.5;
            elevatorForceY = cos * elevatorForce;
            elevatorForceX = -sin * elevatorForce;
        } else if (newPlane.rotateClockwise) {
            dRotation = -1.5;
            elevatorForceY = -cos * elevatorForce;
            elevatorForceX = sin * elevatorForce;
        }

        // Wings generate force with or without elevators pitched. Only include
        // this force if the plane isn't pitching upwards, otherwise it rises
        // too fast.
        if (elevatorForceY <= 0) {
            elevatorForceY += 0.6*Math.abs(cos * forwardSpeed);
        }

        var forceX = cos * thrust + elevatorForceX - newPlane.vx*friction;
        var forceY = sin * thrust + elevatorForceY - newPlane.vy*friction - gravity;

        //update rotation
        this.rotation += dRotation * delta;

        newPlane.vx += forceX * delta/10;
        newPlane.vy += forceY * delta/10;

        newPlane.x += newPlane.vx;
        newPlane.y += newPlane.vy;

        console.log("new x: " + newPlane.x);
        console.log("new y: " + newPlane.y);

        // if the plane has rotated 180 degrees, reverse direction
        if( cos > 0 != newPlane.imageLeftToRight) {
            newPlane.imageLeftToRight = cos > 0;
        }
        return newPlane;
    };

    Plane.prototype.overlap = function(plane) {
        var overlap = plane.r + this.r - this.distanceFrom(plane);
        return (overlap > 0 ? overlap : 0);
    };

    Plane.prototype.intersects = function(plane) {
        return this.distanceFrom(plane) < plane.r + this.r;
    };

    Plane.prototype.distanceFrom = function(plane) {
        return Math.sqrt(Math.pow(this.x - plane.x, 2) + Math.pow(this.y - plane.y, 2));
    };


    var Player = function  (params) {
        this.name = params.name;
        this.type = 'player';

        Plane.call(this, params);
    };

    Player.prototype = new Plane();
    Player.prototype.constructor = Player;

    exports.Game = Game;
    exports.Player = Player;
    exports.Plane = Plane;

}(typeof global === "undefined" ? window : exports));
