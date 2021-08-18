import React from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./styles/Transition.css";

function SwitchBasic() {
  const [state, setState] = React.useState(false);
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={state ? "Goodbye, world!" : "Hello, world!"}
        addEndListener={(node, done) =>
          node.addEventListener("transitionend", done, false)
        }
        classNames="fade"
      >
        <button onClick={() => setState((state) => !state)}>
          {state ? "Goodbye, world!" : "Hello, world!"}
        </button>
      </CSSTransition>
    </SwitchTransition>
  );
}

export default SwitchBasic;
