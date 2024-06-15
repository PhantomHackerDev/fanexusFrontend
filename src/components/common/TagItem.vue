<template>
  <span class="tag-item"
    ><router-link
      class="tag-item-link"
      :to="{
        name: 'tagged-blog-posts',
        params: { tagNames: JSON.stringify([tagName]) }
      }"
      >#{{ tagName }}</router-link
    ></span
  >
</template>

<script>
export default {
  props: {
    tagName: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-item {
  display: inline-block;
  font-size: var(--size-small);
  font-family: 'OpenSans-Bold';
  padding: var(--element-padding-xs);
  border: 1px solid var(--border-tag);
  border-radius: var(--border-radius);
  white-space: pre-wrap;
  word-wrap: break-word;

  &-link {
    color: var(--text-primary);
    text-decoration: none;
  }
}
</style>
