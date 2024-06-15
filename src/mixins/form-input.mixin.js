export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: undefined
    },
    timeoutDelay: {
      type: Number,
      default: 1000
    },
    id: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeout: null
    };
  },
  methods: {
    handleDebounceInput(e, value) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.$emit('input', value);
      }, this.timeoutDelay);
    },
    handleInput(e) {
      const value = e.currentTarget.value;

      if (this.type === 'search') {
        this.handleDebounceInput(e, value);
      } else {
        this.$emit('input', value);
      }
    }
  }
};
