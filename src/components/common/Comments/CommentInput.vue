<!-- @TODO revise if we can include this component in the parent as it is -->
<template>
  <div class="comments-input">
    <form-rich-text-editor
      ref="richTextEditor"
      :value="newComment"
      @input="comment => $emit('input', comment)"
      @space-remaining="updateSpaceRemaining"
      @text-length="updateTextLength"
      @submit="sendComment"
    >
      <button
        type="button"
        @click="sendComment"
        class="comments-input-textarea__submit"
        :disabled="spaceRemaining < 0 || !textLength"
      >
        {{ editing ? 'Update' : 'Comment' }}
      </button>
    </form-rich-text-editor>
  </div>
</template>

<script>
import FormRichTextEditor from '~fields/FormRichTextEditor';

export default {
  components: {
    FormRichTextEditor
  },
  props: {
    newComment: {
      type: String
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      spaceRemaining: 0,
      textLength: 0
    };
  },
  methods: {
    updateSpaceRemaining(value) {
      this.spaceRemaining = value;
      this.$emit('space-remaining', value);
    },
    updateTextLength(value) {
      this.textLength = value;
      this.$emit('text-length', value);
    },
    sendComment() {
      this.$emit('createComment');
    }
  },
  watch: {
    newComment: {
      handler(n) {
        if (n === '') {
          this.$refs.richTextEditor.setInnerHtml(n);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.comments-input {
  &-textarea__submit {
    height: 50px;
    background-color: var(--BG-button-comment);
    padding: 0 var(--element-padding-l);
    border-radius: var(--border-radius);
    color: var(--text-button-comment);
    font-family: 'OpenSans-Bold';
    font-size: var(--size-button);
    text-transform: capitalize;
    margin-left: var(--element-margin-s);
    min-width: 100px;
    @include mobile {
      margin-left: 0;
      width: 100%;
    }
    &:focus {
      outline: none;
      color: var(--text-button-hover);
    }
    &:disabled {
      background-color: var(--BG-button-inactive);
      cursor: not-allowed;
    }
  }
}
</style>
