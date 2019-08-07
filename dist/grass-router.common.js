'use strict';

function warning(condition, message) {
    if (condition)
        return;
    if (typeof console !== 'undefined') {
        var text = "Warning: " + message;
        console.warn(text);
    }
}
function assertParams(path, state) {
    warning(!(typeof path === 'object' &&
        path.state !== undefined &&
        state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' +
        'argument is a location-like object that already has state; it is ignored');
}

function createBrowserHistory(props) {
    var globalHistory = window.history;
    function createHref() { }
    function push(path, state) {
        assertParams(path, state);
    }
    function replace() { }
    function go(n) { }
    function goBack() { }
    function goForward() { }
    function block() { }
    function listen() { }
    var history = {
        go: go,
        push: push,
        block: block,
        listen: listen,
        goBack: goBack,
        replace: replace,
        goForward: goForward,
        createHref: createHref,
        action: 'POP',
        length: globalHistory.length,
    };
    return history;
}



var history = /*#__PURE__*/Object.freeze({
  createBrowserHistory: createBrowserHistory
});

var index = {
    history: history
};

module.exports = index;
