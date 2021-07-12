import { observer } from "mobx-react-lite";
import TimerStore from "../store/timer/TimerStore";

type Props = {
  timer: TimerStore;
};

const TimerView = observer<Props>(({ timer }) => <h1>{timer.number} 초</h1>);

export default TimerView;
