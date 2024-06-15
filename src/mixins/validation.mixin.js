export default {
  data() {
    return {
      messages: {
        passwordsMatch: 'Passwords must match',
        newPasswordsMatch: 'The new passwords do not match'
      },
      ...(!this.errors && { errors: {} })
    };
  },
  computed: {
    nameErrors() {
      return this.findErrors('name').map(nameError => ({
        ...nameError,
        ...(nameError.type === 'notNull Violation' && {
          message: 'The name is required.'
        })
      }));
    },
    linkErrors() {
      return this.findErrors('link').map(linkError => ({
        ...linkError,
        message:
          linkError.type === 'unique violation'
            ? `This link has already been taken.`
            : `The link is required.`
      }));
    },
    descriptionErrors() {
      return this.findErrors('description').map(descriptionError => ({
        ...descriptionError,
        ...(descriptionError.type === 'notNull Violation' && {
          message: 'The description is required.'
        })
      }));
    }
  },
  methods: {
    checkPasswords(formData, refs) {
      const { passwordsMatch } = this.messages;
      const { password, passwordConfirm } = formData;
      const { passwordConfirmRef } = refs;
      if (!passwordConfirmRef) return;
      const message = password !== passwordConfirm ? passwordsMatch : '';

      if (message) {
        this.$set(this.errors, 'password', { match: message });
      } else {
        this.$delete(this.errors, 'password');
      }
      const input = passwordConfirmRef.$el.querySelector('input');
      if (input) {
        input.setCustomValidity(message);
      }

      return !message;
    },
    checkNewPasswords(newPassword, confirmNewPassword) {
      return newPassword === confirmNewPassword
        ? []
        : [{ message: this.messages.newPasswordsMatch }];
    },
    checkClientValidation({ formData = this.formData, refs }) {
      if (!formData) return false;

      if (
        refs &&
        refs.passwordConfirmRef &&
        formData.password &&
        formData.passwordConfirm
      ) {
        return this.checkPasswords(formData, refs);
      }

      return true;
    },
    findErrors(path) {
      return this.errors.filter(function(error) {
        return error.path === path;
      });
    },
    clearError(path) {
      const index = this.errors.findIndex(error => error.path === path);
      if (index > -1) {
        this.errors.splice(
          this.errors.findIndex(error => error.path === path),
          1
        );
      }
    }
  }
};
