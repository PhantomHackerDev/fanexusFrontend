<template>
  <label class="add-moodboard"
    ><input type="checkbox" :id="id" :name="name" :required="required" />
    <span class="add-moodboard__icon">
      <small-plus />
    </span>
    <form-input
      class="add-moodboard__field"
      type="text"
      :id="id"
      placeholder="Add moodboard"
      name="Add moodboard"
      ref="textInput"
    />
    <button class="add-moodboard__close" type="reset">
      <plus-icon />
    </button>
  </label>
</template>

<script>
import formCheckboxMixin from '@/mixins/form-checkbox.mixin';
import FormInput from '~common/Fields/FormInput';
import SmallPlus from '~svg/small_plus.svg';
import PlusIcon from '~svg/plus.svg';

export default {
  components: {
    FormInput,
    PlusIcon,
    SmallPlus
  },
  mixins: [formCheckboxMixin]
};
</script>

<style lang="scss" scoped>
.add-moodboard {
  display: flex;
  align-items: center;
  &__icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: transparent;
    border: var(--border-width-thin) solid var(--color-main-500);
    display: inline-block;
    position: relative;
    margin-right: var(--element-margin-s);
    transition: var(--transition-default);
    display: flex;
    justify-content: center;
    align-items: center;
    ::v-deep svg {
      fill: transparent;
    }
  }
  &__close {
    background-color: transparent;
    transform: rotate(45deg);
    ::v-deep svg {
      fill: transparent;
    }
    &:focus {
      outline: none;
    }
  }
  &__field {
    font-size: var(--size-small);
    color: var(--text-primary);
    transition: var(--transition-default);

    &:focus {
      color: var(--BG-button-primary-hover);
    }
  }
}
input[type='checkbox'] {
  margin: 0;
  &:checked {
    ~ .add-moodboard {
      &__icon {
        border-color: var(--color-main-700);
        ::v-deep svg {
          fill: var(--color-main-700);
        }
      }
      &__field {
        ::v-deep input {
          border-bottom: var(--border-width-thin) solid var(--color-main-700);
          &::placeholder {
            color: var(--color-main-500);
          }
        }
      }
      &__close {
        ::v-deep svg {
          fill: var(--color-main-700);
        }
      }
    }
  }
}

label:hover {
  .add-moodboard__icon {
    border-color: var(--color-main-600);
  }
}

input:focus ~ .add-moodboard__icon {
  border-color: var(--color-main-600);
}
::v-deep .form-input {
  input {
    padding: var(--element-padding-xs);
    border: none;
    border-radius: 0;
    &::placeholder {
      color: var(--text-primary);
    }
  }
}
</style>
