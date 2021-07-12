import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import TimerComponent from "../components/TimerComponent";
import TimerStore from "../store/timer/TimerStore";

function TimerContainer({ number, increaseTimer }: TimerStore) {
  useEffect(() => {
    setInterval(() => {
      increaseTimer();
    }, 1000);
  }, [increaseTimer]);

  return <TimerComponent number={number} />;
}

type Props = {
  timer: TimerStore;
};

export default observer<Props>(({ timer }) => (
  <TimerContainer number={timer.number} increaseTimer={timer.increaseTimer} />
));
