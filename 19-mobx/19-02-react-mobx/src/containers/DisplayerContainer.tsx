import DisplayerComponent from "../components/DisplayerComponent";
import CarStore from "../store/car";
import PersonStore from "../store/person";

type Props = {
  person: PersonStore;
  car: CarStore;
};

function DisplayerContainer({ car, person }: Props) {
  return (
    <>
      <DisplayerComponent
        getName={() => person.name}
        changeName={(e) => {
          person.changeName(e.target.value);
        }}
      />
      <DisplayerComponent
        getName={() => car.name}
        changeName={(e) => {
          car.changeName(e.target.value);
        }}
      />
    </>
  );
}

export default DisplayerContainer;
