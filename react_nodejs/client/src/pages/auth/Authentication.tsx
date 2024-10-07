import React, { useContext, useEffect, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import { Trans, t } from "@lingui/macro";
import { DAuthProps } from "./definitions";
import { useNavigate } from "react-router";
import { DDropdownOption, genderOptions, maritalStatusOptions, parentOptions } from "../../components/common/dropdowns/definitions";
import { DFormField } from "../../components/common/definitions";
import { service } from "../../services";
import FormFieldsGenerator from "../../components/common/forms/FormFieldsGenerator";
import Page from "../../components/common/Page";
import BaseDropDown from "../../components/common/dropdowns/BaseDropdown";
import { DUserDTO } from "../../services/auth/auth.definitions";
import FamilyTreeContext from "contexts/creators/familyTree/familyTree.context";
import GlobalContext from "contexts/creators/global/global.context";
import { Box, Button } from "@mui/material";

const Authentication = ({ mode, changeMode }: DAuthProps): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [attempts, setAttempts] = React.useState<number>(0);
  const [registerAttempts, setRegisterAttempts] = React.useState<number>(0);
  const [displayValues, setDisplayValues] = React.useState<{ [key: string]: string | number }>({ //format dropdown values for client
    is_parent: 'Yes',
    gender: 'Male',
  });
  const { updateUser } = React.useContext(FamilyTreeContext);
  const navigate = useNavigate();
  const { theme, updateModal, toggleLoading, modal } = React.useContext(GlobalContext);
  const mStatus = t({
    id: "marital.status",
    message: `Marital Status`,
  });

  const loginFormFields = [
    {
      fieldName: 'email',
      label: 'Email',
      type: 'email',
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
      required: true
    },
    {
      fieldName: 'last_name',
      label: 'Last Name',
      required: true
    },
    {
      fieldName: 'email',
      label: 'Email',
      required: true
    },
    {
      fieldName: 'password',
      label: 'Password',
      required: true,
      type: 'password'
    },
    {
      fieldName: 'age',
      label: 'Age',
      required: true
    },
    {
      fieldName: 'occupation',
      label: 'Occupation',
      required: true
    },
    {
      fieldName: 'description',
      label: 'Describe Yourself',
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

  React.useEffect(() => {
    if (toggleLoading)
      toggleLoading(false);
  }, []);

  const submitForm = async (values: Partial<DUserDTO>, { resetForm }: FormikHelpers<Partial<DUserDTO>>) => {
    if (mode === 'login') {
      processLogin(values);
      resetForm();
    } else {
      processRegister(values);
      resetForm();
    }
  };

  const processLogin = async (values: Partial<DUserDTO>) => {
    const authService = new service.auth('auth');
    const envToken: string | undefined = process.env.REACT_APP_JWT_TOKEN;
    const { data } = await authService.submitLoginForm({ ...values, sessionToken: envToken as string })
      .catch((e: unknown) => {
        console.log('Error loging in', e);
        // @ts-ignore
        updateModal({
          ...modal,
          hidden: false,
          title: <Trans>login_failure</Trans>,
          content: <Trans>login_failure_msg {attempts}</Trans>,
        });
        return false;
      });

    if (data.error) {
      // @ts-ignore
      updateModal({
        ...modal,
        hidden: false,
        title: <Trans>login_failure</Trans>,
        content: <Trans>login_failure_msg {attempts}</Trans>,
      });
      return false;
    }

    if (data?.payload?.authenticated) {
      localStorage.setItem('FT', JSON.stringify(data.payload));
      if (updateUser) {
        updateUser(data.payload);
        console.log({ logedInUser: { data } });

        changeMode(undefined);
        navigate(`/users/${data.payload.userId}`);
      }
    } else {
      setAttempts((prev) => prev + 1);
      if (updateModal)
        updateModal({
          ...modal,
          hidden: false,
          title: <Trans>login_failure</Trans>,
          content: <Trans>login_failure_msg {attempts}</Trans>,
        });
    }
  }

  const processRegister = async (values: Partial<DUserDTO>) => {
    const authService = new service.auth('auth');
    const registeredUser = await authService.submitRegistrationForm(values)
      .catch((e: unknown) => {
        // ! -TOFIX: LOGGING AND PROPER HANDLING IN FRONT
        console.log('Error registering', e);
        return false;
      });

    if (registeredUser.data?.data?.authenticated) {
      localStorage.setItem('FT', JSON.stringify(registeredUser.data));
      changeMode(undefined);
      if (updateUser) {
        updateUser(registeredUser.data.data);
        navigate(`/users/${registeredUser.data.data.data.userId}`);
      }
    } else {
      // ! -TOFIX: on screen notification
      console.log('Registration failure');
    }
  }

  return (
    <Page
      title="Authentication Page"
      subtitle="Please verify yourself below"
    >
      <Box>
        {mode === 'register' ? (
          <Button variant="text" color="secondary" onClick={() => changeMode('login')}>Login</Button>
        ) : (
          <Button variant="text" color="primary" onClick={() => changeMode('register')}>Register</Button>
        )}
      </Box>
      <Box display="flex" width="50%" margin="auto"> 

        <Formik
          initialValues={mode === 'login' ? loginInitialValues : registerInitialValues}
          onSubmit={submitForm}
        >
          {({ handleSubmit, errors, isSubmitting, setFieldValue, values }) => mode === 'login' ?
            <FormFieldsGenerator size="med" fields={loginFormFields} handleSubmit={handleSubmit} />
            :
            <FormFieldsGenerator size="med"
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
                  label: mStatus,
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
      </Box>
    </Page>
  );
}

export default Authentication;