export interface DBaseDropDownProps {
  options: DDropdownOption[];
  onValueChange: (option: DDropdownOption) => void;
  id?: string;
  additionalClass?: string;
  label?: string;
  val?: string | number;
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
    value: 1,
    id: 'male-option',
  },
  {
    label: 'Female',
    value: 2,
    id: 'female-option',
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
    value: 'Aunt',
    id: 'is-aunt-option',
  },
  {
    label: 'Brother',
    value: 'Brother',
    id: 'is-brother-option',
  },
  {
    label: 'Father',
    value: 'Father',
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
    value: 'Husband',
    id: 'is-husband-option',
  },
  {
    label: 'Mother',
    value: 'Mother',
    id: 'is-mother-option',
  },
  {
    label: 'Sister',
    value: 'Sister',
    id: 'is-sister-option',
  },
  {
    label: 'Uncle',
    value: 'Uncle',
    id: 'is-uncle-option',
  },
  {
    label: 'Wife',
    value: 'Wife',
    id: 'is-wife-option',
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
    id: 'divorced-option',
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