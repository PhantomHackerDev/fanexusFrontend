<template>
  <button
    class="button"
    :class="{
      'button--plus': plus,
      'button--full-width': fullWidth,
      'button--disabled': disabled,
      'button--header-button': headerButton,
      'button--disabled': disabled,
      'button--small': small
    }"
    :type="type"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>
<script>
export default {
  props: {
    text: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plus: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    headerButton: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button'
    },
    small: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
.button {
  border-radius: var(--border-radius);
  font-size: var(--size-button);
  padding: var(--button-padding-s) var(--element-padding-l);
  font-family: 'OpenSans-Bold';
  transition: var(--transition-default);
  outline: none;
  background-color: var(--BG-dropdown);
  border: var(--border-width-thin) solid var(--border-button-secondary);
  color: var(--text-button);

  &:hover {
    border-color: var(--border-button-secondary-hover);
    color: var(--text-button-hover);
  }
  &:focus {
    border-color: var(--border-button-secondary-hover);
    color: var(--text-button-hover);
  }
  &--disabled,
  &--disabled:hover {
    color: var(--text-create-account-inactive);
    border-color: var(--text-create-account-inactive);
    cursor: not-allowed;
  }

  &--plus {
    font-size: var(--size-button);
    background-color: transparent;
    color: var(--color-main-700);
    border: none;
    padding: 0;
    margin-bottom: var(--element-margin-m);
    text-transform: uppercase;

    &:hover {
      color: var(--color-main-600);
    }
    &:focus {
      color: var(--color-main-600);
    }
  }

  &--small {
    font-size: var(--size-small);
    padding: var(--element-padding-xs);
  }
}

[type='submit'] {
  background-color: var(--BG-button-secondary);
  color: var(--text-button-secondary);
  &:focus {
    background-color: var(--BG-button-secondary-hover);
    border-color: var(--border-button-secondary-hover);
    color: var(--text-button-comment);
  }
  &:hover {
    background-color: var(--BG-button-secondary-hover);
    border-color: var(--border-button-secondary-hover);
    color: var(--text-button-comment);
  }
  &.button--disabled,
  &.button--disabled:hover {
    cursor: not-allowed;
    background-color: var(--text-create-account-inactive);
    border-color: var(--text-create-account-inactive);
  }
}
.button--header-button {
  border-color: var(--border-button-normal);
  background-color: var(--color-white);
  color: var(--color-main-800);
  margin-left: var(--element-margin-s);
  text-transform: uppercase;
  &:focus {
    border-color: var(--checkbox-normal);
    background-color: var(--checkbox-normal);
    color: var(--text-button-primary-hover);
  }
  &:hover {
    border-color: var(--checkbox-normal);
    background-color: var(--checkbox-normal);
    color: var(--text-button-primary-hover);
  }
  &[type='submit'] {
    border-color: var(--color-white);
    background-color: transparent;
    color: var(--color-white);
    &:focus {
      border-color: var(--checkbox-normal);
      color: var(--checkbox-normal);
    }
    &:hover {
      border-color: var(--checkbox-normal);
      color: var(--checkbox-normal);
    }
    &.button--disabled,
    &.button--disabled:hover {
      cursor: not-allowed;
      color: var(--text-create-account-inactive);
      border-color: var(--text-create-account-inactive);
      background-color: transparent;
    }
  }
  &.button--disabled,
  &.button--disabled:hover {
    cursor: not-allowed;
    background-color: var(--text-create-account-inactive);
    border-color: var(--text-create-account-inactive);
    color: var(--color-white);
  }
}
.button--full-width {
  padding: var(--button-padding-m) 0;
  width: 100%;
  text-transform: uppercase;
  margin: var(--element-margin-xs) 0;
  background-color: var(--color-main-800);
  color: var(--color-white);
  &:hover {
    background-color: var(--color-main-700);
    color: var(--color-white);
  }

  &:focus {
    background-color: var(--BG-button-secondary-hover);
    border-color: var(--border-button-secondary-hover);
    color: var(--color-white);
  }

  &.button--disabled,
  &.button--disabled:hover {
    cursor: not-allowed;
    background-color: var(--text-create-account-inactive);
    border-color: var(--text-create-account-inactive);
    color: var(--color-white);
  }
}
</style>
