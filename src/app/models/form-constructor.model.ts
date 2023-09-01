export interface FormField {
  placeholder?: string;
  type?: string;
  label?: string;
  validators?: Validator[];
  options?: Option[];
  classes?: string[];
  id: string;
  name: string;
  isArray?: boolean;
}

export interface ConditionalLogicBlock {
  selectedField: FormField;
  selectedCondition: string;
  conditionValue: string;
  selectedAction: string;
  selectedTargetField: string;
  type: string;
}

export interface FormOptions {
  title: string;
  data: { [key: string]: FormField };
}

export interface Validator {
  type: string;
  value?: number | string;
  errormsg?: string;
}

export interface Option {
  name: string;
  value: string;
}

export interface UniqueFormData {
  title: string;
  countryCode: string;
  step: number;
  data: { [key: string]: FormField };
}

export interface FormOptionsMock {
  formData: FormOptions[];
  options: {
    name: string;
    type: string;
    country: string;
  };
  uniqueFormData?: UniqueFormData[];
}
