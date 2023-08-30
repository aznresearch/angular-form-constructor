export enum FormFieldType {
  Text = 'text',
  Textarea = 'textarea',
  Date = 'date',
  Select = 'select',
  Number = 'number',
  Checkbox = 'checkbox',
  Radio = 'radio',
  File = 'file',
  Password = 'password',
  Email = 'email',
  Phone = 'phone'
}

export enum ValidatorType {
  Required = 'required',
  MinLength = 'minlength',
  MaxLength = 'maxlength',
  Pattern = 'pattern',
  Email = 'email',
  Min = 'min',
  Max = 'max',
  RequiredTrue = 'requiredTrue'
}

export const formFieldTypes: FormFieldType[] = [
  FormFieldType.Text,
  FormFieldType.Textarea,
  FormFieldType.Date,
  FormFieldType.Select,
  FormFieldType.Number,
  FormFieldType.Checkbox,
  FormFieldType.Radio,
  FormFieldType.File,
  FormFieldType.Password,
  FormFieldType.Email,
  FormFieldType.Phone
];

export const validatorTypes: ValidatorType[] = [
  ValidatorType.Required,
  ValidatorType.MinLength,
  ValidatorType.MaxLength,
  ValidatorType.Pattern,
  ValidatorType.Email,
  ValidatorType.Min,
  ValidatorType.Max,
  ValidatorType.RequiredTrue
];

export const fieldsToCreate = [
  { name: 'name', isArray: false },
  { name: 'classes', isArray: false },
  { name: 'placeholder', isArray: false },
  { name: 'title', isArray: false },
  { name: 'validators', isArray: true },
  { name: 'options', isArray: true }
];

export const defaultOptionValues: { name: string; value: string }[] = [
  { name: 'Default Option', value: 'Default Value' },
  { name: 'Default Option2', value: 'Default Value2' }
];
