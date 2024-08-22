import { ConditionalLogicBlock, Field } from '../models/form-constructor.model';

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
  Csat = 'csat',
  NPS = 'nps',
  QE = 'qe'
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
  FormFieldType.Likert,
  FormFieldType.Csat,
  FormFieldType.NPS,
  FormFieldType.QE
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
  [FormFieldType.Csat]: 'CSAT Scale',
  [FormFieldType.NPS]: 'NPS Scale',
  [FormFieldType.QE]: 'QE Scale'
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

const commonFields: Field[] = [
  { id: 'name', name: 'Name', isArray: false },
  { id: 'classes', name: 'Classes', isArray: false, placeholder: 'e.g., class1 class2' },
  { id: 'placeholder', name: 'Placeholder', isArray: false },
  { id: 'title', name: 'Title', isArray: false },
  { id: 'subtitle', name: 'Subtitle', isArray: false },
  { id: 'validators', name: 'Validators', isArray: true }
];

export const fieldsByType: Record<string, Field[]> = {
  [FormFieldType.Text]: [...commonFields],
  [FormFieldType.Textarea]: [...commonFields],
  [FormFieldType.Date]: [...commonFields],
  [FormFieldType.Select]: [...commonFields, { id: 'options', name: 'Options', isArray: true }],
  [FormFieldType.Number]: [...commonFields],
  [FormFieldType.Checkbox]: [...commonFields],
  [FormFieldType.CheckboxGroup]: [
    ...commonFields,
    { id: 'options', name: 'Options', isArray: true }
  ],
  [FormFieldType.Radio]: [...commonFields, { id: 'options', name: 'Options', isArray: true }],
  [FormFieldType.RadioBoolean]: [
    ...commonFields,
    { id: 'options', name: 'Options', isArray: true }
  ],
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
  ],
  [FormFieldType.Csat]: [...commonFields],
  [FormFieldType.NPS]: [
    ...commonFields,
    { id: 'commentTitle', name: 'Comment question', isArray: false },
    { id: 'commentSubtitle', name: 'Comment question subtitle', isArray: false },
    { id: 'firstAnswer', name: 'First answer', isArray: false },
    { id: 'lastAnswer', name: 'Last answer', isArray: false }
  ],
  [FormFieldType.QE]: [
    ...commonFields,
    { id: 'firstAnswer', name: 'First answer', isArray: false },
    { id: 'lastAnswer', name: 'Last answer', isArray: false },
    {
      id: 'qeScales',
      name: 'QE Scales',
      isArray: true,
      children: [
        {
          id: 'qeScaleChildren',
          name: 'QE Scales Children',
          isArray: true,
          parentArray: 'qeScales'
        }
      ]
    }
  ]
};

export const defaultOptionValues: { name: string; value: string }[] = [
  { name: 'Default Option', value: 'Default Value' },
  { name: 'Default Option2', value: 'Default Value2' }
];

export const controlsMap: Record<string, string[]> = {
  validators: ['type', 'value', 'errormsg'],
  options: ['name', 'value'],
  rows: ['name'],
  qeScales: ['title', 'subtitle', 'qeScaleChildren'],
  qeScaleChildren: ['title']
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
