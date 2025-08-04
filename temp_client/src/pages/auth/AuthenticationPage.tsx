import React from "react";
import { useNavigate } from "react-router";
import { t, Trans } from "@lingui/macro";
import { DAuthProps } from "./definitions";
import { Formik } from "formik";
import { Box, Button, FormControl } from "@mui/material";
import GlobalContext from "../../contexts/creators/global";
import { DFormField } from "../../components/common/definitions";
import { APILoginResponse, APIRequestPayload, LoginRequestPayload, RegistrationRequestPayload } from "../../services/api.definitions";
import { useLogin, useRegister } from "../../services/v2/authV2";
import PageUrlsEnum from "utils/urls/";
import Page from "../../components/common/Page";
import FormFieldsGenerator from "../../components/common/forms/FormFieldsGenerator";
import GenderDropdown from "../../components/common/dropdowns/gender/GenderDropdown";
import BaseDropDown from "../../components/common/dropdowns/BaseDropdown";
import { maritalStatusOptions } from "../../components/common/dropdowns/definitions";
import { updateUserAction } from "app/slices/user";

const AuthenticationPage = ({ mode, changeMode }: DAuthProps): JSX.Element => {
  const [attempts, setAttempts] = React.useState<number>(0);
  const navigate = useNavigate();
  const { updateModal, toggleLoading, modal, loading } = React.useContext(GlobalContext);
  const loginMutation = useLogin();
  const registerMutation = useRegister();

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
      fieldName: 'dob',
      label: 'Age',
      required: true,
      type: 'date'
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

  const registerInitialValues: RegistrationRequestPayload = {
    first_name: '',
    last_name: '',
    age: 1,
    occupation: '',
    marital_status: '',
    password: '',
    email: '',
    gender: 1,
    profile_url: '',
    description: '',
  };

  const loginInitialValues: LoginRequestPayload = {
    password: '',
    email: '',
  };

  React.useEffect(() => {
    updateModal({ hidden: true })
    toggleLoading(false);
  }, []);

  const proceedToFormSubmission = async (values: LoginRequestPayload | RegistrationRequestPayload) => {
    if (mode === 'login') {
      const loginValues = values as LoginRequestPayload;
      processLogin(loginValues);
    } else {
      const registrationValues = values as RegistrationRequestPayload;
      processRegister(registrationValues);
    }
  };

  const processLogin = async (values: LoginRequestPayload) => {
    loginMutation.mutate(values, {
      onSuccess: (response: APIRequestPayload<APILoginResponse>) => {
        const { payload, error } = response;

        if (payload.authenticated && !error) {
          localStorage.setItem('FT', JSON.stringify(payload));
          updateUserAction(payload);
          changeMode(undefined);
          navigate(PageUrlsEnum.user.replace(':id', `${payload.userId}`));
        } else {
          setAttempts((prev) => prev + 1);
          updateModal({
            ...modal,
            hidden: false,
            title: <Trans>login_failure</Trans>,
            content: <Trans>login_failure_msg {attempts}</Trans>,
          });
        }
      },
      onError: (error) => {
        console.error('Error logging in', error);
        setAttempts((prev) => prev + 1);
        updateModal({
          ...modal,
          hidden: false,
          title: <Trans>login_failure</Trans>,
          content: <Trans>login_failure_msg {attempts}</Trans>,
        });
      }
    });
  }

  const processRegister = async (values: RegistrationRequestPayload) => {
    registerMutation.mutate(values, {
      onSuccess: (response) => {
        const {payload, error} = response;
        if (payload.authenticated) {
          localStorage.setItem('FT', JSON.stringify(payload));
          changeMode(undefined);

          if (payload?.userId) {
            updateUserAction(payload);
            navigate(PageUrlsEnum.user.replace(':id', `${payload.userId}`));
          }
        } else {
          updateModal({
            ...modal,
            hidden: false,
            title: <Trans>login_failure</Trans>,
            content: <Trans>login_failure_msg {attempts}</Trans>,
          });
          console.log('Registration failure');
        }
      },
      onError: (error) => {
        console.error('Registration failed:', error);
        updateModal({
          ...modal,
          hidden: false,
          title: <Trans>login_failure</Trans>,
          content: <Trans>login_failure_msg {attempts}</Trans>,
        });
      }
    });
  }

  return (
          <Page
        title={<Trans>auth_page_title</Trans>}
        subtitle={<Trans>auth_page_subtitle</Trans>}
        loading={loading || loginMutation.isPending || registerMutation.isPending}
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
          onSubmit={(values: LoginRequestPayload | RegistrationRequestPayload) => proceedToFormSubmission(values)}
        >
          {({ submitForm, errors, setFieldValue, values }) => mode === 'login' ?
            <FormFieldsGenerator 
              size="med" 
              fields={loginFormFields} 
              handleSubmit={() => { }}
              locked={loginMutation.isPending}
            />
            :
            <FormFieldsGenerator 
              size="med"
              locked={registerMutation.isPending}
              fields={[
                ...registrationFormFields,
                {
                  fieldName: 'gender',
                  label: <Trans>gender</Trans>,
                  // @ts-ignore: fix and provide ability to accept login or registration fields types
                  value: values.gender,
                  required: true,
                  subComponent: () => (
                    <Box className="field-wrap base" sx={{ width: '100%' }}>
                      <GenderDropdown name="gender" />
                    </Box>
                  ),
                },
                {
                  fieldName: 'marital_status',
                  label: mStatus,
                  // @ts-ignore: fix and provide ability to accept login or registration fields types
                  value: values.marital_status,
                  id: 'marital-status-field',
                  subComponent: () => (
                    <FormControl fullWidth>
                      <BaseDropDown
                        name="marital_status"
                        options={maritalStatusOptions}
                        id="marital-status-dd"
                      />
                    </FormControl>
                  ),
                  required: true,
                }
              ]}
              handleSubmit={submitForm}
              handleFieldValueChange={(field: string, value: string | number) => setFieldValue(field, value)} />
          }
        </Formik>
      </Box>
    </Page>
  );
}

export default AuthenticationPage;