import {APP_CONSTANTS} from "../constants";

const setIsLoading = (status) => (dispatch) => {

    dispatch({
        type: APP_CONSTANTS.SET_IS_LOADING,
        payload: status
    })
};

export default {
    setIsLoading
}