import {combineReducers} from "redux";
import APP_REDUCER from "./reducers/app.reducer";
import PROFILE_REDUCER from "./reducers/profile.reducer";
import TOPBAR_REDUCER from "./reducers/topbar.reducer";

export default combineReducers({
    PROFILE_REDUCER,
    TOPBAR_REDUCER,
    APP_REDUCER,
});