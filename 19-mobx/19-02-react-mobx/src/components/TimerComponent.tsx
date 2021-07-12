import TimerStore from "../store/timer/TimerStore";

function TimerComponent(props: TimerStore) {
  return <h1>{props.number} 초</h1>;
}

export default TimerComponent;
