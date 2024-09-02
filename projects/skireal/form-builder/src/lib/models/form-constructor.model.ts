export interface FormField extends Field {
  placeholder?: string;
  type?: string;
  title?: string;
  description?: string;
  initial?: string;
  validators?: Validator[];
  options?: Option[];
  classes?: string;
  rows?: Row[];
  hasOther?: boolean;
  commentId?: string;
  commentTitle?: string;
  commentSubtitle?: string;
  commentWarningMessage?: string;
  firstAnswer?: string;
  lastAnswer?: string;
  qeScales?: QeScale[];
  step?: number;
  active?: boolean;
  analyticsTitle?: string;
}

export interface Field {
  id: string;
  name: string;
  isArray?: boolean;
  parentArray?: string;
  placeholder?: string;
  children?: Field[];
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
  title?: string;
  addedFields: FormField[];
  conditionalLogicBlocks: ConditionalLogicBlock[];
}

export interface FormDataStructure {
  steps: StepData[];
  generalFields: FormField[];
}

export interface Validator {
  type: string;
  value?: string;
  errormsg?: string;
}

export interface Option {
  id: string;
  name: string;
  value: string;
}

export interface Row {
  name: string;
}

export interface UniqueFormData extends StepData {
  countryCode: string;
  step: number;
}

export interface FormOptionsFull {
  formData: FormDataStructure;
  options: {
    name: string;
    type: string;
    country: string;
  };
  uniqueFormData?: UniqueFormData[];
}

export interface QeScaleChild {
  id?: string;
  title?: string;
}

export interface QeScale {
  id?: string;
  title?: string;
  subtitle?: string;
  qeScaleChildren?: QeScaleChild[];
}

export type FieldItem = Validator | Option | Row | QeScale;
