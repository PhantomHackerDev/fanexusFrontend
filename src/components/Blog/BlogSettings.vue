<template>
  <form class="settings" @submit.prevent="$emit('save-blog-settings')">
    <div class="settings-container" v-if="data">
      <div
        v-for="([key, { title, data: settingsData, id }],
        index) in Object.entries(settings)"
        :key="`${title}-${index}`"
        class="radio-button-group"
      >
        <h4 class="radio-button-group__title">{{ title }}</h4>

        <template v-for="(dataItem, index) in settingsData">
          <!-- @TODO test value change -->
          <form-toggler
            class="form-toggler"
            v-if="id === 'visibility'"
            v-model="currentData[dataItem.name]"
            :key="`${id}-${index}`"
            :name="dataItem.name"
            context="settings"
            v-slot:after
          >
            {{ dataItem.text }}
          </form-toggler>
          <form-radio-button
            v-else
            :name="key"
            :value="dataItem.value"
            :key="`${id}-${index}`"
            v-model="currentData[id].accessControlSetting"
          >
            {{ dataItem.text }}
          </form-radio-button>
          <!-- @TODO output select only if button checked -->
          <form-select
            :key="`${id}-${index}-select`"
            v-if="dataItem.selectOptions"
            title="security group name"
            :options="dataItem.selectOptions"
            name="security-groups"
          />
        </template>
      </div>
      <div v-if="showSubmit" class="settings__buttons">
        <form-button class="settings__cancel-btn" type="reset" text="Cancel" />
        <form-button
          class="settings__save-btn"
          type="submit"
          text="Save"
          :disabled="disabled"
        />
      </div>
    </div>
  </form>
</template>

<script>
import FormRadioButton from '@/components/common/Fields/FormRadioButton';
import FormSelect from '@/components/common/Fields/FormSelect';
import FormToggler from '~common/Fields/FormToggler';
import FormButton from '~common/Buttons/FormButton';
import settings from '@/services/Blog/blog.settings';
import { modelProxy } from '@/utils/proxy';

export default {
  model: {
    prop: 'data'
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FormSelect,
    FormToggler,
    FormRadioButton,
    FormButton
  },
  data() {
    return {
      settings
    };
  },
  computed: {
    currentData() {
      return modelProxy(this, 'data');
    }
  }
};
</script>
<style lang="scss" scoped>
.settings {
  &-container {
    background-color: var(--BG-blog-post);
    border-radius: var(--border-radius);
    padding: var(--element-padding-xl);
  }

  &__cancel-btn {
    margin-right: var(--element-margin-m);
    min-width: 90px;
  }

  &__save-btn {
    min-width: 90px;
  }
}

::v-deep {
  .radio-button-group {
    margin-bottom: var(--element-margin-l);
    font-size: var(--size-regular);
    h4 {
      font-family: 'OpenSans-Bold', sans-serif;
      color: var(--text-primary);
      margin-bottom: var(--element-margin-m);
    }
    /** @TODO revise */
    .radiobutton:last-child {
      margin-bottom: var(--element-margin-l);
    }
  }

  .select {
    margin-left: var(--element-margin-xl);
    font-size: var(--size-regular);
    &__toggler {
      padding: var(--button-padding-s) var(--element-padding-s);
    }
  }
  .checkbox__text {
    font-size: var(--size-regular);
  }

  .toggler-settings {
    margin-bottom: var(--element-margin-m);
  }
}
</style>
