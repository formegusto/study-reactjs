import React from "react";
import { CSSTransition } from "react-transition-group";
import "./styles/Transition.css";

function CSSTransitionBasic() {
  const [inProp, setInProp] = React.useState(false);
  return (
    <div>
      <CSSTransition in={inProp} timeout={1000} classNames="my-node">
        <div>{"I'll receive my-node-* classes"}</div>
      </CSSTransition>
      <button type="button" onClick={() => setInProp(true)}>
        Click to Enter
      </button>
    </div>
  );
}

export default CSSTransitionBasic;
