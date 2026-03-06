import React, { useState } from "react";
import { Trans } from "@lingui/macro";
import { FaRegEdit } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import { Formik } from "formik";
import { Box, Button, Paper } from "@mui/material";
import styled from "styled-components";
import { APIGetProfileResponse, ChangePasswordValues, FormField } from "types";
import FormFieldsGenerator from "components/common/forms/FormFieldsGenerator";

const UserCredentials = ({ handleSubmit, profileInfo }: { profileInfo: APIGetProfileResponse, handleSubmit: (values: ChangePasswordValues) => void }) => {
  const data = profileInfo.payload;
  const [passwordFormMode, setPasswordFormMode] = useState<'write' | 'read'>('read');
  const isReadMode = passwordFormMode === 'read';
  const changePasswordInitialValues: ChangePasswordValues = {
    // @ts-ignore
    first_name: data.first_name,
    // @ts-ignore
    last_name: data.last_name || '',
    email: data.email || '',
    password: '',
    new_password: '',
    repeat_new_password: '',
    id: data.id || 0
  };
  const profileFields = [
      { fieldName: 'first_name', label: <Trans>first_name_form_label</Trans>, type: 'first_name' },
    { fieldName: 'last_name', label: <Trans>last_name_form_label</Trans>, type: 'last_name' },
    { fieldName: 'email', label: <Trans>email_form_label</Trans>, type: 'email' },
    { fieldName: 'password', label: <Trans>password_form_label</Trans>, type: 'password' }
  ];

  const changePassworFields: FormField[] = [
  ...profileFields,
    { fieldName: 'new_password', label: <Trans>new_password_form_label</Trans>, type: 'password' },
    { fieldName: 'repeat_new_password', label: <Trans>repeat_new_password_form_label</Trans>, type: 'password' },
  ];

  function toggleMode() {
    setPasswordFormMode(isReadMode ? 'write' : 'read');
  }

  function submitPasswordForm(values: ChangePasswordValues) {
    handleSubmit(values);
    toggleMode();
  }

  return (
    <ProfileFieldsContainer sx={{ border: 'none', padding: '1rem .5rem' }} elevation={0}>
      <EditButtonContainer>
        <Button variant="outlined" color="primary" sx={{ display: 'flex', gap: "1rem" }} onClick={() => toggleMode()}>
          {
            isReadMode ? (
              <>
                <FaRegEdit size={20} />
                <Trans>edit</Trans>
              </>
            )
              : (
                <>
                  <MdCancelPresentation size={20} />
                  <Trans>cancel</Trans>
                </>
              )
          }
        </Button>
      </EditButtonContainer>
      <Formik initialValues={changePasswordInitialValues} onSubmit={submitPasswordForm}>
        {({ submitForm }) => <FormFieldsGenerator fields={isReadMode ? profileFields : changePassworFields} handleSubmit={submitForm} size="med" withPaper={false} mode={passwordFormMode} />}
      </Formik>
      {/* ) : <Spinner loading={true} />} */}
    </ProfileFieldsContainer>
  )
}

const ProfileFieldsContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
`;
const EditButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  align_items: center;
`;

export default UserCredentials;