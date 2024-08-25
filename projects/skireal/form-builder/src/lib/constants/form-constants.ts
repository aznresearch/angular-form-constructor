import { FormOptionsFull } from '../models/form-constructor.model';

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
