<template>
  <div class="edit-community" v-if="data">
    <modal
      class="edit-community-modal modal-overlay--centered"
      :settings="settings"
      @save="handleSave"
      :closeOnSave="false"
      :action-disabled="disableSave"
    >
      <template slot="body">
        <add-image
          :type="blogImageTypes.coverImage"
          class="edit-community__add-bg"
          button-text="Add Background"
          @add="handleAddImage"
        >
          <wallpaper :src="coverImageData" />
        </add-image>
        <div class="edit-community__header">
          <div class="edit-community__header-wrapper">
            <add-image
              :type="blogImageTypes.avatar"
              class="edit-community__header-add-img"
              @add="handleAddImage"
              button-text="Change Image"
            >
              <avatar
                class="edit-community-header__avatar"
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
          @space-remaining="spaceRemaining = $event"
          @space-remaining-rules="
            $set(spaceRemainingRules, $event.index, $event.space)
          "
          @space-remaining-links="
            $set(spaceRemainingLinks, $event.index, $event.space)
          "
        />
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import Wallpaper from '~common/Wallpaper';
import Avatar from '~common/Avatar';
import Modal from '~common/Modal';
import AddImage from '../common/AddImage';
import Tabs from '~common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';
import validationMixin from '@/mixins/validation.mixin';
import {
  getCommunity,
  editCommunity,
  blogImageTypes,
  communityRoot,
  communityEditAreas
} from '@/services/Community/community.service';
import CommunityProfile from '@/components/Community/CommunityProfile';
import CommunitySettings from '@/components/Community/CommunitySettings';

export default {
  components: {
    AddImage,
    Wallpaper,
    Avatar,
    Modal,
    Tabs,
    CommunityProfile,
    CommunitySettings
  },
  props: {
    name: {
      type: String,
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  mixins: [tabsMixin, validationMixin],
  data() {
    return {
      blogImageTypes,
      activeTab: 0,
      currentComponent: 'community-profile',
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
      data: null,
      errors: [],
      saving: false,
      spaceRemaining: 0,
      spaceRemainingRules: [],
      spaceRemainingLinks: []
    };
  },
  computed: {
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
    communityEditComponents() {
      return getComponentsByPrefix.call(this, communityRoot);
    },
    disableSave() {
      return (
        this.spaceRemaining < 0 ||
        this.spaceRemainingRules.some(
          ruleSpaceRemaining => ruleSpaceRemaining < 0
        ) ||
        this.spaceRemainingLinks.some(
          ruleSpaceRemaining => ruleSpaceRemaining < 0
        )
      );
    },
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = ['community-profile', 'community-settings'][
        componentIndex
      ];
    },
    handleAddImage({ type, data }) {
      this.data[type] = data;
    },

    async handleSave() {
      if (this.saving) {
        return;
      }
      this.saving = true;

      /** @TODO revise */
      const {
        name,
        link,
        links,
        description,
        avatar,
        coverImage,
        hideFromMinors,
        hideFromSearch,
        requireApproval,
        contentAccessControl,
        followsAccessControl,
        commentsAccessControl,
        postingAccessControl,
        membersAccessControl,
        reactionsAccessControl
      } = this.data;
      const payload = {
        alias: this.activeAliasId,
        showMinors: !hideFromMinors,
        hideFromSearchResults: hideFromSearch,
        requireApproval,
        contentAccessControl,
        followsAccessControl,
        postingAccessControl,
        commentsAccessControl,
        membersAccessControl,
        reactionsAccessControl,
        name,
        link,
        links: links.filter(({ length }) => length),
        description,
        rules: this.data.communityRules
          .map(({ name, description }) => ({
            name,
            description
          }))
          .filter(({ name, description }) => name.length && description.length),
        tagDisplays: this.data.Tags.map(({ id, name, displaySynonym }) => ({
          id,
          displaySynonym: displaySynonym || name
        })),
        ...(avatar && avatar.accessUrl && { avatar }),
        ...(coverImage && coverImage.accessUrl && { coverImage })
      };

      try {
        await editCommunity(this.data.id, payload);
        const feedParams = { name: link };
        this.updateFeedParams(feedParams);
        await this.reloadFeed();
        this.$router.push({
          name: 'community',
          params: feedParams
        });
        this.addFlashMessage({
          message: 'Community updated'
        });
      } catch (e) {
        this.errors =
          (e.response && e.response.data && e.response.data.errors) || [];
        this.addFlashMessage({
          message: 'Community update failed',
          type: 'failure'
        });
        this.saving = false;
      }
    },
    ...mapActions([
      'sortRules',
      'reloadFeed',
      'updateFeedParams',
      'addFlashMessage'
    ])
  },
  async mounted() {
    this.data = (result => ({
      ...result,
      hideFromSearch: result.hideFromSearchResults,
      hideFromMinors: !result.showMinors,
      rules: result.communityRules.map(({ name, description }) => ({
        name,
        description
      }))
    }))(
      await getCommunity({
        name: this.name,
        pagination: 1
      })
    );
    this.data.communityRules.sort((rule1, rule2) => rule1.id - rule2.id);
  }
};
</script>

<style lang="scss" scoped>
.edit-community {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);

  &__header {
    display: grid;
    align-items: end;
    grid-template-rows: minmax(0, 60px);
    grid-template-columns:
      var(--width-very-small)
      auto;
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
}
</style>
