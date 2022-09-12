import { Field, Form, Formik } from 'formik';
import React from 'react';

const HouseholdCreateForm = ({handleSubmit, initialValues}) => {
    return (
        <div>
            <h2>Manage Your household</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({isSubmitting, errors, values, isValid}) => (
                    <Form>
                        <label>Name</label>
                        <Field name="name" />
                        <button type="submit" >Edit</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
};

export default HouseholdCreateForm;