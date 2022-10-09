import { connect } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import HouseholdCreateForm from './housholdCreateForm';

const HouseholdManager = ({currentUser, isLoading}) => {
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
                    <HouseholdCreateForm />
                </div>
            )
        }
</>

    );
};

const mapStateToProps = (state) => ({
    isLoading: state.app.isLoading,
    currentUser: state.profile.currentUser
});

const mapDispatchToProps = () => ({});

export default  connect(mapStateToProps, mapDispatchToProps)(HouseholdManager)