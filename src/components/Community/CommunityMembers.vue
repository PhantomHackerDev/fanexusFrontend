<template>
  <section class="members">
    <flash-message v-if="success">{{ successMessage }}</flash-message>
    <tab-content-grid
      :showSearch="true"
      btnSecondary="Invite members"
      btnPrimary="Delete members"
      title="Members"
      @handleSecondaryBtn="handleModalOpen"
      @handle-input="handleInput"
      :note="
        data && data.userHasEditPermissions
          ? 'As a moderator, you can remove members or make other members moderators from here.'
          : ''
      "
    >
      <template v-if="groups">
        <group-component
          group-component-type="blog"
          :link="link"
          :isAddingUser="true"
          @add="addUserAsModerator(aliasId)"
          v-for="({ id: aliasId, name, avatar, updatedAt, Blog: { id, link } },
          index) in groups"
          :key="`${id}-${index}`"
          :id="id"
          :name="name"
          :image="avatar ? avatar.src : ''"
          activityName="Updated at:"
          :date="updatedAt"
          :userHasEditPermissions="data && data.userHasEditPermissions"
          @delete="showModal(aliasId)"
          :options="dropdownOptionsMembers"
        />
        <confirmation-modal
          @submit="deleteMember"
          v-if="settings.show"
          :settings="settings"
        />
      </template>
    </tab-content-grid>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import {
  communityAreas,
  getMembers,
  removeMemberFromCommunity,
  addModerators
} from '@/services/Community/community.service';
import GroupComponent from '@/components/Blog/GroupComponent';
import TabContentGrid from '../common/TabContentGrid';
import ConfirmationModal from '../common/ConfirmationModal';
import { deleteItemById } from '@/utils/array';
import formMessagesMixin from '@/mixins/form-messages.mixin';

export default {
  name: communityAreas.members,
  components: {
    GroupComponent,
    TabContentGrid,
    ConfirmationModal
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    communityId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      /*@TODO revise*/
      groups: [],
      activeItem: null,
      settings: {
        show: false,
        title: 'Remove member',
        /** @TODO make 'Cancel' a default dismissText  */
        removedItem: 'user',
        removedFrom: 'members',
        dismissText: 'Cancel',
        actionText: 'Remove',
        data: []
      },
      dropdownOptionsMembers: [
        {
          text: 'Remove member',
          action: 'delete',
          special: true,
          togglable: false
        },
        {
          text: 'Add user as moderator',
          action: 'add',
          special: false,
          togglable: false
        }
      ],
      successMessage: 'Added user as moderator.'
    };
  },
  mixins: [formMessagesMixin],
  methods: {
    handleModalOpen() {
      /** @TODO make it common */
      this.$emit('openModal');
    },
    showModal(id) {
      this.activeItem = id;
      this.settings.show = true;
    },
    removeItemFromArray() {
      deleteItemById(this.activeItem, this.groups, () => {
        if (this.activeItem === this.activeAliasId) {
          this.$emit('removed-self');
        }
        this.activeItem = null;
      });
    },
    async deleteMember() {
      const payload = {
        alias: this.activeAliasId,
        removeMemberId: this.activeItem
      };
      try {
        await removeMemberFromCommunity(this.communityId, payload);
        this.removeItemFromArray();
      } catch (e) {
        return false;
      }
    },
    async addUserAsModerator(id) {
      if (id) {
        const payload = {
          alias: this.activeAliasId,
          moderators: [id]
        };
        try {
          await addModerators(this.communityId, payload);
          this.showSuccess();
        } catch (e) {
          return false;
        }
      }
    },
    async getData(filterBy) {
      this.groups = await getMembers(this.communityId, 1, filterBy);
    },
    async handleInput(input) {
      await this.getData(input);
    }
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      isMember: state => state.feed.data.aliasIsMember
    })
  },
  watch: {
    async isMember() {
      await this.getData();
    }
  },
  async mounted() {
    await this.getData();
  }
};
</script>
<style lang="scss" scoped></style>
