import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import TimerContext from "../context/TimerContext";
import TimerStore from "../store/timer/TimerStore";

const TimerViewContext = observer(() => {
  const timer = useContext<TimerStore | null>(TimerContext);

  useEffect(() => {
    setInterval(() => {
      timer?.increaseTimer();
    }, 1000);
  }, [timer]);

  return <h1>{timer?.number} 초</h1>;
});

export default TimerViewContext;
