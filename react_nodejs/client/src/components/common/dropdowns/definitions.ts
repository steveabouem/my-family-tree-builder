export interface DBaseDropDownProps {
  options: DDropdownOption[];
  onOptionSelect: (option: string) => void;
  id?: string;
  additionalClass?: string;
  label?: string;
}

export interface DDropdownOption {
  label: string;
  value: string | number | boolean;
  active?: boolean;
  additionalClass?: string;
  id?: string;
}