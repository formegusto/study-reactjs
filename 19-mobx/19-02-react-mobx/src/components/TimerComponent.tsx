type Props = {
  number: number;
};

function TimerComponent(props: Props) {
  return <h1>{props.number} 초</h1>;
}

export default TimerComponent;
