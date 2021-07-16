import { Provider } from "mobx-react";
import InputContainer from "./containers/InputContainer";
import InputStore from "./store/input";

function App() {
  const inputStore = new InputStore({
    name: "",
    nickname: "",
  });

  return (
    <Provider inputStore={inputStore}>
      <InputContainer />
    </Provider>
  );
}

export default App;
