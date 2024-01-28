import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Field, FieldArray, Formik } from "formik";
import { Trans } from "@lingui/macro";
import BaseFormFields from "../common/forms/BaseFormFields";
import { DSibling, DTreeManagerFields, DTreeManagerProps, relationType } from "./definitions";
import { DFormField } from "../common/definitions";
import BaseDropDown from "../common/dropdowns/BaseDropdown";
import { DDropdownOption, relationOptions } from "../common/dropdowns/definitions";
import FamilyTreeContext from "../../context/creators/familyTree.context";

const ManageTreeForm = ({ numberOfSiblings, hasSpouse }: DTreeManagerProps): JSX.Element => {
  // !: For now I will not distinguish between the 2.Will use fam as central entity (seen README)
  // ? single form here to build the treeManagerFormFields. I might add an option on each tree node to allow adding a link for that specific Node. 
  // ? hat will allow for extended families without having to also deal with the families endpoint **/
  const [displayValues, setDisplayValues] = useState<{ [key: string]: string | number }>({
    relation: 'Father',
  });
  const [motherName, setMotherName] = useState<string>('');
  const {currentUser} = useContext(FamilyTreeContext);
  
  useEffect(() => {
    if (displayValues.relation) { }
  }, [displayValues.relation]);

  const treeBuilderFields = [
    {
      fieldName: 'mother_first_name',
      label: <Trans>mother_first_name</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: 'mother_last_name',
      label: <Trans>mother_last_name</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: 'father_first_name',
      label: <Trans>father_first_name</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: 'father_last_name',
      label: <Trans>father_last_name</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: 'public',
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

  const treeManagerInitialValues = useMemo((): DTreeManagerFields => {
    return ({
      first_name: currentUser?.firstName || '',
      last_name: '',
      relation: '',
      siblings: [],
      marital_status: ''
    });
  }, [currentUser]);

  const submitForm = (values: DTreeManagerFields) => {
    console.log({ values });

  }

  const siblingsFieldArray = useMemo((): DFormField[] => {
    const range: number[] = Array.from({ length: numberOfSiblings }, (abstractItem: unknown, index: number) => index);
    const fields = range.reduce((list: DFormField[], siblingIndex: number) => (
      [...list, {
        fieldName: `siblings[${siblingIndex}].first_name`,
        label: <Trans>first_name_for_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      },
      {
        fieldName: `siblings[${siblingIndex}].last_name`,
        label: <Trans>last_name_for_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      },
      {
        fieldName: `siblings[${siblingIndex}].age`,
        label: <Trans>age_for_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      }, {
        fieldName: `siblings[${siblingIndex}].gender`,
        label: <Trans>gender_for_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      }
      ]), []);

    return fields;
  }, [numberOfSiblings]);

  return (
    <div>
      <Formik
        initialValues={treeManagerInitialValues}
        onSubmit={submitForm}
      >
        {({ handleSubmit, errors, isSubmitting, setFieldValue, values }) => (
          <BaseFormFields size="med"
            fields={[
              ...treeBuilderFields,
              ...siblingsFieldArray
            ]}
            handleSubmit={handleSubmit}
            handleFieldValueChange={(field: string, value: string | number) => setFieldValue(field, value)} />
        )}
      </Formik>
    </div >

  );
};

export default ManageTreeForm;