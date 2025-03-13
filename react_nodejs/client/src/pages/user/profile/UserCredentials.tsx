import React, { useContext, useMemo, useState } from "react";
import { Trans } from "@lingui/macro";
import { FaRegEdit } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import { DChangePasswordValues } from "../definitions";
import FamilyTreeContext from "contexts/creators/familyTree";
import { DFormField } from "components/common/definitions";
import { Formik } from "formik";
import FormFieldsGenerator from "components/common/forms/FormFieldsGenerator";
import Spinner from "components/common/Spinner";
import { Box, Button, Paper, Typography } from "@mui/material";

const UserCredentials = ({ handleSubmit }: { handleSubmit: (values: DChangePasswordValues) => void }) => {
  const [passwordFormMode, setPasswordFormMode] = useState<'write' | 'read'>('read');
  const { currentUser } = useContext(FamilyTreeContext);

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
          <Box display="flex" justifyContent="flex-end" width="100%" alignItems="center">
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

export default UserCredentials;