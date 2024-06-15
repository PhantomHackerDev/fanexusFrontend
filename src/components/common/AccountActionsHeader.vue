<template>
  <header class="account-actions-header">
    <div class="account-actions-header__left-side">
      <tabs
        :tabs="navTabs"
        :active="activeTab"
        :isBreadcrumbs="true"
        class="account-actions-header__tabs"
        @select-tab="$active => selectTab($active)"
      />
      <div class="account-actions-header__buttons-group" v-if="showButtons">
        <form-button
          type="submit"
          class="account-actions-header__submit-btn"
          text="Accept all"
          @click.native.stop="$emit('handleSubmitBtn')"
        />
        <form-button
          type="button"
          class="account-actions-header__decline-btn"
          text="Decline All"
          @click.native.stop="$emit('handleDeclineBtn')"
        />
      </div>
    </div>
    <div class="account-actions-header__right-side">
      <form>
        <!-- @TODO make search -->
        <form-input
          class="account-actions-header__search-input"
          type="search"
          name="search"
          placeholder="SEARCH"
          v-if="showSearch"
          :notBordered="true"
        />
      </form>
      <form-select
        title="All activities"
        v-if="selectSecondaryOptions.length"
        :options="selectSecondaryOptions"
        name="activity"
      />
      <form-select
        title="Blogname"
        v-if="selectPrimaryOptions.length"
        :options="selectPrimaryOptions"
        name="primary-options"
      />
    </div>
  </header>
</template>
<script>
import FormInput from '~common/Fields/FormInput';
import FormButton from '~common/Buttons/FormButton';
import FormSelect from '~common/Fields/FormSelect';
import Tabs from '~common/Tabs';

export default {
  components: {
    FormButton,
    FormInput,
    FormSelect,
    Tabs
  },
  props: {
    showButtons: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    selectPrimaryOptions: {
      type: Array,
      default: () => []
    },
    selectSecondaryOptions: {
      type: Array,
      default: () => []
    },
    navTabs: {
      type: Array,
      /** @TODO revise */
      required: true,
      default: () => []
    },
    activeTab: {
      type: Number
    }
  },
  methods: {
    selectTab(index) {
      this.$emit('select-tab', index);
    }
  }
};
</script>
<style lang="scss" scoped>
.account-actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--BG-blog-post);
  box-shadow: var(--box-shadow);

  &__left-side {
    display: flex;
    align-items: center;
    padding-left: var(--element-padding-xl);
  }

  &__right-side {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    padding-right: var(--element-padding-s);
  }

  &__tabs {
    margin-right: var(--element-margin-xxl);
  }

  &__submit-btn {
    margin-right: var(--element-margin-l);
  }
}

::v-deep .select {
  margin-right: var(--element-margin-l);
  button {
    font-size: var(--size-regular);
    margin-bottom: 0;
  }

  ul {
    position: absolute;
    top: 40px;
  }
}
</style>
