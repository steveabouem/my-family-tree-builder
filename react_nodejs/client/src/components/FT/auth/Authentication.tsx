import React, { useContext, useEffect, useState } from "react";
import { DUserDTO } from "../../../services/FT/auth/auth.definitions";
import { Formik, FormikHelpers } from "formik";
import AuthService from "../../../services/FT";
import { DAuthProps } from "./definitions";
import BaseFormFields from "../../common/forms/BaseFormFields";
import { useNavigate } from "react-router";
import FamilyTreeContext from "../../../context/FT/familyTree.context";
import Page from "../../common/Page";
import GlobalContext from "../../../context/global.context";
import useCookie from "../../hooks/useCookie.hook";
import BaseDropDown from "../../common/dropdowns/BaseDropdown";
import { DDropdownOption } from "../../common/dropdowns/definitions";
import { DFormField, cookieRoot } from "../../common/definitions";

const FTAuthentication = ({ mode, changeMode }: DAuthProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [displayValues, setDisplayValues] = useState<{ [key: string]: string | number }>({
    is_parent: 'Yes',
    gender: 'Male',
  });
  const { updateUser } = useContext(FamilyTreeContext);
  const navigate = useNavigate();
  const { theme } = useContext(GlobalContext);


  const maritalStatusOptions: DDropdownOption[] = [
    {
      label: 'Single',
      value: 'Single',
      id: 'single-option',
    },
    {
      label: 'Married',
      value: 'Married',
      id: 'married-option',
    },
    {
      label: 'Divorced',
      value: 'Divorced',
      id: 'divorced-option',
    },
    {
      label: 'Separated',
      value: 'Separated',
      id: 'separated-option',
    },
    {
      label: 'Widowed',
      value: 'Widowed',
      id: 'widowed-option',
    },
    {
      label: 'Not telling',
      value: 'Not telling',
      id: 'not-telling-option',
    },
  ];

  const parentOptions: DDropdownOption[] = [
    {
      label: 'Yes',
      value: 1,
      id: 'is-parent-option',
    },
    {
      label: 'No',
      value: 0,
      id: 'not-parent-option',
    },
  ];

  const genderOptions: DDropdownOption[] = [
    {
      label: 'Male',
      value: 1,
      id: 'male-option',
    },
    {
      label: 'Female',
      value: 2,
      id: 'female-option',
    },
  ];


  const loginFormFields = [
    {
      fieldName: 'email',
      label: 'Email',
      type: 'email',
      // class: ,
      required: true
    },
    {
      fieldName: 'password',
      label: 'Password',
      type: 'password',
      required: true
    },

  ];

  const registrationFormFields: DFormField[] = [
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
      required: true,
      type: 'password'
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
      fieldName: 'description',
      label: 'Describe Yourself',
      // class: ,
      // required: true 
    },
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
    is_parent: 0,
    gender: 1,
    profile_url: '',
    description: '',
    imm_family: 0,
  };

  const loginInitialValues = {
    password: '',
    email: '',
  };

  useEffect(() => {
    setLoading(false)
  }, []);

  const submitForm = async (values: Partial<DUserDTO>, { resetForm }: FormikHelpers<Partial<DUserDTO>>) => {
    if (mode === 'login') {
      processLogin(values);
      resetForm();
    } else {
      processRegister(values)
      resetForm();
    }
  };

  const processLogin = async (values: Partial<DUserDTO>) => {
    const authService = new AuthService('auth');
    const envToken: string | undefined = process.env.REACT_APP_JWT_TOKEN;
    const logedInUser = await authService.submitLoginForm({ ...values, sessionToken: envToken as string })
      .catch(e => {
        // TODO: LOGGING AND PROPER HANDLING IN FRONT
        console.log('Error loging in', e);
        return false;
      });
    console.log({ logedInUser });

    if (logedInUser.data.session) {
      console.log('Succesful login', logedInUser.data.session);
      // TODO: redux/session/ip/routing
      changeMode(undefined);
      updateUser(logedInUser.data.session);
      navigate(`/ft/users/${logedInUser.data.session.id}`);
    } else {
      console.log('Error loging in'); // TODO logging
    }
  }

  const processRegister = async (values: Partial<DUserDTO>) => {
    const authService = new AuthService('auth');
    const registeredUser = await authService.submitRegistrationForm(values)
      .catch(e => {
        // TODO: LOGGING AND PROPER HANDLING IN FRONT
        console.log('Error registering', e);
        return false;
      });

    if (registeredUser.data.session) {
      // TODO: redux/session/ip/routing
      // console.log({registeredUser});
      console.log('Succesful registration', registeredUser);
      // TODO: redux/session/ip/routing
      changeMode(undefined);
      updateUser(registeredUser.data.session);
      document.cookie = cookieRoot + registeredUser.data.session.token;
      navigate(`/ft/users/${registeredUser.data.session.id}`);
    } else {
      // TODO: on screen notification
      console.log('Registration failure');
    }
  }

  return (
    <Page
      title="Authentication Page"
      subtitle="Please verify yourself below"
      theme={theme} isLoading={loading}
    >
      <div className="m-auto w-100">
        {mode === 'register' ? (
          <button onClick={() => changeMode('login')}>Login</button>
        ) : (
          <button onClick={() => changeMode('register')}>Register</button>
        )}
      </div>
      <Formik
        initialValues={mode === 'login' ? loginInitialValues : registerInitialValues}
        onSubmit={submitForm}
      >
        {({ handleSubmit, errors, isSubmitting, setFieldValue, values }) => mode === 'login' ?
          <BaseFormFields size="med" fields={loginFormFields} handleSubmit={handleSubmit} />
          :
          <BaseFormFields size="med"
            fields={[
              ...registrationFormFields,
              {
                fieldName: 'gender',
                label: 'Gender',
                value: values.gender,
                required: true,
                subComponent: () => (
                  <div className="field-wrap base">
                    <BaseDropDown
                      onValueChange={(option: DDropdownOption) => {
                        setFieldValue('gender', option.value);
                        setDisplayValues((prev) => ({ ...prev, gender: option.label }))
                      }}
                      options={genderOptions}
                      id="marital-status-dd"
                      val={values.gender}
                      displayVal={displayValues.gender}
                    />
                  </div>
                ),
              },
              {
                fieldName: 'marital_status',
                label: 'Marital Status',
                value: values.marital_status,
                id: 'marital-status-field',
                subComponent: () => (
                  <div className="field-wrap base">
                    <BaseDropDown
                      onValueChange={(option: DDropdownOption) => setFieldValue('marital_status', option.value)}
                      options={maritalStatusOptions}
                      id="marital-status-dd"
                      val={values.marital_status}
                      displayVal={values.marital_status}
                    />
                  </div>
                ),
                required: true,

              },
              {
                fieldName: 'is_parent',
                label: 'Are you a Parent?',
                value: values.is_parent,
                // class: ,
                required: true,
                subComponent: () => (
                  <div className="field-wrap base">
                    <BaseDropDown
                      onValueChange={(option: DDropdownOption) => {
                        setFieldValue('is_parent', option.value);
                        setDisplayValues((prev) => ({ ...prev, is_parent: option.label }))
                      }}
                      options={parentOptions}
                      id="parent_status-dd"
                      val={values.is_parent}
                      displayVal={displayValues.is_parent}
                    />
                  </div>
                ),
              },
            ]}
            handleSubmit={handleSubmit}
            handleFieldValueChange={(field: string, value: string | number) => setFieldValue(field, value)} />
        }
      </Formik>
    </Page>
  );
}

export default FTAuthentication;