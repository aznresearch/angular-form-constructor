export interface FormField {
  placeholder?: string;
  type?: string;
  title?: string;
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

export interface StepData {
  addedFields: FormField[];
  conditionalLogicBlocks: ConditionalLogicBlock[];
}

export interface FormOptions {
  title: string;
  data: FormField[];
  conditionalLogicBlocks?: ConditionalLogicBlock[];
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

export interface UniqueFormData extends FormOptions {
  countryCode: string;
  step: number;
}

export interface FormOptionsFull {
  formData: FormOptions[];
  options: {
    name: string;
    type: string;
    country: string;
  };
  uniqueFormData?: UniqueFormData[];
}
