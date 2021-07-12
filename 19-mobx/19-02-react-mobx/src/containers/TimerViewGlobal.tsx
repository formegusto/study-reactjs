import { observer } from "mobx-react-lite";
import TimerStore from "../store/timer/TimerStore";

const timer = new TimerStore();

const TimerViewGlobal = observer(() => <h1>{timer.number}초</h1>);

setInterval(() => {
  timer.increaseTimer();
}, 1000);

export default TimerViewGlobal;
