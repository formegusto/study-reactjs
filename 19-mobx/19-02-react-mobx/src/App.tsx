import TimerContainer from "./containers/TimerContainer";
import TimerStore from "./store/timer/TimerStore";

function App() {
  const timer = new TimerStore();

  return <TimerContainer timer={timer} />;
}

export default App;
