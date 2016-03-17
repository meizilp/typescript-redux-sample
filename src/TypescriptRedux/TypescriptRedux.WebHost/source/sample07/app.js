/// <reference path='../../typings/browser.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ReactDOM = require("react-dom");
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
var counter_1 = require("./counter");
var actionplayer_1 = require("./actionplayer");
var shapemaker_1 = require("./shapemaker");
var shapeviewer_1 = require("./shapeviewer");
var colorpicker_1 = require("./colorpicker");
require("./objectassign");
var actions = [];
var defaultState = { nextShapeId: 0, width: 100, height: 100, color: "#000000", shapes: [] };
var store = redux_1.createStore(function (state, action) {
    actions.push(action);
    var shape;
    switch (action.type) {
        case "COUNTER_CHANGE":
            return Object.assign({}, state, (_a = {}, _a[action.field] = state[action.field] + action.by, _a));
        case "COLOR_CHANGE":
            return Object.assign({}, state, { color: action.color });
        case "SHAPE_ADD":
            var id = state.nextShapeId;
            shape = Object.assign({}, { id: id }, action);
            delete shape["type"];
            return Object.assign({}, state, { nextShapeId: id + 1, shapes: state.shapes.concat([shape]) });
        case "SHAPE_CHANGE":
            shape = Object.assign({}, state.shapes.filter(function (x) { return x.id === action.id; })[0], { top: action.top, left: action.left });
            return Object.assign({}, state, { shapes: state.shapes.filter(function (x) { return x.id !== action.id; }).concat([shape]) });
        case "LOAD":
            return action.state;
        default:
            return state;
    }
    var _a;
}, defaultState);
var ColorWrapperBase = (function (_super) {
    __extends(ColorWrapperBase, _super);
    function ColorWrapperBase() {
        _super.apply(this, arguments);
    }
    ColorWrapperBase.prototype.render = function () {
        return React.createElement(colorpicker_1.ColorPicker, {color: this.props.color, onChange: this.props.setColor});
    };
    return ColorWrapperBase;
}(React.Component));
var ColorWrapper = react_redux_1.connect(function (state) { return ({ color: state.color }); }, function (dispatch) { return ({ setColor: function (color) { return dispatch({ type: 'COLOR_CHANGE', color: color }); } }); })(ColorWrapperBase);
ReactDOM.render(React.createElement(react_redux_1.Provider, {store: store}, React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {style: { width: 220 }}, React.createElement(counter_1.default, {field: "width", step: 10}), React.createElement(counter_1.default, {field: "height", step: 10}), React.createElement(ColorWrapper, null)), React.createElement("td", {style: { verticalAlign: "top", textAlign: "center", width: 500 }}, React.createElement("h2", null, "Preview"), React.createElement(shapemaker_1.default, null)), React.createElement("td", {style: { verticalAlign: 'bottom' }}, React.createElement(actionplayer_1.default, {store: store, actions: actions, defaultState: defaultState}))), React.createElement("tr", null, React.createElement("td", {colSpan: 3}, React.createElement("h2", {style: { margin: 5, textAlign: 'center' }}, "Shapes"), React.createElement(shapeviewer_1.default, null)))))), document.getElementById("content"));
//# sourceMappingURL=app.js.map