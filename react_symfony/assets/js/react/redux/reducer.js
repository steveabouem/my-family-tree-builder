import {combineReducers} from "redux";
import app from "./reducers/app.reducer";
import profile from "./reducers/profile.reducer";
import topbar from "./reducers/topbar.reducer";

export default combineReducers({
    profile,
    topbar,
    app,
});