import React from "react";
import { ColorConsumer } from "../contexts/Color";

function ColorComponent() {
  return (
    <ColorConsumer>
      {({ state }) => (
        <>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: state.color,
            }}
          />
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: state.subcolor,
            }}
          />
        </>
      )}
    </ColorConsumer>
  );
}

export default ColorComponent;
