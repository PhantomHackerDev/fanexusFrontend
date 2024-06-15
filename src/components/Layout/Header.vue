<template>
  <header class="header" v-click-outside="handleClickOutside">
    <div
      class="header-left"
      :class="{ 'header-left_opened': isMobileSearchOpen }"
    >
      <router-link
        class="header__home-link"
        :class="{
          'header__home-link_hidden': isMobileSearchOpen,
          'header__home-link_mobile-full': isAsideOpened
        }"
        :to="{ name: 'home', params: { order: mainFeedOrder } }"
        ><fanexus-login-logo class="fanexus-logo"
      /></router-link>
      <nav
        class="header-navigation"
        :class="{ 'header-navigation_mobile-opened': isMobileSearchOpen }"
      >
        <ul class="header-navigation__list">
          <template v-if="!isTablet">
            <li>
              <router-link
                class="header-navigation__link"
                :to="{ name: 'home', params: { order: mainFeedOrder } }"
                >Feed</router-link
              >
            </li>
            <li v-if="activeAliasBlog && activeAliasBlog.id">
              <router-link
                class="header-navigation__link"
                :to="{
                  name: 'blog',
                  params: { name: activeAliasBlog.link || activeAliasBlog.id }
                }"
                >Blog</router-link
              >
            </li>
          </template>
          <li
            v-if="!(isMobile && !isMobileSearchOpen)"
            class="header-navigation__tags-area"
          >
            <div class="header-navigation__tags">
              <tag-input
                class="header-navigation__tags-field"
                name="tags"
                :placeholder="
                  !isMobile ? 'Find by tag or tag combination' : 'Find by tag'
                "
                :allow-new="false"
                :list="tags"
                @list-change="updateTags"
                @select-tag="goToTag"
                :height-limited="true"
              />
              <form-button
                class="header-navigation__tags-find-button"
                @click.native.stop="goToTagFindPage"
                text="Go"
                ref="go-find-by-tag"
              />
              <form-button
                class="header-navigation__new-tag-button"
                @click.native.stop="goToNewTagPage"
                text="New tag"
                v-if="isAuthenticated"
              />
            </div>
          </li>
          <icon-button
            v-else-if="isMobile && !isAsideOpened"
            icon="magnifier"
            label="Open tag search"
            class="header-navigation__mobile-search-button"
            @click.native.stop="isMobileSearchOpen = true"
          />
        </ul>
      </nav>
    </div>
    <div class="header-right">
      <template v-if="isAuthenticated">
        <burger-button
          v-if="isMobile"
          :toggled="isAsideOpened"
          @click.native="$emit('asideToggled')"
        />
        <form-button
          v-else-if="!isTablet"
          :header-button="true"
          @click.native.stop="$emit('openCreatePostModal')"
          text="Create blog post"
        />
        <icon-button
          v-else
          icon="pencil"
          label="Create blog post"
          class="header-right__tablet-new-post-button"
          @click.native.stop="$emit('openCreatePostModal')"
        />
      </template>
      <template v-else>
        <form-button
          :header-button="true"
          @click.native.stop="$emit('openAuthModal', authAreas.login)"
          :text="isMobile && signupKey ? 'Login or create account' : 'Login'"
          :small="isMobile && signupKey"
          class="header-right__login-button"
        />
        <form-button
          v-if="signupKey && !isMobile"
          :header-button="true"
          @click.native.stop="$emit('openAuthModal', authAreas.createUser)"
          text="Create account"
          type="submit"
        />
      </template>
    </div>
  </header>
