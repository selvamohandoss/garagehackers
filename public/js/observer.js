(function(App) {
"use strict";

var eventSubscriptions = {};

App.eventDispatcher = {
    subscribe: function  (eventId, callback) {
        var subscribers = eventSubscriptions[eventId];

        if (typeof subscribers === 'undefined') {
            subscribers = eventSubscriptions[eventId] = [];
        }

        subscribers.push(callback);
    },
    trigger: function  (eventId, data, context) {
        var subscribers = eventSubscriptions[eventId],
            i, iMax;
        
        if (typeof subscribers === 'undefined') {
            return;
        }

        data = (data instanceof Array) ? data : [data];

        context = context || App;

        for (i=0, iMax = subscribers.length; i < iMax; i += 1) {
            subscribers[i].apply(context, data);
        }
    }
};

}(window.BIPLANES));

