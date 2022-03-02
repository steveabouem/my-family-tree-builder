import {PROFILE_CONSTANTS} from "../constants";

const getUser = () => (dispatch, getState) => {
    const currentUSer = getState().profile.currentUSer;

    dispatch({
        type: PROFILE_CONSTANTS.GET_CURRENT_USER,
        payload: currentUSer || null
    })
};

const setUser = (user) => (dispatch) => {
    dispatch({
        type: PROFILE_CONSTANTS.SET_CURRENT_USER,
        payload: user
    })
};

export default {
    getUser,
    setUser
}