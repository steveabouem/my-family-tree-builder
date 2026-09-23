import React, { useContext, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Trans } from '@lingui/macro';
import { v4 } from 'uuid';
import { FamilyTreeDAOV2, FieldsSection, genderOptions, InputType, maritalStatusOptions, MemberVisibility } from 'types';
import BaseDropDown from 'components/common/dropdowns/BaseDropdown';
import FieldSectionsGenerator from 'components/common/forms/FieldSectionsGenerator';

const MemberSidebarForm = () => {
  const { values,setFieldValue} = useFormikContext<FamilyTreeDAOV2>();
  const sections: FieldsSection[] = [
    {
      title: <Trans>member_settings</Trans>, fields: [
        {
          fieldName:
            'current.send_invite', label: <Trans>send_invite?</Trans>,
          type: InputType.checkbox
        },
        {
          fieldName:
            'current.visibility', label: <Trans>visibility</Trans>,
          type: InputType.radio,
          options: [
            { label: <Trans>{MemberVisibility.private}</Trans>, value: MemberVisibility.private },
            { label: <Trans>{MemberVisibility.family_only}</Trans>, value: MemberVisibility.family_only },
            { label: <Trans>{MemberVisibility.public}</Trans>, value: MemberVisibility.public },
          ]
        },
        {
          fieldName: 'current.is_anchor', label: <Trans>set_as_anchor</Trans>, type: InputType.checkbox
        }
      ]
    },
    {
      title: <Trans>basic_identification</Trans>,
      required: true,
      fields: [{
        fieldName:
          'current.first_name', label: <Trans>firstName</Trans>, value: values?.current?.first_name || ''
      },
      { fieldName: 'current.last_name', label: <Trans>lastName</Trans>, value: values?.current?.last_name || '' },
      { fieldName: 'current.email', label: <Trans>email</Trans>, type: InputType.email, value: values?.current?.email || '' },
      {
        fieldName: 'current.gender', label: <Trans>gender</Trans>, subComponent: () => (
          <BaseDropDown
            options={genderOptions} id="gender-selection" name={'current.gender'}
          />),
        value: values?.current?.gender || ''
      }
      ]
    },
    {
      title: <Trans>personal_life</Trans>, fields: [
        {
          fieldName: 'current.marital_status', label: <Trans>marital_status</Trans>, subComponent: () => (
            <BaseDropDown
              name={'current.marital_status'}
              options={maritalStatusOptions}
              // id={`${newNodeId}.marital_status-selection`}
              sx={{ height: '1rem' }}
            />
          ),
          value: values?.current?.marital_status || ''
        },
        { fieldName: 'current.dob', label: <Trans>dob</Trans>, type: InputType.date, value: values?.current?.dob || '' },
        {
          fieldName:
            'current.deceased', label: <Trans>alive</Trans>,
          type: InputType.radio,
          options: [{ label: <Trans>yes</Trans>, value: false }, { label: <Trans>no</Trans>, value: true }]
        },
        { fieldName: 'current.dod', label: <Trans>dod</Trans>, type: InputType.date, value: values?.current?.dod || '' },
      ]
    },
    {
      title: <Trans>others</Trans>, fields: [
        { fieldName: 'current.occupation', label: <Trans>occupation</Trans>, value: values?.current?.occupation || '' },
        { fieldName: 'current.description', label: <Trans>description</Trans>, value: values?.current?.description || '' },
        { fieldName: 'current.profile_url', label: <Trans>picture</Trans>, type: InputType.image },
      ]
    }
  ];

  useEffect(() => {
    generateNodeId();
  }, []);

  function generateNodeId() {
    const isNew = !values?.current?.node_id;
    const newNodeId = isNew ? v4() : values?.current?.node_id;

    if (isNew) {
      setFieldValue('current.node_id', newNodeId);
    }
  }

  return (
    <FieldSectionsGenerator sections={sections} />
  );
};

export default MemberSidebarForm;