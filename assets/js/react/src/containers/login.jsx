import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../../bootstrap";
import {Page} from "../components/common/Page.jsx";
import {Formik, Field, Form} from "formik";
import {StyledLoginContainer} from "../styles/components";

const loginElement = document.getElementById('login');

const Login = () => {

    const onSubmit = (values) => {
        e.preventDefault();

    };


    return (
        <Page>
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
        </Page>
    );
}

// ReactDOM.render(<Login />, loginElement)