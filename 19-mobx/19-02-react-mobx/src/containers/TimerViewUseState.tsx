import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import TimerStore from "../store/timer/TimerStore";

function TimerViewUseState() {
  const [timer] = useState<TimerStore>(new TimerStore());

  useEffect(() => {
    setInterval(() => {
      timer.increaseTimer();
    }, 1000);
  }, [timer]);

  return <h1>{timer.number} 초</h1>;
}

export default observer(TimerViewUseState);