</template>
<script>
import { routerSecureNavigation } from '@/services/router.service';
import FanexusLoginLogo from '~svg/fanexus-login-logo.svg';
import FormButton from '~common/Buttons/FormButton';
import TagInput from '~common/Fields/TagInput';
import IconButton from '~common/Buttons/IconButton';
import BurgerButton from '~common/Buttons/BurgerButton';
import { mapActions, mapState, mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import { authAreas } from '@/services/auth.service';
import tagListMixin from '@/mixins/tag-list.mixin';

export default {
  name: 'fanexus-header',
  components: {
    FanexusLoginLogo,
    FormButton,
    TagInput,
    IconButton,
    BurgerButton
  },
  props: {
    isAsideOpened: {
      type: Boolean
    }
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      tags: [],
      authAreas,
      isMobileSearchOpen: false
    };
  },
  mixins: [tagListMixin],
  methods: {
    ...mapActions(['setSignupKey']),
    updateTags(tags) {
      this.tags = tags;
      this.updateHeaderHeight();
    },
    goToTagFindPage() {
      routerSecureNavigation(
        {
          name: 'tagged-blog-posts',
          params: {
            tagNames: JSON.stringify(this.tags.map(({ name }) => name))
          }
        },
        this.tags
      );
    },
    goToNewTagPage() {
      routerSecureNavigation({
        name: 'new-tag'
      });
    },
    handleClickOutside() {
      this.isMobileSearchOpen = false;
    },
    async updateHeaderHeight() {
      await this.$nextTick();
      this.$store.commit('setHeaderHeight', this.$el.offsetHeight);
    }
  },
  computed: {
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated,
      signupKey: state => state.auth.signupKey,
      mainFeedOrder: state => state.feed.mainFeedOrder
    }),
    ...mapGetters(['activeAliasBlog', 'isTablet', 'isMobile'])
  },
  async mounted() {
    const signupKey = this.$route.query['key'];
    if (signupKey) {
      this.setSignupKey(signupKey);
    }
    this.updateHeaderHeight();
  },
  watch: {
    isAsideOpened() {
      this.isMobileSearchOpen = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.fanexus-logo {
  /*@TODO fix issue when the modal is open*/
  fill: var(--color-white);
  height: 15px;
  margin-right: calc(var(--element-margin-xxl) * 2);
}
.aside-menu.toggled + .header {
  margin-left: -200px;
  @include mobile {
    margin-left: 0;
  }
}
.header {
  grid-area: header;
  background-color: var(--BG-navbar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: var(--transition-default);
  padding: 0 var(--element-padding-xl) 0 calc(var(--element-padding-xl) * 2);
  @include tablet {
    padding: 0 var(--element-padding-xl) 0 calc(var(--element-padding-xl));
  }
  @include mobile {
    padding: 0 var(--element-padding-l) 0 calc(var(--element-padding-l));
    position: sticky;
    top: 0;
    z-index: 2;
  }

  &__home-link {
    z-index: var(--z-index-1);
    @include tablet {
      width: 120px;
    }
    @include mobile {
      width: 18px;
      overflow: hidden;
      transition: width var(--transition-default);
    }
    &_hidden {
      @include mobile-s {
        display: none;
      }
    }
    &_mobile-full {
      @include mobile {
        width: 92px;
        overflow: hidden;
        transition: width var(--transition-default);
      }
    }
  }
  &-left {
    display: flex;
    align-items: center;
    max-width: 80%;
    height: 100%;
    @include mobile {
      order: 2;
      width: calc(50% + 9px);
      justify-content: space-between;
    }
    &_opened {
      @include mobile {
        justify-content: flex-start;
        width: 100%;
        max-width: 92%;
        margin-left: 5px;
      }
    }
  }
  &-right {
    display: flex;
    &__tablet-new-post-button {
      width: 30px;
      height: 30px;
    }
    &__login-button {
      @include mobile {
        max-width: 140px;
      }
    }
  }
  &-navigation {
    display: flex;
    max-width: 70%;
    max-height: 100%;
    @include mobile {
      width: 30px;
    }
    &_mobile-opened {
      @include mobile {
        width: 100%;
        max-width: 100%;
        margin-left: 10px;
      }
    }
    &__list {
      display: flex;
      align-items: center;
      margin: 0;
      list-style: none;
      max-width: 100%;
      max-height: 100%;
    }
    &__tags {
      display: flex;
      align-items: center;
      height: 100%;

      &-find-button {
        margin-left: var(--element-margin-xs);
      }

      &-area {
        max-width: 100%;
        height: 100%;
      }

      &-field {
        height: 100%;
        @include mobile {
          width: 130px;
        }
      }

      ::v-deep .tags-input-area {
        min-width: calc(1.2 * var(--width-small));
        @include mobile {
          min-width: auto;
        }
      }

      ::v-deep .new-tag {
        min-width: var(--width-small);
        @include mobile {
          min-width: auto;
          width: 100px;
        }
        @include mobile-s {
          width: 110px;
        }
      }
    }

    &__new-tag-button {
      margin-left: var(--element-margin-s);
      white-space: pre;
    }
    &__mobile-search-button {
      width: 20px;
      height: 20px;
    }

    ::v-deep &__link {
      color: var(--color-white);
      font-size: var(--size-button);
      font-weight: 600;
      text-transform: uppercase;
      margin-right: var(--element-margin-xxl);
      text-decoration: none;
      &:focus {
        color: var(--color-main-600);
      }

      &.router-link-exact-active {
        color: var(--border-tag);
      }
    }
  }
}
.wrapper.logged .header {
  padding: 0 calc(var(--element-padding-xl) * 2);
  @include tablet {
    padding: 0 var(--element-padding-xl) 0 calc(var(--element-padding-xl));
  }
  @include mobile {
    padding: 0 var(--element-padding-l) 0 calc(var(--element-padding-l));
  }
}
.wrapper .header {
  min-height: 60px;

  @include mobile {
    min-height: 40px;
  }
}
</style>
