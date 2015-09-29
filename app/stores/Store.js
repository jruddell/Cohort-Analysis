var { extend } = require('jquery/jquery:dist/jquery.js'),
    { EventEmitter } = require('gozala/events:events.js');
import assign from 'sindresorhus/object-assign:index.js';

export function Store(ext){
    if (ext) {assign(this, ext);}
};

var CHANGE_EVENT = 'change';

assign(Store.prototype, EventEmitter.prototype, {
    change: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});
