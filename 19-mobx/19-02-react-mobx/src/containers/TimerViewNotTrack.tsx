import { observer } from "mobx-react-lite";

const TimerViewNotTrack = observer(({ number }: any) => <h1>{number} 초</h1>);

export default TimerViewNotTrack;
