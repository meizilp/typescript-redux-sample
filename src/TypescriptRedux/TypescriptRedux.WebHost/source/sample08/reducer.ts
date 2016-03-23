import { combineReducers } from "redux";


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



const changeCounter = (state:any ={width:100,height:100}, action): any => {
    switch (action.type) {
        case "COUNTER_CHANGE":
            return Object.assign({}, state, { [action.field]: state[action.field] + action.by });
        default:
            return state;
    }
};
const changeColor = (state:string = "#000000" ,action): any => {
    switch (action.type) {
        case "COLOR_CHANGE":
            return action.color;
        default:
            return state;
    }
};
export var actions = [];

const changeShape = (state: any = { nextShapeId:0,shapes:[]}, action): any => {
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
        case "LOAD":
            return action.state;
        default:
            return state;
    }
};

const historyLoad = (state:any={}, action) => {
    console.log(action.type);
    if (action.type !== "LOAD" && ! /^@@redux/.test(action.type) ) {
        actions.push(action);
    }
    return state;
}

export const myReducers = combineReducers({
    counter: changeCounter,
    color: changeColor,
    shape: changeShape,
    history: historyLoad
});
