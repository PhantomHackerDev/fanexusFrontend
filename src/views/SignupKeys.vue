<template>
  <article class="signup-keys">
    <flash-message v-if="success">{{ successMessage }}</flash-message>
    <div class="signup-keys__create">
      <h2 class="signup-keys__create-header">Create new signup key</h2>
      <form class="signup-keys__create-form" @submit.prevent="createSignupKey">
        <form-input
          labelText="Email of the new user"
          name="email"
          placeholder="Email"
          v-model="email"
          :class="{ error }"
          @input="clearError"
        />
        <div class="error__message" v-if="error">{{ error }}</div>
        <form-button
          type="submit"
          text="Create signup key"
          :disabled="success"
        />
      </form>
      <div class="signup-keys__email-template" v-if="newKey">
        Email template:
        <form-button
          type="button"
          text="Copy to clipboard"
          @click.native.stop="copyEmailToClipboard"
          :small="true"
        />
        <pre
          class="signup-keys__email-template-text"
          v-html="emailTemplate(newKey)"
        />
      </div>
    </div>
    <div class="signup-keys__display">
      <h2 class="signup-keys__display-header">Unused signup keys</h2>
      <table class="signup-keys__table">
        <thead class="signup-keys__table-head">
          <tr>
            <th class="signup-keys__item">Email</th>
            <th class="signup-keys__item">Key</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="signup-keys__table-row"
            v-for="({ id, email, key }, index) of signupKeys"
            :key="`${id}-${index}`"
          >
            <td class="signup-keys__item">{{ email }}</td>
            <td class="signup-keys__item">{{ key }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>

<script>
import {
  getSignupKeys,
  createSignupKey,
  emailTemplate
} from '@/services/signup-key.service';
import FormButton from '~common/Buttons/FormButton';
import FormInput from '~common/Fields/FormInput';
import formMessagesMixin from '@/mixins/form-messages.mixin';

export default {
  components: {
    FormButton,
    FormInput
  },
  data() {
    return {
      signupKeys: [],
      creating: false,
      successMessage: 'Successfully created signup key',
      successRemoveTime: 2000,
      email: '',
      showEmailTemplate: false,
      emailTemplate,
      newKey: '',
      error: null
    };
  },
  mixins: [formMessagesMixin],
  methods: {
    async getData() {
      this.signupKeys = await getSignupKeys();
    },
    async createSignupKey() {
      if (!this.creating) {
        this.creating = true;
        try {
          const newKey = await createSignupKey({
            email: this.email.trim().toLowerCase()
          });
          this.newKey = newKey.key;
          this.showSuccess();
          await this.getData();
          this.email = '';
        } catch (e) {
          this.error = 'User already exists or signup key already created';
        }
        this.creating = false;
      }
    },
    clearError() {
      this.error = null;
    },
    copyEmailToClipboard() {
      navigator.clipboard.writeText(emailTemplate(this.newKey));
    }
  },
  async mounted() {
    await this.getData();
  }
};
</script>

<style lang="scss" scoped>
.signup-keys {
  overflow-y: auto;
  margin-top: var(--element-margin-m);

  &__create {
    border: var(--border-width-default) solid var(--border-block);
    background-color: var(--BG-blog-post);
    padding: var(--element-padding-s);
    border-radius: var(--border-radius);

    &-header {
      color: var(--text-primary);
      text-align: center;
    }
    &-form {
      margin: 0 auto;
      max-width: var(--width-large);
    }
    ::v-deep {
      input {
        border: var(--border-width-default) solid;
        border-color: var(--border-input-normal);
        margin-bottom: var(--element-margin-s);
      }
    }
  }
  &__email-template {
    max-width: var(--width-large);
    border: var(--border-width-thin) solid var(--border-active);
    color: var(--text-primary);
    margin: 0 auto;
    padding: var(--element-margin-s);
    margin-top: var(--element-margin-s);

    &-text {
      white-space: pre-wrap;
      margin-top: var(--element-margin-s);
    }
  }
  &__display {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: var(--border-width-default) solid var(--border-block);
    background-color: var(--BG-blog-post);
    margin-top: var(--element-margin-m);
    padding: var(--element-padding-m);
    border-radius: var(--border-radius);

    &-header {
      color: var(--text-primary);
    }
  }
  &__table {
    color: var(--text-primary);
    max-width: var(--width-large);

    &-head {
      font-weight: bold;
    }
    &-row:nth-child(even) {
      background-color: var(--BG-repost);
    }
  }
  &__item {
    padding: var(--element-padding-xs) var(--element-padding-s);
  }
}

.error__message {
  font-size: var(--size-small);
  color: var(--error);
  margin-bottom: var(--element-margin-m);
  &:first-letter {
    text-transform: uppercase;
  }
}

::v-deep .error {
  margin-bottom: var(--element-margin-xs);
  input,
  textarea {
    border-color: var(--border-input-error);
  }
}
</style>
