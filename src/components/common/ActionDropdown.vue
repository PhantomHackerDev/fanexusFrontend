<template>
  <ul class="action-dropdown" v-click-outside="close">
    <template>
      <li
        v-for="{ text, action, special, togglable } in options"
        :key="action"
        @click.stop
        class="action-dropdown__item"
      >
        <button
          type="button"
          class="action-dropdown__button"
          @click="emitAction(action)"
          :class="{ special, togglable }"
        >
          {{ text }}
        </button>
      </li>
    </template>
  </ul>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
  props: {
    isAddingUser: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      required: true
    }
  },
  directives: {
    ClickOutside
  },
  methods: {
    close() {
      this.$emit('close');
    },
    emitAction(action) {
      if (
        action === 'edit' ||
        action === 'block' ||
        action === 'unblock' ||
        action === 'add' ||
        action === 'delete' ||
        action === 'report' ||
        action === 'follow' ||
        action === 'join' ||
        action === 'leave' ||
        action === 'unfollow'
      ) {
        this.close();
      }
      this.$emit(action);
    }
  }
};
</script>

<style lang="scss" scoped>
.action-dropdown {
  position: absolute;
  z-index: var(--z-index-1);
  width: 220px;
  top: 100%;
  right: 0;
  list-style: none;
  margin: 0;
  padding: var(--element-padding-xs);
  background-color: var(--BG-dropdown);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius);

  &__item {
    position: relative;
  }
  &__button {
    background: transparent;
    white-space: nowrap;
    padding: var(--element-padding-s);
    font-size: var(--size-regular);
    width: 100%;
    text-align: left;
    color: var(--text-primary);
    &:focus {
      outline: none;
    }
    &.togglable {
      &:after,
      &:before {
        content: '';
        position: absolute;
        right: 5px;
        top: 50%;
        width: 6px;
        height: 2px;
        background-color: var(--dropdown-arrow);
      }
      &:after {
        transform: translateX(35%) rotate(-45deg);
      }
      &:before {
        transform: translateX(-35%) rotate(45deg);
      }
    }
    border-radius: var(--border-radius);
    &:hover {
      background-color: var(--BG-button-dropdown);
    }
    &.special {
      color: var(--error);
    }
  }
}
</style>
