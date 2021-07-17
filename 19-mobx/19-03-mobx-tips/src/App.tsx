import MessageContainer from "./containers/MessageContainer";
import Message from "./store/message";

function App() {
  const MessageStore = new Message(
    "메세지다.",
    {
      name: "th",
    },
    ["mk", "sj"]
  );

  return <MessageContainer store={MessageStore} />;
}

export default App;
