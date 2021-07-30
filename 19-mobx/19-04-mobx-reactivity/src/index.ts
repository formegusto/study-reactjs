import {
  autorun,
  get,
  getDependencyTree,
  observable,
  runInAction,
  set,
  trace,
} from "mobx";
import Message from "./types/Message";

var message = new Message("Foo", { name: "Michel" }, ["Joe", "Sara"]);

const disposer = autorun(() => {
  console.log(message.title);
  trace();
});
message.updateTitle("Bar");

console.log(getDependencyTree(disposer));

message = new Message("Bar", { name: "Michel" }, ["Joe", "Sara"]);
message.updateTitle("Foo");

let title = message.title;
autorun(() => {
  console.log(title);
  trace();
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

const author = message.author;
autorun(() => {
  console.log(
    "title:",
    "Incorrect: store a local reference to an observable object without tracking"
  );
  console.log(author.name);
});

runInAction(() => {
  message.author.name = "Sara";
});
runInAction(() => {
  message.author = { name: "Joe" };
});

autorun(() => {
  console.log(message);
});

// Won't trigger a re-run.
message.updateTitle("Hello world");

autorun(() => {
  console.log(message.likes.length);
});
autorun(() => {
  console.log(message.likes[0]);
});
autorun(() => {
  console.log(message.likes.join(", "));
});
message.likes.push("Jennifer");

const twitterUrls = observable.map({
  Joe: "twitter.com/joey",
});

autorun(() => {
  console.log(twitterUrls.get("Sara"));
});

runInAction(() => {
  twitterUrls.set("Sara", "twitter.com/horsejs");
});

autorun(() => {
  // console.log("test");
  setTimeout(() => console.log(message.likes.join(", ")), 10);
});

runInAction(() => {
  message.likes.push("Jennifer");
});

autorun(() => {
  console.log(message.author.age);
});

runInAction(() => {
  message.author.age = 10;
});

const twitterUrlsTest = observable.object({
  Joe: "twitter.com/joey",
});

autorun(() => {
  console.log(get(twitterUrlsTest, "Sara")); // `get` can track not yet existing properties.
});

runInAction(() => {
  set(twitterUrlsTest, { Sara: "twitter.com/horsejs" });
});
