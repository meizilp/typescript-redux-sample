/// <reference path='../../typings/browser.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ReactDOM = require("react-dom");
var HelloWorld = (function (_super) {
    __extends(HelloWorld, _super);
    function HelloWorld() {
        _super.apply(this, arguments);
    }
    HelloWorld.prototype.render = function () {
        return React.createElement("div", null, "Hello, World!");
    };
    return HelloWorld;
}(React.Component));
ReactDOM.render(React.createElement(HelloWorld, null), document.getElementById("content"));
//# sourceMappingURL=app.js.map