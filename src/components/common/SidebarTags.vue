<template>
  <!-- /*@TODO take a conversation with Vika if we need more editable field via props here */ -->
  <div class="sidebar-tags">
    <h3 v-if="headingText" class="sidebar-tags__title">{{ headingText }}</h3>
    <form-button
      v-if="!isEditable"
      class="sidebar-tags__btn"
      type="submit"
      text="Add tags"
      @click.native.stop="openAndSetEditTagsModal"
    />
    <form-button
      v-else
      class="sidebar-tags__btn"
      type="submit"
      text="Manage tags"
      @click.native.stop="openAndSetEditTagsModal"
    />
    <tags-list :list="tags" v-if="showTagList && tags && tags.length" />
    <span class="sidebar-tags__createText" v-if="isTagsEdit">
      Tags of your posts will be shown here. You may add them, but others will
      see them only when you use them in your posts.
    </span>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import FormButton from '~common/Buttons/FormButton';
import TagsList from '~common/TagsList';
export default {
  components: {
    FormButton,
    TagsList
  },
  props: {
    tags: {
      type: Array
    },
    isTagsEdit: {
      type: Boolean,
      default: false
    },
    showTagList: {
      type: Boolean,
      default: true
    },
    headingText: {
      type: String
    },
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions(['openEditTagsModal']),
    openAndSetEditTagsModal() {
      this.$emit('openTagEdit');
      this.openEditTagsModal(true);
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar-tags {
  background-color: var(--BG-blog-post);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  padding: var(--element-padding-l);
  color: var(--text-primary);
  font-size: var(--size-regular);
  &__title {
    text-align: center;
    font-size: var(--size-title);
    font-family: 'OpenSans-Bold';
    margin-bottom: var(--element-margin-m);
  }
  &__btn {
    margin-bottom: var(--element-margin-s);
  }

  &__createText {
    font-size: var(--size-regular);
    line-height: 1.5em;
  }
}
</style>
