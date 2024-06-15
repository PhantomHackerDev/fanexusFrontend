<template>
  <sidebar-tag-counts
    class="blog__tag-counts blog__sidebar-box"
    v-if="data.tagCounts && data.tagCounts.length"
    :tags="data.tagCounts"
    :current-tags="currentTags"
  />
</template>

<script>
import SidebarTagCounts from '~common/SidebarTagCounts';

export default {
  name: 'blog-mobile-tags',
  components: {
    SidebarTagCounts
  },
  props: {
    data: Object,
    currentTags: Array
  }
};
</script>
<style lang="scss" scoped></style>
