<template>
  <header class="section-title">
    <div class="section-title__heading">
      <h2 class="section-title__header">{{ title }}</h2>
      <button
        v-if="showEditIcon"
        type="button"
        class="section-title__edit-btn"
        @click.stop="$emit('handleEditBtn')"
      >
        <edit-icon />
      </button>
    </div>
    <!-- @TODO: switch to handlePrimary -->
    <form-button
      v-if="isAuthenticated && btnSecondaryText"
      type="submit"
      :text="btnSecondaryText"
      @click.native.stop="$emit('handleSecondaryBtn')"
    />
  </header>
</template>
<script>
import { mapState } from 'vuex';
import EditIcon from '~svg/edit-icon.svg';
import FormButton from '~common/Buttons/FormButton';

export default {
  components: {
    FormButton,
    EditIcon
  },
  props: {
    btnSecondaryText: {
      type: String
    },
    btnPrimaryText: {
      type: String
    },
    title: {
      type: String
    },
    showEditIcon: {
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated
    })
  }
};
</script>
<style lang="scss" scoped>
.section-title {
  display: flex;
  justify-content: space-between;

  &__heading {
    color: var(--text-primary);
    font-family: 'OpenSans-Bold', sans-serif;
    margin-bottom: var(--element-margin-m);
    line-height: 2em;
    display: flex;
    align-items: baseline;
  }
  &__header {
    margin-right: var(--element-margin-l);
    font-size: var(--size-primary);
    margin-bottom: 0;
  }

  &__edit-btn {
    background-color: transparent;
    &:focus {
      outline: none;
    }

    &:focus > ::v-deep svg {
      fill: var(--color-main-700);
    }

    ::v-deep svg {
      fill: var(--text-primary);
    }
  }
  ::v-deep .button {
    height: 30px;
    min-width: 80px;
    padding: 0 var(--element-padding-xl);
    &:last-child {
      margin-left: var(--element-margin-s);
    }
  }
}
</style>
