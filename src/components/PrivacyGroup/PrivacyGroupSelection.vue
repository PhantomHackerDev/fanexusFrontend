<template>
  <div class="privacy-group-selection">
    <div class="privacy-group-selection__find">
      <form-select
        class="privacy-group-selection__select"
        optionsType="text"
        title="Choose privacy groups"
        name="privacy-group-select"
        :options="privacyGroupOptions"
        @select="addPrivacyGroup"
      />
    </div>
    <ul class="privacy-group-selection__selected-list">
      <li
        class="privacy-group-selection__selected-list-item"
        v-for="(privacyGroup, index) of value"
        :key="`${privacyGroup.id}-${index}`"
      >
        {{ privacyGroup.name }}
        <button
          type="button"
          class="cross-button"
          @click.stop="removePrivacyGroup(privacyGroup)"
        >
          <cross-icon class="cross-button__icon" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FormSelect from '~common/Fields/FormSelect';
import CrossIcon from '~svg/cross-icon.svg';

export default {
  props: {
    value: {
      required: true,
      type: Array
    },
    currentPrivacyGroup: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    FormSelect,
    CrossIcon
  },
  computed: {
    ...mapState({
      privacyGroups: state => state.privacyGroup.list
    }),
    privacyGroupOptions() {
      return this.privacyGroups.filter(
        privacyGroup =>
          privacyGroup.id !== this.currentPrivacyGroup.id &&
          !this.value.map(value => value.id).includes(privacyGroup.id)
      );
    }
  },
  methods: {
    addPrivacyGroup(privacyGroup) {
      const privacyGroupList = this.value.slice();
      privacyGroupList.push(privacyGroup);
      this.$emit('input', privacyGroupList);
      this.$emit('add-privacy-group', privacyGroup);
    },
    removePrivacyGroup(privacyGroup) {
      const privacyGroupList = this.value.slice();
      privacyGroupList.splice(this.value.indexOf(privacyGroup), 1);
      this.$emit('input', privacyGroupList);
      this.$emit('remove-privacy-group', privacyGroup);
    }
  }
};
</script>

<style lang="scss" scoped>
.privacy-group-selection {
  margin: var(--element-margin-m) 0;
  display: relative;

  &__select {
    width: var(--width-medium-small);
  }

  &__selected-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px 20px -5px;
    &-item {
      color: var(--text-primary);
      font-size: var(--size-small);
      padding: var(--element-padding-xs);
      border: 1px solid var(--border-tag);
      border-radius: var(--border-radius);
      margin: var(--element-margin-xs);
      max-width: 100%;
      word-wrap: break-word;
      overflow: hidden;
    }
  }
}

::v-deep .form-input {
  input {
    background-color: var(--BG-blog-post);
  }
}

.cross-button {
  position: relative;
  background: transparent;
  outline: none;

  &__icon {
    stroke-width: 5px;
    stroke: var(--text-primary);
    width: 10px;
    height: 8px;
  }
}
</style>
