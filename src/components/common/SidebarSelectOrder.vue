<template>
  <div class="sidebar-select-order">
    <h4 class="sidebar-select-order__title">Order by</h4>
    <form-select
      v-model="currentSelection"
      :options="orders"
      name="blog-post-order"
      optionsType="radiobuttons"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { blogPostOrders } from '@/services/BlogPost/blogPost.service';
import FormSelect from '~common/Fields/FormSelect';

export default {
  props: {
    selected: {
      type: String
    },
    onNewsFeed: {
      type: Boolean
    }
  },
  components: {
    FormSelect
  },
  data() {
    return {
      orders: blogPostOrders(this.onNewsFeed),
      currentSelection: this.selected || undefined
    };
  },
  methods: {
    ...mapActions(['setMainFeedOrder'])
  },
  watch: {
    currentSelection(value) {
      this.$router.push({ params: { order: value } });
      if (this.onNewsFeed) {
        this.setMainFeedOrder(value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.sidebar-select-order {
  background-color: var(--BG-blog-post);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  padding: var(--element-padding-l);
  color: var(--text-primary);
  font-size: var(--size-regular);
  @include mobile {
    padding: var(--element-padding-s);
    background-color: transparent;
  }
  &__title {
    text-align: center;
    font-size: var(--size-title);
    font-family: 'OpenSans-Bold';
    margin-bottom: var(--element-margin-m);
    @include mobile {
      font-size: var(--size-regular);
      margin-bottom: var(--element-margin-xs);
    }
  }
}
</style>
