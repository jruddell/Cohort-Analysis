'use strict';
import {HOME_C as C} from '../constants/Constants';
import {dispatcher} from '../dispatcher/GlobalDispatcher';
import {Store} from './Store';
import {stringSortDesc} from '../helpers/util'

export const homeStore = new Store({
    data: {
        rows: []
    },
    loadingData: false,
    getData: function(){
        return {
           data: this.data,
           loadingData: this.loadingData
        };
    }
});

dispatcher.register(C.DATA_LOAD_REQUESTED, function() {
    homeStore.loadingData = true;
    homeStore.change();
});
dispatcher.register(C.DATA_LOADED, function(payload) {
    homeStore.data = payload;
    homeStore.loadingData = false;
    homeStore.change();
});