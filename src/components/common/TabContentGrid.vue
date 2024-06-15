<template>
  <section class="tab-content">
    <section-header
      :btnSecondaryText="btnSecondary"
      :showEditIcon="editIcon"
      :title="title"
      @handleEditBtn="$emit('handleEditBtn')"
      @handleSecondaryBtn="$emit('handleSecondaryBtn')"
    />
    <p class="note" v-if="note">{{ note }}</p>
    <form @submit.prevent>
      <!-- @TODO make search -->
      <form-input
        v-if="showSearch"
        class="tab-content__search-input"
        type="search"
        name="find-blog"
        placeholder="Find blog"
        @input="$emit('handle-input', $event)"
      />
    </form>
    <div class="tab-content__container">
      <slot />
    </div>
  </section>
</template>

<script>
import SectionHeader from '../common/SectionHeader';
import FormInput from '../common/Fields/FormInput';

export default {
  components: {
    FormInput,
    SectionHeader
  },
  props: {
    btnSecondary: {
      type: String
    },
    title: {
      type: String
    },
    editIcon: {
      type: Boolean
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    note: {
      type: String
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.tab-content {
  &__container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: var(--element-margin-m);
    @include mobile {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }

  &__search-input {
    margin-bottom: var(--element-padding-l);
  }
}

.note {
  color: var(--text-primary);
  margin-top: var(--element-margin-s);
  font-size: var(--size-small);
}

::v-deep .form-input {
  input {
    border-color: var(--border-input-search);
    background-color: var(--BG-blog-post);
  }
}
</style>
