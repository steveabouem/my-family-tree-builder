import React from "react";
import { useNavigate } from "react-router";
import { t, Trans } from "@lingui/macro";
import { Formik } from "formik";
import { Box, Button, FormControl } from "@mui/material";
import GlobalContext from "../../contexts/creators/global";
import {
  APILoginResponse, APIEndpointResponse, LoginRequestPayload, RegistrationRequestPayload,
  FormField, AuthProps, maritalStatusOptions, APIRegistrationResponse
} from "types";
import { useLogin, useRegister } from "../../api/auth";
import PageUrlsEnum from "utils/urls/";
import Page from "../../components/common/Page";
import FormFieldsGenerator from "../../components/common/forms/FormFieldsGenerator";
import GenderDropdown from "../../components/common/dropdowns/gender/GenderDropdown";
import BaseDropDown from "../../components/common/dropdowns/BaseDropdown";
import { setUserAction, updateUserAction } from "app/slices/user";
import { useZDispatch } from "app/hooks";


const AuthenticationPage = ({ mode, changeMode }: AuthProps): JSX.Element => {
  const [attempts, setAttempts] = React.useState<number>(0);
  const navigate = useNavigate();
  const { updateModal, toggleLoading, modal, loading } = React.useContext(GlobalContext);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const dispatch = useZDispatch();

  const mStatus = t({
    id: "marital.status",
    message: `Marital Status`,
  });

  const loginFormFields = [
    {
      fieldName: 'email',
      label: <Trans>email</Trans>,
      type: 'email',
      required: true
    },
    {
      fieldName: 'password',
      label: <Trans>password</Trans>,
      type: 'password',
      required: true
    },

  ];

  const renderRegistrationFormFields: (v: any) => FormField[] = (v) => ([
    {
      fieldName: 'first_name',
      label: <Trans>first_name</Trans>,
      required: true
    },
    {
      fieldName: 'last_name',
      label: <Trans>last name</Trans>,
      required: true
    },
    {
      fieldName: 'gender',
      label: <Trans>gender</Trans>,
      // @ts-ignore: fix and provide ability to accept login or registration fields types
      value: v.gender,
      required: true,
      subComponent: () => (
        <Box className="field-wrap base" sx={{ width: '100%' }}>
          <GenderDropdown name="gender" sx={{}} />
        </Box>
      ),
    },
    {
      fieldName: 'marital_status',
      label: mStatus,
      // @ts-ignore: fix and provide ability to accept login or registration fields types
      value: v.marital_status,
      id: 'marital-status-field',
      subComponent: () => (
        <BaseDropDown
          name="marital_status"
          options={maritalStatusOptions}
          id="marital-status-dd"
        />
      ),
      required: true,
    },
    {
      fieldName: 'email',
      label: <Trans>email</Trans>,
      required: true
    },
    {
      fieldName: 'password',
      label: <Trans>password</Trans>,
      required: true,
      type: 'password'
    },
    {
      fieldName: 'confirm_password',
      label: <Trans>confirm password</Trans>,
      required: true,
      type: 'password'
    },
    // {
    //   fieldName: 'dob',
    //   label: <Trans>age</Trans>,
    //   required: true,
    //   type: 'date'
    // },
  ]);

  const registerInitialValues: RegistrationRequestPayload = {
    firstName: '',
    lastName: '',
    // age: 1,
    occupation: '',
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
      onSuccess: (response: APIEndpointResponse<APILoginResponse>) => {
        const { code, payload } = response;
        console.log('Login REs ', response);

        if (code == 200) {
          dispatch(setUserAction(payload));
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
      onSuccess: (response: APIEndpointResponse<APIRegistrationResponse>) => {
        if (response.payload?.userId) {
          changeMode(undefined);

          setUserAction(response.payload);
          navigate(PageUrlsEnum.user.replace(':id', `${response.payload.userId}`));
        } else {
          updateModal({
            ...modal,
            hidden: false,
            title: <Trans>registration_failure</Trans>,
            content: <Trans>registration_failure_msg {attempts}</Trans>,
          });
          console.error('Registration failure');
        }
      },
      onError: (error) => {
        console.error('Registration failed:', error);
        updateModal({
          ...modal,
          hidden: false,
          title: <Trans>registration_failure</Trans>,
          content: <Trans>registration_failure_msg {attempts}</Trans>,
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
          <Button variant="outlined" color="secondary" onClick={() => changeMode('login')}>Login</Button>
        ) : (
          <Button variant="outlined" color="secondary" onClick={() => changeMode('register')}>Register</Button>
        )}
      </Box>
      <Box sx={formContainerStyle}>
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
              fields={renderRegistrationFormFields(values)}
              handleSubmit={submitForm}
              handleFieldValueChange={(field: string, value: string | number) => setFieldValue(field, value)} />
          }
        </Formik>
      </Box>
    </Page>
  );
}

const formContainerStyle = {
  display: 'flex',
  width: '50%',
  margin: 'auto',
};

export default AuthenticationPage;