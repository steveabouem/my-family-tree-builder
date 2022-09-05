import React from 'react';
import ReactDOM from 'react-dom';
import {Formik, Field, Form} from "formik";
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../../bootstrap";
import {StyledLoginContainer} from "../styles/components";
import authenticationService from "../../services"
import App from "../../app";

const registrationElement = document.getElementById('root');

const Registration = () => {

    const onSubmit = (values) => {
        authenticationService.submitRegistrationForm(values);
    };


    return (
        <App>
            <StyledLoginContainer>
                <div className="form-header-row">
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
                            <Field name="email" type="email" />
                        </div>
                        <div>
                            <label>Password</label>
                            <Field name="password" type="password"/>
                        </div>
                        <div>
                            <button type="submit" >Sign up</button>
                        </div>
                    </Form>
                </Formik>
            </StyledLoginContainer>
        </App>
    );
}

ReactDOM.render(<Registration />, registrationElement)