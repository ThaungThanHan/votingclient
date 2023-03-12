import {createStore,applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";
import UsersReducers from "./reducers/usersReducers.js";

const rootReducer = combineReducers({UsersReducers});

export const store = createStore(rootReducer,applyMiddleware(thunk));