import React, {useEffect} from "react";
import {useDispatch, connect} from "react-redux";
import { Formik, Form, Field} from 'formik';
import {APP_ACTIONS} from "../../redux/actions";
import {StyledHouseholdBubble} from "../../styles/components";

const HouseholdLanding = ({currentUser, isLoading}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // if (currentUser) {
        //     dispatch(APP_ACTIONS.setIsLoading(false));
        // }
    }, [currentUser, isLoading]);

    return (
        <>
                {
                    !isLoading && (
                        <div>
                            <h2>Welcome to your household {currentUser.name}</h2>
                            <div>
                                <ul>Objectives</ul>
                                <ul>Members</ul>
                            </div>
                        </div>
                    )
                }
            <StyledHouseholdBubble />
        </>

);
}

const mapStateToProps = (state) => ({
    isLoading: state.app.isLoading,
    currentUser: state.profile.currentUser
});

const mapDispatchToProps = () => ({});

export default  connect(mapStateToProps, mapDispatchToProps)(HouseholdLanding)
