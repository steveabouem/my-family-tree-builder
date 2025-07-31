import React from "react";
import { Formik } from "formik";
import { Trans, t } from "@lingui/macro";
import { DAuthProps } from "./definitions";
import { useNavigate } from "react-router";
import FamilyTreeContext from "contexts/creators/familyTree/familyTree.context";
import GlobalContext from "contexts/creators/global/global.context";
import { Box, Button, FormControl } from "@mui/material";
import PageUrlsEnum from "utils/urls";
import GenderDropdown from "components/common/dropdowns/gender/GenderDropdown";
import { DFormField } from "components/common/definitions";
import Page from "components/common/Page";
import FormFieldsGenerator from "components/common/forms/FormFieldsGenerator";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";
import { maritalStatusOptions, parentOptions } from "components/common/dropdowns/definitions";
import { DUserDTO } from "@services/api.definitions";
import { submitLoginForm, submitRegistrationForm } from "@services/auth/auth.service";

const AuthenticationPage = ({ mode, changeMode }: DAuthProps): JSX.Element => {
  const [attempts, setAttempts] = React.useState<number>(0);
  const { updateUser } = React.useContext(FamilyTreeContext);
  const navigate = useNavigate();
  const { updateModal, toggleLoading, modal, loading } = React.useContext(GlobalContext);
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

  const registerInitialValues: Partial<DUserDTO> = {
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

  const loginInitialValues: Partial<DUserDTO> = {
    password: '',
    email: '',
  };

  React.useEffect(() => {
    updateModal({ hidden: true })
    toggleLoading(false);
  }, []);

  const proceedToFormSubmission = async (values: Partial<DUserDTO>) => {
    if (mode === 'login') {
      processLogin(values);
    } else {
      processRegister(values);
    }
  };

  const processLogin = async (values: Partial<DUserDTO>) => {
    toggleLoading(true);
    const envToken: string | undefined = process.env.REACT_APP_JWT_TOKEN;
    const { data } = await submitLoginForm({ ...values, sessionToken: envToken as string })
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

    if (data?.authenticated) {
      localStorage.setItem('FT', JSON.stringify(data));
      if (updateUser) {
        updateUser(data);
        changeMode(undefined);
        navigate(PageUrlsEnum.user.replace(':id', data.userId));
      }
    } else {
      setAttempts((prev) => prev + 1);
      updateModal({
        ...modal,
        hidden: false,
        title: <Trans>login_failure</Trans>,
        content: <Trans>login_failure_msg {attempts}</Trans>,
      });
    }
    toggleLoading(false);
  }

  const processRegister = async (values: Partial<DUserDTO>) => {
    toggleLoading(true);
    const registeredUser = await submitRegistrationForm(values)
      .catch((e: unknown) => {
        // ! -TOFIX: LOGGING AND PROPER HANDLING IN FRONT
        console.log('Error registering', e);
        return false;
      });

    if (registeredUser.data?.authenticated) {
      localStorage.setItem('FT', JSON.stringify(registeredUser.data));
      changeMode(undefined);
      if (updateUser) {
        updateUser(registeredUser.data);
        navigate(PageUrlsEnum.user.replace(':id', registeredUser.data.userId));
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
    toggleLoading(false);
  }

  return (
    <Page
      title={<Trans>auth_page_title</Trans>}
      subtitle={<Trans>auth_page_subtitle</Trans>}
      loading={loading}
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
          onSubmit={(values) => proceedToFormSubmission(values)}
        >
          {({ submitForm, errors, setFieldValue, values }) => mode === 'login' ?
            <FormFieldsGenerator size="med" fields={loginFormFields} handleSubmit={() => { }} />
            :
            <FormFieldsGenerator size="med"
              fields={[
                ...registrationFormFields,
                {
                  fieldName: 'gender',
                  label: <Trans>gender</Trans>,
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
                },
                {
                  fieldName: 'is_parent',
                  label: 'Are you a Parent?',
                  value: values.is_parent,
                  required: true,
                  subComponent: () => (
                    <FormControl >
                      <BaseDropDown
                        name="is_parent"
                        options={parentOptions}
                        id="parent_status-dd"
                      />
                    </FormControl>
                  ),
                },
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