import React, { useContext, useEffect } from "react";

import { Trans } from "@lingui/macro";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, Button, useTheme } from "@mui/material";
import { MdOutlineAddBox } from "react-icons/md";
import GlobalContext from "contexts/creators/global/global.context";
import UserCredentials from "./UserCredentials";
import PageUrlsEnum from "utils/urls";
import Page from "components/common/Page";
import NotFound from "pages/404NotFound";
import { FamilyTreeState, UserState, ChangePasswordValues } from "types";
import { EyeIcon, GroupIcon } from "utils/assets/icons";
import { submitPasswordChangeForm } from "services/auth";
import { useZDispatch, useZSelector } from "app/hooks";
import { useChangePassword } from "services/v2";
import PaperSection from "components/common/containers/PaperSection";

const UserProfilePage = (): JSX.Element => {
  const dispatch = useZDispatch();
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const { toggleLoading, updateModal } = useContext(GlobalContext);
  const { mutate: changePasswordMutation, isPending, isSuccess, isError } = useChangePassword();
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (currentUser?.userId && currentUser?.userId !== Number(id)) {
      navigate(PageUrlsEnum.auth);
    }
  }, [currentUser, id, navigate]);

  function processPasswordChange(values: ChangePasswordValues) {
    changePasswordMutation(values,
      {
        onError: () => updateModal({
          title: <Trans>operation_failure_title</Trans>,
          type: 'error',
          buttons: { cancel: true, confirm: false, cancelText: <Trans>close</Trans> },
          content: <Trans>operation_failure_text</Trans>
        }),
        onSuccess: () => updateModal({
          title: <Trans>operation_success_title</Trans>,
          type: 'success',
          buttons: { cancel: true, confirm: false, cancelText: <Trans>close</Trans> },
          content: <Trans>operation_success_text</Trans>
        }),
      });
  }

  return currentUser ? (
    <Page subtitle={<Trans>profile_page_subtitle</Trans>} title={<Trans>profile_management_label {currentUser?.firstName || ''}</Trans>}>
      <PaperSection>
        <UserCredentials handleSubmit={processPasswordChange} />
      </PaperSection>
    </Page>
  ) : (
    <NotFound title={<Trans>profile_not_found</Trans>} /> // this probably wont be necesarry given redirect
  );
}

const mainContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

export default UserProfilePage;