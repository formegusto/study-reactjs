"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var Message_1 = __importDefault(require("./types/Message"));
var message = new Message_1.default("Foo", { name: "Michel" }, ["Joe", "Sara"]);
var disposer = mobx_1.autorun(function () {
    console.log(message.title);
    mobx_1.trace();
});
message.updateTitle("Bar");
console.log(mobx_1.getDependencyTree(disposer));
message = new Message_1.default("Bar", { name: "Michel" }, ["Joe", "Sara"]);
message.updateTitle("Foo");
var title = message.title;
mobx_1.autorun(function () {
    console.log(title);
    mobx_1.trace();
});
// message.updateTitle("Bar");
// message.updateTitle("Foo");
// autorun(() => {
//   console.log("title:", "Correct: dereference inside the tracked function");
//   console.log(message.author.name);
// });
// runInAction(() => {
//   message.author.name = "Sara";
// });
// runInAction(() => {
//   message.author = { name: "Joe" };
// });
var author = message.author;
mobx_1.autorun(function () {
    console.log("title:", "Incorrect: store a local reference to an observable object without tracking");
    console.log(author.name);
});
mobx_1.runInAction(function () {
    message.author.name = "Sara";
});
mobx_1.runInAction(function () {
    message.author = { name: "Joe" };
});
mobx_1.autorun(function () {
    console.log(message);
});
// Won't trigger a re-run.
message.updateTitle("Hello world");
mobx_1.autorun(function () {
    console.log(message.likes.length);
});
mobx_1.autorun(function () {
    console.log(message.likes[0]);
});
mobx_1.autorun(function () {
    console.log(message.likes.join(", "));
});
message.likes.push("Jennifer");
var twitterUrls = mobx_1.observable.map({
    Joe: "twitter.com/joey",
});
mobx_1.autorun(function () {
    console.log(twitterUrls.get("Sara"));
});
mobx_1.runInAction(function () {
    twitterUrls.set("Sara", "twitter.com/horsejs");
});
mobx_1.autorun(function () {
    // console.log("test");
    setTimeout(function () { return console.log(message.likes.join(", ")); }, 10);
});
mobx_1.runInAction(function () {
    message.likes.push("Jennifer");
});
mobx_1.autorun(function () {
    console.log(message.author.age);
});
mobx_1.runInAction(function () {
    message.author.age = 10;
});
var twitterUrlsTest = mobx_1.observable.object({
    Joe: "twitter.com/joey",
});
mobx_1.autorun(function () {
    console.log(mobx_1.get(twitterUrlsTest, "Sara")); // `get` can track not yet existing properties.
});
mobx_1.runInAction(function () {
    mobx_1.set(twitterUrlsTest, { Sara: "twitter.com/horsejs" });
});
