import { createContext } from "react";
import TimerStore from "../store/timer/TimerStore";

const TimerContext = createContext<TimerStore | null>(null);

export default TimerContext;
