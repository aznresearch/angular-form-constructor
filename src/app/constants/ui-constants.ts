import { ConditionalLogicBlock, FormField } from '../models/form-constructor.model';

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

export const fieldTypesNames: FieldTypesNames = {
  [FormFieldType.Text]: 'Text Input',
  [FormFieldType.Textarea]: 'Text Area',
  [FormFieldType.Date]: 'Date',
  [FormFieldType.Select]: 'Select',
  [FormFieldType.Number]: 'Number',
  [FormFieldType.Checkbox]: 'Checkboxes',
  [FormFieldType.Radio]: 'Radio',
  [FormFieldType.File]: 'File Attachment',
  [FormFieldType.Password]: 'Password',
  [FormFieldType.Email]: 'Email',
  [FormFieldType.Phone]: 'Phone Number'
};

export type FieldTypesNames = {
  [key in FormFieldType]: string;
};

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

export const fieldsToCreate: FormField[] = [
  { id: 'name', name: 'name', isArray: false },
  { id: 'classes', name: 'classes', isArray: false },
  { id: 'placeholder', name: 'placeholder', isArray: false },
  { id: 'title', name: 'title', isArray: false },
  { id: 'validators', name: 'validators', isArray: true },
  { id: 'options', name: 'options', isArray: true }
];

export const defaultOptionValues: { name: string; value: string }[] = [
  { name: 'Default Option', value: 'Default Value' },
  { name: 'Default Option2', value: 'Default Value2' }
];

export const controlsMap: Record<string, string[]> = {
  validators: ['type', 'value', 'errormsg'],
  options: ['name', 'value']
};

export const defaultConditionalLogicBlock: ConditionalLogicBlock = {
  selectedField: {
    type: '',
    id: '',
    name: ''
  },
  selectedCondition: '',
  conditionValue: '',
  selectedAction: '',
  selectedTargetField: '',
  type: 'conditionalLogicBlock'
};

export const conditionOptions: Record<string, string[]> = {
  text: ['equals', 'contains', 'is empty', 'is not empty'],
  checkbox: ['is empty', 'is not empty'],
  number: [
    'equals',
    'not equals',
    'greater',
    'less',
    'greater or equals',
    'less or equals',
    'is empty',
    'is not empty'
  ]
};
