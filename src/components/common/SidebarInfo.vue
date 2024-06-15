<template>
  <!-- take a conversation with @Vika if we need more editable field via props here -->
  <div class="sidebar-info">
    <h3 v-if="name" class="sidebar-info__title">{{ name }}</h3>
    <template v-if="isAuthenticated">
      <template v-if="feedType === feedTypes['community'] && !hideFromMinor">
        <form-button
          class="sidebar-info__button"
          @click.native.stop="$emit('join')"
          type="submit"
          text="Join"
          v-if="!isMember && !membershipPending"
        />
        <form-button
          class="sidebar-info__button"
          type="info"
          text="Membership pending"
          v-else-if="!isMember"
        />
        <form-button
          class="sidebar-info__button"
          @click.native.stop="$emit('leave')"
          type="cancel"
          text="Leave"
          v-else
        />
      </template>
      <form-button
        class="sidebar-info__button"
        type="cancel"
        text="Unfollow"
        @click.native.stop="$emit('unsubscribe')"
        v-if="isSubscribe"
        :disabled="awaitFollow"
      />
      <form-button
        class="sidebar-info__button"
        type="submit"
        text="Follow"
        @click.native.stop="$emit('subscribe')"
        v-else-if="!hideFromMinor"
        :disabled="awaitFollow"
      />
      <form-button
        class="sidebar-info__button"
        type="submit"
        text="Edit"
        @click.native.stop="$emit('edit')"
        v-if="isEditable"
      />
    </template>
    <expandable content-label="description">
      <p class="sidebar-info__desc" v-html="description" ref="description" />
    </expandable>
    <template v-if="tags.length">
      <h4 class="sidebar-info__subtitle">Tags</h4>
      <tags-list
        class="sidebar-info__tags"
        :list="tags"
        @select="$emit('select-tag', $event)"
      />
    </template>
    <template v-if="links.length">
      <h4 class="sidebar-info__subtitle">{{ subtitle }}</h4>
      <ul class="sidebar-info-list" ref="links">
        <li
          class="sidebar-info-list__item text-overflow"
          :key="index"
          v-for="(link, index) in links"
          v-html="sanitize(link)"
        />
      </ul>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import FormButton from '~common/Buttons/FormButton';
import { feedTypes } from '@/services/feed.service';
import TagsList from '~common/TagsList';
import Expandable from '~common/Expandable';
import { linkHttp } from '@/utils/regExp';
import userContent from '@/utils/userContent';
import sanitize from '@/utils/sanitizeHTML';

export default {
  components: {
    FormButton,
    TagsList,
    Expandable
  },
  props: {
    name: {
      type: String,
      required: true
    },
    feedType: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      default: () => []
    },
    links: {
      type: Array,
      default: () => []
    },
    isMember: {
      type: Boolean
    },
    membershipPending: {
      type: Boolean
    },
    isSubscribe: {
      type: Boolean
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    subtitle: {
      type: String,
      default: 'My links'
    },
    awaitFollow: {
      type: Boolean,
      default: false
    },
    hideFromMinor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      feedTypes,
      sanitize
    };
  },
  computed: {
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  methods: {
    addRel() {
      userContent.addRel(this.$refs.description);
      userContent.addRel(this.$refs.links);
    },
    withHttp(link) {
      return link.match(linkHttp) ? link : `http://${link}`;
    },
    withoutHttp(link) {
      return link.replace(linkHttp, '');
    }
  },
  mounted() {
    this.addRel();
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';

.sidebar-info {
  background-color: var(--BG-blog-post);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  padding: var(--element-padding-m);
  color: var(--text-primary);
  font-size: var(--size-regular);
  &__title {
    font-family: 'OpenSans-Bold';
    font-size: var(--size-primary);
    text-align: center;
    padding: var(--element-padding-xs);
    padding-bottom: var(--element-padding-m);
    margin-bottom: 0;
    word-wrap: break-word;
    overflow: auto;
  }
  &__desc {
    padding: var(--element-padding-xs);
    margin: var(--element-margin-m) 0;
    word-wrap: break-word;
    overflow: auto;

    ::v-deep {
      @include user-content;
    }
  }
  &__tags {
    padding: 0 var(--element-padding-xs);
  }
  &__subtitle {
    padding: var(--element-padding-xs);
    font-family: 'OpenSans-Bold';
    margin-bottom: var(--element-margin-s);
  }
  &-list {
    padding: var(--element-padding-xs);
    list-style: none;
    margin: 0;
    &__item {
      padding-bottom: var(--element-padding-s);
      ::v-deep {
        @include user-content;
      }
    }
  }
  &__button {
    margin: 0 var(--element-padding-xs);
  }
  &__button:not(:first-child) {
    margin-top: var(--element-margin-xs);
  }
}
</style>
