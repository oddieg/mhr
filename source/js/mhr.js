/*global
	console
*/
var mhr = (function() {

    var hiddenClass = 'hdn'; //class to hide elements
    var maskEl;

    function get(id) {
        if (typeof id === "string") {
            return document.getElementById(id);
        }
        return id;
    }

    function show(id) {
        removeClass(id, hiddenClass);
    }

    function hide(id) {
        addClass(id, hiddenClass);
    }

    function addClass(id, className) {
        var el = get(id);
        if (!el) {
            return;
        }
        el.classList.add(className);
    }

    function removeClass(id, className) {
        var el = get(id);
        if (!el) {
            return;
        }
        el.classList.remove(className);
    }

    function hasClass(el, className) {
        return el.classList.contains(className);
    }

    function nodeListToArray(list) {
        return Array.prototype.slice.call(list, 0);
    }

    return {
        get: get,
        show: show,
        hide: hide,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        nodeListToArray: nodeListToArray
    };
})();
