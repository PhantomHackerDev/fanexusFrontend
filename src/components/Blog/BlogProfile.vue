<template>
  <div class="edit-blog">
    <form class="settings" ref="form">
      <div class="settings-container">
        <h3 class="edit-blog__title">Title</h3>
        <form-input
          class="edit-blog__title"
          :class="{ error: nameErrors.length }"
          type="text"
          name="Blog Name"
          placeholder="Blog name"
          v-model="currentData.name"
          @input="clearError('name')"
        />
        <span
          class="error__message"
          v-for="(nameError, index) in nameErrors"
          :key="`${index}-${nameError.message}`"
          >{{ nameError.message }}</span
        >
        <h3 class="edit-blog__title">Tags</h3>
        <p class="note">
          Tags only affect searching for blogs.
          <router-link class="note-link" :to="{ name: 'tagging-basics' }"
            >(Tagging guide)</router-link
          >
        </p>
        <tag-input
          :list="currentData.Tags"
          placeholder="Add tag"
          @list-change="currentData.Tags = $event"
        />
        <h3 class="edit-blog__title">Description</h3>
        <form-rich-text-editor
          class="edit-blog__description"
          :class="{ error: descriptionErrors.length }"
          v-model="currentData.description"
          placeholder="Blog description"
          @input="clearError('description')"
          @space-remaining="$emit('space-remaining', $event)"
        />
        <span
          class="error__message"
          v-for="(descriptionError, index) in descriptionErrors"
          :key="`${index}-${descriptionError.message}`"
          >{{ descriptionError.message }}</span
        >
        <h3 class="edit-blog__title">Blog url</h3>
        <form-input
          class="edit-blog__url"
          :class="{ error: linkErrors.length }"
          type="text"
          name="Set blog URL"
          placeholder="Set blog URL"
          v-model="currentData.link"
          @input="clearError('link')"
        />
        <span
          class="error__message"
          v-for="(linkError, index) in linkErrors"
          :key="`${index}-${linkError.message}`"
          >{{ linkError.message }}</span
        >
        <h3 class="edit-blog__title">Website</h3>
        <div>
          <div
            class="edit-blog__website-item"
            v-for="(input, index) in currentData.links"
            :key="index"
          >
            <form-rich-text-editor
              class="edit-blog__link"
              placeholder="Create link"
              v-model="currentData.links[index]"
              @space-remaining="
                $emit('space-remaining-links', { index, space: $event })
              "
            />
            <form-button
              class="edit-blog__remove-button"
              text="Remove link"
              @click.native.stop="removeLink(index)"
            />
          </div>
          <form-button
            :plus="true"
            class="edit-blog__add-link"
            text="+ add link"
            @click.native.stop="addLink"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import FormInput from '~common/Fields/FormInput';
import FormButton from '~common/Buttons/FormButton';
import TagInput from '~common/Fields/TagInput';
import validationMixin from '@/mixins/validation.mixin';
import { modelProxy } from '@/utils/proxy';
import FormRichTextEditor from '~common/Fields/FormRichTextEditor';

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    errors: {
      type: Array,
      required: true
    }
  },
  model: {
    prop: 'data'
  },
  components: {
    FormInput,
    FormButton,
    TagInput,
    FormRichTextEditor
  },
  mixins: [validationMixin],
  computed: {
    currentData() {
      return modelProxy(this, 'data');
    }
  },
  methods: {
    addLink() {
      this.currentData.links.push('');
    },
    removeLink(index) {
      this.currentData.links.splice(index, 1);
    },
    clearError(path) {
      this.$emit('clear-error', path);
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-blog {
  &__title {
    margin-top: var(--element-margin-m);
    color: var(--text-primary);
  }

  &__link {
    flex-grow: 1;
  }

  &__website-item {
    align-items: center;
    margin-bottom: var(--element-margin-m);
    border: var(--border-width-default) solid var(--activity-divider);
    border-radius: var(--border-radius);
    padding: 0 var(--element-padding-m) var(--element-padding-s);
  }
}

.note {
  color: var(--text-primary);
  margin-top: var(--element-margin-s);
  font-size: var(--size-small);

  &-link {
    color: var(--text-secondary);
    text-decoration: none;
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
