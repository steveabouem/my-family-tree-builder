export interface DBaseDropDownProps {
  options: DDropdownOption[];
  onValueChange: (option: string | boolean | number) => void;
  id?: string;
  additionalClass?: string;
  label?: string;
  val: any;
}

export interface DDropdownOption {
  label: string;
  value: string | number | boolean;
  active?: boolean;
  additionalClass?: string;
  id?: string;
}