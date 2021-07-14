import { Observer, observer } from "mobx-react-lite";
import { useEffect } from "react";
// import TimerComponent from "../components/TimerComponent";
import TimerStore from "../store/timer/TimerStore";
import TimeViewEmpty from "./TimeViewEmpty";

type Props = {
  timer: TimerStore;
};

// const TimerContainer = observer(({ timer }: Props) => {
//   useEffect(() => {
//     setInterval(() => {
//       timer.increaseTimer();
//     }, 1000);
//   }, [timer]);

//   return (
//     <TimerComponent number={timer.number} increaseTimer={timer.increaseTimer} />
//   );
// });

// export default TimerContainer;

function TimerContainer({ timer }: Props) {
  useEffect(() => {
    setInterval(() => {
      timer.increaseTimer();
    }, 1000);
  }, [timer]);
  return (
    // <TimerComponent number={timer.number} increaseTimer={timer.increaseTimer} />
    // <TimeViewEmpty onRender={() => <h1>{timer.number}초</h1>} />
    <TimeViewEmpty
      onRender={() => <Observer>{() => <h1>{timer.number}초</h1>}</Observer>}
    />
  );
}

export default observer<Props>(TimerContainer);
