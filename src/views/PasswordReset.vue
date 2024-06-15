<template>
  <form class="password-reset">
    <h1 class="password-reset__title">Reset your password</h1>
    <form class="password-reset__form" @submit.prevent="onSubmit">
      <template v-if="!token">
        <p class="password-reset__description">
          Enter your email here and follow instructions on email
        </p>
        <form-input
          name="email"
          type="email"
          placeholder="Your email address"
          required
          v-model="email"
        />
        <div v-if="emailError" class="password-reset__error">
          {{ emailError }}
        </div>
      </template>
      <template v-else>
        <form-input
          class="password-reset__input"
          :class="{ error: newPasswordErrors.length }"
          labelText="New password"
          type="password"
          name="new-password"
          placeholder="New password"
          v-model="newPassword"
          required
        />
        <div
          class="password-reset__error"
          v-for="(newPasswordError, index) in newPasswordErrors"
          :key="`${index}-${newPasswordError.message}`"
        >
          {{ newPasswordError.message }}
        </div>
        <form-input
          class="password-reset__input"
          labelText="Confirm new password"
          type="password"
          name="confirm-new-password"
          placeholder="Confirm new password"
          v-model="confirmNewPassword"
          required
        />
      </template>
      <form-button type="submit" text="Reset" class="password-reset__button" />
    </form>
  </form>
</template>

<script>
import FormButton from '~common/Buttons/FormButton';
import FormInput from '~common/Fields/FormInput';
import validationMixin from '@/mixins/validation.mixin';
import { requestPasswordReset, passwordReset } from '@/services/auth.service';
import { mapActions } from 'vuex';

export default {
  components: {
    FormButton,
    FormInput
  },
  mixins: [validationMixin],
  data() {
    return {
      email: null,
      emailError: null,
      newPassword: '',
      confirmNewPassword: '',
      newPasswordErrors: []
    };
  },
  computed: {
    token() {
      return this.$route.query.resetKey;
    }
  },
  methods: {
    ...mapActions(['addFlashMessage']),
    async onSubmit() {
      if (!this.token) {
        this.emailError = null;
        try {
          await requestPasswordReset(this.email);
          this.addFlashMessage({
            message:
              "If the provided email has an account, a password reset link will be sent. Don't forget to check your junk!"
          });
          this.email = null;
        } catch ({ response }) {
          // Swallow the error so this appears the same
          //this.emailError = response.data.error;
          this.addFlashMessage({
            message:
              "If the provided email has an account, a password reset link will be sent. Don't forget to check your junk!"
          });
          this.email = null;
        }
      } else {
        this.newPasswordErrors = this.checkNewPasswords(
          this.newPassword,
          this.confirmNewPassword
        );
        if (!this.newPasswordErrors.length) {
          try {
            await passwordReset({
              resetKey: this.token,
              password: this.newPassword
            });
            this.addFlashMessage({ message: 'Password successfully updated.' });
            this.newPassword = null;
            this.confirmNewPassword = null;
          } catch ({ response }) {
            this.newPasswordErrors.push({ message: response.data });
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.password-reset {
  padding: var(--element-padding-l);
  grid-area: content;
  &__title {
    color: var(--text-primary);
  }
  &__form {
    margin-top: var(--element-margin-l);
    max-width: 400px;
  }
  &__description {
    color: var(--text-primary);
  }
  &__error {
    font-size: var(--size-small);
    color: var(--error);
    margin-bottom: var(--element-margin-m);
    &:first-letter {
      text-transform: uppercase;
    }
  }
  &__button {
    margin-top: var(--element-margin-m);
    width: 100%;
  }
  &__input {
    margin-top: var(--element-margin-m);
  }
}
</style>
