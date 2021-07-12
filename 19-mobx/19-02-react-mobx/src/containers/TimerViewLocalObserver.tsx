import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

function TimerViewLocalObserver() {
  const timer = useLocalObservable(() => ({
    number: 0,
    increase() {
      this.number++;
    },
  }));

  useEffect(() => {
    setInterval(() => {
      timer.increase();
    }, 1000);
  }, [timer]);

  return <h1>{timer.number} 초</h1>;
}

export default observer(TimerViewLocalObserver);
