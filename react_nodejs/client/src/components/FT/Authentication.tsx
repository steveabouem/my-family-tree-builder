import React, { useEffect, useState } from "react";
import { DUserDTO } from "../../services/FT/auth/auth.definitions";
import { Field, Form, Formik, FormikHelpers } from "formik";
import AuthService from "../../services/FT";


const FTAuthentication = (): JSX.Element => {
    const [lastName, setLastName] = useState<string>('');
    const [familyOptions, seFamilyOptions] = useState<string[]>([]);

    useEffect(() => {
        async function getFams(name: string): Promise<>
        if (lastName.length > 3) {
            const matches = 
        }
    }, [lastName]);

    const initialValues = {
        first_name:'',
        last_name:'',
        age:1,
        occupation:'',
        partner:0,
        marital_status:'',
        password:'',
        email:'',
        is_parent:false,
        gender:1,
        profile_url:'',
        description:'',
        imm_family:0,
    };

    const submitForm = async (p_values: Partial<DUserDTO>, { setSubmitting }: FormikHelpers<Partial<DUserDTO>>) => {
        const authService = new AuthService();

        const success = await authService.register(p_values)
        .catch(e => {
            // TODO: LOGGING AND PROPER HANDLING IN FRONT
            console.log('Error registering', e);
            return false;
        });

        if (success) {
            // TODO: redux/session/ip/routing
            console.log('good');
        } else {
            console.log('bad');
        }
    };

    return (
        <div className="form-container">
            <Formik
                initialValues={initialValues}
                onSubmit={submitForm}
            >
                <Form>
                    <div>
                        <label htmlFor="first_name">First Name</label>
                        <Field id="first_name" name="first_name" />
                    </div>

                    <div>
                        <label htmlFor="last_name">Last Name</label>
                        <Field id="last_name" name="last_name" />
                    </div>

                    <div>
                        <label htmlFor="email">Email</label>
                        <Field id="email" name="email" type="email" />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <Field id="password" name="password" type="password" />
                    </div>

                    <div>
                        <label htmlFor="gender">Gender</label>
                        <Field id="gender" name="gender"/>
                    </div>

                    <div>
                        <label htmlFor="age">Age</label>
                        <Field id="age" name="age"/>
                    </div>

                    <div>
                        <label htmlFor="is_parent">Parent</label>
                        <Field id="is_parent" name="is_parent" type="checkbox"/>
                    </div>

                    <div>
                        <label htmlFor="marital_status">Marital Status</label>
                        <Field id="marital_status" name="marital_status"/>
                    </div>

                    <div>
                        <label htmlFor="occupation">Occupation</label>
                        <Field id="occupation" name="occupation"/>
                    </div>

                    <div>
                        <label htmlFor="description">Summary</label>
                        <Field id="description" name="description"/>
                    </div>

                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}

export default FTAuthentication;