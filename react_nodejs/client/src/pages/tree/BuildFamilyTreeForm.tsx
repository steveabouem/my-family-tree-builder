import React from "react";
import { Formik } from "formik";
import { Trans } from "@lingui/macro";
import FormFieldsGenerator from "../../components/common/forms/FormFieldsGenerator";
import { DTreeManagerFields, DTreeManagerProps } from "./definitions";
import { DFormField } from "../../components/common/definitions";
import { service } from "../../services";
import BaseDropDown from "../../components/common/dropdowns/BaseDropdown";
import { DDropdownOption, genderOptions } from "../../components/common/dropdowns/definitions";
import FamilyTreeContext from "contexts/creators/familyTree/familyTree.context";
import GlobalContext from "contexts/creators/global/global.context";
import { Box } from "@mui/material";

const BuildFamilyTreeForm = ({ numberOfSiblings, hasSpouse }: DTreeManagerProps): JSX.Element => {
  // ? single form here to build the treeManagerFormFields. I might add an option on each tree node to allow adding a link for that specific Node. 
  // ? hat will allow for extended families without having to also deal with the families endpoint **/
  const { currentUser } = React.useContext(FamilyTreeContext);
  const { updateModal, toggleLoading } = React.useContext(GlobalContext);
  const [trees, setTrees] = React.useState<number[]>([]);

  const treeBuilderFields: DFormField[] = [
    {
      fieldName: 'mother.first_name',
      label: <Trans>mother_first_name</Trans>,
      type: 'text',
      required: true,
    },
    {
      fieldName: 'mother.last_name',
      label: <Trans>mother_last_name</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: 'mother.dob',
      label: <Trans>mother_age</Trans>,
      type: 'date',
      required: true
    },
    {
      fieldName: 'father.first_name',
      label: <Trans>father_first_name</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: 'father.last_name',
      label: <Trans>father_last_name</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: 'father.dob',
      label: <Trans>father_age</Trans>,
      type: 'date',
      required: true
    },
    {
      fieldName: 'is_public',
      label: <Trans>make_tree_private</Trans>,
      type: 'checkbox',
      required: true,
      class: 'd-inline'
    },
    {
      fieldName: 'tree_name',
      label: <Trans>family_tree_name_label</Trans>,
      type: 'text',
      required: true
    },
  ];

  const treeManagerInitialValues: Partial<DTreeManagerFields> = currentUser?.userId ? {
    first_name: currentUser?.firstName || '',
    last_name: currentUser?.lastName || '',
    user_id: currentUser?.userId || 0,
    siblings: [],
    marital_status: '' //! - TODO: send from session
  } : {};

  const siblingsFieldArray = React.useMemo((): DFormField[] => {
    const range: number[] = Array.from({ length: numberOfSiblings }, (abstractItem: unknown, index: number) => index);
    const fields = range.reduce((list: DFormField[], siblingIndex: number) => (
      [...list, {
        fieldName: `siblings[${siblingIndex}].first_name`,
        label: <Trans>first_name_of_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      },
      // TODO: add a field here for email, to allow the backend to query the member
      {
        fieldName: `siblings[${siblingIndex}].last_name`,
        label: <Trans>last_name_of_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      },
      {
        fieldName: `siblings[${siblingIndex}].email`,
        label: <Trans>email_of_sibling {siblingIndex + 1}</Trans>,
        type: 'email',
        required: true
      },
      {
        fieldName: `siblings[${siblingIndex}].dob`,
        label: <Trans>age_of_sibling {siblingIndex + 1}</Trans>,
        type: 'date',
        required: true
      }, {
        fieldName: `siblings[${siblingIndex}].gender`,
        label: <Trans>gender_of_sibling {siblingIndex + 1}</Trans>,
        type: 'select',
        options: [{ label: 'F', value: 2 }, { label: 'M', value: 1 },],
        required: true
      }
      ]), []);

    return fields;
  }, [numberOfSiblings]);

  const spouseFieldArray = React.useMemo((): DFormField[] => {
    return hasSpouse ? ([{
      fieldName: `spouse.first_name`,
      label: <Trans>first_name_of_spouse</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: `spouse.last_name`,
      label: <Trans>last_name_of_spouse</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: `spouse.dob`,
      label: <Trans>age_of_spouse</Trans>,
      type: 'date',
      required: true
    }]) : [];

  }, [hasSpouse]);

  const submitForm = async (values: any) => {
    if (toggleLoading) {
      toggleLoading(true);
    }
    const familyTreeService = new service.familyTree();
    const { data } = await familyTreeService.create({ ...values, user_id: currentUser.userId });
    if (updateModal) {
      if (data?.error) {
        updateModal({
          hidden: false,
          title: 'Err',
          content: 'Error'
        });
      } else {
        updateModal({
          hidden: false,
          title: 'Success',
          content: 'Success',
          buttons: { confirm: false, cancel: true }
        });
      }
    }

    if (toggleLoading) {
      toggleLoading(false);
    }
  };

  return (
    <Box width="450px">
      <Formik
        initialValues={treeManagerInitialValues}
        onSubmit={submitForm}
      >
        {({ handleSubmit, errors, setFieldValue, values }) => (
          <FormFieldsGenerator size="med"
            fields={
              [
              ...treeBuilderFields,
              ...siblingsFieldArray,
              ...spouseFieldArray,
              {
                fieldName: `spouse.gender`,
                label: <Trans>gender_of_spouse</Trans>,
                type: 'select',
                options: [{ label: <Trans>gender_female</Trans>, value: 2 }, { label: <Trans>gender_male</Trans>, value: 1 },],
                required: true,
                subComponent: () => <Box className="field-wrap base">
                  <BaseDropDown
                    options={genderOptions}
                    id="marital-status-dd"
                    //  TODO typing of your form is not optimal
                    // @ts-ignore:
                    val={values?.spouse?.gender}
                    // @ts-ignore:
                    displayVal={values?.spouse?.gender === 1 ? <Trans>gender_male</Trans> : <Trans>gender_female</Trans>}
                  />
                </Box>
              }]
            }
            handleSubmit={handleSubmit}
            handleFieldValueChange={(field: string, value: string | number) => setFieldValue(field, value)} />
        )}
      </Formik>
    </Box >

  );
};

export default BuildFamilyTreeForm;