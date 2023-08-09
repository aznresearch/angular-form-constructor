export interface FormField {
  type: string;
  label: string;
  validators?: Validator[];
  options?: string[];
}

export interface FormOptions {
  title: string;
  data: { [key: string]: FormField };
}

interface Validator {
  type: string;
  value?: number | string;
  errormsg?: string;
}
