function LevelGenerator (params) {
    this.blobCount = params.blobCount;
    this.maxSPeed = params.maxSpeed;
    this.maxRadius = params.maxRadius;
    this.width = params.width;
    this.height = params.height;

    this.lastId = 0;
}

LevelGenerator.prototype.generate = function () {
    var state = {
        objects: {},
        timeStamp: new Date()
    };
    return state;
}

exports.Generator = LevelGenerator;
