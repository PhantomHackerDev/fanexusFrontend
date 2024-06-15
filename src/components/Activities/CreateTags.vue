<!-- @TODO revise usage of this file -->
<template>
  <section class="create-tags">
    <h2 class="create-tags__heading">New tag</h2>
    <form class="create-tags-container">
      <!-- @TODO output these components dynamically -->
      <form-input
        labelText="Tag name:"
        class="create-tags__input"
        type="text"
        :notBordered="true"
        name="tag-name"
        placeholder="Tag name"
        id="tag-name"
      />
      <form-input
        labelText="Tag Description:"
        class="create-tags__textarea"
        type="textarea"
        :notBordered="true"
        name="tag-description"
        placeholder="Tag Description"
        id="tag-description"
      />
      <form-input
        labelText="Parents Tags:"
        class="create-tags__input"
        type="text"
        :notBordered="true"
        name="parents-tags"
        placeholder="Tag name"
        id="parents-tags"
      />
      <form-input
        labelText="Child Tags:"
        class="create-tags__input"
        type="text"
        :notBordered="true"
        name="child-tags"
        placeholder="Tag name"
        id="child-tags"
      />
      <form-input
        labelText="Synonym Tags:"
        class="create-tags__input"
        type="text"
        :notBordered="true"
        name="synonym-tags"
        placeholder="Tag name"
        id="synonym-tags"
      />
      <div class="create-tags__buttons-group">
        <form-button
          type="button"
          class="create-tags__cancel-btn"
          text="Cancel"
          @click.native.stop="$emit('handleCancelBtn')"
        />
        <form-button
          type="submit"
          class="create-tags__save-btn"
          text="Save"
          @click.native.stop="$emit('handleSaveBtn')"
        />
      </div>
    </form>
  </section>
</template>

<script>
import FormInput from '../common/Fields/FormInput';
import FormButton from '~common/Buttons/FormButton';

export default {
  components: {
    FormInput,
    FormButton
  }
};
</script>
<style lang="scss" scoped>
.create-tags {
  padding: var(--element-padding-xl);

  &__heading {
    font-size: var(--size-activity);
    color: var(--text-title-secondary);
  }

  &__input {
    margin-bottom: var(--element-margin-l);
    display: inline-block;
    border-radius: var(--border-radius);
    width: 680px;
  }

  &__textarea {
    margin-bottom: var(--element-margin-l);
    display: inline-block;
    width: 680px;
    border-radius: var(--border-radius);
  }
  &__cancel-btn {
    margin-right: var(--element-margin-m);
    min-width: 90px;
  }

  &__save-btn {
    min-width: 90px;
  }

  &__buttons-group {
    border-top: var(--border-width-thin) solid var(--popular-blog-divider);
    padding-top: var(--element-padding-l);
  }
}

::v-deep .form-input {
  input {
    background-color: var(--BG-blog-post);
  }

  textarea {
    background-color: var(--BG-blog-post);
  }

  label {
    margin-bottom: var(--element-margin-xs);
  }
}
</style>
