import React from 'react';
import ReactDOM from 'react-dom';
import {Formik, Field, Form} from "formik";
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../../bootstrap";
import {Page} from "../components/common/Page.jsx";
import {StyledLoginContainer} from "../styles/components";
import authenticationService from "../../services"

const registrationElement = document.getElementById('registration');

const Registration = () => {

    const onSubmit = (values) => {
        authenticationService.submitRegistrationForm(values)
            .then(r => {
                console.log(r);
            })
    };


    return (
        <Page>
            <StyledLoginContainer>
                <div>
                    <h2>Register</h2>
                </div>
                <Formik
                    initialValues={{"name": null, "email": null, "password": null}}
                    onSubmit={onSubmit}
                >
                    <Form>
                        <div>
                            <label>Name</label>
                            <Field name="name" />
                        </div>
                        <div>
                            <label>Email</label>
                            <Field name="email" />
                        </div>
                        <div>
                            <label>Password</label>
                            <Field name="password" />
                        </div>
                        <div>
                            <button type="submit" >Sign up</button>
                        </div>
                    </Form>
                </Formik>
            </StyledLoginContainer>
        </Page>
    );
}

ReactDOM.render(<Registration />, registrationElement)