<template>
  <div class="toggler" :class="`toggler-${context}`">
    <label class="toggler__container" :class="{ disabled }"
      ><input
        type="checkbox"
        :id="id"
        :name="name"
        v-model="model"
        :required="required"
        :disabled="disabled"/><span
        class="toggler__label"
        v-if="this.$slots.default"
        ><slot></slot></span
      ><span class="toggler__slider"></span
      ><span class="toggler__label" v-if="this.$slots.after"
        ><slot name="after"></slot></span
    ></label>
  </div>
</template>

<script>
import formCheckboxMixin from '@/mixins/form-checkbox.mixin';

export default {
  props: {
    context: {
      type: String,
      default: 'aside'
    }
  },
  mixins: [formCheckboxMixin]
};
</script>

<style lang="scss" scoped>
.toggler {
  &__container {
    position: relative;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    &.disabled {
      cursor: default;

      .toggler__slider {
        background-color: var(--text-create-account-inactive);
      }
      .toggler__label {
        color: var(--text-create-account-inactive);
      }
    }

    input {
      opacity: 0;
      margin: 0;
      display: none;
      &:checked ~ .toggler__slider:before {
        transform: translateX(17px);
      }
    }
  }
  &__slider {
    cursor: pointer;
    width: 37px;
    height: 19px;
    transition: var(--transition-default);
    border-radius: 34px;
    display: block;

    &:before {
      content: '';
      display: block;
      height: 17px;
      width: 17px;
      margin-left: 1px;
      margin-top: 1px;
      background-color: var(--BG-button-inactive);
      transition: var(--transition-default);
      border-radius: 50%;
    }
  }

  &-aside {
    .toggler__slider {
      background-color: var(--color-white);
    }
    .toggler__label {
      color: var(--color-white);
    }
    input:checked ~ .toggler__slider:before {
      background-color: var(--color-main-800);
    }
  }

  &-settings {
    .toggler__slider {
      background-color: var(--color-main-800);
    }
    .toggler__label {
      color: var(--text-primary);
    }
    input:checked ~ .toggler__slider {
      background-color: var(--color-main-700);

      &:before {
        background-color: var(--color-main-600);
      }
    }
  }

  &__label + &__slider {
    margin-left: var(--element-margin-s);
  }

  &__slider + &__label {
    margin-left: var(--element-margin-s);
  }
}
</style>
