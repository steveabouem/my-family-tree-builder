import {HOUSEHOLD_CONSTANTS} from "../constants";
// import  SERVICE THEN CALL IT IN Function, THEN WRITE THE END POINT IN API
import householdService from "../../services/household.service";

const fetchAll = () => async (dispatch) => {
    const {data} = await householdService.fetchHouseholds();
    dispatch({
        type: HOUSEHOLD_CONSTANTS.FETCH_ALL,
        payload: data
    })
};

export default {
    fetchAll
}