import React from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { useNavigate, useParams } from "react-router-dom";

import Page from "components/common/Page";
import PaperSection from "components/common/containers/PaperSection";
import PageUrlsEnum from "utils/urls";
import { useGetMemberDetails } from "api/familyMember";

const ViewFamilyMemberPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetMemberDetails(Number(id || ""));
  const member = data?.payload?.details;
  const relation = data?.payload?.relation_to_user;

  function handleRelativeClick (relativeId: string) {
    navigate(PageUrlsEnum.viewMember.replace(":id", relativeId));
  };

  return (
    <Page
      loading={isLoading} error={!!error} code={data?.code} prevUrl={PageUrlsEnum.trees} reload={refetch}
      title={member ? `${member.first_name} ${member.last_name}` : <Trans>member_details_title</Trans>}
      subtitle={<Trans>member_details_subtitle</Trans>}
    >
      <PaperSection>

      <Box sx={mainContainerStyle}>
          <Typography variant="h6" gutterBottom>
            <Trans>general_details_title</Trans>
          </Typography>
          {error && (
            <Typography color="error" variant="body2">
              <Trans>error_loading_member</Trans>
            </Typography>
          )}
          {member && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong><Trans>name_label</Trans>:</strong>{" "}
                  {member.first_name} {member.last_name}
                </Typography>
                <Typography variant="body2">
                  <strong><Trans>email_label</Trans>:</strong> {member.email}
                </Typography>
                <Typography variant="body2">
                  <strong><Trans>age_label</Trans>:</strong>15</Typography>
                <Typography variant="body2">
                  <strong><Trans>gender_label</Trans>:</strong> {member.gender}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong><Trans>dob_label</Trans>:</strong> {member.dob}
                </Typography>
                <Typography variant="body2">
                  <strong><Trans>marital_status_label</Trans>:</strong> {member.marital_status}
                </Typography>
                <Typography variant="body2">
                  <strong><Trans>description_label</Trans>:</strong>{" "}
                  {member.description || "-"}
                </Typography>
                <Typography variant="body2">
                  <strong><Trans>directly_related_to_you?</Trans>:</strong>{" "}
                  {relation ? `${member.first_name} is your ${relation.type}`  : ""}
                </Typography>
              </Grid>
            </Grid>
          )}
      </Box>
      </PaperSection>
    </Page>
  );
};

const mainContainerStyle = {
  width: "100%",
};

export default ViewFamilyMemberPage;

