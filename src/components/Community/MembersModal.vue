<template>
  <modal
    class="members-modal modal-overlay--centered"
    :settings="settings"
    :actionDisabled="!activeItem"
    @save="inviteMember()"
    :closeOnSave="false"
  >
    <template slot="body">
      <p v-if="addedMember" class="members-modal__user">
        User
        <span class="members-modal__user-name">{{ addedMember }}</span>
        was successfully added to the security group.
      </p>
      <form class="members-modal__search-field" @submit.prevent>
        <form-input
          @input="handleInput"
          class="members-modal__name"
          type="search"
          name="find-community"
          placeholder="Find user"
        />
      </form>
      <div class="members-modal__container">
        <div class="members-modal__wrapper" slot="body">
          <template v-if="settings.data">
            <author-title
              v-for="({ id, name, avatar }, index) of settings.data"
              :key="`${id}-${index}`"
              class="group__item"
              :name="name"
              :image="avatar ? avatar.src : ''"
              :class="{ active: activeItem === id }"
              @click.native.stop="activateItem(id)"
            />
          </template>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import { mapState } from 'vuex';
import { deleteItemById } from '@/utils/array';
import { findAliases } from '@/services/alias.service';
import Modal from '../common/Modal';
import FormInput from '../common/Fields/FormInput';
import AuthorTitle from '../common/AuthorTitle';
import { inviteMember } from '@/services/Community/community.service';
export default {
  components: {
    AuthorTitle,
    Modal,
    FormInput
  },
  props: {
    settings: {
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
      activeItem: null,
      addedMember: null
    };
  },
  methods: {
    /** @TODO add debounce functionality @see https://temperance-software.atlassian.net/browse/FAN-202 */
    async handleInput(value) {
      try {
        this.settings.data = await findAliases({
          aliasPart: value,
          context: { context: 'community', id: this.communityId },
          alias: this.activeAliasId
        });
      } catch (e) {
        return false;
      }
    },
    activateItem(id) {
      this.activeItem = id;
    },
    removeItemFromArray() {
      deleteItemById(this.activeItem, this.settings.data, () => {
        this.activeItem = null;
      });
    },
    async inviteMember() {
      if (this.activeItem) {
        const payload = {
          alias: this.activeAliasId,
          invitedAliasId: this.activeItem
        };
        try {
          await inviteMember(this.communityId, payload);
          this.removeItemFromArray();
          this.updateModalData(true);
        } catch (e) {
          return false;
        }
      }
    },
    /** @TODO check if we still need that method */
    updateModalData(isAdd) {
      const timeOut = 30000;
      deleteItemById(this.activeItem, this.data, indexToDelete => {
        const getUserName = this.data[indexToDelete].name;
        this.activeItem = null;
        if (isAdd) {
          this.addedMember = getUserName;
          setTimeout(() => (this.addedMember = null), timeOut);
        }
      });
    }
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  }
};
</script>

<style lang="scss" scoped>
.members-modal {
  padding: var(--element-padding-xl);
  &__user {
    font-family: OpenSans-Regular;
    font-size: var(--size-regular);
    color: var(--text-primary);
    margin-bottom: var(--element-margin-l);
    line-height: 1.5em;
  }
  &__user {
    color: var(--text-secondary);
    &-name {
      font-family: 'OpenSans-Bold', sans-serif;
    }
  }
  &__container {
    max-height: 50vh;
    overflow: auto;
  }
  &__wrapper {
    display: grid;
    grid-gap: var(--element-margin-s);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-right: var(--element-padding-s);
    padding-bottom: var(--element-padding-s);
  }

  &__search-field {
    position: relative;
    align-items: center;
    margin-bottom: var(--element-margin-l);
    background-color: var(--BG-input);
  }
  ::v-deep {
    .modal-body {
      padding-bottom: 0;
    }
    .group__item {
      padding: var(--element-padding-m);
      margin-bottom: 0;
      border: var(--border-width-thin) solid var(--border-group-normal);
      border-radius: var(--border-radius);
      cursor: pointer;
      background-color: var(--BG-input);
      overflow: auto;
      &:hover {
        border-color: var(--border-input-hover);
      }
      &.active {
        border-color: var(--border-active);
      }
    }
  }
}
</style>
