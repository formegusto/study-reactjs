import React from "react";
import {
  MotionLayoutProvider,
  MotionScreen,
  useMotion,
  MotionScene,
  SharedElement,
} from "react-motion-layout";
import { Chat, Chats } from "./store/Messages";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";

function Message() {
  const { messageId } = useParams<{ messageId: string }>();
  const item = Chats[parseInt(messageId) || 0];

  return (
    <MotionScreen>
      <MotionScene
        name={`message-${messageId}`}
        easing="cubic-bezier(0.22, 1, 0.36, 1)"
      >
        <div className="flex flex-col">
          <div className="flex p-4 cursor-pointer hover:bg-gray-100">
            <SharedElement.Image
              alt=""
              className="w-16 h-16 rounded-full"
              src={item.avatar}
              animationKey="avatar"
            />
            <div className="flex justify-between w-full ml-4 mt-2">
              <div className="flex flex-col">
                <SharedElement.Text
                  className="font-semibold text-xl"
                  animationKey="name"
                >
                  {item.name}
                </SharedElement.Text>
                <div className={`text-sm font-medium text-green-500`}>
                  Active now
                </div>
              </div>
              <div className={`text-xs ${item.unread ? "" : "text-gray-500"}`}>
                profile | settings
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex w-full justify-start">
              <div
                className="p-4 w-1/2 bg-gray-400 rounded-lg m-4"
                style={{ borderRadius: 40 }}
              >
                {item.messages[1].text}
              </div>
            </div>
            <div className="flex w-full justify-end items-center">
              <div
                className="flex p-4 w-1/2 bg-blue-600 text-white rounded-lg m-4"
                style={{ borderRadius: 40 }}
              >
                {item.messages[0].text}
              </div>
              <img
                alt=""
                className="w-5 h-5 rounded-full border-white mr-4"
                src={item.avatar}
              />
            </div>
          </div>
        </div>
      </MotionScene>
    </MotionScreen>
  );
}

function ItemComponent({ item, id }: { item: Chat; id: number }) {
  const history = useHistory();
  const withTransition = useMotion(`message-${id}`);
  const callback = React.useCallback(
    () => history.push(`/message/${id}`),
    [history, id]
  );

  return (
    <MotionScene
      easing="cubic-bezier(0.22, 1, 0.36, 1)"
      name={`message-${id}`}
      onClick={withTransition(callback)}
    >
      <div className="flex p-4 cursor-pointer hover:bg-gray-100">
        <SharedElement.Image
          alt=""
          className="w-16 h-16 rounded-full"
          src={item.avatar}
          animationKey="avatar"
        />
        <div className="flex justify-between w-full ml-4 mt-2">
          <div className="flex flex-col">
            <SharedElement.Text className="font-semibold" animationKey="name">
              {item.name}
            </SharedElement.Text>
            <div
              className={`text-sm font-medium ${
                item.unread ? "text-gray-800" : "text-gray-500"
              }`}
            >
              {item.text}
            </div>
          </div>
          <div className={`text-xs ${item.unread ? "" : "text-gray-500"}`}>
            {item.time}
          </div>
        </div>
      </div>
    </MotionScene>
  );
}

function Messages() {
  return (
    <MotionScreen>
      <div className="mt-4">
        <h1 className="p-4 text-3xl font-bold">Messages</h1>
        {Chats.map((item, id) => (
          <ItemComponent item={item} id={id} key={id} />
        ))}
      </div>
    </MotionScreen>
  );
}

function ChatExample() {
  return (
    <Router>
      <MotionLayoutProvider>
        <Switch>
          <Route path="/message/:messageId">
            <Message />
          </Route>
          <Route path="/">
            <Messages />
          </Route>
        </Switch>
      </MotionLayoutProvider>
    </Router>
  );
}

export default ChatExample;
