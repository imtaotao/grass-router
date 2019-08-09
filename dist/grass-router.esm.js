function isAbsolute(path) {
    return path.charAt(0) === '/';
}
function spliceOne(list, index) {
    var i = index;
    var k = i + 1;
    var len = list.length;
    for (; k < len; i += 1, k += 1) {
        list[i] = list[k];
    }
    list.pop();
}
function parsePath(path) {
    var hash = '';
    var search = '';
    var pathname = path || '';
    var hashIndex = pathname.indexOf('#');
    if (hashIndex > -1) {
        hash = pathname.substring(hashIndex);
        pathname = pathname.substring(0, hashIndex + 1);
        if (hash === '#')
            hash = '';
    }
    var searchIndex = pathname.indexOf('?');
    if (searchIndex > -1) {
        search = path.substring(searchIndex);
        pathname = path.substring(0, searchIndex + 1);
        if (search === '?')
            search = '';
    }
    return { hash: hash, search: search, pathname: pathname };
}
function createPath(location) {
    var hash = location.hash, search = location.search, pathname = location.pathname;
    var path = pathname || '/';
    if (search && search !== '?') {
        path += search.charAt(0) === '?'
            ? search
            : "?" + search;
    }
    if (hash && hash !== '#') {
        path += hash.charAt(0) === '#'
            ? hash
            : "#" + hash;
    }
    return path;
}
function resolvePathname(to, from) {
    if (from === undefined)
        from = '';
    var toParts = to && to.split('/') || [];
    var fromParts = from && from.split('/') || [];
    var isToAbs = to ? isAbsolute(to) : false;
    var isFromAbs = from ? isAbsolute(from) : false;
    var mustEndAbs = isToAbs || isFromAbs;
    if (isToAbs) {
        fromParts = toParts;
    }
    else if (toParts.length > 0) {
        fromParts.pop();
        fromParts = fromParts.concat(toParts);
    }
    if (fromParts.length === 0)
        return '/';
    var hasTrailingSlash;
    if (fromParts.length > 0) {
        var last = fromParts[fromParts.length - 1];
        hasTrailingSlash = last === '.' || last === '..' || last === '';
    }
    else {
        hasTrailingSlash = false;
    }
    var up = 0;
    for (var i = fromParts.length; i >= 0; i--) {
        var part = fromParts[i];
        if (part === '.') {
            spliceOne(fromParts, i);
        }
        else if (part === '..') {
            spliceOne(fromParts, i);
            up++;
        }
        else if (up) {
            spliceOne(fromParts, i);
            up--;
        }
    }
    if (!mustEndAbs) {
        for (; up--; up) {
            fromParts.unshift('..');
        }
    }
    if (mustEndAbs &&
        fromParts[0] !== '' &&
        (!fromParts[0] || !isAbsolute(fromParts[0]))) {
        fromParts.unshift('');
    }
    var result = fromParts.join('/');
    return hasTrailingSlash && result.charAt(result.length - 1) !== '/'
        ? result + '/'
        : result;
}

var canUseDOM = !!(typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement);
function getConfirmation(message, callback) {
    callback(window.confirm(message));
}
function supportsHistory() {
    var ua = window.navigator.userAgent;
    if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1)
        return false;
    return window.history && 'pushState' in window.history;
}
function supportsPopStateOnHashChange() {
    return window.navigator.userAgent.indexOf('Trident') === -1;
}
function supportsGoWithoutReloadUsingHash() {
    return window.navigator.userAgent.indexOf('Firefox') === -1;
}
function isExtraneousPopstateEvent(event) {
    return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

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
function valueEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length)
            return false;
        return a.every(function (item, i) { return valueEqual(item, b[i]); });
    }
    if (typeof a === 'object' || typeof b === 'object') {
        var aVal = a.valueOf ? a.valueOf() : Object.prototype.valueOf.call(a);
        var bVal = b.valueOf ? b.valueOf() : Object.prototype.valueOf.call(b);
        if (aVal !== a || bVal !== b) {
            return valueEqual(aVal, bVal);
        }
        var keys = Object.keys(Object.assign({}, a, b));
        return keys.every(function (key) { return valueEqual(a[key], b[key]); });
    }
    return false;
}
function locationsAreEqual(a, b) {
    return (a.key === b.key &&
        a.hash === b.hash &&
        a.search === b.search &&
        a.pathname === b.pathname &&
        valueEqual(a.state, b.search));
}
function createLocation(path, state, key, currrentLocation) {
    var location;
    if (typeof path === 'string') {
        location = parsePath(path);
        location.state = state;
    }
    else {
        location = Object.assign({}, path);
        location.pathname = location.pathname || '';
        var completion = function (key) {
            var prefix = key === 'search' ? '?' : '#';
            if (location[key]) {
                if (location[key].charAt(0) !== prefix)
                    location[key] = prefix + location[key];
            }
            else {
                location[key] = prefix;
            }
        };
        completion('hash');
        completion('search');
    }
    if (key)
        location.key = key;
    if (currrentLocation) {
        if (!location.pathname) {
            location.pathname = currrentLocation.pathname;
        }
        else if (!isAbsolute(location.pathname)) {
            location.pathname = resolvePathname(location.pathname, currrentLocation.pathname);
        }
    }
    else {
        location.pathname = location.pathname || '/';
    }
    return location;
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
  createBrowserHistory: createBrowserHistory,
  warning: warning,
  assertParams: assertParams,
  valueEqual: valueEqual,
  locationsAreEqual: locationsAreEqual,
  createLocation: createLocation,
  canUseDOM: canUseDOM,
  getConfirmation: getConfirmation,
  supportsHistory: supportsHistory,
  supportsPopStateOnHashChange: supportsPopStateOnHashChange,
  supportsGoWithoutReloadUsingHash: supportsGoWithoutReloadUsingHash,
  isExtraneousPopstateEvent: isExtraneousPopstateEvent,
  isAbsolute: isAbsolute,
  spliceOne: spliceOne,
  parsePath: parsePath,
  createPath: createPath,
  resolvePathname: resolvePathname
});

var index = {
    history: history
};

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Jhc3Mtcm91dGVyLmVzbS5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
