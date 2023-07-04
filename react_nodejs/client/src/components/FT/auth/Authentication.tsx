import React, { useContext, useState } from "react";
import { DUserDTO } from "../../../services/FT/auth/auth.definitions";
import { Form, Formik, FormikHelpers } from "formik";
import AuthService from "../../../services/FT";
import { DAuthProps } from "./definitions";
import BaseFormFields from "../../common/forms/BaseFormFields";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import FamilyTreeContext from "../../../context/FT/familyTree.context";

const FTAuthentication = ({ mode, changeMode }: DAuthProps): JSX.Element => {
  const { updateUser } = useContext(FamilyTreeContext);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['FT'])

  const loginFormFields = [
    {
      fieldName: 'email',
      label: 'Email',
      // class: ,
      required: true
    },
    {
      fieldName: 'password',
      label: 'Password',
      // class: ,
      required: true
    },

  ];

  const registrationFormFields = [
    {
      fieldName: 'first_name',
      label: 'First Name',
      // class: ,
      required: true
    },

    {
      fieldName: 'last_name',
      label: 'Last Name',
      // class: ,
      required: true
    },


    {
      fieldName: 'email',
      label: 'Email',
      // class: ,
      required: true
    },

    {
      fieldName: 'password',
      label: 'Password',
      // class: ,
      required: true
    },

    {
      fieldName: 'age',
      label: 'Age',
      // class: ,
      required: true
    },

    {
      fieldName: 'occupation',
      label: 'Occupation',
      // class: ,
      required: true
    },

    {
      fieldName: 'partner',
      label: 'Partner/Spouse First Name',
      // class: ,
    },

    {
      fieldName: 'partner',
      label: 'Partner/Spouse Last Name',
      // class: ,
    },

    {
      fieldName: 'partner',
      label: 'Partner/Spouse Email',
      // class: ,
      required: true
    },

    {
      fieldName: 'marital_status',
      label: 'Marital Status',
      // class: ,
      required: true
    },

    {
      fieldName: 'email',
      label: 'Email',
      // class: ,
      required: true
    },

    {
      fieldName: 'is_parent',
      label: 'Are you a Parent?',
      // class: ,
      required: true
    },

    {
      fieldName: 'gender',
      label: 'Gender',
      // class: ,
      required: true
    },

    // {
    //   fieldName: 'profile_url',
    //   label: 'Profile Picture U',
    //   // class: ,
    //   required: true 
    // },

    {
      fieldName: 'description',
      label: 'Describe Yourself',
      // class: ,
      // required: true 
    },

    // {
    //   fieldName: 'imm_family',
    //   label: '',
    //   // class: ,
    //   required: true 
    // }
  ];

  const registerInitialValues = {
    first_name: '',
    last_name: '',
    age: 1,
    occupation: '',
    partner: 0,
    marital_status: '',
    password: '',
    email: '',
    is_parent: false,
    gender: 1,
    profile_url: '',
    description: '',
    imm_family: 0,
  };

  const loginInitialValues = {
    password: '',
    email: '',
  };

  const submitForm = async (p_values: Partial<DUserDTO>, { setSubmitting }: FormikHelpers<Partial<DUserDTO>>) => {
    if (mode === 'login') {
      processLogin(p_values);
    } else {
      processRegister(p_values)
    }
  };

  const processLogin = async (p_values: Partial<DUserDTO>) => {
    const authService = new AuthService('auth');
    const logedInUser = await authService.submitLoginForm({ ...p_values, sessionToken: 'example' })
      .catch(e => {
        // TODO: LOGGING AND PROPER HANDLING IN FRONT
        console.log('Error loging in', e);
        return false;
      });

    console.log({ success: logedInUser.data });
    if (logedInUser.data.dataValues) {
      // updateUser(currentUser);
      setCookie('FT', JSON.stringify(logedInUser.data.dataValues))
      // TODO: redux/session/ip/routing
      changeMode(undefined);

      updateUser(logedInUser.data.dataValues);
      navigate(`/ft/users/${logedInUser.data.dataValues.id}`);
    } else {
      console.log('Error loging in');
    }
  }

  const processRegister = async (p_values: Partial<DUserDTO>) => {
    const authService = new AuthService('auth');
    const registeredUser = await authService.submitRegistrationForm(p_values)
      .catch(e => {
        // TODO: LOGGING AND PROPER HANDLING IN FRONT
        console.log('Error registering', e);
        return false;
      });

    if (registeredUser) {
      // TODO: redux/session/ip/routing
      setCookie('FT', JSON.stringify(registeredUser.data.dataValues))
      changeMode(undefined);
    } else {
      // TODO: on screen notification
      console.log('Registration failure');
    }

  }

  return (
    <div className="form-container">
      <div>
        Already a member?
        {mode === 'register' ? <button onClick={() => changeMode('login')}>Login inst</button> : null}
      </div>
      <Formik
        initialValues={mode === 'login' ? loginInitialValues : registerInitialValues}
        onSubmit={submitForm}
      >
        <Form>
          {mode === 'login' ? (
            <BaseFormFields fields={loginFormFields} />
          ) : (
            <BaseFormFields fields={registrationFormFields} />
          )}
          <div>
            <button type="submit">Submit</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default FTAuthentication;