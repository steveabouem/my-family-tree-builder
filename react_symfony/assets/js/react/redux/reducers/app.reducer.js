import APP_CONSTANTS from "../constants/app.constants";

const initialState = {
    isLoading: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case APP_CONSTANTS.SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case APP_CONSTANTS.GET_IS_LOADING:
            return {
                ...state,
                isLoading: state.isLoading
            };
        default:
            return  state;
    }
};

export default reducer;