import { inject, observer } from "mobx-react";
import InputComponent from "../components/InputComponent";
import InputStore from "../store/input";

type Props = {
  store?: InputStore;
};

function InputContainer({ store }: Props) {
  console.log(store);
  return (
    <>
      <h1>{store?.input["name"]}</h1>
      {/* <InputComponent input={store!.input} changeInput={store!.changeInput} /> */}
      <InputComponent
        name={store!.input.name}
        changeInput={store!.changeInput}
      />
    </>
  );
}

export default inject((store: { inputStore: InputStore }) => ({
  store: store.inputStore,
}))(observer(InputContainer));
