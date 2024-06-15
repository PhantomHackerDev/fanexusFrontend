<template>
  <!-- take a conversation with @Vika if we need more editable field via props here -->
  <form class="sidebar-form">
    <form-input
      class="sidebar-form__name textarea big"
      :class="{ error: nameErrors.length }"
      type="textarea"
      name="Community Name"
      :placeholder="placeholderName"
      v-model="data.name"
      @input="clearError('name')"
    />
    <span
      class="error__message"
      v-for="(nameError, index) in nameErrors"
      :key="`${index}-${nameError.message}`"
      >{{ nameError.message }}</span
    >
    <form-input
      class="sidebar-form__description textarea small"
      :class="{ error: descriptionErrors.length }"
      type="textarea"
      name="Community description"
      :placeholder="placeholderDesc"
      v-model="data.description"
      @input="clearError('description')"
    />
    <span
      class="error__message"
      v-for="(descriptionError, index) in descriptionErrors"
      :key="`${index}-${descriptionError.message}`"
      >{{ descriptionError.message }}</span
    >
    <h4 class="sidebar-form__title">Create link</h4>
    <form-input
      class="sidebar-form__paste-link"
      :class="{ error: linkErrors.length }"
      type="text"
      name="Create link"
      placeholder="Create link"
      v-model="data.link"
      @input="clearError('link')"
    />
    <span
      class="error__message"
      v-for="(linkError, index) in linkErrors"
      :key="`${index}-${linkError.message}`"
      >{{ linkError.message }}</span
    >
    <h4 class="sidebar-form__title">{{ subtitle }}</h4>
    <div>
      <form-input
        v-for="(input, index) in data.links"
        :key="index"
        class="sidebar-form__paste-link"
        type="text"
        name="Paste link"
        placeholder="Paste link"
        v-model="data.links[index]"
      />
      <form-button
        :plus="true"
        class="sidebar-form__btn-add-link"
        text="+ add link"
        @click.native.stop="addLink"
      />
    </div>
    <div v-if="showButtons" class="sidebar-form__btns">
      <form-button @click.native.stop="goBack" text="Cancel" class="button" />
      <form-button
        @click.native.stop.prevent="emitFormData"
        type="submit"
        text="Save"
        class="button button--submit"
      />
    </div>
  </form>
</template>
<script>
import FormButton from './Buttons/FormButton';
import FormInput from '../common/Fields/FormInput';

export default {
  components: {
    FormButton,
    FormInput
  },
  props: {
    showButtons: {
      type: Boolean,
      default: false
    },
    placeholderName: {
      type: String,
      default: 'Community Name'
    },
    placeholderDesc: {
      type: String,
      default: 'Community Description'
    },
    errors: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => ({
        name: null,
        links: [],
        description: null
      })
    },
    subtitle: {
      type: String,
      default: 'My links'
    }
  },
  methods: {
    /** @TODO push just empty string, not object */
    addLink() {
      this.data.links.push('');
    },
    goBack() {
      this.$router.go(-1);
    },

    emitFormData() {
      const links = this.data.links
        .filter(item => item.link !== '')
        .map(item => item.link);
      this.$emit('save', { ...this.data, links });
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
  }
};
</script>
<style lang="scss" scoped>
.sidebar-form {
  background-color: var(--BG-blog-post);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  padding: var(--element-padding-s);
  color: var(--text-primary);
  font-size: var(--size-regular);

  &__name {
    margin-bottom: var(--element-margin-m);
    min-height: 90px;
  }

  &__description {
    margin-bottom: var(--element-margin-m);
  }

  &__title {
    font-size: var(--size-regular);
    font-family: 'OpenSans-Bold', sans-serif;
    color: var(--text-primary);
    margin-bottom: var(--element-margin-s);
  }
  &__paste-link {
    margin-bottom: var(--element-margin-m);
  }

  &__btns {
    display: flex;
    justify-content: space-between;
    padding: var(--element-padding-m) 0;
    border-top: var(--border-width-thin) solid var(--border-block);
    .button {
      width: 85px;
    }
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
