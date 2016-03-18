/// <reference path='../../typings/browser.d.ts'/>

import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import Counter from "./counter";
import ActionPlayer from "./actionplayer";
import ShapeMaker from "./shapemaker";
import ShapeViewer from "./shapeviewer";
import { ColorWrapper } from "./colorpicker";

import "./objectassign";

import {myReducers, actions} from "./reducer";

var defaultState = { nextShapeId: 0, width: 100, height: 100 };

let store = createStore(myReducers);

store.subscribe(() => {
    console.log("store has been updated. Latest store state:", store.getState());
});
ReactDOM.render(
    <Provider store={store}>
        <table>
            <tbody>
                <tr>
                    <td style={{ width: 220 }}>
                        <Counter field="width" step={10} />
                        <Counter field="height" step={10} />
                        <ColorWrapper />
                    </td>
                    <td style={{ verticalAlign: "top", textAlign: "center", width: 500 }}>
                        <h2>Preview</h2>
                        <ShapeMaker />
                    </td>
                    <td style={{ verticalAlign: "bottom" }}>
                        <ActionPlayer store={store} actions={actions} defaultState={defaultState} />
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <h2 style={{ margin: 5, textAlign: "center" }}>Shapes</h2>
                        <ShapeViewer />
                    </td>
                </tr>
            </tbody>
        </table>
    </Provider>,
    document.getElementById("content"));