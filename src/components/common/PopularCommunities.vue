<template v-if="data.suggestions">
  <div class="popular-blogs">
    <h3 class="popular-blogs__title">Blogs and communities</h3>
    <!-- @TODO switch key to blogInfo.id (currently there's an issue on BE so the ids are duplicated) -->
    <popular-blog
      v-for="(blogInfo, index) in data.suggestions"
      :key="`${blogInfo.id}-${index}`"
      :blogInfo="blogInfo"
    />
  </div>
</template>
<script>
import PopularBlog from '~common/PopularBlog';

export default {
  components: {
    PopularBlog
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({
        suggestions: []
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.popular-blogs {
  padding-left: var(--element-padding-m);

  &__title {
    color: var(--text-primary);
    text-transform: uppercase;
    line-height: var(--size-button);
    padding-top: var(--element-padding-xs);
    padding-bottom: var(--element-padding-m);
    margin-bottom: var(--element-margin-m);
    font-family: 'OpenSans-Bold', sans-serif;
    font-size: var(--size-button);
    border-bottom: var(--border-width-thin) solid var(--popular-blog-divider);
  }
}
</style>
