import React, { useContext } from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { useNavigate, useParams } from "react-router-dom";

import Page from "components/common/Page";
import PaperSection from "components/common/containers/PaperSection";
import GlobalContext from "contexts/creators/global";
import PageUrlsEnum from "utils/urls";
import { useGetMemberDetails } from "api/familyMember";

const ViewFamilyMemberPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading } = useContext(GlobalContext);

  const { data, isLoading, error,refetch } = useGetMemberDetails(id || "", !!id);
  const member = data?.payload;
  const isProcessing = loading || isLoading;

  const handleRelativeClick = (relativeId: string) => {
    navigate(PageUrlsEnum.viewMember.replace(":id", relativeId));
  };

  return (
    <Page
      loading={isProcessing} error={!!error || data?.code === 500}
      prevUrl={PageUrlsEnum.trees} reload={refetch}
      title={member ? `${member.firstName} ${member.lastName}` : <Trans>member_details_title</Trans>}
      subtitle={<Trans>member_details_subtitle</Trans>}
    >
      <Box sx={mainContainerStyle}>
        <PaperSection>
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
                  {member.firstName} {member.lastName}
                </Typography>
                <Typography variant="body2">
                  <strong><Trans>email_label</Trans>:</strong> {member.email}
                </Typography>
                <Typography variant="body2">
                  <strong><Trans>age_label</Trans>:</strong> {member.age}</Typography>
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
              </Grid>
            </Grid>
          )}
        </PaperSection>

        <PaperSection >
          <Typography variant="h6" gutterBottom>
            <Trans>relatives_section_title</Trans>
          </Typography>
          {data?.payload?.relatives && data.payload.relatives.length > 0 ? (
            <Box sx={relativesContainerStyle}>
              {data.payload.relatives.map((relative: any) => (
                <Box key={relative.id} sx={relativeItemStyle}>
                  {relative.treeName && (
                    <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5 }}>
                      {relative.treeName}
                    </Typography>
                  )}
                  <Chip
                    label={relative.fullName}
                    clickable
                    color="primary"
                    variant="outlined"
                    onClick={() => handleRelativeClick(relative.id)}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2">
              <Trans>no_relatives_found</Trans>
            </Typography>
          )}
        </PaperSection>
      </Box>
    </Page>
  );
};

const mainContainerStyle = {
  width: "100%",
};

const relativesContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
};

const relativeItemStyle = {
  display: "flex",
  flexDirection: "column" as const,
};

export default ViewFamilyMemberPage;

