export interface FormField {
  placeholder?: string;
  type?: string;
  label?: string;
  validators?: Validator[];
  options?: string[];
  classes?: string[];
  id?: string;
  name?: string;
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
