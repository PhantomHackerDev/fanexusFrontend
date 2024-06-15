<template>
  <label class="radiobutton" tabindex="0" :class="{ disabled }">
    <input
      type="radio"
      :id="id"
      :name="name"
      :value="value"
      v-model="radioChecked"
      :required="required"
      tabindex="-1"
      :disabled="disabled"
    />
    <span class="radiobutton__checkmark"></span>
    <span class="radiobutton__text"><slot /></span>
  </label>
</template>

<script>
import formInputMixin from '@/mixins/form-input.mixin';

export default {
  mixins: [formInputMixin],
  model: {
    prop: 'checked'
  },
  props: {
    value: {
      type: [Object, Number, String]
    },
    checked: {
      type: [Object, Number, String]
    },
    name: {
      type: String
    }
  },
  computed: {
    radioChecked: {
      get: function() {
        return this.checked;
      },
      set: function(value) {
        this.$emit('input', value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.radiobutton {
  display: flex;
  position: relative;
  cursor: pointer;
  user-select: none;
  color: var(--text-primary);
  align-items: center;
  margin-bottom: var(--element-margin-m);
  max-width: 430px;

  &.disabled {
    cursor: default;
    .radiobutton__checkmark {
      border-color: var(--text-create-account-inactive);
    }

    .radiobutton__text {
      color: var(--text-create-account-inactive);
    }
  }

  &:focus {
    outline: none;
  }

  &:not(disabled) &:hover input ~ &__checkmark {
    border-color: var(--BG-button-primary-hover);

    &:after {
      background-color: var(--BG-button-primary-hover);
      display: block;
    }
  }
  &:not(disabled) &:focus input ~ &__checkmark {
    border-color: var(--BG-button-primary-hover);

    &:after {
      background-color: var(--BG-button-primary-hover);
      display: block;
    }
  }

  &:not(disabled) &:hover &__text {
    color: var(--BG-button-primary-hover);
  }

  &:not(disabled) &:focus &__text {
    color: var(--BG-button-primary-hover);
  }

  & input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  &__text {
    font-size: var(--size-regular);
    transition: var(--transition-default);
    flex: 1 0 0;
    line-height: 21px;
  }

  &__checkmark {
    height: 20px;
    width: 20px;
    background-color: transparent;
    border-radius: 50%;
    border: var(--border-width-thin) solid var(--text-primary);
    position: relative;
    margin-right: var(--element-margin-s);
    transition: var(--transition-default);

    &:after {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      border-radius: 50%;
      content: '';
      position: absolute;
      display: none;
      transition: var(--transition-default);
    }
  }

  & input:checked ~ &__checkmark {
    border-color: var(--BG-button-pagination-active);

    &:after {
      background: var(--BG-button-pagination-active);
      display: block;
    }
  }
  & input:checked ~ &__text {
    color: var(--BG-button-pagination-active);
  }
}
</style>
