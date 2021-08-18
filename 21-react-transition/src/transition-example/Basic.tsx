import { CSSProperties } from "react";
import { Transition } from "react-transition-group";

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles: {
  [key: string]: CSSProperties;
} = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

type Props = {
  in: boolean;
};

const Fade = ({ in: inProp }: Props) => (
  <Transition in={inProp} timeout={duration}>
    {(state) => (
      <div
        style={{
          ...defaultStyle,
          ...transitionStyles[state],
        }}
      >
        I'm a fade Transition!
      </div>
    )}
  </Transition>
);

export default Fade;
