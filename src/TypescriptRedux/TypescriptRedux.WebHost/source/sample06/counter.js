"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='../../typings/browser.d.ts'/>
var React = require('react');
var react_redux_1 = require('react-redux');
var Counter = (function (_super) {
    __extends(Counter, _super);
    function Counter() {
        _super.apply(this, arguments);
    }
    Counter.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null, React.createElement("p", null, React.createElement("label", null, "Counter: "), React.createElement("b", null, "#", this.props.counter)), React.createElement("button", {onClick: function (e) { return _this.props.incr(); }}, "INCREMENT"), React.createElement("span", {style: { padding: "0 5px" }}), React.createElement("button", {onClick: function (e) { return _this.props.decr(); }}, "DECREMENT")));
    };
    return Counter;
}(React.Component));
var mapStateToProps = function (state) { return state; };
var mapDispatchToProps = function (dispatch) { return ({
    incr: function () {
        dispatch({ type: 'INCR', by: 1 });
    },
    decr: function () {
        dispatch({ type: 'INCR', by: -1 });
    }
}); };
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Counter);
//# sourceMappingURL=counter.js.map