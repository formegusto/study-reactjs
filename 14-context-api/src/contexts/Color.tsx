import React, { createContext, useState } from "react";

export type ColorType = {
  state: {
    color: string;
    subcolor: string;
  };
  actions: {
    setColor: (color: string) => void;
    setSubcolor: (color: string) => void;
  };
};

const ColorContext = createContext<ColorType>({
  state: {
    color: "black",
    subcolor: "red",
  },
  actions: {
    setColor: () => {},
    setSubcolor: () => {},
  },
});

function ColorProvider({ children }: React.PropsWithChildren<any>) {
  const [color, setColor] = useState<string>("black");
  const [subcolor, setSubcolor] = useState<string>("red");

  const value = {
    state: { color, subcolor },
    actions: { setColor, setSubcolor },
  };

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
}

const { Consumer: ColorConsumer } = ColorContext;

export { ColorConsumer, ColorProvider };

export default ColorContext;
