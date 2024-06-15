<template>
  <expandable content-label="description" class="blog-card">
    <div class="blog-card__wrapper-content">
      <div class="blog-card__image">
        <router-link :to="{ name: blogRoot, params: { name: blogUrl } }">
          <img :src="src" :alt="blogName" />
        </router-link>
      </div>
      <div class="blog-card__details">
        <div class="blog-card__text">
          <div class="blog-card__name">
            <router-link
              class="blog-card__link"
              :to="{ name: blogRoot, params: { name: blogUrl } }"
            >
              {{ blogName }}
            </router-link>
          </div>
          <div
            class="blog-card__description"
            v-html="sanitize(data.description)"
          ></div>
        </div>
      </div>
    </div>
  </expandable>
</template>

<script>
import { blogRoot } from '@/services/Blog/blog.service';
import sanitize from '@/utils/sanitizeHTML';
import Expandable from '~common/Expandable';

export default {
  components: {
    Expandable
  },
  props: {
    src: {
      type: String,
      default: require('@/assets/img/png/Image_8.png')
    },
    data: {
      type: Object
    },
    blogName: {
      type: String
    }
  },
  data() {
    return {
      blogRoot,
      sanitize
    };
  },
  computed: {
    blogUrl() {
      return this.data.link || this.data.id;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';

.blog-card {
  display: block;
  position: relative;
  border-radius: var(--border-radius);
  background-color: var(--BG-blog-post);
  transition: var(--transition-default);
  padding: var(--element-padding-m) var(--element-padding-l);
  overflow: auto;
  min-width: 0;

  &__wrapper-content {
    display: flex;
  }

  &:hover {
    box-shadow: var(--box-shadow);
  }

  &__image {
    border-radius: var(--border-radius);
    max-width: 20%;
    max-height: 100%;
    min-width: 10%;

    img {
      display: block;
    }
  }

  &__details {
    margin-left: var(--element-margin-m);
    min-width: 0;
  }
  &__text {
    color: var(--text-primary);
    font-size: var(--size-regular);
  }
  &__name {
    font-family: 'OpenSans-Bold', sans-serif;
  }
  &__link {
    text-decoration: none;
    color: var(--text-primary);
  }
  &__description {
    margin-top: var(--element-margin-xs);
    word-wrap: break-word;

    ::v-deep {
      @include user-content;
    }
  }
}
</style>
