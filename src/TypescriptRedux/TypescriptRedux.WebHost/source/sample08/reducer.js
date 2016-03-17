"use strict";
var redux_1 = require("redux");
require("./objectassign");
var counterReducer = function (state, action) {
    switch (action.type) {
        case "COUNTER_CHANGE":
            return Object.assign({}, state, (_a = {}, _a[action.field] = state[action.field] + action.by, _a));
        default:
            return state;
    }
    var _a;
};
var colorReducer = function (state, action) {
    switch (action.type) {
        case "COLOR_CHANGE":
            return Object.assign({}, state, { color: action.color });
        default:
            return state;
    }
};
var shapeReducer = function (state, action) {
    var shape;
    switch (action.type) {
        case "SHAPE_ADD":
            var id = state.nextShapeId;
            shape = Object.assign({}, { id: id }, action);
            delete shape["type"];
            return Object.assign({}, state, { nextShapeId: id + 1, shapes: state.shapes.concat([shape]) });
        case "SHAPE_CHANGE":
            shape = Object.assign({}, state.shapes.filter(function (x) { return x.id === action.id; })[0], { top: action.top, left: action.left });
            return Object.assign({}, state, { shapes: state.shapes.filter(function (x) { return x.id !== action.id; }).concat([shape]) });
        default:
            return state;
    }
};
exports.actions = [];
var defaultReducer = function (state, action) {
    exports.actions.push(action);
    switch (action.type) {
        case "LOAD":
            return action.state;
        default:
            return state;
    }
};
exports.myReducers = redux_1.combineReducers({
    counter: counterReducer,
    color: colorReducer,
    shape: shapeReducer,
    default: defaultReducer
});
//# sourceMappingURL=reducer.js.map