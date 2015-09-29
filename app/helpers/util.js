export const util = {
    isString: function(obj){
        return typeof obj === 'string';
    },
    empty: function(str){
        return !(str && util.isString(str) && str.length > 0);
    },
    notEmpty: function(str){
        return !util.empty(str);
    },
    // TODO: add browser support check
    historyPushState: function(url, state, title){
        window.history.pushState(state, title, url);
    },
    historyReplaceState: function(url, state, title){
        window.history.replaceState(state, title, url);
    },
    stringSortDesc: function(a, b) {
        if (a > b) return -1;
        else if (a < b) return 1;
        else return 0;
    }
};