<template>
  <div class="settings">
    <flash-message v-if="success">{{ successMessage }}</flash-message>
    <tabs :tabs="navTabs" @select-tab="navigateToTab" :active="tabIndex" />
    <router-view
      :key="`${activeAliasId}-${tabIndex}`"
      @success="showSuccess"
      :disabled="success"
      :data="data"
      v-model="data"
      :show-submit="true"
      @save-blog-settings="saveBlogSettings"
      v-if="data"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Tabs from '~common/Tabs';
import formMessagesMixin from '@/mixins/form-messages.mixin';
import { getBlogData } from '@/services/Blog/blog.service';
import { editBlog } from '@/services/Blog/blog.service';

export default {
  components: {
    Tabs
  },
  data() {
    return {
      navTabs: [
        {
          title: 'User settings'
        }
      ],
      data: null
    };
  },
  mixins: [formMessagesMixin],
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    }),
    ...mapGetters(['activeAlias', 'activeAliasBlogId']),
    tabIndex() {
      return this.$route.meta.tabIndex;
    },
    formData() {
      return {
        password: this.currentPassword,
        email: this.email,
        newPassword: this.newPassword,
        newPasswordAgain: this.confirmNewPassword
      };
    }
  },
  methods: {
    navigateToTab(tabIndex) {
      this.$router.push({
        name: ['settings-auth', 'settings-blog'][tabIndex]
      });
    },
    async saveBlogSettings() {
      const {
        contentAccessControl,
        followsAccessControl,
        commentsAccessControl,
        reactionsAccessControl,
        hideFromSearch
      } = this.data;
      const payload = {
        alias: this.activeAliasId,
        contentAccessControl,
        followsAccessControl,
        commentsAccessControl,
        reactionsAccessControl,
        hideFromSearchResults: hideFromSearch,
        showMinors: !this.data.hideFromMinors
      };

      try {
        await editBlog(this.data.id, payload);
      } catch (e) {
        this.errors = e.response.data.errors;
      }

      this.showSuccess();
    }
  },
  watch: {
    activeAliasBlogId: {
      handler: async function(id) {
        if (id) {
          this.data = (blogData => ({
            ...blogData,
            hideFromSearch: blogData.hideFromSearchResults,
            hideFromMinors: !this.activeAlias.showMinors
          }))(
            await getBlogData({
              name: this.activeAliasBlogId,
              id: 'id',
              pagination: 1
            })
          );
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.settings {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  padding: var(--element-padding-m);

  @include mobile {
    padding-bottom: 50px;
  }
}
</style>
