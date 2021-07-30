"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var Message = /** @class */ (function () {
    function Message(title, author, likes) {
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "author", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "likes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        mobx_1.makeAutoObservable(this);
        this.title = title;
        this.author = author;
        this.likes = likes;
    }
    Object.defineProperty(Message.prototype, "updateTitle", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (title) {
            this.title = title;
        }
    });
    return Message;
}());
exports.default = Message;
