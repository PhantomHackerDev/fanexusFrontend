<template>
  <div class="rich-text-editor">
    <ul class="rich-text-editor__social-links active">
      <li v-for="a in mediaActions" :key="a.id">
        <template v-if="a.type === actions.uploadImage">
          <!-- @TODO provide only $event to the handleExecCommand method -->
          <label>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg, image/gif, image/png"
              v-show="false"
              @change="uploadImage($event)"
              multiple
            />
            <component :is="a.icon" />
          </label>
        </template>
        <!-- <button type="button" v-else-if="a.type === actions.createLink" @click="() => handleExecCommand(a.type)">
          <component :is="a.icon" />
        </button> -->
        <button type="button" v-else @click="() => handleExecCommand(a.type)">
          <component :is="a.icon" />
        </button>
      </li>
    </ul>
    <!-- @TODO add proper condition on v-if -->
    <div v-if="false" class="rich-text-editor__image">
      <!-- @TODO make it dynamic -->
      <!-- @TODO remove height -->
      <img
        height="4"
        src="https://i.pinimg.com/originals/2b/52/7d/2b527dfbe670cd5a746425eb30e2740d.jpg"
        alt="downloaded-image"
      />
      <button type="button" class="rich-text-editor__delete-btn">
        Delete image
      </button>
    </div>
    <ul class="rich-text-editor__tools active">
      <li class="rich-text-editor__item" v-for="c in commands" :key="c.id">
        <button type="button" @click.stop="() => handleExecCommand(c.type)">
          <component :is="c.icon" />
        </button>
      </li>
    </ul>
    <div class="textarea-container">
      <div
        ref="editorArea"
        contenteditable
        class="textarea"
        :data-placeholder="placeholder"
        @input="handleInput"
        @keydown.ctrl.enter="$emit('submit')"
        @keydown.enter.exact="exitBlockquote($event)"
        @keydown.backspace.exact="exitBlockquote($event, true, true)"
        @keydown.delete.exact="exitBlockquote($event, true)"
        @paste.prevent="pasteAsHtml"
      ></div>
      <!--  -->
      <slot />
    </div>
    <div
      class="rich-text-editor__limit-notice"
      :class="{ 'over-limit': spaceRemaining < 0 }"
    >
      Space used: {{ spaceUsed }}/{{ sizeLimit }} ({{ spaceRemaining }} left)
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import {
  commands,
  mediaActions,
  getQueryCommandState,
  execCommand,
  actions,
  exitBlockquote,
  uploadImage,
  nodeTypes
} from '@/services/rich-text-editor.service';
import linkifyHtml from 'linkifyjs/html';
// media
import LinkIcon from '~svg/media/link.svg';
import ImageIcon from '~svg/media/image.svg';
import MediaIcon from '~svg/media/media.svg';

// commands
import Bold from '~svg/text-editing/bold.svg';
import InsertUnorderedList from '~svg/text-editing/insertUnorderedList.svg';
import FormatBlockH1 from '~svg/text-editing/formatBlockH1.svg';
import FormatBlockH2 from '~svg/text-editing/formatBlockH2.svg';
import Italic from '~svg/text-editing/italic.svg';
import InsertOrderedList from '~svg/text-editing/insertOrderedList.svg';
import Sentencecase from '~svg/text-editing/sentencecase.svg';
import StrikeThrough from '~svg/text-editing/strikeThrough.svg';
import Subscript from '~svg/text-editing/subscript.svg';
import Superscript from '~svg/text-editing/superscript.svg';
import Underline from '~svg/text-editing/underline.svg';
import Quote from '~svg/text-editing/quote.svg';

