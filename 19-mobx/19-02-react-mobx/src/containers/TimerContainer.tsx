import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import TimerComponent from "../components/TimerComponent";
import TimerStore from "../store/timer/TimerStore";

function TimerContainer({ timer }: { timer?: TimerStore }) {
  useEffect(() => {
    setInterval(() => {
      timer!.increaseTimer();
    }, 1000);
  }, [timer]);

  return <TimerComponent number={timer!.number} />;
}

export default observer(TimerContainer);
