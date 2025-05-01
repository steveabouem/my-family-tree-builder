import { Gendersenum } from "../definitions";

export interface DBaseDropDownProps {
  options: DDropdownOption[];
  name: string;
  additionalClass?: string;
  onChangeCB?: (value: string | number) => void;
  label?: string;
  sx?: { [key: string]: string },
  id?: string;
  displayVal?: string | number;
}

export interface DDropdownOption {
  label: string;
  value: string | number;
  active?: boolean;
  additionalClass?: string;
  id?: string;
}

export const genderOptions: DDropdownOption[] = [
  {
    label: 'Male',
    value: Gendersenum.male,
  },
  {
    label: 'Female',
    value: Gendersenum.female,
  },
];
export const parentOptions: DDropdownOption[] = [
  {
    label: 'Yes',
    value: 1,
    id: 'is-parent-option',
  },
  {
    label: 'No',
    value: 0,
    id: 'not-parent-option',
  },
];

export const relationOptions: DDropdownOption[] = [
  {
    label: 'Aunt',
    value: 'aunt',
    id: 'is-aunt-option',
  },
  {
    label: 'Brother',
    value: 'brother',
    id: 'is-brother-option',
  },
  {
    label: 'Father',
    value: 'father',
    id: 'is-father-option',
  },
  {
    label: 'Grand-father',
    value: 'Grand-father',
    id: 'is-grand-father-option',
  },
  {
    label: 'Grand-mother',
    value: 'Grand-mother',
    id: 'is-grand-mother-option',
  },
  {
    label: 'Husband',
    value: 'husband',
    id: 'is-husband-option',
  },
  {
    label: 'Mother',
    value: 'mother',
    id: 'is-mother-option',
  },
  {
    label: 'Sister',
    value: 'sister',
    id: 'is-sister-option',
  },
  {
    label: 'Uncle',
    value: 'uncle',
    id: 'is-uncle-option',
  },
  {
    label: 'Wife',
    value: 'wife',
    id: 'is-wife-option',
  },
  {
    label: 'Son',
    value: 'son',
    id: 'is-son-option',
  },
  {
    label: 'Daughter',
    value: 'daughter',
    id: 'is-daughter-option',
  },
];

export const maritalStatusOptions: DDropdownOption[] = [
  {
    label: 'Single',
    value: 'Single',
    id: 'single-option',
  },
  {
    label: 'Married',
    value: 'Married',
    id: 'married-option',
  },
  {
    label: 'Divorced',
    value: 'Divorced',
    id: 'Divorced-option',
  },
  {
    label: 'Separated',
    value: 'Separated',
    id: 'separated-option',
  },
  {
    label: 'Widowed',
    value: 'Widowed',
    id: 'widowed-option',
  },
  {
    label: 'Not telling',
    value: 'Not telling',
    id: 'not-telling-option',
  },
];