export default {
  components: {
    LinkIcon,
    ImageIcon,
    MediaIcon,
    Bold,
    InsertUnorderedList,
    FormatBlockH1,
    FormatBlockH2,
    Italic,
    InsertOrderedList,
    Sentencecase,
    StrikeThrough,
    Subscript,
    Superscript,
    Underline,
    Quote
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Type your comment here'
    }
  },
  data() {
    return {
      formatBlock: 'p',
      commands,
      mediaActions,
      actions,
      sizeLimit: 128 * 1024,
      errors: [],
      showErrorTime: 5000
    };
  },
  computed: {
    spaceUsed() {
      return new TextEncoder().encode(this.value).length;
    },
    spaceRemaining() {
      return this.sizeLimit - this.spaceUsed;
    }
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.innerHTML);
      this.$nextTick(this.emitTextInfo);
    },
    emitTextInfo() {
      this.$emit('space-remaining', this.spaceRemaining);
      this.$emit(
        'text-length',
        this.$refs.editorArea.textContent.trim().length +
          this.$refs.editorArea.getElementsByTagName('img').length +
          this.$refs.editorArea.getElementsByTagName('iframe').length
      );
    },
    setInnerHtml(html) {
      this.$refs.editorArea.innerHTML = html;
    },
    imageUploadCallback(img) {
      this.$refs.editorArea.appendChild(img);
      this.$emit('input', this.$refs.editorArea.innerHTML);
      this.$refs.fileInput[0].value = '';
    },
    async uploadImage(event) {
      try {
        await uploadImage(
          this.$refs.editorArea,
          event,
          this.imageUploadCallback
        );
        this.emitTextInfo();
      } catch (e) {
        this.addFlashMessage({
          message: 'Image upload failed.',
          type: 'failure'
        });
      }
    },
    handleExecCommand(type) {
      /** @TODO revise params, use object instead of array */
      switch (type) {
        case actions.formatBlockH1:
          this.formatBlock = this.findFormatBlock('h1') ? 'p' : 'h1';
          break;
        case actions.formatBlockH2:
          this.formatBlock = this.findFormatBlock('h2') ? 'p' : 'h2';
          break;
        case actions.formatBlockquote:
          (block => {
            type = block ? 'outDent' : type;
            this.formatBlock = block ? 'p' : 'blockquote';
          })(this.findFormatBlock('blockquote'));
          break;
      }
      this.$refs.editorArea.focus();
      const params = [type, this.formatBlock];
      execCommand(...params);
    },
    findFormatBlock(elementType) {
      const anchorNode = window.getSelection().anchorNode;
      if (anchorNode.nodeType === nodeTypes.textNode) {
        return this.closestElement(anchorNode.parentNode, elementType);
      } else {
        return this.closestElement(anchorNode, elementType);
      }
    },
    closestElement(node, elementType) {
      return node.closest(`div[contenteditable~="true"] ${elementType}`);
    },
    pasteAsHtml(e) {
      const text = (e.originalEvent || e).clipboardData.getData('text/plain');
      if (text.includes('<iframe ')) {
        execCommand(actions.insertHTML, false, text);
      } else {
        execCommand(
          actions.insertHTML,
          false,
          linkifyHtml(text, { defaultProtocol: 'https' })
        );
      }
      this.emitTextInfo();
    },
    exitBlockquote,
    getQueryCommandState,
    ...mapActions(['addFlashMessage'])
  },
  mounted() {
    /** @TODO revise value/v-model functionality */
    this.setInnerHtml(this.value);
    this.emitTextInfo();
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.textarea {
  height: auto;
  flex-grow: 1;
  min-height: 50px;
  // @TODO revise do we need max-height?
  max-height: 350px;
  line-height: normal;
  border: 1px solid var(--border-input-comment-normal);
  font-size: var(--size-regular);
  padding: var(--element-padding-m) var(--element-padding-s);
  border-radius: var(--border-radius);
  background-color: transparent;
  margin-bottom: var(--element-margin-s);
  color: var(--text-primary);
  word-wrap: break-word;
  overflow: auto;
  resize: vertical;
  @include mobile {
    font-size: 16px;
  }
  ::v-deep a {
    color: var(--text-primary);
  }

  ::v-deep {
    a {
      color: var(--text-primary);
    }

    ul {
      padding-left: 40px;
    }

    p {
      margin-bottom: 0;
    }

    blockquote {
      padding-left: var(--element-padding-s);
      border-left: var(--border-width-default) solid var(--border-group-normal);
    }
  }

  &:focus {
    outline: none;
  }

  &-container {
    display: flex;
    @include mobile {
      display: block;
    }
    h1 {
      font-size: var(--comment-h1);
    }
    h2 {
      font-size: var(--comment-h2);
    }
  }

  &:empty {
    &:before {
      content: attr(data-placeholder);
    }
  }

  &:focus:before {
    display: none;
  }
}

.rich-text-editor {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  &__delete-btn {
    background-color: var(--color-main-800);
    color: var(--color-white);
    padding: var(--element-padding-s) var(--element-padding-l);
    font-size: var(--size-regular);
    position: absolute;
    bottom: 0;
    right: 0;
    border-radius: var(--border-radius);
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }

  &__image {
    margin-bottom: var(--element-margin-m);
    position: relative;

    img {
      display: block;
      opacity: var(--opacity-image-overlay);
    }
  }

  &__limit-notice {
    padding-bottom: var(--element-padding-l);
    font-size: var(--size-small);
    @include mobile {
      padding-top: var(--element-padding-s);
    }

    &:not(.over-limit) {
      color: var(--text-primary);
    }
    &.over-limit {
      color: var(--error);
    }
  }

  ::v-deep &__tools {
    margin: 0;
    display: none;
    margin-bottom: var(--element-margin-s);
    list-style: none;
    justify-content: space-between;
    max-width: 390px;
    flex-wrap: wrap;
    &.active {
      display: flex;
    }
    button {
      background-color: transparent;
      color: var(--border-button-tools);
      vertical-align: middle;
      &:focus {
        outline: none;
        svg {
          fill: var(--color-main-600);
        }
      }

      svg {
        fill: var(--text-activity-name-active);
        vertical-align: baseline;
      }
    }
  }
  ::v-deep &__item {
    height: 24px;
    flex-grow: 1;
    border: var(--border-width-thin) solid var(--border-button-tools);
    border-left: none;
    text-align: center;
    transition: var(--default-transition);

    button {
      width: 100%;
      height: 100%;
    }

    &:first-child {
      border-left: var(--border-width-thin) solid var(--border-button-tools);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
    }

    &:last-child {
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }

    &.active {
      background-color: green;
    }
  }

  &__social-links {
    display: none;
    list-style: none;
    margin: var(--element-margin-m) 0 var(--element-margin-s);

    &.active {
      display: flex;
    }
    button,
    label {
      padding: 0 var(--button-padding-s);
      background-color: transparent;
      &:focus {
        outline: none;
        svg {
          fill: var(--color-main-500);
        }
      }

      svg {
        fill: var(--text-primary);
      }
    }
  }
}
</style>
