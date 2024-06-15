<template>
  <div class="tagged">
    <tabs
      v-if="!isTablet"
      :tabs="navTabs"
      @select-tab="navigateToTab"
      :active="tabIndex"
    />
    <div v-else class="tagged__mobile-header">
      <div class="tagged__control-holder tagged__control-holder_type">
        <options-row
          :selections="mobileTypeTabs"
          ellipses-heading
          @input="activeMobileTypeTab = $event.value"
        />
      </div>
      <template v-if="activeMobileTypeTab === 'content'">
        <div class="tagged__control-holder">
          <h4 class="tagged__content-type-label">Content Type</h4>
          <form-select
            v-model="activeMobileTab"
            :options="mobileNavTabs"
            name="tagged-content-type"
            optionsType="radiobuttons"
            class="tagged__content-type-select"
            :class="{
              'tagged__content-type-select_blog-posts':
                activeMobileTab === 'tagged-blog-posts'
            }"
            ref="mobileNavSelect"
          />
        </div>
        <sidebar-select-order
          v-if="activeMobileTab === 'tagged-blog-posts'"
          class="tagged__mobile-select-order"
          :selected="order"
        />
      </template>
    </div>
    <router-view
      v-if="activeMobileTypeTab === 'content'"
      :key="`${activeAliasId}-${tabIndex}`"
      @reportPost="handleReportPost($event)"
    />
    <div v-else class="tagged__mobile-tags-info">
      <sidebar-tag-counts
        class="tagged-blog-posts__tag-counts tagged-blog-posts__sidebar-box"
        v-if="feedData.tagCounts && feedData.tagCounts.length"
        :tags="feedData.tagCounts"
        :current-tags="currentTags"
      />
      <tag-show
        class="tagged-blog-posts__sidebar-box"
        v-for="(tag, index) of currentTags"
        :key="`${tag}-${index}`"
        context="sidebar"
        :name="tag"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Tabs from '~common/Tabs';
import SidebarSelectOrder from '~common/SidebarSelectOrder';
import FormSelect from '~common/Fields/FormSelect';
import OptionsRow from '~common/Fields/OptionsRow';
import SidebarTagCounts from '~common/SidebarTagCounts';
import TagShow from '@/views/TagShow';

import tabsMixin from '@/mixins/tabs.mixin';

export default {
  props: {
    tagNames: {
      type: String
    },
    order: {
      type: String
    }
  },
  components: {
    Tabs,
    SidebarSelectOrder,
    FormSelect,
    OptionsRow,
    SidebarTagCounts,
    TagShow
  },
  mixins: [tabsMixin],
  data() {
    return {
      activeTab: 0,
      activeMobileTab: 'tagged-blog-posts',
      activeMobileTypeTab: 'content',
      navTabs: [
        {
          title: 'Blog posts',
          component: 'tagged-blog-posts'
        },
        {
          title: 'Blogs',
          component: 'tagged-blogs'
        },
        {
          title: 'Communities',
          component: 'tagged-communities'
        }
      ]
    };
  },
  methods: {
    navigateToTab(tabIndex) {
      if (tabIndex !== this.tabIndex) {
        this.$router.push({
          name: this.navTabs[tabIndex].component,
          params: this.$route.params
        });
      }
    },
    handleReportPost(blogPost) {
      this.$parent.handleOpenSubmitReportModal({
        isBlogPost: true,
        postId: blogPost.id,
        commentId: null,
        postingAlias: blogPost.Alias.name,
        updatedAt: blogPost.updatedAt
      });
    }
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      feedData: state => state.feed.data
    }),
    ...mapGetters(['isTablet']),
    tabIndex() {
      return this.$route.meta.tabIndex;
    },
    mobileNavTabs() {
      return this.navTabs.map(tab => ({
        value: tab.component,
        label: tab.title
      }));
    },
    mobileTypeTabs() {
      const tags = this.currentTags;
      return [
        {
          name: 'type',
          heading: tags && tags.length > 0 ? tags.join('|') : 'Tags',
          values: [
            {
              value: 'content',
              label: 'Content'
            },
            {
              value: 'info',
              label: 'Info'
            }
          ],
          selected: this.activeMobileTypeTab
        }
      ];
    },
    currentTags() {
      return JSON.parse(this.tagNames);
    }
  },
  watch: {
    activeMobileTab(tab) {
      const index = this.mobileNavTabs.findIndex(
        iteratedTab => iteratedTab.value === tab
      );
      if (index !== -1) {
        this.navigateToTab(index);
      }
      this.$refs.mobileNavSelect.toggleVisibility(false);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.tagged {
  @include tablet {
    padding: 0;
  }
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  padding: var(--element-padding-l);

  &__mobile-header {
    @include tablet {
      display: flex;
      justify-content: center;
    }
    @include mobile {
      justify-content: space-between;
    }
    @include mobile-s {
      --element-padding-s: 5px;
    }
  }

  &__control-holder {
    @include tablet {
      text-align: center;
      padding: var(--element-padding-l);
      color: var(--text-primary);
    }
    @include tablet-s {
      padding: var(--element-margin-xs);
    }
    &_type {
      @include mobile {
        width: calc(130px + var(--element-padding-s) * 2);
      }
    }
    ::v-deep .options-rows__heading {
      @include tablet {
        font-size: var(--size-title);
        margin-bottom: var(--element-margin-m);
      }
      @include mobile {
        font-size: var(--size-regular);
        margin-bottom: var(--element-margin-xs);
      }
    }
    ::v-deep .options-rows__value-list-item {
      @include mobile-s {
        font-size: 12px;
        &:not(:last-child) {
          margin-right: var(--element-margin-xs);
        }
      }
    }
  }

  &__content-type-label {
    text-align: center;
    font-size: var(--size-title);
    font-family: 'OpenSans-Bold';
    margin-bottom: var(--element-margin-m);
    @include mobile {
      font-size: var(--size-regular);
      margin-bottom: var(--element-margin-xs);
    }
  }

  &__mobile-tags-info {
    padding: var(--element-padding-l);
    @include mobile {
      padding-bottom: 50px;
    }
  }

  &__mobile-select-order {
    @include tablet {
      background-color: transparent;
      width: 250px;
    }
    @include tablet-s {
      width: 180px;
      padding: var(--element-margin-xs);
    }
    @include mobile {
      width: 120px;
    }
    @include mobile-s {
      width: 100px;
    }
  }

  &__content-type-select {
    @include tablet {
      width: 250px;
    }
    @include tablet-s {
      width: 150px;
    }
    @include mobile {
      width: 120px;
    }
    @include mobile-s {
      width: 95px;
    }
    &_blog-posts {
      @include mobile-m {
        width: 100px;
      }
      @include mobile-s {
        width: 95px;
      }
    }
  }
}
</style>
