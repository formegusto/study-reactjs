import { observer } from "mobx-react-lite";
import TimerStore from "../store/timer/TimerStore";

type Props = {
  timer: TimerStore;
};

function PureTimerContainer() {
  const timer = new TimerStore();
  const TimerView = observer<Props>(({ timer }) => <h1>{timer.number}</h1>);

  setInterval(() => {
    timer.increaseTimer();
  }, 1000);

  return <TimerView timer={timer} />;
}

export default PureTimerContainer;
