import FormInput from '~fields/FormInput';
import FormCheckbox from '~fields/FormCheckbox';
import DateDropdown from 'vue-date-dropdown';

export default {
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  components: { FormInput, FormCheckbox, DateDropdown }
};
