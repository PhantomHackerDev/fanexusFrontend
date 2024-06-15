<template>
  <modal class="create-group modal-overlay--centered" :settings="settings">
    <template slot="body">
      <p class="create-group__desc">
        The list of people in your security group won’t be visible at your blog.
        Only you can see and manage it.
      </p>
      <label class="create-group__text" for="create-text"
        >Create name of a new group</label
      >
      <form-input
        class="create-group__name"
        type="text"
        name="create-group-name"
        placeholder="Group name"
        id="create-text"
      />
    </template>
  </modal>
</template>

<script>
import Modal from '~common/Modal';
import FormInput from '../common/Fields/FormInput';

export default {
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  components: {
    Modal,
    FormInput
  }
};
</script>

<style lang="scss" scoped>
.create-group {
  &__desc,
  &__text {
    font-family: OpenSans-Regular;
    font-size: var(--size-regular);
    color: var(--text-primary);
    margin-bottom: var(--element-margin-xl);
  }
  &__text {
    display: block;
    font-family: 'OpenSans-Bold', sans-serif;
    margin-bottom: var(--element-margin-m);
  }
  &__name {
    width: 100%;
    height: 40px;
    outline: none;
    border-radius: var(--border-radius);
    background-color: var(--BG-input);
    color: var(--BG-button-comment);

    &::placeholder {
      font-size: var(--size-regular);
      font-family: OpenSans-Regular;
      color: var(--text-input-placeholder);
    }
    &:hover {
      border-color: var(--border-input-hover);
    }

    &:focus {
      border-color: var(--border-input-active);
      caret-color: var(--border-input-active);
    }
  }
}
</style>
