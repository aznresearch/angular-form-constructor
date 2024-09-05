import {
  ConditionalLogicBlock,
  Field,
  FormFieldBooleanKeys
} from '../models/form-constructor.model';

export enum FormFieldType {
  Text = 'text',
  Textarea = 'textarea',
  Date = 'date',
  Select = 'select',
  Number = 'number',
  Checkbox = 'checkbox',
  CheckboxGroup = 'checkbox-group',
  Radio = 'radio',
  NeedContact = 'need-contact',
  File = 'file',
  Password = 'password',
  Email = 'email',
  Phone = 'phone',
  Likert = 'likert',
  Csat = 'csat',
  NPS = 'nps',
  QE = 'qe',
  ContactName = 'contact-name',
  ContactSurname = 'contact-surname',
  ContactEmail = 'contact-email',
  ContactPhone = 'contact-phone',
  CountryDropdown = 'country-dropdown'
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
  FormFieldType.NeedContact,
  FormFieldType.File,
  FormFieldType.Password,
  FormFieldType.Email,
  FormFieldType.Phone,
  FormFieldType.Likert,
  FormFieldType.Csat,
  FormFieldType.NPS,
  FormFieldType.QE
];

export const surveyFieldTypes: FormFieldType[] = [
  FormFieldType.Text,
  FormFieldType.Textarea,
  FormFieldType.Date,
  FormFieldType.Select,
  FormFieldType.Number,
  FormFieldType.Checkbox,
  FormFieldType.CheckboxGroup,
  FormFieldType.Radio,
  FormFieldType.NeedContact,
  FormFieldType.Email,
  FormFieldType.Likert,
  FormFieldType.Csat,
  FormFieldType.NPS,
  FormFieldType.QE,
  FormFieldType.ContactName,
  FormFieldType.ContactSurname,
  FormFieldType.ContactEmail,
  FormFieldType.ContactPhone,
  FormFieldType.CountryDropdown
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
  [FormFieldType.NeedContact]: 'Need Contact',
  [FormFieldType.File]: 'File Attachment',
  [FormFieldType.Password]: 'Password',
  [FormFieldType.Email]: 'Email',
  [FormFieldType.Phone]: 'Phone Number',
  [FormFieldType.Likert]: 'Likert Scale',
  [FormFieldType.Csat]: 'CSAT Scale',
  [FormFieldType.NPS]: 'NPS Scale',
  [FormFieldType.QE]: 'QE Scale',
  [FormFieldType.ContactName]: 'Contact Name',
  [FormFieldType.ContactSurname]: 'Contact Surname',
  [FormFieldType.ContactEmail]: 'Contact Email',
  [FormFieldType.ContactPhone]: 'Contact Phone',
  [FormFieldType.CountryDropdown]: 'Country'
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
  { id: 'active', name: 'Active', isArray: false },
  { id: 'name', name: 'Name', isArray: false },
  { id: 'classes', name: 'Classes', isArray: false, placeholder: 'e.g., class1 class2' },
  { id: 'placeholder', name: 'Placeholder', isArray: false },
  { id: 'title', name: 'Title', isArray: false },
  { id: 'description', name: 'Description', isArray: false },
  { id: 'validators', name: 'Validators', isArray: true },
  { id: 'required', name: 'Required', isArray: false },
  { id: 'warningMessage', name: 'Warning message', isArray: false },
  { id: 'analyticsTitle', name: 'Analytics title', isArray: false },
  { id: 'step', name: 'Move to step', isArray: false }
];

export const fieldsByType: Record<string, Field[]> = {
  [FormFieldType.Text]: [...commonFields],
  [FormFieldType.Textarea]: [...commonFields],
  [FormFieldType.Date]: [...commonFields],
  [FormFieldType.Select]: [
    ...commonFields,
    { id: 'options', name: 'Options', isArray: true },
    { id: 'hasOther', name: 'Has other', isArray: false }
  ],
  [FormFieldType.Number]: [...commonFields],
  [FormFieldType.Checkbox]: [...commonFields],
  [FormFieldType.CheckboxGroup]: [
    ...commonFields,
    { id: 'options', name: 'Options', isArray: true },
    { id: 'hasOther', name: 'Has other', isArray: false }
  ],
  [FormFieldType.Radio]: [
    ...commonFields,
    { id: 'options', name: 'Options', isArray: true },
    { id: 'hasOther', name: 'Has other', isArray: false }
  ],
  [FormFieldType.NeedContact]: [...commonFields, { id: 'options', name: 'Options', isArray: true }],
  [FormFieldType.File]: [...commonFields],
  [FormFieldType.Password]: [...commonFields],
  [FormFieldType.Email]: [...commonFields],
  [FormFieldType.Phone]: [...commonFields],
  [FormFieldType.Likert]: [
    ...commonFields,
    { id: 'optionsTitle', name: 'Options Title', isArray: false },
    { id: 'options', name: 'Options', isArray: true },
    { id: 'rows', name: 'rows', isArray: true }
  ],
  [FormFieldType.Csat]: [
    ...commonFields,
    { id: 'firstAnswer', name: 'First answer', isArray: false },
    { id: 'lastAnswer', name: 'Last answer', isArray: false }
  ],
  [FormFieldType.NPS]: [
    ...commonFields,
    { id: 'commentTitle', name: 'Comment question', isArray: false },
    { id: 'commentSubtitle', name: 'Comment question subtitle', isArray: false },
    { id: 'commentWarningMessage', name: 'Comment warning message', isArray: false },
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
  ],
  [FormFieldType.ContactName]: [...commonFields],
  [FormFieldType.ContactSurname]: [...commonFields],
  [FormFieldType.ContactEmail]: [...commonFields],
  [FormFieldType.ContactPhone]: [...commonFields],
  [FormFieldType.CountryDropdown]: [...commonFields]
};

export const defaultOptionValues: { name: string; value: string }[] = [];

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

export const haveOptionsFieldTypes = [
  'select',
  'checkbox-group',
  'radio',
  'likert',
  'need-contact'
];

export const withoutValueValidatorTypes = ['required', 'requiredTrue', 'email'];

export const booleanFields: FormFieldBooleanKeys[] = ['active', 'required', 'hasOther'];
