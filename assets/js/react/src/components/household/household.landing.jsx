import React, {useEffect} from "react";
import {useDispatch, connect} from "react-redux";
import {APP_ACTIONS, PROFILE_ACTIONS} from "../../../redux/actions";
import {StyledHouseholdBubble} from "../../styles/components";

export const HouseholdLanding = ({currentUser}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (window.user) {
            dispatch(PROFILE_ACTIONS.setUser(window.user));
            // dispatch(APP_ACTIONS.setIsLoading(false));
        }
    }, [currentUser]);

    return (
        <>
            {/*<Formik*/}
            {/*    initialValues={{}}*/}
            {/*    onSubmit={(values) => console.log(values)}*/}
            {/*>*/}
            {/*    <Form>*/}
            {/*        <label>Name</label>*/}
            {/*        <Field name="name" />*/}
            {/*        <button type="submit">Edit</button>*/}
            {/*    </Form>*/}
            {/*</Formik>*/}
            <div>
                <h2>Welcome to your household {window.user.name}</h2>
                <div>

                </div>
            </div>
            <StyledHouseholdBubble />
        </>

);
}

const mapStateToProps = (state) => ({
    isLoading: state.isLoading,
    currentUSer: state.currentUSer
});

const mapDispatchToProps = (dispatch) => ({});

export default  connect(mapStateToProps, mapDispatchToProps)(HouseholdLanding)
