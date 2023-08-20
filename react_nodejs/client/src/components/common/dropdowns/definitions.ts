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