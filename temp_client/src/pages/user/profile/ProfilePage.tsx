import React, { useContext, useEffect } from "react";
import { Trans } from "@lingui/macro";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import GlobalContext from "contexts/creators/global/global.context";
import UserCredentials from "./UserCredentials";
import PageUrlsEnum from "utils/urls";
import Page from "components/common/Page";
import NotFound from "pages/404NotFound";
import { UserState, ChangePasswordValues } from "types";
import { useZDispatch, useZSelector } from "app/hooks";
import { useUpdatUser } from "services/v2";
import PaperSection from "components/common/containers/PaperSection";
import { updateUserAction } from "app/slices/user";

const UserProfilePage = (): JSX.Element => {
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const dispatch = useZDispatch();
  const { updateModal } = useContext(GlobalContext);
  const { mutate: updatUserMutation, isPending } = useUpdatUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (currentUser?.userId && currentUser?.userId !== Number(id)) {
      navigate(PageUrlsEnum.auth);
    }
  }, [currentUser, id, navigate]);

  function showUpdateProfileConfirm(values: ChangePasswordValues) {
    updateModal({
      buttons: { cancel: true, confirm: true },
      type: 'info',
      title: <Trans>user_profile_updates_confirm_title</Trans>,
      content: <Trans>user_profile_updates_confirm_text</Trans>,
      onConfirm: () => processUserUpdate(values),
      hidden: false
    });
  }
  function processUserUpdate(values: ChangePasswordValues) {
    updatUserMutation(values,
      {
        onError: () => {
          updateModal({
            title: <Trans>operation_failure_title</Trans>,
            type: 'error',
            buttons: { cancel: true, confirm: false, cancelText: <Trans>close</Trans> },
            content: <Trans>operation_failure_text</Trans>,
            hidden: false
          });
        },
        onSuccess: (data) => {
          console.log({ data });
          dispatch(updateUserAction(data.payload));
          updateModal({
            title: <Trans>operation_success_title</Trans>,
            type: 'success',
            buttons: { cancel: true, confirm: false, cancelText: <Trans>close</Trans> },
            content: <Trans>operation_success_text</Trans>,
            hidden: false
          });
        },
      });
  }

  return (
    <Page loading={isPending} subtitle={<Trans>profile_page_subtitle</Trans>} title={<Trans>profile_management_label {currentUser?.firstName || ''}</Trans>}>
      {currentUser?.userId ? (
        <PaperSection>
          <UserCredentials handleSubmit={showUpdateProfileConfirm} />
        </PaperSection>
      ) : (
        <NotFound title={<Trans>profile_not_found</Trans>} /> // this probably wont be necesarry given redirect
      )}
    </Page>
  );
};

export default UserProfilePage;