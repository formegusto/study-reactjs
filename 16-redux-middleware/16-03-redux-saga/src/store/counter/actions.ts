import { createAction } from "redux-actions";
import { DECREASE, DECREASE_ASYNC, INCREASE, INCREASE_ASYNC } from "./types";

const increase = createAction(INCREASE);
const decrease = createAction(DECREASE);

const increase_async = createAction<undefined>(INCREASE_ASYNC, () => undefined);
const decrease_async = createAction<undefined>(DECREASE_ASYNC, () => undefined);

export { increase, decrease, increase_async, decrease_async };
