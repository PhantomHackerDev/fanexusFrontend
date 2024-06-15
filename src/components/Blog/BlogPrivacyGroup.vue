<template>
  <section class="privacy-group">
    <div class="privacy-group__wrapper">
      <!--  @TODO make it dynamic -->

      <!--  @TODO adjust the UI in accordance with the existing style guide, see https://temperance-software.atlassian.net/browse/FAN-271 -->
      <privacy-group-list
        class="privacy-group-list"
        :privacy-groups="privacyGroups"
        :current-privacy-group="currentPrivacyGroup"
        @create-new-privacy-group="createPrivacyGroupAndSelect"
        @set-privacy-group="setPrivacyGroup"
      />
      <div class="privacy-group__display">
        <form v-if="currentPrivacyGroup.id">
          <div
            v-for="(privacyOption, index) in privacyOptions"
            :key="`${privacyOption.name}-${index}`"
          >
            <h4
              class="privacy-option__title"
              v-if="privacyOption.type === 'radio-button'"
            >
              {{ privacyOption.title }}
            </h4>
            <component
              v-if="!privacyOption.selections"
              :is="`form-${privacyOption.type}`"
              :name="privacyOption.name"
              v-model="currentPrivacyGroup[privacyOption.name]"
              :labelText="privacyOption.title"
              :placeholder="privacyOption.title"
              context="settings"
              v-slot:after
              >{{ privacyOption.title }}</component
            >
            <form-radio-button
              v-else
              :name="privacyOption.name"
              v-for="(selection, index) in privacyOption.selections"
              :key="`${selection.value}-${index}`"
              :value="selection.value"
              v-model="currentPrivacyGroup[privacyOption.name]"
              :no-pristine="true"
              >{{ selection.description }}</form-radio-button
            >
          </div>
          <template
            v-if="[4, 5].includes(currentPrivacyGroup.accessControlSetting)"
          >
            <h4 class="privacy-group__title">Aliases</h4>
            <div class="privacy-group__user-search">
              <form-input
                class="privacy-group__user-search-input"
                type="search"
                name="find-blog"
                placeholder="Find blog to add"
                v-model="findAliasInput"
                @focus="startInputAlias"
                @blur="endInputAlias"
              />
              <div
                class="privacy-group__user-search-result"
                v-if="inputtingAlias && findAliasesItems.length"
              >
                <div
                  class="privacy-group__user-search-result-entry"
                  v-for="(alias, index) of findAliasesItems"
                  :key="`${alias.id}-${index}`"
                  @mousedown="addMemberFromInput(alias)"
                >
                  {{ alias.name }}
                </div>
              </div>
            </div>
            <div
              class="privacy-group__members"
              v-if="currentPrivacyGroup.aliases.length"
            >
              <ul class="privacy-group__members-list">
                <li
                  class="privacy-group__members-list-item"
                  v-for="(alias, index) of currentPrivacyGroup.aliases"
                  :key="`${alias.id}-${index}`"
                >
                  {{ alias.name }}
                  <button
                    type="button"
                    class="cross-button"
                    @click.stop="
                      removeMember({ privacyGroup: currentPrivacyGroup, alias })
                    "
                  >
                    <cross-icon class="cross-button__icon" />
                  </button>
                </li>
              </ul>
            </div>
            <div class="privacy-group__none-message" v-else>
              {{ noneMessage }}
            </div>
            <h4 class="privacy-group__title">Auto-add members from</h4>
            <privacy-group-selection
              :value="currentPrivacyGroup.subsets"
              :current-privacy-group="currentPrivacyGroup"
              @add-privacy-group="
                addSubset({ privacyGroup: currentPrivacyGroup, subset: $event })
              "
              @remove-privacy-group="
                removeSubset({
                  privacyGroup: currentPrivacyGroup,
                  subset: $event
                })
              "
            />
          </template>
          <form-button
            class="privacy-group__delete-button"
            text="Delete privacy group"
            @click.native.stop="deletePrivacyGroupFromMenu(currentPrivacyGroup)"
          />
          <div class="note">
            Where's the save button? There isn't any because all changes are
            automatically saved.
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import GroupComponent from '@/components/Blog/GroupComponent';
import FormInput from '~common/Fields/FormInput';
import FormButton from '~common/Buttons/FormButton';
import FormToggler from '~common/Fields/FormToggler';
import FormRadioButton from '~common/Fields/FormRadioButton';
import PrivacyGroupList from '@/components/PrivacyGroup/PrivacyGroupList.vue';
import PrivacyGroupSelection from '@/components/PrivacyGroup/PrivacyGroupSelection.vue';
import { blogModalTypes, blogAreas } from '@/services/Blog/blog.service';
import { findAliases } from '@/services/alias.service';
import { privacyOptions } from '@/services/privacy-group.service';
import { mapState, mapActions } from 'vuex';
import CrossIcon from '~svg/cross-icon.svg';
import { getIndexById, getById } from '@/utils/array.js';

