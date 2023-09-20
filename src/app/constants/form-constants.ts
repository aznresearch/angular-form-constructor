import { FormOptionsFull } from '../models/form-constructor.model';

// export const step1Data = {
//   name: {
//     id: 'name',
//     name: 'name',
//     type: 'text',
//     label: 'Name',
//     validators: [
//       { type: 'required' },
//       { type: 'minlength', value: 3, errormsg: 'Must be more than 3 characters' }
//     ],
//     classes: ['col-6', 'someClass']
//   },
//   birthdate: {
//     id: 'birthdate',
//     name: 'birthdate',
//     type: 'date',
//     label: 'Date of Birth',
//     validators: [],
//     classes: ['col-4']
//   },
//   file: {
//     id: 'file',
//     name: 'file',
//     type: 'file',
//     label: 'Add File',
//     validators: []
//   },
//   gender: {
//     id: 'gender',
//     name: 'gender',
//     type: 'radio',
//     label: 'Gender',
//     options: [
//       { name: 'Male', value: 'Male' },
//       { name: 'Female', value: 'Female' }
//     ]
//   }
// };

// export const step2Data = {
//   terms: {
//     id: 'terms',
//     name: 'terms',
//     type: 'checkbox',
//     label: 'Agree to Terms',
//     validators: [{ type: 'requiredTrue', errormsg: 'Must agree to terms' }]
//   },
//   country: {
//     id: 'country',
//     name: 'country',
//     type: 'select',
//     label: 'Country',
//     validators: [{ type: 'required' }],
//     options: [
//       { name: 'USA', value: 'USA' },
//       { name: 'Canada', value: 'Canada' },
//       { name: 'UK', value: 'UK' }
//     ]
//   }
// };

// export const step3Data = {
//   email: {
//     id: 'email',
//     name: 'email',
//     type: 'email',
//     label: 'Email',
//     validators: [{ type: 'required' }, { type: 'email', errormsg: 'Invalid email format' }]
//   },
//   phone: {
//     id: 'phone',
//     name: 'phone',
//     type: 'tel',
//     label: 'Phone',
//     validators: [
//       { type: 'required' },
//       { type: 'pattern', value: '^\\d{10}$', errormsg: 'Phone number must consist of 10 digits' }
//     ]
//   },
//   information: {
//     id: 'information',
//     name: 'information',
//     type: 'textarea',
//     label: 'Additional Information',
//     validators: []
//   }
// };

// export const step4Data = {
//   termsNigeria: {
//     id: 'termsNigeria',
//     name: 'termsNigeria',
//     type: 'checkbox',
//     label: 'Agree to Terms',
//     validators: [{ type: 'requiredTrue' }]
//   },
//   countryNigeria: {
//     id: 'countryNigeria',
//     name: 'countryNigeria',
//     type: 'select',
//     label: 'Country',
//     validators: [{ type: 'required' }],
//     options: [
//       { name: 'USA', value: 'USA' },
//       { name: 'Canada', value: 'Canada' },
//       { name: 'UK', value: 'UK' }
//     ]
//   },
//   AccountTypeNigeria: {
//     id: 'AccountTypeNigeria',
//     name: 'AccountTypeNigeria',
//     type: 'radio',
//     label: 'Account Type',
//     options: [
//       { name: 'Personal', value: 'Personal' },
//       { name: 'Business', value: 'Business' }
//     ]
//   }
// };

// export const formOptionsMock: FormOptionsFull = {
//   formData: [
//     {
//       title: 'Step 1',
//       data: step1Data
//     },
//     {
//       title: 'Step 2',
//       data: step2Data
//     },
//     {
//       title: 'Step 3',
//       data: step3Data
//     }
//   ],
//   options: {
//     name: 'formName',
//     type: 'formType',
//     country: 'NG'
//   },
//   uniqueFormData: [
//     {
//       title: 'Step Nigeria',
//       countryCode: 'NG',
//       step: 2,
//       data: step4Data
//     },
//     {
//       title: 'Step Ghana',
//       countryCode: 'GH',
//       step: 1,
//       data: step4Data
//     }
//   ]
// };

export const defaultFormOptionsObject: FormOptionsFull = {
  formData: {
    steps: [
      {
        addedFields: [
          {
            id: 'id',
            name: 'name',
            title: 'title'
          }
        ],
        conditionalLogicBlocks: []
      }
    ],
    generalFields: []
  },
  options: {
    name: 'formName',
    type: 'formType',
    country: 'NG'
  },
  uniqueFormData: []
};
