import { ConditionalLogicBlock } from '../models/form-constructor.model';

export enum FormFieldType {
  Text = 'text',
  Textarea = 'textarea',
  Date = 'date',
  Select = 'select',
  Number = 'number',
  Checkbox = 'checkbox',
  CheckboxGroup = 'checkbox-group',
  Radio = 'radio',
  RadioBoolean = 'radio-boolean',
  File = 'file',
  Password = 'password',
  Email = 'email',
  Phone = 'phone',
  Likert = 'likert',
  AllFields = 'all-fields'
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
  FormFieldType.CheckboxGroup,
  FormFieldType.Radio,
  FormFieldType.RadioBoolean,
  FormFieldType.File,
  FormFieldType.Password,
  FormFieldType.Email,
  FormFieldType.Phone,
  FormFieldType.Likert
];

export const fieldTypesNames: FieldTypesNames = {
  [FormFieldType.Text]: 'Text Input',
  [FormFieldType.Textarea]: 'Text Area',
  [FormFieldType.Date]: 'Date',
  [FormFieldType.Select]: 'Select',
  [FormFieldType.Number]: 'Number',
  [FormFieldType.Checkbox]: 'Checkbox',
  [FormFieldType.CheckboxGroup]: 'Checkboxes',
  [FormFieldType.Radio]: 'Radio',
  [FormFieldType.RadioBoolean]: 'Radio (Yes/No)',
  [FormFieldType.File]: 'File Attachment',
  [FormFieldType.Password]: 'Password',
  [FormFieldType.Email]: 'Email',
  [FormFieldType.Phone]: 'Phone Number',
  [FormFieldType.Likert]: 'Likert Scale',
  [FormFieldType.AllFields]: 'All Fields'
};

export type FieldTypesNames = Record<FormFieldType, string>;

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

export interface Field {
  id: string;
  name: string;
  isArray: boolean;
}

const commonFields: Field[] = [
  { id: 'name', name: 'Name', isArray: false },
  { id: 'classes', name: 'Classes', isArray: false },
  { id: 'placeholder', name: 'Placeholder', isArray: false },
  { id: 'title', name: 'Title', isArray: false },
  { id: 'subtitle', name: 'Subtitle', isArray: false },
  { id: 'validators', name: 'Validators', isArray: true }
];

export const fieldsByType: Record<FormFieldType, Field[]> = {
  [FormFieldType.AllFields]: [
    ...commonFields,
    { id: 'optionsTitle', name: 'Options Title', isArray: false },
    { id: 'option1', name: 'Option 1 title', isArray: false },
    { id: 'option2', name: 'Option 2 title', isArray: false },
    { id: 'option3', name: 'Option 3 title', isArray: false },
    { id: 'option4', name: 'Option 4 title', isArray: false },
    { id: 'option5', name: 'Option 5 title', isArray: false },
    { id: 'initial', name: 'Default value', isArray: false },
    { id: 'options', name: 'options', isArray: true },
    { id: 'rows', name: 'rows', isArray: true }
  ],
  [FormFieldType.Text]: [...commonFields],
  [FormFieldType.Textarea]: [...commonFields],
  [FormFieldType.Date]: [...commonFields],
  [FormFieldType.Select]: [...commonFields, { id: 'options', name: 'Options', isArray: true }],
  [FormFieldType.Number]: [...commonFields],
  [FormFieldType.Checkbox]: [...commonFields],
  [FormFieldType.CheckboxGroup]: [...commonFields],
  [FormFieldType.Radio]: [...commonFields],
  [FormFieldType.RadioBoolean]: [...commonFields],
  [FormFieldType.File]: [...commonFields],
  [FormFieldType.Password]: [...commonFields],
  [FormFieldType.Email]: [...commonFields],
  [FormFieldType.Phone]: [...commonFields],
  [FormFieldType.Likert]: [
    ...commonFields,
    { id: 'optionsTitle', name: 'Options Title', isArray: false },
    { id: 'option1', name: 'Option 1 Title', isArray: false },
    { id: 'option2', name: 'Option 2 Title', isArray: false },
    { id: 'option3', name: 'Option 3 Title', isArray: false },
    { id: 'option4', name: 'Option 4 Title', isArray: false },
    { id: 'option5', name: 'Option 5 Title', isArray: false },
    { id: 'rows', name: 'rows', isArray: true }
  ]
};

export const defaultOptionValues: { name: string; value: string }[] = [
  { name: 'Default Option', value: 'Default Value' },
  { name: 'Default Option2', value: 'Default Value2' }
];

export const controlsMap: Record<string, string[]> = {
  validators: ['type', 'value', 'errormsg'],
  options: ['name', 'value'],
  rows: ['name']
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

export const haveOptionsFieldTypes = ['select', 'checkbox-group', 'radio', 'radio-boolean'];

export const withoutValueValidatorTypes = ['required', 'requiredTrue', 'email'];
