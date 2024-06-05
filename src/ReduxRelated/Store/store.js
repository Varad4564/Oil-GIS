import { createStore } from "redux";

import { Rootreducer } from "../Reducers/CombineReducer";

export const Store = createStore(Rootreducer)