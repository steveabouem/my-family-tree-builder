import HOUSEHOLD_CONSTANTS from "../constants/household.constants";

const initialState = {
    index: [],
    current: undefined,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case HOUSEHOLD_CONSTANTS.FETCH_ALL:
            return {
                ...state,
                index: action.payload
            };
        case HOUSEHOLD_CONSTANTS.FETCH_ONE:
            return {
                ...state,
                current: state.isLoading
            };
        default:
            return  state;
    }
};

export default reducer;