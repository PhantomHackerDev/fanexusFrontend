<template>
  <section class="rules">
    <section-header title="Rules" />
    <div class="rules-container" v-if="rules.length">
      <article
        class="rules-article"
        v-for="(rule, index) in rules"
        :key="index"
      >
        <h3 class="rules-article__title">{{ rule.name }}</h3>
        <expandable content-label="rule">
          <p class="rules-article__text" v-html="sanitize(rule.description)" />
        </expandable>
      </article>
    </div>
  </section>
</template>

<script>
import { communityAreas } from '@/services/Community/community.service';
import SectionHeader from '~common/SectionHeader';
import Expandable from '~common/Expandable';
import sanitize from '@/utils/sanitizeHTML';

export default {
  name: communityAreas.rules,
  components: {
    SectionHeader,
    Expandable
  },
  props: {
    rules: {
      type: Array
    }
  },
  data() {
    return {
      data: null,
      sanitize
    };
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';

.rules {
  &-container {
    padding: var(--element-padding-s);
    background-color: var(--BG-blog-post);
    border-radius: var(--border-radius);
  }

  &-article {
    color: var(--text-primary);
    padding: var(--element-padding-s);
    overflow: auto;
    &:not(:last-of-type) {
      margin-bottom: var(--element-margin-l);
    }

    &__title {
      font-size: var(--size-regular);
      font-family: 'OpenSans-Bold', sans-serif;
      margin-bottom: var(--element-margin-s);
    }

    &__text {
      font-size: var(--size-regular);
      margin-bottom: 0;
      word-wrap: break-word;

      ::v-deep {
        @include user-content;
      }
    }
  }
}

::v-deep .form-input {
  input {
    border-color: var(--border-input-search);
    background-color: var(--BG-blog-post);
  }
}
</style>
