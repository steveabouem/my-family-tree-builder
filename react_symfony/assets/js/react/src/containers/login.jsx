import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../../bootstrap";
import {Formik, Field, Form} from "formik";
import {StyledLoginContainer} from "../styles/components";
import App from "../../app";
import AUTHENTICATION_SERVICE from "../../services/authentication.service";

const loginElement = document.getElementById('root');

const Login = () => {

    const onSubmit = (values) => {
        e.preventDefault();
        AUTHENTICATION_SERVICE.submitLoginForm()
    };

    return (
        <App>
            <StyledLoginContainer>
                <div>
                    <h2>Login</h2>
                </div>
                <Formik
                    initialValues={{"email": null, "password": null}}
                    onSubmit={(values) => console.log(values)}
                >
                    <Form>
                        <div>
                            <label>Email</label>
                            <Field name="_username" />
                        </div>
                        <div>
                            <label>Password</label>
                            <Field name="_password" />
                        </div>
                        <div>
                            <button type="submit">Sign in</button>
                        </div>
                    </Form>
                </Formik>
            </StyledLoginContainer>
        </App>
    );
}

ReactDOM.render(<Login />, loginElement)