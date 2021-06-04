import React from "react";
import ColorComponent from "./components/ColorComponent";
import SelectComponent from "./components/SelectComponent";
import { ColorProvider } from "./contexts/Color";

function App() {
  return (
    <ColorProvider>
      <SelectComponent />
      <ColorComponent />
    </ColorProvider>
  );
}

export default App;
