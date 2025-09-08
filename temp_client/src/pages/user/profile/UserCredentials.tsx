import React, { useMemo, useState } from "react";

import { Trans } from "@lingui/macro";
import { FaRegEdit } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import { Formik } from "formik";
import { Box, Button, Paper, Typography } from "@mui/material";

import { DChangePasswordValues } from "../definitions";
import { DFormField } from "components/common/definitions";
import FormFieldsGenerator from "components/common/forms/FormFieldsGenerator";
import Spinner from "components/common/progressIndicators/Spinner";
import { useZSelector } from "app/hooks";
import { DUserState } from "app/slices/definitions";

const UserCredentials = ({ handleSubmit }: { handleSubmit: (values: DChangePasswordValues) => void }) => {
  const [passwordFormMode, setPasswordFormMode] = useState<'write' | 'read'>('read');
  const {currentUser} = useZSelector<DUserState>(state => state.user);
  const changePasswordInitialValues = useMemo((): DChangePasswordValues => ({
    email: currentUser?.email || '',
    password: '',
    newPassword: '',
    repeatNewPassword: '',
    id: currentUser?.userId || 0
  }), [currentUser?.email, currentUser?.userId]);
  const changePasswordFields: DFormField[] = [
    { fieldName: 'email', label: <Trans>email_form_label</Trans>, type: 'email' },
    { fieldName: 'password', label: <Trans>password_form_label</Trans>, type: 'password' },
    { fieldName: 'newPassword', label: <Trans>new_password_form_label</Trans>, type: 'password' },
    { fieldName: 'repeatNewPassword', label: <Trans>repeat_new_password_form_label</Trans>, type: 'password' },
  ];

  function toggleMode() {
    setPasswordFormMode(passwordFormMode === 'read' ? 'write' : 'read');
  }

  function submitPasswordForm(values: DChangePasswordValues) {
    handleSubmit(values);
    toggleMode();
  }

  return (

    <Paper style={{ display: 'flex', flexDirection: 'column', flex: '0 1 47%', padding: '1rem .5rem' }}>
      <Typography variant="h4"><Trans>profile_management_label</Trans></Typography>
      {currentUser?.email?.length ? (
        <>
          <Box sx={editButtonContainerStyle}>
            <Button variant="outlined" color="secondary" sx={{ display: 'flex', gap: "1rem" }} onClick={() => toggleMode()}>
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
          </Box>
          <Formik initialValues={changePasswordInitialValues} onSubmit={submitPasswordForm}>
            {({ submitForm }) => <FormFieldsGenerator fields={changePasswordFields} handleSubmit={submitForm} size="med" withPaper={false} mode={passwordFormMode} />}
          </Formik>
        </>
      ) : <Spinner loading={true} />}
    </Paper>
  )
}

const editButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
  alignItems: 'center',
};

export default UserCredentials;