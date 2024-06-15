import FlashMessage from '~common/FlashMessage';

export default {
  components: {
    FlashMessage
  },
  data() {
    return {
      success: false,
      successMessage: 'Successfully saved.',
      successRemoveTime: 10000,
      successRemove: null
    };
  },
  methods: {
    showSuccess() {
      clearTimeout(this.successRemove);
      this.success = true;
      this.successRemove = setTimeout(
        () => (this.success = false),
        this.successRemoveTime
      );
    }
  }
};
