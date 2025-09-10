import { Gendersenum } from "../definitions";

export interface BaseDropDownProps {
  options: DDropdownOption[];
  name: string;
  additionalClass?: string;
  onChangeCB?: (value: string | number) => void;
  label?: string;
  sx?: { [key: string]: string },
  id?: string;
  displayVal?: string | number;
}

export interface DropdownOption {
  label: string;
  value: string | number;
  active?: boolean;
  additionalClass?: string;
  id?: string;
}

export const genderOptions: DDropdownOption[] = [
  {
    label: 'male',
    value: Gendersenum.male,
  },
  {
    label: 'female',
    value: Gendersenum.female,
  },
];
export const parentOptions: DDropdownOption[] = [
  {
    label: 'yes',
    value: 1,
    id: 'is-parent-option',
  },
  {
    label: 'no',
    value: 0,
    id: 'not-parent-option',
  },
];

export const relationOptions: DDropdownOption[] = [
  {
    label: 'brother',
    value: 'brother',
    id: 'is-brother-option',
  },
  {
    label: 'father',
    value: 'father',
    id: 'is-father-option',
  },
  {
    label: 'husband',
    value: 'husband',
    id: 'is-husband-option',
  },
  {
    label: 'mother',
    value: 'mother',
    id: 'is-mother-option',
  },
  {
    label: 'sister',
    value: 'sister',
    id: 'is-sister-option',
  },
  {
    label: 'wife',
    value: 'wife',
    id: 'is-wife-option',
  },
  {
    label: 'son',
    value: 'son',
    id: 'is-son-option',
  },
  {
    label: 'daughter',
    value: 'daughter',
    id: 'is-daughter-option',
  },
];

export const maritalStatusOptions: DDropdownOption[] = [
  {
    label: 'single',
    value: 'Single',
    id: 'single-option',
  },
  {
    label: 'married',
    value: 'Married',
    id: 'married-option',
  },
  {
    label: 'divorced',
    value: 'Divorced',
    id: 'Divorced-option',
  },
  {
    label: 'separated',
    value: 'Separated',
    id: 'separated-option',
  },
  {
    label: 'widowed',
    value: 'Widowed',
    id: 'widowed-option',
  },
  {
    label: 'not telling',
    value: 'Not telling',
    id: 'not-telling-option',
  },
];