export default {
  name: blogAreas.privacyGroup,
  components: {
    GroupComponent,
    FormInput,
    FormButton,
    FormToggler,
    FormRadioButton,
    PrivacyGroupList,
    PrivacyGroupSelection,
    CrossIcon
  },
  data() {
    return {
      blogModalTypes,
      currentPrivacyGroup: {
        id: 0,
        name: '',
        isDefault: false,
        accessControlSetting: 0,
        aliases: [],
        subsets: []
      },
      findAliasInput: '',
      findAliasesItems: [],
      inputtingAlias: false,
      privacyOptions,
      lastSubsetChange: 0
    };
  },
  methods: {
    ...mapActions([
      'createPrivacyGroup',
      'updatePrivacyGroup',
      'deletePrivacyGroup',
      'addMember',
      'removeMember',
      'addSubset',
      'removeSubset'
    ]),
    async setPrivacyGroup(privacyGroup) {
      if (!privacyGroup.loaded) {
        await privacyGroup.loadData();
      }
      const context = this;
      this.currentPrivacyGroup = new Proxy(privacyGroup, {
        set(target, name, value) {
          context.updatePrivacyGroup({
            privacyGroup,
            params: {
              accessControlSetting: privacyGroup.accessControlSetting,
              [name]: value
            }
          });
          return true;
        }
      });
    },
    async createPrivacyGroupAndSelect() {
      await this.setPrivacyGroup(await this.createPrivacyGroup());
    },
    startInputAlias() {
      this.inputtingAlias = true;
    },
    endInputAlias() {
      this.inputtingAlias = false;
    },
    async addMemberFromInput(alias) {
      this.addMember({ privacyGroup: this.currentPrivacyGroup, alias });
      this.findAliasInput = '';
    },
    alreadyMember(alias) {
      return getById(alias.id, this.currentPrivacyGroup.aliases);
    },
    async deletePrivacyGroupFromMenu(privacyGroupToDelete) {
      const index = getIndexById(privacyGroupToDelete.id, this.privacyGroups);
      await Promise.all([
        this.setPrivacyGroup(
          this.privacyGroups[index + 1] || this.privacyGroups[index - 1]
        ),
        this.deletePrivacyGroup({ id: privacyGroupToDelete.id, index })
      ]);
    }
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      privacyGroups: state => state.privacyGroup.list
    }),
    noneMessage() {
      return this.currentPrivacyGroup.accessControlSetting === 4
        ? 'Currently showing only to myself'
        : 'Currently hiding from no one, same as public';
    }
  },
  watch: {
    async findAliasInput(input) {
      if (input) {
        const aliases = await findAliases({
          aliasPart: input,
          alias: this.activeAliasId
        });
        this.findAliasesItems = aliases.filter(
          alias => !this.alreadyMember(alias)
        );
      } else {
        return (this.findAliasesItems = []);
      }
    }
  },
  mounted() {
    if (this.privacyGroups.length) {
      return this.setPrivacyGroup(this.privacyGroups[0]);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.privacy-group {
  grid-area: content;
  padding: var(--element-padding-l);
  overflow: auto;
  @include mobile {
    padding-bottom: 50px;
  }

  &__wrapper {
    display: flex;
    padding: var(--element-padding-s);
    border: var(--border-width-default) solid var(--border-block);
    border-radius: var(--border-radius);
    background-color: var(--BG-blog-post);
    max-width: var(--width-large);
    margin: 0 auto;
    @include tablet {
      display: block;
    }
  }

  ::v-deep input {
    width: var(--width-medium-small);
    @include tablet {
      width: 100%;
    }
  }

  ::v-deep .toggler-settings {
    margin-top: var(--element-margin-s);
    & input {
      width: auto;
    }
  }

  ::v-deep .select {
    @include tablet {
      width: auto;
    }
  }

  h4 {
    color: var(--text-primary);
    margin-top: var(--element-margin-s);
  }

  &-list {
    flex-grow: 1;
    flex-basis: 0;
  }

  &__display {
    flex-grow: 4;
    flex-basis: 0;
    padding: var(--element-padding-m);
    max-width: 100%;
    min-width: 0;
  }

  &__user-search {
    margin: var(--element-margin-m) 0;
    display: relative;

    &-result {
      left: var(--element-padding-xs);
      top: 100%;
      border: var(--border-width-thin) solid var(--border-tag);
      padding: var(--element-padding-s);
      border-radius: var(--border-radius);
      background-color: var(--BG-dropdown);
      cursor: pointer;
      &-entry {
        color: var(--text-primary);
        padding: var(--element-padding-xs);
        border-radius: var(--border-radius);

        &:hover {
          background-color: var(--BG-button-primary-hover);
          color: var(--tab-active);
        }
      }
    }
  }

  &__members-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    &-item {
      color: var(--text-primary);
      font-size: var(--size-small);
      padding: var(--element-padding-xs);
      border: 1px solid var(--border-tag);
      border-radius: var(--border-radius);
      margin: var(--element-margin-xs);
    }
  }

  &__none-message {
    color: var(--text-primary);
    font-size: var(--size-small);
  }

  &__delete-button {
    background-color: var(--error);
    border-color: var(--error);
    color: var(--color-white);
    &:hover {
      color: var(--color-white);
    }
  }
}

.note {
  margin-top: var(--element-margin-s);
  font-size: var(--size-small);
  color: var(--text-primary);
}

::v-deep .tab-content {
  grid-column-gap: var(--element-margin-xl);
}

::v-deep .form-input {
  input {
    background-color: var(--BG-blog-post);
  }
}

.cross-button {
  position: relative;
  background: transparent;
  outline: none;

  &__icon {
    stroke-width: 5px;
    stroke: var(--text-primary);
    width: 10px;
    height: 8px;
  }
}
</style>
