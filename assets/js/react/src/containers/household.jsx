import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../../bootstrap";
import {Page} from "../components/common/Page.jsx";
import {Formik, Field, Form} from "formik";
import {StyledHouseholdBubble} from "../styles/components";

const householdElement = document.getElementById('household');

class Household extends React.Component {

    render() {
        return (
            <Page>
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
                    <h2>Welcome to your household</h2>
                    <div>

                    </div>
                </div>
                <StyledHouseholdBubble />
            </Page>
        );
    }
}

ReactDOM.render(<Household />, householdElement)
