import { FormOptionsMock } from '../models/form-constructor.model';

export const step1Data = {
  name: {
    type: 'text',
    label: 'Name',
    validators: [
      { type: 'required' },
      { type: 'minlength', value: 3, errormsg: 'Must be more than 3 characters' }
    ],
    classes: ['col-6', 'someClass']
  },
  birthdate: {
    type: 'date',
    label: 'Date of Birth',
    validators: [],
    classes: ['col-4']
  },
  file: {
    type: 'file',
    label: 'Add File',
    validators: []
  },
  gender: {
    type: 'radio',
    label: 'Gender',
    options: [
      { name: 'Male', value: 'Male' },
      { name: 'Female', value: 'Female' }
    ]
  }
};

export const step2Data = {
  terms: {
    type: 'checkbox',
    label: 'Agree to Terms',
    validators: [{ type: 'requiredTrue', errormsg: 'Must agree to terms' }]
  },
  country: {
    type: 'select',
    label: 'Country',
    validators: [{ type: 'required' }],
    options: [
      { name: 'USA', value: 'USA' },
      { name: 'Canada', value: 'Canada' },
      { name: 'UK', value: 'UK' }
    ]
  }
};

export const step3Data = {
  email: {
    type: 'email',
    label: 'Email',
    validators: [{ type: 'required' }, { type: 'email', errormsg: 'Invalid email format' }]
  },
  phone: {
    type: 'tel',
    label: 'Phone',
    validators: [
      { type: 'required' },
      { type: 'pattern', value: '^\\d{10}$', errormsg: 'Phone number must consist of 10 digits' }
    ]
  },
  information: {
    type: 'textarea',
    label: 'Additional Information',
    validators: []
  }
};

export const step4Data = {
  termsNigeria: {
    type: 'checkbox',
    label: 'Agree to Terms',
    validators: [{ type: 'requiredTrue' }]
  },
  countryNigeria: {
    type: 'select',
    label: 'Country',
    validators: [{ type: 'required' }],
    options: [
      { name: 'USA', value: 'USA' },
      { name: 'Canada', value: 'Canada' },
      { name: 'UK', value: 'UK' }
    ]
  },
  AccountTypeNigeria: {
    type: 'radio',
    label: 'Account Type',
    options: [
      { name: 'Personal', value: 'Personal' },
      { name: 'Business', value: 'Business' }
    ]
  }
};

export const formOptionsMock: FormOptionsMock = {
  formData: [
    {
      title: 'Step 1',
      data: step1Data
    },
    {
      title: 'Step 2',
      data: step2Data
    },
    {
      title: 'Step 3',
      data: step3Data
    }
  ],
  options: {
    name: 'formName',
    type: 'formType',
    country: 'NG'
  },
  uniqueFormData: [
    {
      title: 'Step Nigeria',
      countryCode: 'NG',
      step: 2,
      data: step4Data
    },
    {
      title: 'Step Ghana',
      countryCode: 'GH',
      step: 1,
      data: step4Data
    }
  ]
};
