(function (App) {
    "use strict";
    
    var events = App.eventDispatcher;

    var preventPropogationKeys = [32, 37, 39];
    var that = this;

    addEventListener("keyup", function  (e) {
        if (preventPropogationKeys.indexOf(e.keyCode) > -1) {
            events.trigger("keyup", e.keyCode);
        }
        if (preventPropogationKeys.indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    });

    addEventListener("keydown", function  (e) {
        if (preventPropogationKeys.indexOf(e.keyCode) > -1) {
            events.trigger("keydown", e.keyCode);
        }
        if (preventPropogationKeys.indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    });
}(window.BIPLANES));
