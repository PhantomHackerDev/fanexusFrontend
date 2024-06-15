<template>
  <label class="checkbox" :class="{ disabled: disabled }"
    ><input
      type="checkbox"
      :id="id"
      :name="name"
      :value="value"
      v-model="model"
      :required="required"
      :disabled="disabled"
    />
    <span class="checkbox__icon"></span>
    <span class="checkbox__text"><slot /></span>
  </label>
</template>

<script>
import formCheckboxMixin from '@/mixins/form-checkbox.mixin';

export default {
  mixins: [formCheckboxMixin]
};
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;

  &.disabled {
    .checkbox__icon {
      background-color: var(--text-create-account-inactive);
    }
    .checkbox__text {
      color: var(--text-create-account-inactive);
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
    border-radius: var(--border-radius);
    background-color: var(--checkbox-normal);
    display: inline-block;
    position: relative;
    margin-right: var(--element-margin-s);
    transition: var(--transition-default);
  }
  &__text {
    font-size: var(--size-small);
    color: var(--text-primary);
    transition: var(--transition-default);

    &:focus {
      color: var(--BG-button-primary-hover);
    }

    & a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: var(--transition-default);
    }
  }
}
input[type='checkbox'] {
  margin: 0;
  &:checked {
    ~ .checkbox {
      &__icon {
        background: var(--checkbox-active);

        &:before {
          position: absolute;
          top: 50%;
          left: 50%;
          content: '';
          display: inline-block;
          transform: translate(-50%, -50%) rotate(45deg);
          height: 8px;
          width: 6px;
          border-bottom: var(--border-width-default) solid
            var(--BG-button-primary);
          border-right: var(--border-width-default) solid
            var(--BG-button-primary);
        }
      }
    }
  }
}

label:hover {
  .checkbox__icon {
    background-color: var(--color-main-500);
  }
}

input:focus ~ .checkbox__icon {
  background-color: var(--color-main-500);
}
</style>
