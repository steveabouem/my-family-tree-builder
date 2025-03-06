import { Trans } from "@lingui/macro";
import { MdCancelPresentation, MdOutlineAddBox } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Link, Typography, Paper, Button } from "@mui/material";
import { Formik } from "formik";
import NotFound from '../404NotFound';
import Page from "../../components/common/Page";
import { service } from "../../services";
import GlobalContext from "contexts/creators/global/global.context";
import FamilyTreeContext from "contexts/creators/familyTree/familyTree.context";
import img1 from "../../assets/images/kids under tree locked.jpg";
import FormFieldsGenerator from "components/common/forms/FormFieldsGenerator";
import { DChangePasswordValues } from "./definitions";
import { DFormField } from "components/common/definitions";
import Spinner from "components/common/Spinner";

const UserProfilePage = (): JSX.Element => {
  const [passwordFormMode, setPasswordFormMode] = useState<'write' | 'read'>('read');
  const { currentUser, familyTrees, updateFamilyTrees } = useContext(FamilyTreeContext);
  const { toggleLoading, updateModal, loading } = useContext(GlobalContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const getfamilyTrees = useCallback(async (): Promise<any> => {
    const familyTreeService = new service.familyTree();
    const userId = currentUser?.userId;

    if (userId && userId === Number(id)) {
      const families = await familyTreeService.getAllForUser(userId)
        .catch(e => {
          console.log('Get FAMILIES: ', e);
        });

      return families;
    } else {
      navigate('/connect');
    }
  }, [currentUser, id]);
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

  useEffect(() => {
    if (currentUser?.userId) {
      getfamilyTrees()
        .then(({ data }) => {
          if (!data.error) {
            if (updateFamilyTrees) updateFamilyTrees(data.payload);
            if (toggleLoading) toggleLoading(false);
          }
        })
        .catch((e: unknown) => {
          if (updateModal) updateModal({
            hidden: false,
            buttons: { confirm: true, cancel: false },
            content: <Trans>error_modal_message</Trans>,
            title: <Trans>error_modal_title</Trans>,
          });
          if (toggleLoading) toggleLoading(false);
        });
    }
  }, [currentUser]);
  
  function handlePasswordChange(values: DChangePasswordValues) {
    toggleLoading(true);
    const authService = new service.auth('auth');
    authService.submitPasswordChangeForm(values)
      .then((updatedUser) => {
        toggleLoading(false);
        toggleMode();
        if (updateModal) updateModal({
          hidden: false,
          buttons: { confirm: true, cancel: false },
          content: <Trans>operation_success_text</Trans>,
          title: <Trans>operation_success_title</Trans>,
        });
      })
      .catch((e: unknown) => {
        console.log('ERRR login out: ', e);
        toggleLoading(false);

        // ! -TOFIX: handle error
        if (updateModal) updateModal({
          hidden: false,
          buttons: { confirm: true, cancel: false },
          content: <Trans>operation_failure_text</Trans>,
          title: <Trans>operation_failure_title</Trans>,
        });
      });
  }

  function toggleMode() {
    setPasswordFormMode(passwordFormMode === 'read' ? 'write' : 'read');
  }

  return currentUser ? (
    <Page subtitle={<Trans>profile_page_subtitle</Trans>} title={<Trans>profile_page_title {currentUser?.firstName || ''}</Trans>} bg={img1}>
      <Spinner loading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Spinner loading={!currentUser?.email?.length} />
        <Paper style={{ display: 'flex', flexDirection: 'column', flex: '0 1 47%', padding: '1rem .5rem' }}>
          <Typography variant="h4"><Trans>profile_management_label</Trans></Typography>
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
          <Formik initialValues={changePasswordInitialValues} onSubmit={handlePasswordChange}>
            {({ submitForm }) => <FormFieldsGenerator  fields={changePasswordFields} handleSubmit={submitForm} size="med" withPaper={false} mode={passwordFormMode} />}
          </Formik>
        </Paper>
        <Paper style={{ display: 'flex', flexDirection: 'column', flex: '0 1 47%', padding: '1rem .5rem' }}>
          <Typography variant="h4"><Trans>tree_management_label</Trans></Typography>
          {
            familyTrees?.length ?
              <Typography variant="subtitle2">
                <><Trans>your_tree_title</Trans> ({familyTrees?.length || 0})</>
              </Typography>
              : (
                <Box display="flex" justifyContent="flex-end" width="100%" alignItems="center">
                  <Button variant="outlined" color="secondary" sx={{ display: 'flex', gap: "1rem" }}>
                    <MdOutlineAddBox size={20} />
                    <Link underline="none" href="/family-trees/manage"><Trans>create_your_first_tree</Trans></Link>
                  </Button>
                </Box>
              )
          }
        </Paper>
      </Box>
      {
        familyTrees?.map((tree: any, index: number) => (
          <Box display="flex" gap={2} key={`tree-preview-${index}`}>
            <Box flex="0 1 30%">
              {tree?.name}
            </Box>
            <Box flex="0 1 30%">
              <Link href={`/family-trees/${tree?.id || ''}`}><Trans>go_check_my_tree</Trans></Link>
            </Box>
          </Box>
        ))
      }
    </Page>
  ) : (
    <NotFound title={<Trans>profile_not_found</Trans>} /> // this probably wont be necesarry given redirect
  );
}

export default UserProfilePage;