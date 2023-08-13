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

const FTAuthentication = ({ mode, changeMode }: DAuthProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const { updateUser } = useContext(FamilyTreeContext);
  const navigate = useNavigate();
  const cookie = useCookie();
  const { theme, session } = useContext(GlobalContext);

  const maritalStatusOptions: DDropdownOption[] = [
    {
      label: 'single',
      value: 'single',
      id: 'single-option',
    },
    {
      label: 'married',
      value: 'married',
      id: 'married-option',
    },
    {
      label: 'divorced',
      value: 'divorced',
      id: 'divorced-option',
    },
    {
      label: 'separated',
      value: 'separated',
      id: 'separated-option',
    },
    {
      label: 'widowed',
      value: 'widowed',
      id: 'widowed-option',
    },
    {
      label: 'not telling',
      value: 'not telling',
      id: 'not-telling-option',
    },
  ];

  const parentOptions: DDropdownOption[] = [
    {
      label: 'yes',
      value: true,
      id: 'is-parent-option',
    },
    {
      label: 'no',
      value: false,
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
      required: true,
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
      fieldName: 'marital_status',
      label: 'Marital Status',
      id: 'marital-status-field',
      subComponent: () => (
        <div className="field-wrap base">
          <BaseDropDown
            onOptionSelect={(option: string) => console.log('OPTION: ', option)}
            options={maritalStatusOptions}
            id="marital-status-dd"
          />
        </div>
      ),
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
      required: true,
      subComponent: () => (
        <div className="field-wrap base">
          <BaseDropDown
            onOptionSelect={(option: string) => console.log('OPTION: ', option)}
            options={parentOptions}
            id="parent_status-dd"
          />
        </div>
      ),
    },

    {
      fieldName: 'gender',
      label: 'Gender',
      // class: ,
      required: true,
      subComponent: () => (
        <div className="field-wrap base">
          <BaseDropDown
            onOptionSelect={(option: string) => console.log('OPTION: ', option)}
            options={genderOptions}
            id="marital-status-dd"
          />
        </div>
      ),
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

  useEffect(() => {
    //NOTE: if cookie status changes or is clearImmediate, present loading screen and adjust display (hence no second argument)
    if (!cookie) {
      setLoading(true);
      changeMode('register');
    } else {
      changeMode('login');
    }
    setLoading(false)
  });

  const submitForm = async (values: Partial<DUserDTO>, { resetForm }: FormikHelpers<Partial<DUserDTO>>) => {
    if (mode === 'login') {
      processLogin(values);
      // resetForm();
    } else {
      processRegister(values)
      // resetForm();
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
      console.log('Succesful login');
      // TODO: redux/session/ip/routing
      changeMode(undefined);
      updateUser(logedInUser.data.dataValues);
      navigate(`/ft/users/${logedInUser.data.dataValues.id}`);
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

    if (registeredUser) {
      // TODO: redux/session/ip/routing
      // console.log({registeredUser});
      document.cookie = `FT=${registeredUser.data.session.token}`;
      changeMode(undefined);
    } else {
      // TODO: on screen notification
      // console.log('Registration failure');
    }

  }

  return (
    <Page title="Authentication Page" subTitle="Please verify yourself below" theme={theme} isLoading={loading}>
      <div>
        Already a member?
        <button onClick={() => changeMode('login')}>Login inst</button>
      </div>
      <Formik
        initialValues={mode === 'login' ? loginInitialValues : registerInitialValues}
        onSubmit={submitForm}
      >
        {({ handleSubmit, errors, isSubmitting }) => mode === 'login' ?
          <BaseFormFields size="med" fields={loginFormFields} handleSubmit={handleSubmit} />
          :
          <BaseFormFields size="med" fields={registrationFormFields} handleSubmit={handleSubmit} />
        }
      </Formik>
    </Page>
  );
}

export default FTAuthentication;