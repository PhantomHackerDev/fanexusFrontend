<template>
  <form class="settings">
    <h3 class="edit-community__title">Settings</h3>
    <div class="settings-container">
      <div
        v-for="([key, { title, data: settingsData, id }],
        index) in Object.entries(settings)"
        :key="`${title}-${index}`"
        class="radio-button-group"
      >
        <h4 class="radio-button-group__title">{{ title }}</h4>
        <template v-for="(dataItem, index) in settingsData">
          <form-toggler
            class="form-toggler"
            v-if="id === 'general'"
            v-model="data[dataItem.name]"
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
            name="select-options"
          />
        </template>
      </div>
    </div>
  </form>
</template>
<script>
import settings from '@/services/Community/community.settings';
import FormRadioButton from '@/components/common/Fields/FormRadioButton';
import FormSelect from '@/components/common/Fields/FormSelect';
import FormToggler from '~common/Fields/FormToggler';
import { modelProxy } from '@/utils/proxy';

export default {
  model: {
    prop: 'data'
  },
  components: {
    FormSelect,
    FormToggler,
    FormRadioButton
  },
  props: {
    data: {
      type: Object,
      required: true
    }
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
}

::v-deep {
  .radio-button-group {
    font-size: var(--size-regular);
    h4 {
      font-family: 'OpenSans-Bold', sans-serif;
      color: var(--text-primary);
      margin-bottom: var(--element-margin-m);
    }
  }
  .radio-button-group:not(:last-child) {
    margin-bottom: var(--element-margin-l);
    /** @TODO revise */
    .radiobutton:last-child {
      margin-bottom: var(--element-margin-l);
    }
  }
  .radio-button-group:last-child .radiobutton:last-child {
    margin-bottom: 0;
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
