import React, { useMemo, useState } from "react";
import { Trans } from "@lingui/macro";
import { FaRegEdit } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import { Formik } from "formik";
import { Box, Button, Paper, Typography } from "@mui/material";
// @ts-ignore
import styled from "styled-components";
import { ChangePasswordValues, FormField, UserState } from "types";
import FormFieldsGenerator from "components/common/forms/FormFieldsGenerator";
import Spinner from "components/common/progressIndicators/Spinner";
import { useZSelector } from "app/hooks";

const UserCredentials = ({ handleSubmit }: { handleSubmit: (values: ChangePasswordValues) => void }) => {
  const [passwordFormMode, setPasswordFormMode] = useState<'write' | 'read'>('read');
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const changePasswordInitialValues = useMemo((): ChangePasswordValues => ({
    email: currentUser?.email || '',
    password: '',
    newPassword: '',
    repeatNewPassword: '',
    id: currentUser?.userId || 0
  }), [currentUser?.email, currentUser?.userId]);
  const changePassworFields: FormField[] = [
    { fieldName: 'email', label: <Trans>email_form_label</Trans>, type: 'email' },
    { fieldName: 'password', label: <Trans>password_form_label</Trans>, type: 'password' },
    { fieldName: 'newPassword', label: <Trans>new_password_form_label</Trans>, type: 'password' },
    { fieldName: 'repeatNewPassword', label: <Trans>repeat_new_password_form_label</Trans>, type: 'password' },
  ];

  function toggleMode() {
    setPasswordFormMode(passwordFormMode === 'read' ? 'write' : 'read');
  }

  function submitPasswordForm(values: ChangePasswordValues) {
    handleSubmit(values);
    toggleMode();
  }

  return (

    <ProfileFieldsContainer sx={{border: 'none', padding: '1rem .5rem'}} elevation={0}>
      {currentUser?.email?.length ? (
        <>
          <EditButtonContainer>
            <Button variant="outlined" color="primary" sx={{ display: 'flex', gap: "1rem" }} onClick={() => toggleMode()}>
              {
                passwordFormMode === 'read' ? (
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
            {({ submitForm }) => <FormFieldsGenerator fields={changePassworFields} handleSubmit={submitForm} size="med" withPaper={false} mode={passwordFormMode} />}
          </Formik>
        </>
      ) : <Spinner loading={true} />}
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