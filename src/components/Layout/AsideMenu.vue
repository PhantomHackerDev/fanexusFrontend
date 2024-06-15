<template>
  <aside class="aside-menu" :class="{ toggled: show }">
    <div class="aside-menu__fixed">
      <burger-button
        class="menu-toggler"
        :toggled="show"
        @click.native="handleAsideToggled"
      />
      <div v-if="userAliases" class="icons-bar">
        <div
          :key="`${id}-${index}`"
          v-for="({ id, avatar }, index) in userAliases"
          class="icons-bar__image"
          :class="{ active: isActiveAlias(id) }"
          @click="aliasClickHandler(id)"
        >
          <!-- /*@TODO add dynamic data*/ -->
          <avatar size="md" :file="avatar ? avatar.src : ''" />
          <!-- <badge :info="12" /> @TODO resolve after FAN-175 will be resolved -->
        </div>
        <button
          @click.stop="showAddAliasPopup"
          class="icons-bar__image icons-bar__image--new-account"
          :class="{ disabled }"
          :disabled="disabled"
          v-if="canCreateNewAlias"
        >
          <plus-icon />
        </button>
      </div>
    </div>
    <div class="aside-menu__toggler" v-if="activeAlias">
      <nav class="aside-menu-navigation">
        <h3 v-if="activeAliasBlog">{{ activeAliasBlog.name }}</h3>
        <ul>
          <li v-if="isTablet" class="aside-menu-navigation__link">
            <router-link
              class="header-navigation__link"
              :to="{ name: 'home', params: { order: mainFeedOrder } }"
              >My Feed</router-link
            >
          </li>
          <li v-if="activeAliasBlogUrl" class="aside-menu-navigation__link">
            <router-link
              class="header-navigation__link"
              :to="{
                name: 'blog',
                params: {
                  name: activeAliasBlogUrl,
                  id: activeAliasBlog.link ? undefined : 'id'
                }
              }"
              >My Blog</router-link
            >
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'my-communities' }"
              >My Communities</router-link
            >
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'following' }"
              >Following<badge :info="activeAlias.followingCount"
            /></router-link>
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'followers' }"
              >Followers <badge :info="activeAlias.followedByCount"
            /></router-link>
          </li>
          <li class="aside-menu-navigation__link">
            <router-link
              :to="{ name: 'likes', params: { name: activeAliasBlogUrl } }"
              >Likes <badge :info="activeAlias.likesCount"
            /></router-link>
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'activities' }">
              Activities<badge :info="activeAlias.activitiesCount" />
            </router-link>
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'blocking' }">Blocking</router-link>
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'privacy-groups' }"
              >Privacy groups</router-link
            >
          </li>
          <li class="aside-menu-navigation__link">
            <router-link
              :to="{ name: 'settings-auth' }"
              :class="{
                'router-link-exact-active': $route.matched.some(
                  ({ meta: { settings } }) => settings
                )
              }"
              >Settings</router-link
            >
          </li>
          <li class="aside-menu-navigation__link" v-if="isModerator">
            <router-link
              :to="{ name: 'signup-keys' }"
              :class="{
                'router-link-exact-active': $route.matched.some(
                  ({ meta: { moderation } }) => moderation
                )
              }"
              >Moderation</router-link
            >
          </li>
        </ul>
      </nav>
      <div class="aside-menu__btns">
        <div class="aside-menu__theme-toggler">
          <form-toggler
            name="theme"
            class="form-toggler"
            v-model="themeDarkValue"
            :checked="themeDark"
          >
            Dark mode
          </form-toggler>
        </div>
        <button
          type="button"
          class="aside-menu__logout-btn"
          @click="logoutBtnHandler"
        >
          Logout
          <logout-icon class="logout-icon" />
        </button>
        <div v-if="!isMobile" class="aside-menu__copyrights">
          <copyrights />
        </div>
      </div>
    </div>
    <alias-modal
      :settings="aliasModalSettings"
      v-if="aliasModalSettings.show"
      :data="aliasPopupModalData"
      @close="handleAliasModalClosed"
    />
    <fanexus-footer v-if="isMobile" class="aside-menu__footer" />
  </aside>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Badge from '~common/Badge';
