<template>
  <!-- /*@TODO test this approach through all the app*/ -->
  <div class="form-input" :class="{ transparent: notBordered }">
    <search-icon class="search-icon" v-if="type === 'search'" />
    <label :for="id" v-if="labelText">{{ labelText }}</label>
    <textarea
      v-if="isTextArea"
      :name="name"
      :id="id"
      :value="value"
      @input="handleInput"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="{ disabled }"
    >
    </textarea>
    <input
      v-else
      :name="name"
      :id="id"
      :value="value"
      :placeholder="placeholder"
      @input="handleInput"
      :required="required"
      :type="type"
      :disabled="disabled"
      :class="{ disabled }"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    />
  </div>
</template>

<script>
import formInputMixin from '@/mixins/form-input.mixin';
import SearchIcon from '~svg/search-icon.svg';

export default {
  mixins: [formInputMixin],
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String
    },
    notBordered: {
      type: Boolean,
      default: false
    },
    labelText: {
      type: String
    },
    value: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isTextArea() {
      return this.type === 'textarea';
    },
    /*@TODO add predefined input types*/
    /*@TODO revise textarea case functionality*/
    getElementByType() {
      return this.isTextArea ? 'textarea' : 'input';
    }
  },
  components: {
    SearchIcon
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
/*@TODO revise textarea styles case*/
.form-input {
  position: relative;

  &.textarea {
    &.big > textarea {
      font-size: var(--size-primary);
      font-family: 'OpenSans-Bold', sans-serif;
      min-height: 130px;
    }

    &.small > textarea {
      min-height: 80px;
    }
  }
}

input {
  width: 100%;
  border-radius: var(--border-radius);
  border: var(--border-width-thin) solid;
  border-color: var(--border-input-normal);
  padding: var(--element-padding-s);
  font-family: 'OpenSans-Regular';
  font-size: var(--size-regular);
  background-color: transparent;
  color: var(--text-primary);
  transition: var(--transition-default);
  @include mobile {
    font-size: 16px;
  }

  &::placeholder {
    color: var(--color-main-500);
  }

  &:hover {
    border-color: var(--border-input-hover);
  }
  &:focus {
    border-color: var(--border-input-active);
    outline: none;
  }
  &.disabled {
    border-color: var(--text-create-account-inactive);
    color: var(--text-create-account-inactive);
    cursor: not-allowed;
  }
}
input[type='search'] {
  padding-left: var(--element-padding-xl);
}

textarea {
  width: 100%;
  border-radius: var(--border-radius);
  border: var(--border-width-thin) solid;
  border-color: var(--border-input-normal);
  padding: var(--element-padding-s);
  font-family: 'OpenSans-Regular';
  font-size: var(--size-regular);
  background-color: transparent;
  color: var(--text-primary);
  resize: vertical;
  min-height: 41px;
  @include mobile {
    font-size: 16px;
  }

  &::placeholder {
    color: var(--color-main-500);
  }

  &:hover {
    border-color: var(--border-input-hover);
  }

  &:focus {
    border-color: var(--border-input-active);
    outline: none;
  }
  &.disabled {
    border-color: var(--text-create-account-inactive);
    color: var(--text-create-account-inactive);
    cursor: not-allowed;
  }
}

.search-icon {
  position: absolute;
  top: 50%;
  left: var(--element-margin-s);
  transform: translateY(-50%);
}

/** @TODO revise styles for the notBordered prop */
.form-input.transparent {
  padding: 0;
  margin-right: var(--element-margin-m);
  input[type='search'] {
    border: none;
    font-size: var(--size-button);
    padding: var(--element-padding-xs);
    padding-left: var(--element-padding-xl);
  }

  input {
    border: none;
  }

  textarea {
    border: none;
  }
}

label {
  font-size: var(--size-button);
  font-family: 'OpenSans-Bold', sans-serif;
  margin-bottom: var(--element-margin-s);
  color: var(--text-primary);
  display: block;
  cursor: default;
}
</style>
