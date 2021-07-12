import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

function TimerViewUseState_2() {
  const [timer] = useState(() =>
    observable({
      number: 0,
      increase() {
        this.number++;
      },
    })
  );

  useEffect(() => {
    setInterval(() => {
      timer.increase();
    }, 1000);
  }, [timer]);

  return <h1>{timer.number} 초</h1>;
}

export default observer(TimerViewUseState_2);
