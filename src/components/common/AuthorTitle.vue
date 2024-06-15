<template>
  <div class="author-title" :class="{ 'is-valid-date': isValidDate }">
    <avatar
      :size="imageSize"
      :file="image"
      :alt="alt"
      @click.native.stop="$emit('author-click')"
    />
    <div class="author-title-text">
      <router-link
        v-bind:to="{ name: 'blog', params: blogParams }"
        class="author-title__name"
        :class="{ shared: isShared }"
      >
        {{ name }}
      </router-link>
      <p v-if="isShared" class="author-title__shared">
        {{ blogAliasName ? blogAliasName : name }} shared this
        <router-link
          v-if="community"
          class="author-title__community"
          v-bind:to="{ name: 'community', params: { name: community.link } }"
        >
          {{ community.name }}
        </router-link>
        .
      </p>
      <p v-else class="author-title__shared">
        <slot v-if="community">
          {{ name }} posted this to
          <router-link
            class="author-title__community"
            v-bind:to="{ name: 'community', params: { name: community.link } }"
          >
            {{ community.name }}
          </router-link>
          .
        </slot>
      </p>
      <router-link
        class="author-title__date"
        v-bind:to="{
          name: `${this.$route.name}-with-blog-post`,
          params: blogPostParams
        }"
      >
        {{ date | dateFormat }}
      </router-link>
      <slot />
    </div>
  </div>
</template>
<script>
import { isValidDate } from '@/filters/date.filter';
import Avatar from '~common/Avatar';

export default {
  components: {
    Avatar
  },
  props: {
    id: {
      type: [String, Number]
    },
    link: {
      type: [String, Number]
    },
    imageSize: {
      type: String
    },
    image: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    date: {
      type: String
    },
    alt: {
      type: String,
      default: 'avatar'
    },
    isShared: {
      type: Boolean,
      default: false
    },
    blogAliasName: {
      type: String
    },
    community: {
      type: Object,
      default: null
    },
    blogParams: {
      type: Object
    },
    blogPostParams: {
      type: Object
    }
  },
  computed: {
    isValidDate() {
      return isValidDate(this.date);
    }
  }
};
</script>
<style lang="scss" scoped>
.author-title {
  display: flex;
  margin-bottom: var(--element-margin-s);
  &-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: var(--element-margin-s);
    min-width: 0;
  }
  &__name {
    color: var(--text-primary);
    font-size: var(--size-regular);
    font-weight: 700;
    word-break: break-word;
    margin-bottom: var(--element-margin-s);
    text-decoration: none;
  }
  &__shared,
  &__date {
    color: var(--text-date-and-time);
    font-size: var(--size-small);
    margin-bottom: 0;
    word-break: break-word;
    text-decoration: none;
  }
  &__shared {
    color: var(--text-primary);
    margin-bottom: var(--element-margin-xs);
  }
  &__community {
    font-weight: 700;
    color: var(--text-primary);
    text-decoration: none;
  }
  &.is-valid-date {
    .author-title-text {
      justify-content: flex-start;
    }
    .author-title__name {
      text-decoration: none;
      margin-bottom: var(--element-margin-s);
      &.shared {
        margin-bottom: var(--element-margin-xs);
      }
    }
  }
}
</style>
