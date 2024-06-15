<template>
  <div class="create-community">
    <form class="create-community__form" @submit.prevent="onSave" ref="form">
      <add-image
        :type="blogImageTypes.coverImage"
        class="create-community__add-bg"
        button-text="Add Background"
        @add="handleAddImage"
      >
        <wallpaper :src="coverImageData" />
      </add-image>
      <div class="create-community__header">
        <div class="create-community__header-wrapper">
          <add-image
            :type="blogImageTypes.avatar"
            class="create-community__header-add-img"
            @add="handleAddImage"
            button-text="Change Image"
          >
            <avatar
              class="create-community-header__avatar"
              size="xl"
              :file="avatarImageData"
            />
          </add-image>
        </div>
        <tabs
          :tabs="navTabs"
          @select-tab="$active => setComponent($active, $active)"
          :active="activeTab"
        />
      </div>
      <component
        :is="currentComponent"
        v-model="data"
        :errors="errors"
        @clear-error="clearError"
      />
      <div class="create-community__buttons">
        <form-button
          class="create-community__cancel-btn"
          type="reset"
          text="Cancel"
        />
        <form-button
          class="create-community__save-btn"
          type="submit"
          text="Save"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import settings from '@/services/Community/community.settings';
import AddImage from '../common/AddImage';
import Tabs from '../common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';
import CommunityProfile from '@/components/Community/CommunityProfile';
import CommunitySettings from '@/components/Community/CommunitySettings';
import {
  createCommunity,
  blogImageTypes,
  communityRoot,
  communityEditAreas
} from '@/services/Community/community.service';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import Wallpaper from '~common/Wallpaper';
import Avatar from '~common/Avatar';
import FormButton from '~common/Buttons/FormButton';

export default {
  components: {
    Wallpaper,
    Avatar,
    AddImage,
    Tabs,
    CommunityProfile,
    CommunitySettings,
    FormButton
  },
  mixins: [tabsMixin],
  data() {
    return {
      blogImageTypes,
      errors: [],
      data: {
        links: [],
        Tags: [],
        communityRules: [],
        /** @TODO revise structure */
        followsAccessControl: {
          accessControlSetting: 1
        },
        contentAccessControl: {
          accessControlSetting: 1
        },
        reactionsAccessControl: {
          accessControlSetting: 1
        },
        commentsAccessControl: {
          accessControlSetting: 1
        },
        membersAccessControl: {
          accessControlSetting: 1
        },
        postingAccessControl: {
          accessControlSetting: 1
        },
        /** @TODO revise dummy data */
        coverImage: {
          name: 'nanosuit',
          src: '',
          baseUrl:
            'http://media.fanexus.net/users/root/images/851cfc5a-d18a-4541-91ba-3a34ca283234',
          alt: 'awesomesuit',
          identifier: '851cfc5a-d18a-4541-91ba-3a34ca283234'
        },
        avatar: {
          name: 'nanosuit',
          src: '',
          baseUrl:
            'http://media.fanexus.net/users/root/images/851cfc5a-d18a-4541-91ba-3a34ca283234',
          alt: 'awesomesuit',
          identifier: '851cfc5a-d18a-4541-91ba-3a34ca283234'
        },
        requireApproval: false
      },
      activeTab: 0,
      currentComponent: 'community-profile',
      settings,
      navTabs: [
        {
          title: 'Profile',
          component: communityEditAreas.profile
        },
        {
          title: 'Settings',
          component: communityEditAreas.settings
        }
      ],
      saving: false
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    }),
    /** @TODO make it common between blog and community */
    coverImageData() {
      if (!this.data || !this.data.coverImage) return '';

      return this.data.coverImage.accessUrl || this.data.coverImage.src;
    },
    /** @TODO make it common between blog and community */
    avatarImageData() {
      return (
        this.data &&
        this.data.avatar &&
        (this.data.avatar.accessUrl || this.data.avatar.src)
      );
    },
    /** @TODO make it common between blog and community */
    communityComponents() {
      return getComponentsByPrefix.call(this, communityRoot);
    },
    tagItems() {
      return this.tags.map(tag => ({ name: tag, id: 0 }));
    }
  },
  methods: {
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = ['community-profile', 'community-settings'][
        componentIndex
      ];
    },
    handleAddImage({ type, data }) {
      this.data[type] = { ...data };
    },
    /** @TODO check this issue @see https://prnt.sc/stfus5 */
    /** @TODO check this issue @see https://prnt.sc/stb7s7 */
    /** @TODO check this issue @see http://prntscr.com/sth0ar */
    async onSave() {
      if (this.saving) {
        return;
      }
      this.saving = true;

      /** @TODO make it common between blog and community */
      const { avatar, coverImage } = this.data;
      const payload = {
        ...this.data,
        showMinors: !this.data.hideFromMinors,
        hideFromSearchResults: this.data.hideFromSearch,
        alias: this.activeAliasId,
        /** @TODO make it dynamic */
        moderators: [this.activeAliasId],
        members: [this.activeAliasId],
        rules: this.data.communityRules.map(({ name, description }) => ({
          name,
          description
        })),
        tagNames: this.data.Tags.map(({ name }) => name)
      };
      // remove empty values
      /** @TODO revise other places to switch data to payload */
      payload.links = payload.links.filter(link => link.length);
      payload.rules = payload.rules.filter(
        rules => rules.name.length || rules.description.length
      );

      if (!avatar.accessUrl) {
        avatar.src = coverImage.baseUrl;
      }

      if (!coverImage.accessUrl) {
        coverImage.src = coverImage.baseUrl;
      }

      try {
        const response = await createCommunity(payload);
        this.$router.push({
          name: 'community',
          params: { name: response.link }
        });
        this.addFlashMessage({ message: 'Community created' });
      } catch (e) {
        this.errors = e.response.data.errors;
        coverImage.src = '';
        this.saving = false;
        /** @TODO revise */
      }
    },
    clearError(path) {
      const index = this.errors.findIndex(error => error.path === path);
      if (index > -1) {
        this.errors.splice(
          this.errors.findIndex(error => error.path === path),
          1
        );
      }
    },
    ...mapActions(['addFlashMessage'])
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.create-community {
  padding: var(--element-padding-xl);
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  @include mobile {
    padding-bottom: 50px;
  }

  &__header {
    display: grid;
    align-items: end;
    grid-template-rows: minmax(0, 60px);
    grid-template-columns:
      var(--width-very-small)
      max-content var(--width-small);
    grid-gap: var(--element-margin-xl);
    background-color: var(--BG-blog-post);
    padding: 0 var(--element-padding-xl);

    &-wrapper {
      border: var(--border-width-avatar) solid var(--color-white);
      height: 120px;
      z-index: 1;
      border-radius: var(--border-radius);
    }

    &-add-img {
      height: 100%;

      ::v-deep .xl {
        border-radius: 0;
        height: 100%;
      }
    }
  }

  &__add-bg {
    ::v-deep .button {
      padding: 8px var(--element-padding-xxl);
    }
  }

  &__buttons {
    margin-top: var(--element-margin-m);
  }

  &__cancel-btn {
    margin-right: var(--element-margin-m);
    min-width: 90px;
  }

  &__save-btn {
    min-width: 90px;
  }
}
</style>
