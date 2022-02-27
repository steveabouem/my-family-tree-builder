import {TOPBAR_CONSTANTS} from "../constants";

const setUser = (user) => (dispatch) => {

    dispatch({
        type: TOPBAR_CONSTANTS.SET_CURRENT_USER,
        payload: user
    })
};

export default {
    setUser
}