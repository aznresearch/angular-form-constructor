export const formOptionsMock = [
  { type: 'text', label: 'Имя', name: 'name', validators: [{ type: 'required' }] },
  { type: 'date', label: 'Дата рождения', name: 'birthdate', validators: [{ type: 'required' }] },
  {
    type: 'checkbox',
    label: 'Согласен с условиями',
    name: 'terms',
    validators: [{ type: 'required' }]
  },
  {
    type: 'dropdown',
    label: 'Страна',
    name: 'country',
    validators: [{ type: 'required' }],
    options: ['USA', 'Canada', 'UK']
  },
  {
    type: 'controlWithLabel',
    label: 'Описание',
    name: 'description',
    validators: [{ type: 'required' }, { type: 'minLength', value: 10 }]
  },
  {
    type: 'dropZone',
    label: 'Загрузить документ',
    name: 'document',
    validators: [{ type: 'required' }]
  }
];
