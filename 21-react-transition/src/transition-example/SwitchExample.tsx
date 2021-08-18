import React from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Button, Form } from "react-bootstrap";
import "./styles/Switch.css";

const modes = ["out-in", "in-out"];

function SwitchExample() {
  const [mode, setMode] = React.useState<"out-in" | "in-out" | undefined>(
    "out-in"
  );
  const [state, setState] = React.useState(true);
  return (
    <>
      <div className="label">Mode:</div>
      <div className="modes">
        {modes.map((m) => (
          <Form.Check
            key={m}
            custom
            inline
            label={m}
            id={`mode=msContentScript${m}`}
            type="radio"
            name="mode"
            checked={mode === m}
            value={m}
            onChange={(event) => {
              setMode(event.target.value as "out-in" | "in-out" | undefined);
            }}
          />
        ))}
      </div>
      <div className="main">
        <SwitchTransition mode={mode}>
          <CSSTransition
            key={state.toString()}
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            classNames="fade"
          >
            <div className="button-container">
              <Button onClick={() => setState((state) => !state)}>
                {state ? "Hello, world!" : "Goodbye, world!"}
              </Button>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </>
  );
}

export default SwitchExample;
