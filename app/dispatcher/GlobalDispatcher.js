import {util} from '../helpers/util';

var Dispatcher = function(){
    //you can add logging here if you want only in debug mode
    this.logging = true;
    this.callbacks = {};
};

Dispatcher.prototype = {
    __add: function(name, fn){
        if (hasOwn.call(this.callbacks, name))
            this.callbacks[name].push(fn);
        else
            this.callbacks[name] = [fn];
    },
    __invoke: function(name, payload){
        if (!hasOwn.call(this.callbacks, name)){
            if (this.logging) {console.warn('DISPATCHER: "' + name + '" dispatched but there are no registered callbacks.');}
            return;
        }

        var group = this.callbacks[name];

        for (var i = 0; i < group.length; i++){
            // TODO: context?, make async?
            group[i].apply(this, [payload]);
        }
    },
    register: function(actionType, fn){
        if (util.empty(actionType))
            throw Error('Invalid action type.');

        this.__add(actionType, fn);
        return this;
    },
    dispatch: function(action /*, payload */){
        var actionType, payload;

        if (util.isString(action)){
            actionType = action;
            payload = arguments[1];
        }
        else if(action && hasOwn.call(action, 'actionType') && !util.empty(action.actionType)) {
            actionType = action.actionType;
            if(hasOwn.call(action, 'payload'))
                payload = action.payload;
        }
        else{
            if (this.logging){
                var data = hasOwn.call(window, 'JSON') ? JSON.stringify(action) : action;
                console.warn('DISPATCHER: "' + JSON.stringify(action) + '" is invalid to dispatch. Did you specify an `actionType`?.');
            }
            return;
        }

        this.__invoke(actionType, payload);
        return this;
    }
};


var hasOwn = Object.prototype.hasOwnProperty;

export const dispatcher = new Dispatcher();