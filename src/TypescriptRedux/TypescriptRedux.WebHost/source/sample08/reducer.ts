import { createStore, combineReducers } from "redux";


import "./objectassign";


interface IAction {
    type: string;
}
interface ICounterAction extends IAction {
    field: string;
    by: number;
}
interface IColorAction extends IAction {
    color: string;
}
interface IShapeAction extends IAction {
    top: number;
    left: number;
    id: string;
}
interface IDefaultAction extends IAction {
    state: any;
}
const changeCounter = ( state:any = {}, action: ICounterAction): any => {
    switch (action.type) {
        case "COUNTER_CHANGE":
            return Object.assign({}, state, { [action.field]: state[action.field] + action.by });
        default:
            return state;
    }
};
const changeColor = (state: any = {}, action: IColorAction): any => {
    switch (action.type) {
        case "COLOR_CHANGE":
            return Object.assign({}, state, { color: action.color });
        default:
            return state;
    }
};

const changeShape = (state: any = {}, action: IShapeAction): any => {
    let shape;
    switch (action.type) {
        case "SHAPE_ADD":
            const id = state.nextShapeId;
            shape = Object.assign({}, { id: id }, action);
            delete shape["type"];
            return Object.assign({}, state, { nextShapeId: id + 1, shapes: [...state.shapes, shape] });
        case "SHAPE_CHANGE":
            shape = Object.assign({}, state.shapes.filter(x => x.id === action.id)[0],
                { top: action.top, left: action.left });
            return Object.assign({}, state,
                { shapes: [...state.shapes.filter(x => x.id !== action.id), shape] });
        default:
            return state;
    }
};
export var actions = [];
const defaultReducer = (state: any = {}, action: IDefaultAction): any => {
        actions.push(action);
        switch (action.type) {
            case "LOAD":
                return action.state;
            default:
                return state;
        }
};

export const myReducers = combineReducers({
    counter: changeCounter,
    color: changeColor,
    shape: changeShape,
    default: defaultReducer
});
