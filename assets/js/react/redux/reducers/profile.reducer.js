import PROFILE_CONSTANTS from "../constants/profile.constants";

const initialState = {
    currentUser: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PROFILE_CONSTANTS.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            }
        case PROFILE_CONSTANTS.GET_CURRENT_USER:
            return state.currentUser;
        default:
            return  state;
    }
};

export default reducer;