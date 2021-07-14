// import TimerContainer from "./containers/TimerContainer";
// import TimerStore from "./store/timer/TimerStore";

import DisplayerContainer from "./containers/DisplayerContainer";
import CarStore from "./store/car";
import PersonStore from "./store/person";

function App() {
  // const timer = new TimerStore();

  // return <TimerContainer timer={timer} />;
  const car = new CarStore();
  const person = new PersonStore();

  return <DisplayerContainer car={car} person={person} />;
}

export default App;
