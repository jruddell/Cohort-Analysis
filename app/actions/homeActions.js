import {dispatcher} from '../dispatcher/GlobalDispatcher';
import {HOME_C as C} from '../constants/Constants';
import $ from 'jquery/jquery:dist/jquery.js';

export const homeActions = {
    loadCohort: function(){
        dispatcher.dispatch(C.DATA_LOAD_REQUESTED); 
        $.ajax({
            url: '/cohort-data', method: 'GET'
        }).done(function(result) {
           dispatcher.dispatch(C.DATA_LOADED, JSON.parse(result)); 
        }).fail(function(result){
            dispatcher.dispatch(C.DATA_NOT_LOADED, result); 
        });
    }
};