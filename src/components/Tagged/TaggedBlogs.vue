<template>
  <await-response :has-response="loaded">
    <div class="main-area">
      <div class="loading-error" v-if="error">
        {{ error.message }}
      </div>
      <div class="tagged-blogs" v-else>
        <!-- @TODO make image src dynamically: https://temperance-software.atlassian.net/browse/FAN-186 -->
        <blog-card
          :src="(blog.avatar && blog.avatar.src) || undefined"
          :blog-name="blog.name"
          v-for="(blog, index) in blogs"
          :key="`${blog.id}-${index}`"
          :data="blog"
          class="tagged-blogs__card"
        />
      </div>
    </div>
  </await-response>
</template>

<script>
import { getTaggedBlogs } from '@/services/tag.service';
import BlogCard from '@/components/Activities/BlogCard';
import AwaitResponse from '~common/AwaitResponse';

export default {
  props: {
    tagNames: {
      required: true,
      type: String
    }
  },
  components: {
    BlogCard,
    AwaitResponse
  },
  data() {
    return {
      blogs: [],
      error: null,
      loaded: false
    };
  },
  methods: {
    async getData() {
      try {
        this.blogs = await getTaggedBlogs(this.tagNames);
      } catch (e) {
        this.error = e;
      }
    }
  },
  async mounted() {
    await this.getData();
    this.loaded = true;
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.tagged-blogs {
  padding: var(--element-padding-xl);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: var(--element-margin-m);
  @include mobile {
    display: block;
    padding-bottom: 40px;
  }
  &__card {
    @include mobile {
      margin-bottom: var(--element-margin-s);
    }
  }
}

.loading-error {
  color: var(--error);
  text-align: center;
  margin-top: var(--element-margin-m);
}
</style>