import Copyrights from '~common/Copyrights';
import Avatar from '~common/Avatar';
import AliasModal from '~common/AliasModal';
import PlusIcon from '~svg/plus.svg';
import LogoutIcon from '~svg/logout.svg';
import FormToggler from '~common/Fields/FormToggler';
import BurgerButton from '~common/Buttons/BurgerButton';
import FanexusFooter from '@/components/Layout/Footer';

export default {
  name: 'fanexus-aside-menu',
  components: {
    PlusIcon,
    FormToggler,
    LogoutIcon,
    Avatar,
    Badge,
    AliasModal,
    Copyrights,
    BurgerButton,
    FanexusFooter
  },
  data() {
    return {
      aliasModalSettings: {
        show: false,
        title: 'Alias',
        dismissText: 'Cancel',
        actionText: 'Save'
      },
      aliasPopupModalData: {
        accessUrl: '',
        baseUrl: '',
        imageIdentifier: '',
        aliasName: ''
      },
      currentWatch: null
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /*@TODO add a corresponding side effect to the login action (if needed) */
    ...mapActions([
      'logout',
      'getUserAliases',
      'setActiveAlias',
      'removeActiveAlias',
      'clearUserAliases',
      'setPrivacyGroups',
      'watchActiveAliasActivitiesCount',
      'unwatchActiveAliasActivitiesCount',
      'setTheme'
    ]),
    handleAsideToggled() {
      this.$emit('asideToggled');
    },
    showAddAliasPopup() {
      this.aliasModalSettings.show = true;
    },
    async aliasClickHandler(newActiveAliasId) {
      if (newActiveAliasId !== this.activeAliasId) {
        return this.setActiveAlias(newActiveAliasId);
      }
    },
    /** @TODO revise if needed */
    refreshAliasModalData() {
      this.aliasPopupModalData = {
        ...this.aliasPopupModalData,
        imageIdentifier: '',
        aliasName: '',
        accessUrl: '',
        baseUrl: ''
      };
    },
    handleAliasModalClosed() {
      this.aliasModalSettings.show = false;
      this.refreshAliasModalData();
    },
    async logoutBtnHandler() {
      await this.logout();
      this.removeActiveAlias();
      this.clearUserAliases();
    }
  },
  computed: {
    ...mapState({
      themeDark: state => state.theme.themeDark,
      userAliases: state => state.alias.userAliases,
      canCreateNewAlias: state => state.alias.canCreateNewAlias,
      activeAliasId: state => state.alias.activeAliasId,
      isModerator: state => state.auth.userData.moderator,
      mainFeedOrder: state => state.feed.mainFeedOrder
    }),
    ...mapGetters([
      'activeAlias',
      'activeAliasBlog',
      'activeAliasBlogUrl',
      'activeAliasBlogId',
      'isTablet',
      'isMobile'
    ]),
    isActiveAlias() {
      return id => this.activeAliasId === id;
    },
    themeDarkValue: {
      get: function() {
        return this.themeDark;
      },
      set: function(value) {
        this.setTheme(value);
      }
    }
  },
  watch: {
    activeAliasBlogId: {
      handler(val) {
        if (val) {
          return this.setPrivacyGroups();
        }
      },
      immediate: true
    }
  },
  async mounted() {
    if (!this.userAliases.length) {
      await this.getUserAliases();
    }
    if (!this.userAliases.map(({ id }) => id).includes(this.activeAliasId)) {
      await this.aliasClickHandler(this.userAliases[0].id);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.wrapper.logged .aside-menu {
  display: flex;
}
.aside-menu {
  grid-area: aside;
  display: none;
  overflow: hidden;
  width: var(--width-aside);
  transition: var(--transition-default);

  @include mobile {
    transform: translateX(-100%);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 2;
    min-height: 100%;
  }

  &.toggled {
    width: 260px;
    @include mobile {
      transform: translateX(0);
      width: 100%;
    }
    .aside-menu__toggler {
      left: var(--width-aside);
    }

    .aside-menu__fixed {
      background-color: var(--BG-navbar);
      z-index: var(--z-index-popup-overlay);
    }

    .aside-menu-navigation {
      background-color: var(--BG-aside-togglable);
      z-index: var(--z-index-popup);
    }
    .aside-menu__btns {
      background-color: var(--BG-aside-togglable);
      z-index: var(--z-index-popup);
    }
  }

  &__fixed {
    position: relative;
    z-index: var(--z-index-1);
    width: var(--width-aside);
    background: var(--BG-navbar);

    .menu-toggler {
      margin: var(--element-margin-l) auto;
      @include mobile {
        visibility: hidden;
      }
    }

    .icons-bar {
      padding: var(--element-padding-s);
      padding-top: var(--element-padding-l);

      &__image {
        width: 40px;
        height: 40px;
        border-radius: var(--border-radius);
        margin-bottom: var(--element-margin-l);
        position: relative;
        cursor: pointer;
        opacity: var(--opacity-image-overlay);
        transition: var(--transition-default);
        ::v-deep img {
          border: var(--border-width-thin) solid transparent;
        }

        &--new-account {
          background-color: var(--color-white);
          display: flex;
          justify-content: center;
          align-items: center;
          &:focus {
            outline: none;
          }
          &:hover {
            background-color: var(--checkbox-normal);
          }
          &.disabled {
            background-color: var(--text-create-account-inactive);
            ::v-deep svg {
              fill: var(--BG-input);
            }
          }
        }

        &.active {
          opacity: 1;
          box-shadow: var(--box-shadow-alias);

          ::v-deep img {
            border: var(--border-width-thin) solid var(--color-white);
          }
        }

        ::v-deep img {
          height: 100%;
          width: 100%;
          object-position: top;
        }

        ::v-deep .badge {
          position: absolute;
          top: -10px;
          right: 0;
        }
      }
    }
  }

  &__toggler {
    padding: var(--width-aside) 0 var(--element-padding-xl)
      var(--element-padding-s);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    height: 100%;
    left: -140px;
    width: var(--width-small);

    background-color: var(--BG-aside-togglable);
    transition: var(--transition-default);
    box-shadow: var(--box-shadow);
    overflow: hidden;

    @include mobile {
      left: var(--width-aside);
      width: calc(100vw - var(--width-aside));
      padding-bottom: 25px;
      overflow-y: auto;
    }

    &:hover {
      overflow: auto;
      @include mobile {
        overflow-y: auto;
      }
    }
  }

  &__btns {
    padding-left: var(--element-padding-s);
    font-size: var(--size-regular);
  }

  &__copyrights {
    margin: var(--element-margin-l) 0;
    ::v-deep {
      .copyrights {
        color: var(--color-white);
        a {
          color: var(--color-white);

          &:hover {
            color: var(--color-main-500);
          }
        }
      }
    }
  }

  &__theme-toggler {
    margin-bottom: var(--element-margin-m);
    margin-top: var(--element-margin-m);
    color: var(--color-white);

    .form-toggler {
      vertical-align: middle;
    }
  }

  &__logout-btn {
    background: none;
    color: var(--color-white);
    margin-bottom: var(--element-margin-m);
    margin-top: var(--element-margin-m);
    &:focus {
      outline: none;
      color: var(--color-main-500);
      .logout-icon {
        fill: var(--color-main-500);
      }
    }

    .logout-icon {
      margin-left: var(--element-margin-xs);
      vertical-align: bottom;
      height: 12px;
      fill: var(--color-white);
    }
  }

  h3 {
    padding: var(--element-padding-s);
    background-color: rgba(255, 255, 255, 0.25);
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
    margin-bottom: var(--element-margin-xl);
    color: var(--color-white);
    font-size: var(--size-regular);
    font-family: 'OpenSans-Bold', sans-serif;
    line-height: 21px;
  }

  &-navigation {
    padding-top: var(--element-padding-s);
    list-style: none;

    &__link {
      margin-bottom: var(--element-padding-s);
      display: flex;
      align-items: center;

      ::v-deep {
        .badge {
          padding: 0 calc(var(--button-padding-m) / 1.5);
          margin-left: 15px;
          display: block;
        }

        a {
          padding: var(--element-padding-s);
          border-top-left-radius: var(--border-radius);
          border-bottom-left-radius: var(--border-radius);
          text-decoration: none;
          color: var(--color-white);
          font-size: var(--size-regular);
          line-height: 21px;
          width: 100%;
          display: flex;
          transition: var(--transition-default);

          &.router-link-exact-active {
            background-color: var(--BG-navbar);
            border-top-left-radius: var(--border-radius);
            border-bottom-left-radius: var(--border-radius);
          }

          &:hover {
            background-color: var(--BG-navbar);
          }

          &:focus {
            background-color: var(--BG-navbar);
          }
        }
      }
    }
  }

  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 3;
    background-color: var(--BG-navbar);
    margin: 0;
  }
}
</style>
