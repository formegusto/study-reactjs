import CombineContainer from "./containers/CombineContainer";
import RootStore from "./store";

function App() {
  const store = new RootStore();

  return <CombineContainer store={store} />;
}

export default App;
