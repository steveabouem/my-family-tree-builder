import React, { useContext, useEffect } from "react";
import { Trans } from "@lingui/macro";
import GlobalContext from "contexts/creators/global/global.context";
import UserCredentials from "./UserCredentials";
import Page from "components/common/Page";
import NotFound from "components/common/404NotFound";
import { UserState, ChangePasswordValues } from "types";
import { useZDispatch, useZSelector } from "app/hooks";
import { useGetProfileInfo, useUpdatUser } from "api";
import PaperSection from "components/common/containers/PaperSection";
import { updateUserAction } from "app/slices/user";

const UserProfilePage = (): JSX.Element => {
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const userId = currentUser?.userId;
  const dispatch = useZDispatch();
  const { updateModal, clearModal } = useContext(GlobalContext);
  const { mutate: updatUserMutation, isPending } = useUpdatUser();
  const { data: profileData, isLoading: isProfileLoading, refetch } = useGetProfileInfo(userId);
  const isProcessing = isProfileLoading || isPending;

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
          clearModal();
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
          clearModal();
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
  function reloadProfile() {
    refetch()
    .then((data) => {
      console.log('GOOD ', data);
      
    })
    .catch((e: unknown) => {
      console.log('FAILD ', e);;
      
    })
  }

  return (
    <Page loading={isProcessing} subtitle={<Trans>profile_page_subtitle</Trans>} title={<Trans>profile_management_label {currentUser?.firstName || ''}</Trans>}>
      <PaperSection>
        {profileData ? (
          <PaperSection>
            <UserCredentials handleSubmit={showUpdateProfileConfirm} profileInfo={profileData} />
          </PaperSection>
        ) : (
          <NotFound handleReload={reloadProfile} />
        )}
      </PaperSection>
    </Page>
  );
};

export default UserProfilePage;