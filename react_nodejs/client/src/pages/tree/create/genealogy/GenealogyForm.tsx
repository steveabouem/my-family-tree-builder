import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import StepForm from "components/common/forms/stepform";
import { Formik } from "formik";

const GenealogyForm = () => {
  const [currentFormStep, setCurrentFormStep] = useState<number>(0);

  function goToStep(step: number) {
    if (step > 0) {
      setCurrentFormStep(step);
    }
  }

  return (
    <Paper>
      <Box>
        <Formik initialValues={{}} onSubmit={(v) => { }}>
          {({ }) => (
            <StepForm
              currentFields={[]}
              currentStep={currentFormStep}
              name="tell-my-story" updateStep={goToStep} />
          )}
        </Formik>
      </Box>
    </Paper>
  );
};

export default GenealogyForm;