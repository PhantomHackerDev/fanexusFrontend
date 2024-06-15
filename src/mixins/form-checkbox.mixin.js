import formInputMixin from '@/mixins/form-input.mixin';

export default {
  mixins: [formInputMixin],
  model: {
    prop: 'checked'
  },
  props: {
    checked: {
      type: [Array, Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    model: {
      get() {
        return this.checked;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
};
