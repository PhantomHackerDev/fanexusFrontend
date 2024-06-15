<template>
  <ul
    class="tags-list"
    :class="{
      togglable: showAllBtn,
      'tags-list-input': isInput
    }"
  >
    <li
      v-for="({ id, name, displaySynonym, tagCount }, index) in tagsToShow"
      :key="`${name}-${index}`"
      class="tags-list__item"
      :class="{
        'tags-list-input__item': isInput,
        disabled: !$listeners || !$listeners.select
      }"
      @click.stop="$emit('select', name)"
    >
      <template
        >#{{ displaySynonym || name
        }}<span v-if="tagCount"> ({{ tagCount }})</span>
        <button
          v-if="$listeners && $listeners['remove-tag']"
          type="button"
          class="cross-button"
          @click.stop="$emit('remove-tag', id)"
        >
          <cross-icon class="cross-button__icon" /></button
      ></template>
    </li>
    <!-- /*@TODO fix Element button not allowed as child of element ul in this context. */ -->
    <button
      v-if="!isInput && showTagsButton && !showAllBtn"
      class="tags-list__more"
      @click.stop="showMoreTags"
    >
      More
    </button>
    <button
      v-if="showAllBtn"
      class="tags-list__more--square-btn"
      @click.stop="toggleVisibility"
      :class="{ active: toggled }"
    >
      More
    </button>
  </ul>
</template>
<script>
import { isLastIndex } from '@/utils/array';
import CrossIcon from '~svg/cross-icon.svg';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
      required: true
    },
    showAllBtn: {
      type: Boolean,
      default: false
    },
    isInput: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CrossIcon
  },
  data() {
    return {
      toggled: false,
      tagsIncrementNumber: 5,
      tagsToShowNumber: 5
    };
  },

  computed: {
    allTagsLength() {
      return this.list.length;
    },
    tagsToShow() {
      return this.allTagsLength
        ? this.isInput
          ? this.list
          : this.list.slice(0, this.tagsToShowNumber)
        : [];
    },
    showTagsButton() {
      return this.allTagsLength
        ? this.allTagsLength > this.tagsToShowNumber
        : false;
    }
  },
  methods: {
    isLastIndex,
    showMoreTags() {
      this.tagsToShowNumber += this.tagsIncrementNumber;
    },
    toggleVisibility() {
      this.toggled = !this.toggled;
      this.tagsToShowNumber = this.toggled
        ? this.allTagsLength
        : this.tagsIncrementNumber;
    }
  }
};
</script>
<style lang="scss" scoped>
.tags-list {
  display: inline;
  vertical-align: middle;
  list-style: none;

  &__item {
    display: inline-block;
    vertical-align: middle;
    color: var(--text-primary);
    font-size: var(--size-small);
    font-family: 'OpenSans-Bold';
    padding: var(--element-padding-xs);
    border: 1px solid var(--border-tag);
    border-radius: var(--border-radius);
    margin-right: var(--element-margin-xs);
    margin-bottom: var(--element-margin-xs);
    max-width: 100%;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow: auto;
    &:not(.disabled) {
      cursor: pointer;
    }
    &.disabled {
      border-color: var(--text-create-account-inactive);
    }
  }
  &.separate {
    .tags-list {
      &__more {
        margin-bottom: var(--element-margin-s);
        &:focus {
          outline: none;
        }
      }

      &__item {
        padding: 0;
        border: none;
        font-size: var(--size-small);
        margin-bottom: var(--element-margin-s);
        font-family: 'OpenSans-Regular', sans-serif;
      }
    }
  }
  &.togglable {
    padding-right: var(--element-padding-xl);
  }
  &__item {
    display: inline-block;
  }

  .cross-button {
    position: relative;
    background: transparent;
    outline: none;

    &__icon {
      stroke-width: 5px;
      stroke: var(--text-primary);
      width: 10px;
      height: 8px;
    }
  }

  &__more {
    color: var(--text-secondary);
    font-family: 'OpenSans-Bold';
    font-size: var(--size-small);
    background: none;
    margin-bottom: var(--element-margin-xs);
    text-transform: uppercase;
    &:focus {
      outline: none;
    }

    &--square-btn {
      background-color: var(--BG-button-square);
      margin-bottom: var(--element-margin-xs);
      position: relative;
      width: 25px;
      height: 25px;
      border-radius: var(--border-radius);
      font-size: 0;
      position: absolute;
      top: 10px;
      right: 0;
      border: var(--border-width-thin) solid var(--color-white);
      &:after {
        content: '';
        width: 6px;
        height: 6px;
        border-left: var(--border-width-default) solid var(--color-white);
        border-top: var(--border-width-default) solid var(--color-white);
        position: absolute;
        top: 50%;
        right: 6px;
        transform: rotate(225deg) translateY(50%);
        transform-origin: 0 50%;
      }
      &.active {
        &:after {
          transform: rotate(45deg);
          top: 35%;
          right: 8px;
        }
      }
    }
  }
}
</style>
