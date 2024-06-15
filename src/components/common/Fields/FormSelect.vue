<template>
  <div
    class="select"
    :class="{ active: selectToggled }"
    v-click-outside="() => toggleVisibility(false)"
  >
    <button
      type="button"
      class="select__toggler"
      @click="toggleVisibility"
      tabindex="0"
    >
      {{
        optionsType === 'radiobuttons'
          ? selectLabel
          : currentSelection === null
          ? title
          : currentSelection.label || currentSelection.name
      }}
    </button>
    <ul v-if="options.length" class="select-options-container">
      <li
        v-for="(option, index) in options"
        :key="`${option.value}-${index}`"
        class="select__option"
      >
        <form-checkbox
          v-if="optionsType === 'checkboxes'"
          :name="name"
          :disabled="disabled"
          v-model="selectValue"
          :value="option.value"
          >{{ option.label || option.name }}</form-checkbox
        >
        <template v-else-if="optionsType === 'selection'">{{
          option.label || option.name
        }}</template>
        <form-radio-button
          class=""
          v-if="optionsType === 'radiobuttons'"
          v-model="selectValue"
          :value="option.value"
          :name="name"
          :disabled="disabled"
          >{{ option.label || option.name }}</form-radio-button
        >
        <p
          @click="handleSelect(option)"
          class="select__text"
          v-if="optionsType === 'text' || optionsType === 'text-single'"
        >
          {{ option.label || option.name }}
        </p>
      </li>
    </ul>
    <cross-icon
      v-if="selectToggled"
      class="select__mobile-close"
      @click="toggleVisibility(false)"
    />
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import FormCheckbox from '~common/Fields/FormCheckbox';
import FormRadioButton from '~common/Fields/FormRadioButton';
import CrossIcon from '~svg/cross-icon.svg';

export default {
  model: {
    prop: 'checked'
  },
  components: {
    FormCheckbox,
    FormRadioButton,
    CrossIcon
  },
  props: {
    checked: {
      type: [Object, Array, String, Number]
    },
    name: {
      type: String,
      required: true
    },
    optionsType: {
      type: String,
      default: 'checkboxes'
    },
    title: {
      type: String
    },
    options: {
      type: Array,
      default: () => [],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      selectToggled: false,
      currentSelection: null
    };
  },
  methods: {
    handleSelect(option) {
      this.$emit('select', option);
      this.selectToggled = false;

      if (this.optionsType === 'text-single') {
        this.currentSelection = option;
      }
    },
    toggleVisibility(isToggle = true) {
      this.selectToggled = isToggle ? !this.selectToggled : false;
    }
  },
  computed: {
    selectValue: {
      get: function() {
        return this.checked;
      },
      set: function(value) {
        this.$emit('input', value);
      }
    },
    selectLabel() {
      const checkedOption = this.options.find(
        option => option.value === this.checked
      );
      return checkedOption && checkedOption.label;
    },
    isMobile() {
      return this.$store.getters.isMobile;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';

.select {
  display: inline-block;
  position: relative;
  font-size: var(--size-button);

  &__text {
    font-size: var(--size-regular);
    margin: 0;
    width: 100%;
    padding: var(--element-padding-s) 0;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  &.active &__toggler {
    color: var(--dropdown-arrow);

    &:after {
      transform: rotate(45deg) translateY(-50%);
      transform-origin: 0 -50%;
    }
  }

  &.active &-options-container {
    display: block;
    max-height: 50vh;
    overflow: auto;
    @include mobile {
      max-height: calc(100% - 60px - var(--header-height));
    }
  }

  &__toggler {
    border-radius: var(--border-radius);
    border: var(--border-width-thin) solid var(--border-button-select);
    padding: var(--element-padding-xs) var(--element-padding-s);
    color: var(--text-primary);
    position: relative;
    width: 100%;
    text-align: left;
    background-color: transparent;
    margin-bottom: var(--element-margin-s);
    min-height: 30px;
    overflow: hidden;
    word-wrap: break-word;
    @include mobile {
      padding-right: calc(var(--element-padding-s) * 2.5);
      margin-bottom: 0;
      min-height: 28px;
    }

    &:focus {
      outline: none;
      border-color: var(--border-button-secondary-hover);
      color: var(--text-button-hover);
    }

    &:hover {
      border-color: var(--border-button-secondary-hover);
      color: var(--text-button-hover);
    }

    &:after {
      content: '';
      width: 6px;
      height: 6px;
      border-left: var(--border-width-default) solid var(--border-button-select);
      border-top: var(--border-width-default) solid var(--border-button-select);
      position: absolute;
      top: 50%;
      right: 9px;
      transform: rotate(225deg) translateY(50%);
      transform-origin: 0 50%;
    }
  }

  &-options-container {
    position: absolute;
    list-style: none;
    border: var(--border-width-thin) solid var(--BG-navbar);
    background-color: var(--BG-select-options);
    border-radius: var(--border-radius);
    display: none;
    box-shadow: var(--common-box-shadow);
    z-index: var(--z-index-popup);
    width: 100%;
    padding: var(--button-padding-s) var(--element-padding-s);
    @include mobile {
      position: fixed;
      left: 10px;
      right: 10px;
      bottom: 10px;
      max-height: calc(100% - 60px - var(--header-height));
      width: calc(100% - 20px);
      margin-bottom: 0;
    }
  }

  &__option {
    color: var(--text-primary);
    display: flex;
    align-items: center;
    word-break: break-word;
    line-height: 1.5em;
  }

  &__mobile-close {
    @include mobile {
      position: fixed;
      top: calc(15px + var(--header-height));
      right: 15px;
      width: 20px;
      height: 20px;
      stroke: var(--text-primary);
      stroke-width: 5;
    }
  }
}
::v-deep {
  .select__option {
    &:last-of-type {
      .checkbox,
      .radiobutton {
        margin-bottom: 0;
      }
    }
  }

  .checkbox {
    margin-bottom: var(--element-margin-m);
    &__text {
      color: var(--text-primary);
      font-size: var(--size-button);
    }
    input[type='checkbox']:checked ~ .checkbox__text {
      color: var(--BG-button-pagination-active);
    }
  }
}
</style>
