<template>
  <form class="settings" @submit.prevent="submitUserEdit" ref="form">
    <div class="settings-container">
      <!--<form-input
        class="settings__input"
        labelText="Email"
        name="email"
        placeholder="Email"
        v-model="email"
        />-->
      <form-input
        class="settings__input"
        labelText="Current password"
        type="password"
        name="current-password"
        placeholder="Current password"
        v-model="currentPassword"
      />
      <div
        class="error__message"
        v-for="(passwordError, index) in passwordErrors"
        :key="`${index}-${passwordError.message}`"
      >
        {{ passwordError.message }}
      </div>
      <form-input
        class="settings__input"
        :class="{ error: passwordErrors.length }"
        labelText="New password"
        type="password"
        name="new-password"
        placeholder="New password"
        v-model="newPassword"
      />
      <div
        class="error__message"
        v-for="(newPasswordError, index) in newPasswordErrors"
        :key="`${index}-${newPasswordError.message}`"
      >
        {{ newPasswordError.message }}
      </div>
      <form-input
        class="settings__input"
        labelText="Confirm new password"
        type="password"
        name="confirm-new-password"
        placeholder="Confirm new password"
        v-model="confirmNewPassword"
      />
      <div class="settings__buttons">
        <form-button class="settings__cancel-btn" type="reset" text="Cancel" />
        <form-button
          class="settings__save-btn"
          type="submit"
          text="Save"
          :disabled="disabled"
        />
      </div>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FormButton from '~common/Buttons/FormButton';
import FormInput from '~common/Fields/FormInput';
import validationMixin from '@/mixins/validation.mixin';

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FormButton,
    FormInput
  },
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      passwordErrors: [],
      newPasswordErrors: []
    };
  },
  computed: {
    ...mapState({
      currentEmail: state => state.auth.userData.email,
      currentUserId: state => state.auth.userData.id
    }),
    formData() {
      return {
        password: this.currentPassword,
        email: this.email,
        newPassword: this.newPassword,
        newPasswordAgain: this.confirmNewPassword
      };
    }
  },
  methods: {
    async submitUserEdit() {
      this.passwordErrors = [];
      this.newPasswordErrors = this.checkNewPasswords(
        this.newPassword,
        this.confirmNewPassword
      );
      if (!this.newPasswordErrors.length) {
        const payload = [this.currentUserId, this.formData];
        try {
          await this.updateUser(payload);
          this.$emit('success');
        } catch (e) {
          if (e.response.status === 401) {
            this.passwordErrors.push({
              message: 'The password is incorrect.'
            });
          }
        }
      }
    },
    ...mapActions(['updateUser'])
  },
  mounted() {
    this.email = this.currentEmail;
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.settings {
  &-container {
    background-color: var(--BG-blog-post);
    border-radius: var(--border-radius);
    padding: var(--element-padding-xl);
  }

  &__input {
    margin-bottom: var(--element-margin-l);
    border-radius: var(--border-radius);
    width: 680px;
    @include tablet {
      width: 100%;
    }
  }
  &__cancel-btn {
    margin-right: var(--element-margin-m);
    min-width: 90px;
  }

  &__save-btn {
    min-width: 90px;
  }

  .error__message {
    font-size: var(--size-small);
    color: var(--error);
    margin-bottom: var(--element-margin-m);
    &:first-letter {
      text-transform: uppercase;
    }
  }
}

::v-deep {
  input {
    background-color: var(--BG-blog-post);
  }
}
</style>
