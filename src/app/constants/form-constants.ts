export const step1Data = {
  name: {
    type: 'text',
    label: 'Имя',
    validators: [
      { type: 'required' },
      { type: 'minLength', value: 3, errormsg: 'Минимальная длина - 3 символа' }
    ],
    classes: ['col-6', 'someClass']
  },
  birthdate: {
    type: 'date',
    label: 'Дата рождения',
    validators: [],
    classes: ['col-4']
  },
  file: {
    type: 'file',
    label: 'Добавьте файл',
    validators: []
  },
  gender: {
    type: 'radio',
    label: 'Пол',
    options: ['Мужской', 'Женский']
  }
};

export const step2Data = {
  terms: {
    type: 'checkbox',
    label: 'Согласен с условиями',
    validators: [{ type: 'requiredTrue' }]
  },
  country: {
    type: 'select',
    label: 'Страна',
    validators: [{ type: 'required' }],
    options: ['USA', 'Canada', 'UK']
  }
};

export const step3Data = {
  email: {
    type: 'email',
    label: 'Email',
    validators: [{ type: 'required' }, { type: 'email', errormsg: 'Неверный формат email' }]
  },
  phone: {
    type: 'tel',
    label: 'Телефон',
    validators: [
      { type: 'required' },
      { type: 'pattern', value: '/^d{10}$/', errormsg: 'Номер телефона должен состоять из 10 цифр' }
    ]
  },
  information: {
    type: 'textarea',
    label: 'Доп.информация',
    validators: []
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
  },
  {
    title: 'Step 3',
    data: step3Data
  }
];
