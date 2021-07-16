import React from "react";
import { inject, observer, Provider } from "mobx-react";

type ButtonProps = {
  color?: string;
};

// @inject("color")
// @observer
const Button = inject("color")(
  observer((props: React.PropsWithChildren<ButtonProps>) => {
    return (
      <button style={{ background: props.color }}>{props.children}</button>
    );
  })
);

type MessageProps = {
  text: string;
};
function Message(props: MessageProps) {
  return (
    <div>
      {props.text} <Button>Delete</Button>
    </div>
  );
}

type RootProps = {
  messages: string[];
};

function InjectContainer(props: RootProps) {
  const children = props.messages.map((message) => <Message text={message} />);
  return (
    <Provider color="red">
      <div>{children}</div>
    </Provider>
  );
}

export default InjectContainer;
