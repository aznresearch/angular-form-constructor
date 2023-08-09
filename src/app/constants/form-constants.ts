export const step1Data = {
  name: {
    type: 'text',
    label: 'Имя',
    validators: [
      { type: 'required' },
      { type: 'minLength', value: 3, errormsg: 'Minimum length should be 3 characters' }
    ]
  },
  birthdate: {
    type: 'date',
    label: 'Дата рождения',
    validators: [{ type: 'required' }]
  }
};

export const step2Data = {
  terms: {
    type: 'checkbox',
    label: 'Согласен с условиями',
    validators: [
      { type: 'required' },
      { type: 'minLength', value: 3, errormsg: 'Minimum length should be 3 characters' }
    ]
  },
  country: {
    type: 'dropdown',
    label: 'Дата рождения',
    validators: [{ type: 'required' }],
    options: ['USA', 'Canada', 'UK']
  }
};

export const formOptionsMock = [
  {
    title: 'Step 1',
    data: step1Data
  },
  {
    title: 'Step 2',
    data: step2Data
  }
];
