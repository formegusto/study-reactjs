import React, { CSSProperties } from 'react';

function App() {
  const name:string = "리액트";
  const style:CSSProperties = {
    backgroundColor: "black",
    color: "aqua",
    fontSize: "48px",
    fontWeight: "bold",
    padding: 16
  };
  return <div style={style}>{name}</div>
}

export default App;
