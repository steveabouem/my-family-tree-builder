import React, { useContext, useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import { Trans } from "@lingui/macro";
import BaseFormFields from "../common/forms/BaseFormFields";
import { DTreeManagerFields, DTreeManagerProps } from "./definitions";
import { DFormField } from "../common/definitions";
import FamilyTreeContext from "../../context/creators/familyTree.context";
import GlobalContext from "../../context/creators/global.context";
import {service} from "../../services";

const ManageTreeForm = ({ numberOfSiblings, hasSpouse }: DTreeManagerProps): JSX.Element => {
  // !: For now I will not distinguish between the 2.Will use fam as central entity (seen README)
  // ? single form here to build the treeManagerFormFields. I might add an option on each tree node to allow adding a link for that specific Node. 
  // ? hat will allow for extended families without having to also deal with the families endpoint **/
  // const [motherName, setMotherName] = useState<string>('');
  const { currentUser } = useContext(FamilyTreeContext);
  const { updateModal, toggleLoading } = useContext(GlobalContext);
  const [trees, setTrees] = useState<number[]>([]);

  const treeBuilderFields: DFormField[] = [
    {
      fieldName: 'mother.first_name',
      label: <Trans>mother_first_name</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: 'mother.last_name',
      label: <Trans>mother_last_name</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: 'mother.age',
      label: <Trans>mother_age</Trans>,
      type: 'number',
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
      fieldName: 'father.age',
      label: <Trans>father_age</Trans>,
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

  const treeManagerInitialValues: Partial<DTreeManagerFields> = currentUser?.userId ? {
    first_name: currentUser?.firstName || '',
    last_name: currentUser?.lastName || '',
    user_id: currentUser?.userId || 0,
    siblings: [],
    marital_status: '' //! - TODO: send from session
  } : {};

  const siblingsFieldArray = useMemo((): DFormField[] => {
    const range: number[] = Array.from({ length: numberOfSiblings }, (abstractItem: unknown, index: number) => index);
    const fields = range.reduce((list: DFormField[], siblingIndex: number) => (
      [...list, {
        fieldName: `siblings[${siblingIndex}].first_name`,
        label: <Trans>first_name_of_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      },
      {
        fieldName: `siblings[${siblingIndex}].last_name`,
        label: <Trans>last_name_of_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      },
      {
        fieldName: `siblings[${siblingIndex}].age`,
        label: <Trans>age_of_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      }, {
        fieldName: `siblings[${siblingIndex}].gender`,
        label: <Trans>gender_of_sibling {siblingIndex + 1}</Trans>,
        type: 'text',
        required: true
      }
      ]), []);

    return fields;
  }, [numberOfSiblings]);

  const spouseFieldArray = useMemo((): DFormField[] => {
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
      fieldName: `spouse.age`,
      label: <Trans>age_of_spouse</Trans>,
      type: 'text',
      required: true
    },
    {
      fieldName: `spouse.gender`,
      label: <Trans>gender_of_spouse</Trans>,
      type: 'text',
      required: true
    }]) : [];

  }, [hasSpouse]);

  const submitForm = (values: any) => {
    if (toggleLoading) {
      toggleLoading(true);
    }
    const familyTreeService = new service.familyTree();
    familyTreeService.create(values)
      .then(({ data }) => {
        if (data?.error && updateModal) {
          updateModal({
            hidden: false,
            title: 'Err',
            content: 'Error'
          });
        }
        if (updateModal) {
          updateModal({
            hidden: false,
            title: 'Success',
            content: 'Success',
            buttons: {confirm: false, cancel: true}
          });
        }
      })
      .catch((e: unknown) => {
        console.log('Create tree', e);
        if (updateModal) {
          updateModal({
            hidden: false,
            title: 'Err',
            content: 'Error'
          });
        }
        return false;
      });

    if (toggleLoading) {
      toggleLoading(false);
    }
  };

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
              ...siblingsFieldArray,
              ...spouseFieldArray,
            ]}
            handleSubmit={handleSubmit}
            handleFieldValueChange={(field: string, value: string | number) => setFieldValue(field, value)} />
        )}
      </Formik>
    </div >

  );
};

export default ManageTreeForm;