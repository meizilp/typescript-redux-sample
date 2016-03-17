/// <reference path='../../typings/browser.d.ts'/>
"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
var counter_1 = require("./counter");
var store = redux_1.createStore(function (state, action) {
    switch (action.type) {
        case 'INCR':
            return { counter: state.counter + action.by };
        default:
            return state;
    }
}, { counter: 0 });
ReactDOM.render(React.createElement(react_redux_1.Provider, {store: store}, React.createElement(counter_1.default, null)), document.getElementById("content"));
//# sourceMappingURL=app.js.map