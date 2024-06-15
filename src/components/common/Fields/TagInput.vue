<template>
  <div class="tags-input">
    <div
      class="tags-input-area"
      :class="{ 'height-limited': heightLimited, single }"
      @click="setToInput"
    >
      <tags-list
        :list="list"
        @remove-tag="removeTag"
        :is-input="true"
        v-on="tagListListeners"
        @list-change="$emit('list-change', $event)"
      />
      <div class="tags-input-area__input">
        <span v-if="!(single && list.length)">
          #<input
            ref="input"
            type="text"
            class="new-tag"
            :placeholder="placeholder"
            :value="newTag"
            @input="newTag = $event.target.value"
            v-if="!(single && list.length)"
            @focus="startInput"
            @blur="endInput(true)"
            @keydown.enter.prevent="handleEnter()"
            @keydown.backspace="removeLast"
            @keydown.delete="removeLast"
            @keydown.right="handleEnterEnd"
        /></span>
      </div>
    </div>
    <div
      class="tags-input__autocomplete"
      v-if="!synonyms && inputtingTags && autocompleteEntries.length"
    >
      <div class="tags-input__autocomplete-container">
        <div
          class="tags-input__autocomplete-entry"
          v-for="({ id, name, displaySynonym, isLocked },
          index) of autocompleteEntries"
          :key="`${id}-${index}`"
          @mousedown.prevent="addTag(autocompleteEntries[index])"
        >
          <div
            class="tags-input__autocomplete-display"
            :class="{ locked: isLocked && noLockedTags }"
          >
            {{ displaySynonym
            }}<span
              v-if="isLocked && noLockedTags"
              class="tags-input__autocomplete-locked-note"
            >
              (locked)</span
            >
          </div>
          <div class="tags-input__autocomplete-name">
            {{ name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TagsList from '~common/TagsList';
import {
  findTags,
  tagLengthLimit,
  tagLengthErrorMessage
} from '@/services/tag.service';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    synonyms: {
      type: Boolean,
      default: false
    },
    allowNew: {
      type: Boolean,
      default: true
    },
    heightLimited: {
      type: Boolean,
      default: true
    },
    single: {
      type: Boolean,
      default: false
    },
    noLockedTags: {
      type: Boolean,
      default: false
    }
  },
  components: {
    TagsList
  },
  data() {
    return {
      newTag: '',
      inputtingTags: false,
      autocompleteEntries: []
    };
  },
  computed: {
    tagListListeners() {
      return this.$listeners && this.$listeners['select-tag']
        ? { select: event => this.$emit('select-tag', event) }
        : null;
    },
    ...mapState({
      isTagWrangler: state => state.auth.userData.tagWrangler,
      isSuperTagWrangler: state => state.auth.userData.superTagWrangler
    })
  },
  methods: {
    removeLast() {
      if (!this.newTag && this.list.length) {
        this.removeTag(this.list[this.list.length - 1].id);
      }
    },
    removeTag(idToRemove) {
      if (this.single) {
        this.$emit('input', null);
      } else {
        this.$emit(
          'list-change',
          this.list.filter(({ id }) => id !== idToRemove)
        );
      }
    },
    setToInput() {
      this.$refs.input.focus();
    },
    addTag(tag) {
      if (
        tag.name.length &&
        !this.list.find(
          ({ id, name, displaySynonym }) =>
            (name === tag.name && displaySynonym === tag.displaySynonym) ||
            (name.toLowerCase() === tag.name.toLowerCase() &&
              (id < 0 || tag.id < 0))
        ) &&
        (!tag.isLocked ||
          !this.noLockedTags ||
          this.isTagWrangler ||
          this.isSuperTagWrangler)
      ) {
        if (this.single) {
          this.$emit('input', tag);
        } else {
          this.$emit('list-change', this.list.concat(tag));
        }
        this.newTag = '';
      }
    },
    startInput() {
      this.inputtingTags = true;
    },
    endInput(stopInput = true) {
      if (stopInput) {
        this.inputtingTags = false;
      }
      if (this.synonyms || this.allowNew) {
        const matchingTag = this.autocompleteEntries.find(
          ({ displaySynonym }) =>
            displaySynonym.toLowerCase() === this.newTag.toLowerCase()
        );
        const tagByteLength = new TextEncoder().encode(this.newTag).length;
        if (matchingTag) {
          this.addTag(matchingTag);
        } else if (tagByteLength <= tagLengthLimit) {
          this.addTag({
            name: this.newTag.trim(),
            id: -Date.now()
          });
        } else {
          this.addFlashMessage({
            message: tagLengthErrorMessage(tagByteLength),
            type: 'failure'
          });
        }
      } else {
        this.newTag = '';
      }
    },
    async getAutocomplete(input) {
      const tags = await findTags(input);
      return tags
        .flatMap(({ id, name, synonyms, isLocked }) => [
          { name, displaySynonym: name, id, isLocked },
          ...(synonyms
            ? synonyms.map(synonym => ({ id, name, displaySynonym: synonym }))
            : [])
        ])
        .filter(({ displaySynonym }) =>
          displaySynonym.toLowerCase().includes(input.toLowerCase())
        )
        .filter(
          ({ id, displaySynonym }) =>
            !this.list.find(
              ({ id: listId, displaySynonym: listDisplaySynonym }) =>
                listId === id && listDisplaySynonym === displaySynonym
            )
        )
        .filter(
          ({ id, displaySynonym }, index, self) =>
            index ===
            self.findIndex(
              ({ id: foundId, displaySynonym: foundDisplaySynonym }) =>
                id === foundId && displaySynonym === foundDisplaySynonym
            )
        )
        .sort(
          (tag1, tag2) =>
            tag1.displaySynonym.length - tag2.displaySynonym.length
        );
    },
    handleEnter() {
      if (this.synonyms || this.allowNew || !this.autocompleteEntries.length) {
        this.endInput(false);
      } else {
        this.addTag(this.autocompleteEntries[0]);
      }
    },
    handleEnterEnd() {
      const input = this.$refs.input;
      if (input.value.length === input.selectionEnd) {
        this.handleEnter();
      }
    },
    ...mapActions(['addFlashMessage'])
  },
  watch: {
    newTag(input) {
      if (
        input &&
        !this.synonyms &&
        new TextEncoder().encode(input).length <= tagLengthLimit
      ) {
        return this.getAutocomplete(input).then(entries => {
          this.autocompleteEntries = entries;
        });
      } else {
        return (this.autocompleteEntries = []);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.tags-input {
  position: relative;
  width: 100%;

  &-area {
    cursor: text;
    max-height: 40vh;
    overflow: visible;
    border-radius: var(--border-radius);
    border: var(--border-width-thin) solid;
    border-color: var(--border-input-normal);
    background-color: var(--BG-blog-post);
    padding: var(--element-padding-xs) 0 0 var(--element-padding-xs);
    @include mobile {
      height: 100%;
    }

    &.height-limited {
      overflow-x: hidden;
      overflow-y: auto;
    }

    &.single {
      display: inline-block;
    }
    &:not(.single) {
      width: 100%;
    }

    &__input {
      color: var(--text-secondary);
      display: inline-block;
      margin-bottom: var(--element-margin-xs);
      @include mobile {
        margin-bottom: 0;
      }
    }
  }

  &__autocomplete {
    position: absolute;
    left: var(--element-padding-xs);
    top: 100%;
    max-width: 50vw;
    min-width: 20vw;
    border: var(--border-width-thin) solid var(--border-tag);
    padding: var(--element-padding-s);
    border-radius: var(--border-radius);
    background-color: var(--BG-dropdown);
    cursor: pointer;
    z-index: var(--z-index-popup-overlay);

    &-display {
      word-wrap: break-word;
      min-width: 0;
      overflow: hidden;

      &.locked {
        color: var(--BG-button-inactive);
        cursor: not-allowed;
      }
    }

    &-name {
      color: var(--text-secondary);
      font-size: var(--size-small);
      word-wrap: break-word;
      min-width: 0;
      overflow: hidden;
    }

    &-entry {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-primary);
      padding: var(--element-padding-xs);
      border-radius: var(--border-radius);

      &:hover {
        background-color: var(--BG-button-primary-hover);
        color: var(--tab-active);
      }
    }

    &-locked-note {
      font-size: var(--size-small);
    }
  }
}

.new-tag {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: var(--size-regular);
  @include mobile {
    font-size: 16px;
  }

  &:focus {
    outline: none;
    border: var(--border-width-thin) dotted var(--border-input-normal);
  }

  &::placeholder {
    color: var(--color-main-500);
  }
}
</style>
