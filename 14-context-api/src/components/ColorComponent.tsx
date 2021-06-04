import React, { useContext } from "react";
import ColorContext from "../contexts/Color";

function ColorComponent() {
  const { state } = useContext(ColorContext);

  return (
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
  );
}

export default ColorComponent;
